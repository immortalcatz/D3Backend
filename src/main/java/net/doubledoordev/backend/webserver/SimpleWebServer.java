package net.doubledoordev.backend.webserver;

import java.io.*;
import java.net.URLEncoder;
import java.util.*;

public abstract class SimpleWebServer extends NanoHTTPD
{
    /**
     * Common mime type for dynamic content: binary
     */
    public static final String MIME_DEFAULT_BINARY = "application/octet-stream";
    /**
     * Default Index file names.
     */
    public static final List<String> INDEX_FILE_NAMES = new ArrayList<String>()
    {{
            add("index.html");
        }};
    /**
     * Hashtable mapping (String)FILENAME_EXTENSION -> (String)MIME_TYPE
     */
    private static final Map<String, String> MIME_TYPES = new HashMap<String, String>()
    {{
            put("css", "text/css");
            put("htm", "text/html");
            put("html", "text/html");
            put("xml", "text/xml");
            put("java", "text/x-java-source, text/java");
            put("md", "text/plain");
            put("txt", "text/plain");
            put("asc", "text/plain");
            put("gif", "image/gif");
            put("jpg", "image/jpeg");
            put("jpeg", "image/jpeg");
            put("png", "image/png");
            put("mp3", "audio/mpeg");
            put("m3u", "audio/mpeg-url");
            put("mp4", "video/mp4");
            put("ogv", "video/ogg");
            put("flv", "video/x-flv");
            put("mov", "video/quicktime");
            put("swf", "application/x-shockwave-flash");
            put("js", "application/javascript");
            put("pdf", "application/pdf");
            put("doc", "application/msword");
            put("ogg", "application/x-ogg");
            put("zip", "application/octet-stream");
            put("exe", "application/octet-stream");
            put("class", "application/octet-stream");
        }};
    private final String rootDir;

    public SimpleWebServer(String host, int port, String wwwroot)
    {
        super(host, port);
        if (!wwwroot.endsWith("/")) wwwroot += "/";
        this.rootDir = wwwroot;

        this.init();
    }

    /**
     * Used to initialize and customize the server.
     */
    public void init()
    {
    }

    /**
     * URL-encodes everything between "/"-characters. Encodes spaces as '%20' instead of '+'.
     */
    private String encodeUri(String uri)
    {
        String newUri = "";
        StringTokenizer st = new StringTokenizer(uri, "/ ", true);
        while (st.hasMoreTokens())
        {
            String tok = st.nextToken();
            if (tok.equals("/"))
                newUri += "/";
            else if (tok.equals(" "))
                newUri += "%20";
            else
            {
                try
                {
                    newUri += URLEncoder.encode(tok, "UTF-8");
                }
                catch (UnsupportedEncodingException ignored)
                {
                }
            }
        }
        return newUri;
    }

    protected Response respond(Map<String, String> headers, String uri)
    {
        // Remove URL arguments
        uri = uri.trim().replace(File.separatorChar, '/');
        if (uri.indexOf('?') >= 0)
        {
            uri = uri.substring(0, uri.indexOf('?'));
        }

        // Prohibit getting out of current directory
        if (uri.startsWith("src/main") || uri.endsWith("src/main") || uri.contains("../"))
        {
            return getForbiddenResponse("Won't serve ../ for security reasons.");
        }

        if (!canServeUri(uri))
        {
            return getNotFoundResponse();
        }

        String mimeTypeForFile = getMimeTypeForFile(uri);
        Response response = serveFile(uri, headers, mimeTypeForFile);
        return response != null ? response : getNotFoundResponse();
    }

    protected Response getNotFoundResponse()
    {
        return createResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Error 404, file not found.");
    }

    protected Response getForbiddenResponse(String s)
    {
        return createResponse(Response.Status.FORBIDDEN, MIME_PLAINTEXT, "FORBIDDEN: " + s);
    }

    private boolean canServeUri(String uri)
    {
        return this.getClass().getResource(rootDir + uri) != null;
    }

