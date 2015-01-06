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

import com.google.gson.annotations.Expose;
import net.doubledoordev.backend.permissions.User;
import net.doubledoordev.backend.server.Server;
import org.apache.commons.io.FileUtils;

import java.io.FileReader;
import java.io.IOException;
import java.util.*;

import static net.doubledoordev.backend.Main.LOGGER;
import static net.doubledoordev.backend.util.Constants.*;

/**
 * Global settings
 *
 * @author Dries007
 */
@SuppressWarnings("UnusedDeclaration")
public class Settings
{
    public static final Settings SETTINGS;

    static
    {
        try
        {
            if (CONFIG_FILE.exists()) SETTINGS = Constants.GSON.fromJson(new FileReader(CONFIG_FILE), Settings.class);
            else SETTINGS = new Settings();
        }
        catch (IOException e)
        {
            throw new RuntimeException(e);
        }
    }

    public Map<String, Server> servers = new HashMap<>();
    public Map<String, User> users = new HashMap<>();
    @Expose
    public String hostname = "";
    @Expose
    public int portHTTP = 80;
    @Expose
    public int portHTTPS = 443;
    @Expose
    public boolean useJava8 = false;
    @Expose
    public boolean fixedPorts = false;
    @Expose
    public boolean fixedIP = false;
    @Expose
    public PortRange portRange = new PortRange();
    @Expose
    public int defaultDiskspace = -1;
    @Expose
    public List<String> anonPages = Arrays.asList("index", "login", "register");
    @Expose
    public String certificatePath = "";
    @Expose
    public String certificatePass = "";

    private Settings() throws IOException
    {
        try
        {
            FileReader fileReader;

            if (SERVERS_FILE.exists())
            {
                fileReader = new FileReader(SERVERS_FILE);
                if (SERVERS_FILE.exists())
                {
                    for (Server server : GSON.fromJson(fileReader, Server[].class))
                    {
                        servers.put(server.getID(), server);
                    }
                }
                fileReader.close();
            }

            if (USERS_FILE.exists())
            {
                fileReader = new FileReader(USERS_FILE);
                if (USERS_FILE.exists())
                {
                    for (User user : GSON.fromJson(fileReader, User[].class))
                    {
                        users.put(user.getUsername().toLowerCase(), user);
                    }
                }
                fileReader.close();
            }
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    public static void save()
    {
        try
        {
            FileUtils.writeStringToFile(CONFIG_FILE, GSON.toJson(SETTINGS));
            FileUtils.writeStringToFile(SERVERS_FILE, GSON.toJson(SETTINGS.servers.values()));
            FileUtils.writeStringToFile(USERS_FILE, GSON.toJson(SETTINGS.users.values()));

            LOGGER.info("Saved settings.");
        }
        catch (Exception e)
        {
            LOGGER.error("Error saving the config file...", e);
        }
    }

    public static Server getServerByName(String name)
    {
        return SETTINGS.servers.get(name);
    }

    public static User getUserByName(String name)
    {
        return SETTINGS.users.get(name.toLowerCase());
    }

    public Collection<Server> getServers()
    {
        return servers.values();
    }

    public Collection<Server> getOnlineServers()
    {
        HashSet<Server> onlineServers = new HashSet<>();
        for (Server server : getServers()) if (server.getOnline()) onlineServers.add(server);
        return onlineServers;
    }

    public Collection<User> getUsers()
    {
        return users.values();
    }

    public String getHostname()
    {
        return hostname;
    }

    public boolean isUseJava8()
    {
        return useJava8;
    }

    public boolean isFixedPorts()
    {
        return fixedPorts;
    }

    public boolean isFixedIP()
    {
        return fixedIP;
    }

    public PortRange getPortRange()
    {
        return portRange;
    }
}
