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

package net.doubledoordev.backend.server;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

import static net.doubledoordev.backend.Main.LOGGER;
import static net.doubledoordev.backend.util.Constants.*;

/**
 * Handles backups and dimension related stuff
 *
 * @author Dries007
 */
@SuppressWarnings("UnusedDeclaration")
public class WorldManager
{
    final HashMap<Integer, Dimention> dimentionMap = new HashMap<>();
    final Server server;
    File worldFolder;

    public WorldManager(Server server)
    {
        this.server = server;
    }

    public void update()
    {
        worldFolder = new File(server.getFolder(), getWorldName());
        if (!worldFolder.exists()) return;
        if (!dimentionMap.containsKey(0)) dimentionMap.put(0, new Dimention(0));
        for (String file : worldFolder.list(DIM_ONLY_FILTER))
        {
            Integer dimid = Integer.parseInt(file.replace(DIM, ""));
            if (!dimentionMap.containsKey(dimid)) dimentionMap.put(dimid, new Dimention(dimid));
        }
        for (Dimention dimention : dimentionMap.values()) dimention.update(this);
    }

    public String getWorldName()
    {
        return server.getProperties().getProperty("level-name", "world");
    }

    public HashMap<Integer, Dimention> getDimentionMap()
    {
        return dimentionMap;
    }

    public void makeWorldBackup() throws BackupException
    {
        if (!checkSpace()) throw new BackupException("Out of diskspace.");
        doBackup(new File(new File(server.getBackupFolder(), WORLD), BACKUP_SDF.format(new Date()) + ".zip"), new File(server.getFolder(), getWorldName()), ACCEPT_NONE_FILTER);
    }

    public void makeAllOfTheBackup() throws BackupException
    {
        if (!checkSpace()) throw new BackupException("Out of diskspace.");
        doBackup(new File(new File(server.getBackupFolder(), SERVER), BACKUP_SDF.format(new Date()) + ".zip"), server.getFolder(), ACCEPT_NONE_FILTER);
    }

    public void doBackup(File zip, File folder, FilenameFilter filter)
    {
        LOGGER.info(String.format("'%s' is making a backup from '%s' to '%s'", server.getName(), folder.getPath(), zip.getPath()));
        if (server.getOnline())
        {
            server.send("say Making backup....");
            server.send("save-off");
            server.send("save-all");
        }
        try
        {
            File tmp = new File(server.getBackupFolder(), "tmp");
            if (tmp.exists()) FileUtils.deleteDirectory(tmp);
            tmp.mkdirs();
            FileUtils.copyDirectory(folder, tmp);
            zip.getParentFile().mkdirs();

            for (File delfolder : tmp.listFiles(filter)) FileUtils.deleteDirectory(delfolder);

            if (tmp.list().length != 0)
            {
                ZipParameters parameters = new ZipParameters();
                parameters.setIncludeRootFolder(false);
                ZipFile zipFile = new ZipFile(zip);
                zipFile.createZipFileFromFolder(tmp, parameters, false, 0);
            }

            if (tmp.exists()) FileUtils.deleteDirectory(tmp);
        }
        catch (IOException | ZipException e)
        {
            if (server.getOnline()) server.send("say Error when making backup");
            server.logger.warn(e);
            e.printStackTrace();
        }
        if (server.getOnline())
        {
            server.send("save-on");
        }
    }

    private boolean checkSpace()
    {
        return server.getOwnerObject().getMaxDiskspace() == -1 && server.getOwnerObject().getDiskspaceLeft() <= 0;
    }

    private class BackupException extends Exception
    {
        public BackupException(String s)
        {
            super(s);
        }
    }
}