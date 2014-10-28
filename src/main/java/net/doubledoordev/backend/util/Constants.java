/*
 * Unless otherwise specified through the '@author' tag or comments at
 * the top of the file or on a specific portion of the code the following license applies:
 *
 * Copyright (c) 2014, DoubleDoorDevelopment
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 *  Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 *  The header specified or the above copyright notice, this list of conditions
 *   and the following disclaimer below must be displayed at the top of the source code
 *   of any web page received while using any part of the service this software provides.
 *
 *   The header to be displayed:
 *       This page was generated by DoubleDoorDevelopment's D3Backend or a derivative thereof.
 *
 *  Neither the name of the project nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package net.doubledoordev.backend.util;

import com.google.common.base.Joiner;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import freemarker.ext.beans.BeansWrapper;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import net.doubledoordev.backend.server.Server;
import net.doubledoordev.backend.util.winreg.JavaFinder;
import net.doubledoordev.backend.util.winreg.JavaInfo;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Random;
import java.util.Timer;
import java.util.regex.Pattern;

/**
 * Constants!
 *
 * @author Dries007
 */
public class Constants
{
    public static final    String           NAME                           = "D3 Backend";
    public static final    String           LOCALHOST                      = "localhost";
    public static final    Pattern          USERNAME_CHECK                 = Pattern.compile("^[\\w-]+$");
    public static final    Gson             GSON                           = new GsonBuilder()
            .registerTypeAdapter(Server.class, new Server.Deserializer())
            .registerTypeAdapter(Server.class, new Server.Serializer())
            .setPrettyPrinting()
            .create();
    public static final    Random           RANDOM                         = new Random();

    public static final    File             ROOT                           = getRootFile();
    public static final    File             CONFIG_FILE                    = new File(ROOT, "config.json");
    public static final    File             SERVERS_FILE                   = new File(ROOT, "servers.json");
    public static final    File             USERS_FILE                     = new File(ROOT, "users.json");
    public static final    File             SERVERS                        = new File(ROOT, "servers");
    public static final    File             BACKUPS                        = new File(ROOT, "backups");
    public static final    String           STATIC_PATH                    = "/static/";
    public static final    String           P2S_PATH                       = "/pay2spawn/";
    public static final    String           FAVOTICON                      = "favicon.ico";
    public static final    String           COOKIE_KEY                     = "user";
    public static final    JsonParser       JSONPARSER                     = new JsonParser();
    public static final    String           MC_VERIONS_URL                 = "https://s3.amazonaws.com/Minecraft.Download/versions/versions.json";
    public static final    String           FORGE_VERIONS_URL              = "http://files.minecraftforge.net/maven/net/minecraftforge/forge/json";
    public static final    String           MC_SERVER_JAR_URL              = "https://s3.amazonaws.com/Minecraft.Download/versions/%ID%/minecraft_server.%ID%.jar";
    public static final    String           FORGE_INSTALLER_URL            = "http://files.minecraftforge.net/maven/net/minecraftforge/forge/%ID%/forge-%ID%-installer.jar";
    public static final    Pattern          ILLEGAL_OPTIONS[]              = {Pattern.compile("^-Xms.*$"), Pattern.compile("^-Xmx.*$"), Pattern.compile("^-XX:MaxPermSize=.*$")};
    public static final    SimpleDateFormat BACKUP_SDF                     = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
    public static final    String           WORLD                          = "world";
    public static final    String           SERVER                         = "server";
    public static final    String           DIM                            = "DIM";
    public final static    FilenameFilter   NOT_DIM_FILTER                 = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return !name.startsWith(DIM);
        }
    };
    public final static    FilenameFilter   DIM_ONLY_FILTER                = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return name.startsWith(DIM);
        }
    };
    public final static    FilenameFilter   ACCEPT_ALL_FILTER              = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return true;
        }
    };
    public final static    FilenameFilter   ACCEPT_NONE_FILTER             = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return false;
        }
    };
    public final static    FilenameFilter   ACCEPT_FORGE_FILTER            = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return name.startsWith("forge");
        }
    };
    public final static    FilenameFilter   ACCEPT_MINECRAFT_SERVER_FILTER = new FilenameFilter()
    {
        @Override
        public boolean accept(File dir, String name)
        {
            return name.startsWith("minecraft_server");
        }
    };
    public static final    TemplateModel    HELPER_TEMPLATE_MODEL          = getStaticHelper();
    public static final    Timer            TIMER                          = new Timer();
    public static final    Joiner           JOINER_COMMA_SPACE             = Joiner.on(", ");
    public static final    Joiner           JOINER_COMMA                   = Joiner.on(',');
    public static final    Joiner           JOINER_SPACE                   = Joiner.on(' ');
    public static final    String           VERSION_CHECKER_URL            = "http://jenkins.dries007.net/view/D3_misc/job/D3Backend/api/json?tree=lastStableBuild[number,artifacts[*]]";
    public static final    Pattern          VERSION_PATTERN                = Pattern.compile("\\d+(?:\\.\\d+)+");
    protected static final char[]           symbols                        = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
    public static final    String           JAVAPATH                       = getJavaPath();

    /**
     * Methods that only get called to init the Constants
     */

    private Constants()
    {
    }

    private static File getRootFile()
    {
        try
        {
            return new File(".").getCanonicalFile();
        }
        catch (IOException e)
        {
            return new File(".");
        }
    }

    private static String getJavaPath()
    {
        JavaInfo javaVersion;
        if (OSUtils.getCurrentOS() == OSUtils.OS.MACOSX)
        {
            javaVersion = JavaFinder.parseJavaVersion();

            if (javaVersion != null && javaVersion.path != null) return javaVersion.path;
        }
        else if (OSUtils.getCurrentOS() == OSUtils.OS.WINDOWS)
        {
            javaVersion = JavaFinder.parseJavaVersion();

            if (javaVersion != null && javaVersion.path != null) return javaVersion.path.replace(".exe", "w.exe");
        }

        // Windows specific code adds <java.home>/bin/java no need mangle javaw.exe here.
        return System.getProperty("java.home") + "/bin/java";
    }

    private static TemplateModel getStaticHelper()
    {
        try
        {
            return BeansWrapper.getDefaultInstance().getStaticModels().get(Helper.class.getName());
        }
        catch (TemplateModelException e)
        {
            throw new RuntimeException(e);
        }
    }
}
