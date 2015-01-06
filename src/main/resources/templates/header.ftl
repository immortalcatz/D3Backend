<!DOCTYPE html>
<!--
  ~ Unless otherwise specified through the '@author' tag or comments at
  ~ the top of the file or on a specific portion of the code the following license applies:
  ~
  ~ Copyright (c) 2014, DoubleDoorDevelopment
  ~ All rights reserved.
  ~
  ~ Redistribution and use in source and binary forms, with or without
  ~ modification, are permitted provided that the following conditions are met:
  ~
  ~ * Redistributions of source code must retain the above copyright notice, this
  ~   list of conditions and the following disclaimer.
  ~
  ~ * Redistributions in binary form must reproduce the above copyright notice,
  ~   this list of conditions and the following disclaimer in the documentation
  ~   and/or other materials provided with the distribution.
  ~
  ~ * The header specified or the above copyright notice, this list of conditions
  ~   and the following disclaimer below must be displayed at the top of the source code
  ~   of any web page received while using any part of the service this software provides.
  ~
  ~   The header to be displayed:
  ~       This page was generated by DoubleDoorDevelopment's D3Backend or a derivative thereof.
  ~
  ~ * Neither the name of the project nor the names of its
  ~   contributors may be used to endorse or promote products derived from
  ~   this software without specific prior written permission.
  ~
  ~ THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  ~ AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  ~ IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  ~ DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  ~ FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  ~ DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  ~ SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  ~ CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  ~ OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  ~ OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  -->
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>D3 Backend</title>
    <!-- Le meta -->
    <meta name="author" content="Dries007">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Le styles -->
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
    <link href="/static/css/font-awesome.min.css" rel="stylesheet">
    <link rel="shortcut icon" type="image/ico" href="/static/favicon.ico"/>
    <style>
        body {
            padding-top: 70px;
        }

        .hiddenlink a:link {
            color: #000000;
            text-decoration: none
        }

        .hiddenlink a:visited {
            color: #000000;
            text-decoration: none
        }

        .hiddenlink a:hover {
            color: #3366CC;
            text-decoration: underline
        }

        .hiddenlink a:active {
            color: #000000;
            text-decoration: none
        }
    </style>
    <script src="/static/js/jquery.min.js"></script>
    <script src="/static/js/bootstrap.min.js"></script>
    <script>
        function wsurl(s)
        {
            var l = window.location;
            return (l.protocol === "https:" ? "wss://" : "ws://") + l.hostname + ":" + l.port + "/socket/" + s;
        }

        function openPopup(url)
        {
            window.open(window.location.origin + url, '_new', 'height=500,width=800');
        }

        function call(url, method, args, func)
        {
            var cmdwebsocket = new WebSocket(wsurl(url));
            cmdwebsocket.onopen = function (evt)
            {
                cmdwebsocket.send(JSON.stringify({method: method, args: args}));
            };
            cmdwebsocket.onmessage = function (evt)
            {
                var temp = JSON.parse(evt.data);
                if (typeof func === 'undefined')
                {
                    if (temp.status !== "ok") alert(temp.message);
                }
                else
                {
                    func(temp.data);
                }
            };
            cmdwebsocket.onerror = function (evt)
            {
                alert("The call socket connction errored. Try again.");
            };
        }
        <#if server??>
        var websocketMonitor = new WebSocket(wsurl("servermonitor/${server.ID}"));
        websocketMonitor.onerror = function (evt)
        {
            alert("The websocket errored. Refresh the page!")
        };
        websocketMonitor.onclose = function (evt)
        {
            alert("The websocket closed. Refresh the page!")
        };
        </#if>
    </script>
</head>
<body>
<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">D3 Backend</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li id="homeNavTab"><a href="/">Home</a></li>
            <#if user??>
                <li id="serverListNavTab"><a href="/servers">Server List</a></li>
                <li id="serversNavTab" class="dropdown">
                    <a href="/servers" class="dropdown-toggle" data-toggle="dropdown">Servers <span
                            class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <#list Settings.servers as server>
                            <#if server.canUserControl(user)>
                                <li id="${server.ID}NavTab"><a href="/server?server=${server.ID}">${server.ID}</a></li>
                            </#if>
                        </#list>
                    </ul>
                </li>
                <li id="newserverListNavTab"><a href="/newserver">New Server</a></li>
                <li id="usersNavTab"><a href="/users">Users</a></li>
                <#if user.isAdmin()>
                    <li id="consoleNavTab"><a href="/console">Console</a></li>
                </#if>
            </#if>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li id="loginNavTab"><a href="/login"><#if user??>${user.username}<#else>Log in</#if></a></li>
            </ul>
        </div>
        <!--/.nav-collapse -->
    </div>
</div>
<div class="container" id="container">