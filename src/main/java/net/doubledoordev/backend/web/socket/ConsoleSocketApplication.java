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
 *
 */

package net.doubledoordev.backend.web.socket;

import net.doubledoordev.backend.permissions.User;
import net.doubledoordev.backend.server.Server;
import net.doubledoordev.backend.util.Constants;
import net.doubledoordev.backend.util.WebSocketHelper;
import org.glassfish.grizzly.http.server.DefaultSessionManager;
import org.glassfish.grizzly.http.server.Session;
import org.glassfish.grizzly.websockets.DefaultWebSocket;
import org.glassfish.grizzly.websockets.WebSocket;
import org.glassfish.grizzly.websockets.WebSocketApplication;
import org.glassfish.grizzly.websockets.WebSocketEngine;

import java.util.TimerTask;

import static net.doubledoordev.backend.util.Constants.*;

/**
 * @author Dries007
 */
public class ConsoleSocketApplication extends WebSocketApplication
{
    private static final  ConsoleSocketApplication APPLICATION = new ConsoleSocketApplication();
    private static final String URL_PATTERN = "/console";

    private ConsoleSocketApplication()
    {
        TIMER.scheduleAtFixedRate(new TimerTask()
        {
            @Override
            public void run()
            {
                for (WebSocket socket : getWebSockets()) socket.sendPing("ping".getBytes());
            }
        }, SOCKET_PING_TIME, SOCKET_PING_TIME);
    }

    @Override
    public void onConnect(WebSocket socket)
    {
        Session session = DefaultSessionManager.instance().getSession(null, ((DefaultWebSocket) socket).getUpgradeRequest().getRequestedSessionId());
        if (session == null)
        {
            WebSocketHelper.sendError(socket, "No valid session.");
            socket.close();
            return;
        }
        if (!((User) session.getAttribute(USER)).isAdmin())
        {
            WebSocketHelper.sendError(socket, "You are no admin.");
            socket.close();
            return;
        }
        super.onConnect(socket);
    }

    public static void register()
    {
        WebSocketEngine.getEngine().register(SOCKET_CONTEXT, URL_PATTERN, APPLICATION);
    }

    public static void sendLine(String line)
    {
        for (WebSocket socket : APPLICATION.getWebSockets())
        {
            WebSocketHelper.sendData(socket, line);
        }
    }
}