/*
 * D3Backend
 * Copyright (C) 2015 - 2016  Dries007 & Double Door Development
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Java Finder by petrucio@stackoverflow(828681) is licensed under a Creative Commons Attribution 3.0 Unported License.
 * Needs WinRegistry.java. Get it at: http://stackoverflow.com/questions/62289/read-write-to-windows-registry-using-java
 *
 * JavaFinder - Windows-specific classes to search for all installed versions of java on this system
 * Author: petrucio@stackoverflow (828681)
 *****************************************************************************/

package net.doubledoordev.backend.util.winreg;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Helper class to fetch the stdout and stderr outputs from started Runtime execs
 * Modified from http://www.javaworld.com/javaworld/jw-12-2000/jw-1229-traps.html?page=4
 * ***************************************************************************
 */
class RuntimeStreamer extends Thread
{
    InputStream is;
    String lines;

    RuntimeStreamer(InputStream is)
    {
        this.is = is;
        this.lines = "";
    }

    /**
     * Execute a command and wait for it to finish
     *
     * @return The resulting stdout and stderr outputs concatenated
     * **************************************************************************
     */
    public static String execute(String[] cmdArray)
    {
        try
        {
            Runtime runtime = Runtime.getRuntime();
            Process proc = runtime.exec(cmdArray);
            RuntimeStreamer outputStreamer = new RuntimeStreamer(proc.getInputStream());
            RuntimeStreamer errorStreamer = new RuntimeStreamer(proc.getErrorStream());
            outputStreamer.start();
            errorStreamer.start();
            proc.waitFor();
            return outputStreamer.contents() + errorStreamer.contents();
        }
        catch (Throwable t)
        {
            t.printStackTrace();
        }
        return null;
    }

    public static String execute(String cmd)
    {
        String[] cmdArray = {cmd};
        return RuntimeStreamer.execute(cmdArray);
    }

    public String contents()
    {
        return this.lines;
    }

    public void run()
    {
        try
        {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line;
            while ((line = br.readLine()) != null)
            {
                this.lines += line + "\n";
            }
        }
        catch (IOException ioe)
        {
            ioe.printStackTrace();
        }
    }
}