    /**
     * Serves file from homeDir and its' subdirectories (only). Uses only URI, ignores all headers and HTTP parameters.
     */
    Response serveFile(String uri, Map<String, String> header, String mime)
    {
        Response res;
        try
        {
            InputStream stream = getClass().getResourceAsStream(rootDir + uri);
            int fileLen = stream.available();
            res = createResponse(Response.Status.OK, mime, stream);
            res.addHeader("Content-Length", "" + fileLen);
        }
        catch (IOException ioe)
        {
            res = getForbiddenResponse("Reading file failed.");
        }

        return res;
    }

    // Get MIME type from file name extension, if possible
    private String getMimeTypeForFile(String uri)
    {
        int dot = uri.lastIndexOf('.');
        String mime = null;
        if (dot >= 0)
        {
            mime = MIME_TYPES.get(uri.substring(dot + 1).toLowerCase());
        }
        return mime == null ? MIME_DEFAULT_BINARY : mime;
    }

    // Announce that the file server accepts partial content requests
    private Response createResponse(Response.Status status, String mimeType, InputStream message)
    {
        Response res = new Response(status, mimeType, message);
        res.addHeader("Accept-Ranges", "bytes");
        return res;
    }

    // Announce that the file server accepts partial content requests
    private Response createResponse(Response.Status status, String mimeType, String message)
    {
        Response res = new Response(status, mimeType, message);
        res.addHeader("Accept-Ranges", "bytes");
        return res;
    }

    private String findIndexFileInDirectory(File directory)
    {
        for (String fileName : INDEX_FILE_NAMES)
        {
            File indexFile = new File(directory, fileName);
            if (indexFile.exists())
            {
                return fileName;
            }
        }
        return null;
    }

    protected String listDirectory(String uri, File f)
    {
        String heading = "Directory " + uri;
        StringBuilder msg = new StringBuilder("<html><head><title>" + heading + "</title><style><!--\n" +
                "span.dirname { font-weight: bold; }\n" +
                "span.filesize { font-size: 75%; }\n" +
                "// -->\n" +
                "</style>" +
                "</head><body><h1>" + heading + "</h1>");

        String up = null;
        if (uri.length() > 1)
        {
            String u = uri.substring(0, uri.length() - 1);
            int slash = u.lastIndexOf('/');
            if (slash >= 0 && slash < u.length())
            {
                up = uri.substring(0, slash + 1);
            }
        }

        List<String> files = Arrays.asList(f.list(new FilenameFilter()
        {
            @Override
            public boolean accept(File dir, String name)
            {
                return new File(dir, name).isFile();
            }
        }));
        Collections.sort(files);
        List<String> directories = Arrays.asList(f.list(new FilenameFilter()
        {
            @Override
            public boolean accept(File dir, String name)
            {
                return new File(dir, name).isDirectory();
            }
        }));
        Collections.sort(directories);
        if (up != null || directories.size() + files.size() > 0)
        {
            msg.append("<ul>");
            if (up != null || directories.size() > 0)
            {
                msg.append("<section class=\"directories\">");
                if (up != null)
                {
                    msg.append("<li><a rel=\"directory\" href=\"").append(up).append("\"><span class=\"dirname\">..</span></a></b></li>");
                }
                for (String directory : directories)
                {
                    String dir = directory + "/";
                    msg.append("<li><a rel=\"directory\" href=\"").append(encodeUri(uri + dir)).append("\"><span class=\"dirname\">").append(dir).append("</span></a></b></li>");
                }
                msg.append("</section>");
            }
            if (files.size() > 0)
            {
                msg.append("<section class=\"files\">");
                for (String file : files)
                {
                    msg.append("<li><a href=\"").append(encodeUri(uri + file)).append("\"><span class=\"filename\">").append(file).append("</span></a>");
                    File curFile = new File(f, file);
                    long len = curFile.length();
                    msg.append("&nbsp;<span class=\"filesize\">(");
                    if (len < 1024)
                    {
                        msg.append(len).append(" bytes");
                    }
                    else if (len < 1024 * 1024)
                    {
                        msg.append(len / 1024).append(".").append(len % 1024 / 10 % 100).append(" KB");
                    }
                    else
                    {
                        msg.append(len / (1024 * 1024)).append(".").append(len % (1024 * 1024) / 10 % 100).append(" MB");
                    }
                    msg.append(")</span></li>");
                }
                msg.append("</section>");
            }
            msg.append("</ul>");
        }
        msg.append("</body></html>");
        return msg.toString();
    }
}