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

import java.io.File;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Helper class for file downloading
 * Make sure you don't thread this twice. It happens once internally already!
 * <p/>
 * http://stackoverflow.com/questions/14069848/download-a-file-while-also-updating-a-jprogressbar
 *
 * @author Kevin Esche, Stackoverflow user.
 */
public class Download implements Runnable
{
    // Max size of download buffer.
    private static final int MAX_BUFFER_SIZE = 1024;
    private final File target;// target file
    private final URL  url; // download URL
    private String message = "OK";
    private long   size; // size of download in bytes
    private long   downloaded; // number of bytes downloaded
    private Status status; // current status of download

    // Constructor for Download.
    public Download(URL url, File target)
    {
        this.target = target;
        this.url = url;
        size = -1;
        downloaded = 0;
        status = Status.Downloading;

        // Begin the download.
        download();
    }

    // Get this download's URL.
    public String getUrl()
    {
        return url.toString();
    }

    // Get this download's size.
    public long getSize()
    {
        return size;
    }

    // Get this download's progress.
    public float getProgress()
    {
        return ((float) downloaded / size) * 100;
    }

    public long getDownloaded()
    {
        return downloaded;
    }

    // Get this download's status.
    public Status getStatus()
    {
        return status;
    }

    // Mark this download as having an error.
    private void error(String message)
    {
        status = Status.Error;
        this.message = message;
    }

    // Start or resume downloading.
    private void download()
    {
        Thread thread = new Thread(this);
        thread.start();
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    // Download file.
    public void run()
    {
        RandomAccessFile file = null;
        InputStream stream = null;

        try
        {
            // Open connection to URL.
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Specify what portion of file to download.
            connection.setRequestProperty("Range", "bytes=" + downloaded + "-");

            // Connect to server.
            connection.connect();

            // Make sure response code is in the 200 range.
            if (connection.getResponseCode() / 100 != 2)
            {
                error("Responce wasn't 200: " + connection.getResponseMessage());
            }

            // Check for valid content length.
            int contentLength = connection.getContentLength();
            if (contentLength < 1)
            {
                error("Content length is invalid.");
            }

            // Set the size for this download if it hasn't been already set.
            if (size == -1)
            {
                size = contentLength;
            }

            // Open file and seek to the end of it.
            file = new RandomAccessFile(target, "rw");
            file.seek(downloaded);

            stream = connection.getInputStream();
            while (status == Status.Downloading)
            {
                // Size buffer according to how much of the file is left to download.
                byte buffer[];
                if (size - downloaded > MAX_BUFFER_SIZE)
                {
                    buffer = new byte[MAX_BUFFER_SIZE];
                }
                else
                {
                    buffer = new byte[(int) (size - downloaded)];
                }

                // Read from server into buffer.
                int read = stream.read(buffer);
                if (read == -1)
                    break;

                // Write buffer to file.
                file.write(buffer, 0, read);
                downloaded += read;
            }

            // Change status to complete if this point was reached because downloading has finished.
            if (status == Status.Downloading)
            {
                status = Status.Complete;
            }
        }
        catch (Exception e)
        {
            error(e.toString());
            e.printStackTrace();
        }
        finally
        {
            // Close file.
            if (file != null)
            {
                try
                {
                    file.close();
                }
                catch (Exception e)
                {
                }
            }

            // Close connection to server.
            if (stream != null)
            {
                try
                {
                    stream.close();
                }
                catch (Exception e)
                {
                }
            }
        }
    }

    public static enum Status
    {
        Downloading, Complete, Error
    }
}
