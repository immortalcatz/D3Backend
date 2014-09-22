/*
 * Unless otherwise specified through the '@author' tag or the javadoc
 * at the top of the file or on a specific portion of the code the following license applies:
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

package net.doubledoordev.backend.server.query;

import java.util.ArrayList;

/**
 * @author Ryan McCann
 */
public class QueryResponse
{
    static byte NULL = 00;
    static byte SPACE = 20;

    private boolean fullstat;

    //for simple stat
    private String motd, gameMode, mapName;
    private int onlinePlayers, maxPlayers;
    private short port;
    private String hostname;

    //for full stat only
    private String gameID;
    private String version;
    private String plugins;
    private ArrayList<String> playerList;

    public QueryResponse(byte[] data, boolean fullstat)
    {
        this.fullstat = fullstat;

        data = ByteUtils.trim(data);
        byte[][] temp = ByteUtils.split(data);

//		if(temp.length == 6) //short stat
        if (!fullstat)
        {
            motd = new String(ByteUtils.subarray(temp[0], 1, temp[0].length - 1));
            gameMode = new String(temp[1]);
            mapName = new String(temp[2]);
            onlinePlayers = Integer.parseInt(new String(temp[3]));
            maxPlayers = Integer.parseInt(new String(temp[4]));
            port = ByteUtils.bytesToShort(temp[5]);
            hostname = new String(ByteUtils.subarray(temp[5], 2, temp[5].length - 1));
        }
        else //full stat
        {
            motd = new String(temp[3]);
            gameMode = new String(temp[5]);
            mapName = new String(temp[13]);
            onlinePlayers = Integer.parseInt(new String(temp[15]));
            maxPlayers = Integer.parseInt(new String(temp[17]));
            port = Short.parseShort(new String(temp[19]));
            hostname = new String(temp[21]);

            //only available with full stat:
            gameID = new String(temp[7]);
            version = new String(temp[9]);
            plugins = new String(temp[11]);

            playerList = new ArrayList<String>();
            for (int i = 25; i < temp.length; i++)
            {
                playerList.add(new String(temp[i]));
            }
        }
    }

    /**
     * Returns a JSON string representation of the data returned from the server, useful for JSP/servlet pages with javascript.
     *
     * @return a JSON string
     */
    public String asJSON()
    {
        StringBuilder json = new StringBuilder();
        json.append("\'{");
        json.append("\"motd\":");                            // "motd":
        json.append('"').append(motd).append("\",");        // "A Minecraft Server",

        json.append("\"gamemode\":");                        // "gamemode":
        json.append('"').append(gameMode).append("\",");    // "SMP",

        json.append("\"map\":");                            // "map":
        json.append('"').append(mapName).append("\",");        // "world1",

        json.append("\"onlinePlayers\":");                    // "onlinePlayers":
        json.append(onlinePlayers).append(',');                // 0,

        json.append("\"maxPlayers\":");                        // "maxPlayers":
        json.append(maxPlayers).append(',');                // 20,

        json.append("\"port\":");                            // "port":
        json.append(port).append(',');                        // 25565,

        json.append("\"host\":");                            // "hostname":
        json.append('"').append(hostname).append('"');        // "0.0.0.0",

        if (fullstat)
        {
            json.append(',');
            json.append("\"gameID\":");                        // "gameID":
            json.append('"').append(gameID).append("\",");    // "MINECRAFT",

            json.append("\"version\":");                    // "version":
            json.append('"').append(version).append("\",");    // "1.2.5",

            json.append("\"players\":");
            json.append('[');
            for (String player : playerList)
            {
                json.append("\"" + player + "\"");
                if (playerList.indexOf(player) != playerList.size() - 1)
                {
                    json.append(',');
                }
            }
            json.append(']');
        }

        json.append("}\'");

        return json.toString();
    }

    public String toString()
    {
        String delimiter = ", ";
        StringBuilder str = new StringBuilder();
        str.append(motd);
        str.append(delimiter);
        str.append(gameMode);
        str.append(delimiter);
        str.append(mapName);
        str.append(delimiter);
        str.append(onlinePlayers);
        str.append(delimiter);
        str.append(maxPlayers);
        str.append(delimiter);
        str.append(port);
        str.append(delimiter);
        str.append(hostname);

        if (fullstat)
        {
            str.append(delimiter);
            str.append(gameID);
            str.append(delimiter);
            str.append(version);

            //plugins for non-vanilla (eg. Bukkit) servers
            if (plugins.length() > 0)
            {
                str.append(delimiter);
                str.append(plugins);
            }

            // player list
            str.append(delimiter);
            str.append("Players: ");
            str.append('[');
            for (String player : playerList)
            {
                str.append(player);
                if (playerList.indexOf(player) != playerList.size() - 1)
                {
                    str.append(',');
                }
            }
            str.append(']');
        }

        return str.toString();
    }

    public String getMotd()
    {
        return motd;
    }

    public String getGameMode()
    {
        return gameMode;
    }

    public String getMapName()
    {
        return mapName;
    }

    public int getOnlinePlayers()
    {
        return onlinePlayers;
    }

    public int getMaxPlayers()
    {
        return maxPlayers;
    }

    public String getPlugins()
    {
        return plugins;
    }

    public String getVersion()
    {
        return version;
    }

    public String getGameID()
    {
        return gameID;
    }

    /**
     * Returns an <code>ArrayList</code> of strings containing the connected players' usernames.
     * Note that this will return null for basic status requests.
     *
     * @return An <code>ArrayList</code> of player names
     */
    public ArrayList<String> getPlayerList()
    {
        return playerList;
    }
}