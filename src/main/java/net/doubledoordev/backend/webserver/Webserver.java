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

package net.doubledoordev.backend.webserver;

import net.doubledoordev.backend.Main;
import net.doubledoordev.backend.permissions.Group;
import net.doubledoordev.backend.permissions.User;
import net.doubledoordev.backend.util.Constants;
import net.doubledoordev.backend.util.Settings;
import net.doubledoordev.backend.webserver.methods.Get;
import net.doubledoordev.backend.webserver.methods.Post;
import net.doubledoordev.backend.webserver.methods.Put;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static net.doubledoordev.backend.util.Constants.COOKIE_KEY;
import static net.doubledoordev.backend.util.Constants.STATIC_PATH;

/**
 * NanoHTTPD based server
 *
 * @author Dries007
 */
public class Webserver extends SimpleWebServer
{
    public static final Webserver WEBSERVER = new Webserver();

    private Webserver()
    {
        super(Settings.SETTINGS.hostname, Settings.SETTINGS.port, STATIC_PATH);
    }

    /**
     * The entry point for all HTTP requests
     *
     * @param session The HTTP session
     * @return
     */
    @Override
    public Response serve(IHTTPSession session)
    {
        // We want to split off static ASAP.
        if (session.getUri().startsWith(STATIC_PATH))
            return super.respond(session.getHeaders(), session.getUri().substring(STATIC_PATH.length()));

        // stupid favicon.ico
        if (session.getUri().contains(Constants.FAVOTICON))
            return super.respond(session.getHeaders(), session.getUri());

        /**
         * Populate data map with user (if logged in) and admin status.
         */
        HashMap<String, Object> dataObject = new HashMap<>();
        if (session.getCookies().has(COOKIE_KEY))
        {
            String[] cookie = session.getCookies().read(COOKIE_KEY).split("\\|");
            User user = Settings.getUserByName(cookie[0]);
            if (user != null && user.getPasshash().equals(cookie[1]))
            {
                dataObject.put("user", user);
                dataObject.put("admin", user.getGroup() == Group.ADMIN);
            }
        }
        if (!dataObject.containsKey("admin")) dataObject.put("admin", false);

        /**
         * Handle depending on HTTP method.
         * - PUT is a method call
         * - POST is a form submission, also calls GET
         * - GET is a page request
         * - Anything else is invalid.
         */
        switch (session.getMethod())
        {
            case POST:
                Post.handlePost(dataObject, session);
            case GET:
                return Get.handleGet(dataObject, session);
            case PUT:
                return Put.handlePut(dataObject, session);
            default:
                return new Response(Response.Status.NO_CONTENT, MIME_PLAINTEXT, "No Content");
        }
    }
}