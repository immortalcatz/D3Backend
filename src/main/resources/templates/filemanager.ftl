<#include "header.ftl">
<h1>File Manager
    <small> <a href="/server?server=${server.ID}">${server.ID}</a>   <span class="label label-<#if server.online>success<#else>danger</#if>"><#if server.online>Online<#else>Offline</#if></span></small>
</h1>
<#if !fm.file.exists()>
<div class="panel panel-danger">
    <div class="panel-heading"><#list fm.makeBreadcrumbs() as file> / <a href="?server=${server.ID}&file=${fm.stripServer(file)}">${file.getName()}</a></#list></div>
    <div class="panel-body">
        <h4>File not found.</h4>
    </div>
</div>
<#elseif fm.file.isDirectory() >
<div class="panel panel-info">
    <div class="panel-heading"><#list fm.makeBreadcrumbs() as file> / <a href="?server=${server.ID}&file=${fm.stripServer(file)}">${file.getName()}</a></#list></div>
    <div class="panel-body">
        <div class="btn-group">
            <button type="button" onclick="{var n = prompt('New file ID?', ''); if (n != null) call('filemanager', '${fm.server.ID}', '${fm.stripServer(fm.file)}', 'newFile', n);}" class="btn btn-default btn-xs">New file</button>
            <button type="button" onclick="{var n = prompt('New folder ID?', ''); if (n != null) call('filemanager', '${fm.server.ID}', '${fm.stripServer(fm.file)}', 'newFolder', n);}" class="btn btn-default btn-xs">New folder</button>
        </div>
    </div>
    <table class="table table-hover table-condensed">
        <tbody>
            <#list fm.file.listFiles() as file>
            <tr>
                <td><i class="fa fa-${fm.getIcon(file)}"></i></td>
                <#if fm.canEdit(file)>
                    <td class="col-sm-4">
                        <a href="?server=${server.ID}&file=${fm.stripServer(file)}" <#if file.getName()?ends_with(".dat") && Helper.getUsernameFromUUID(file.getName())??>rel="tooltip" data-toggle="tooltip" data-placement="top" title="${Helper.getUsernameFromUUID(file.getName())}"</#if>>${file.getName()}</a>
                    </td>
                <#else>
                    <td class="col-sm-4">${file.getName()}</td>
                </#if>
                <td>
                    <#if !file.isDirectory()><a type="button" class="btn btn-default btn-xs" href="/raw/${server.ID}/${fm.stripServer(file)}">Raw file</a></#if>
                </td>
                <td class="col-sm-8">
                    <div class="btn-group">
                        <button type="button" onclick="{var n = prompt('New file ID?', '${file.getName()}'); if (n != null) call('filemanager', '${fm.server.ID}', '${fm.stripServer(file)}', 'rename', n);}" class="btn btn-default btn-xs">
                            Rename
                        </button>
                        <button type="button" onclick="if (confirm('Are you sure?\nIt will be gone FOREVER!')) call('filemanager', '${fm.server.ID}', '${fm.stripServer(file)}', 'delete');" class="btn btn-danger btn-xs">Delete</button>
                        <#if !file.canWrite()>
                            <button type="button" onclick="call('filemanager', '${fm.server.ID}', '${fm.stripServer(file)}', 'makeWritable');" class="btn btn-info btn-xs">Make writeable</button></#if>
                        <#if fm.getExtension(file) == "jar" || fm.getExtension(file) == "zip">
                            <button type="button" onclick="call('filemanager', '${fm.server.ID}', '${fm.stripServer(file)}', 'rename', '${file.getName()}.disabled');" class="btn btn-default btn-xs">Disable</button>
                        <#elseif fm.getExtension(file) == "disabled">
                            <button type="button" onclick="call('filemanager', '${fm.server.ID}', '${fm.stripServer(file)}', 'rename', '${file.getName()?replace(".disabled", "")}');" class="btn btn-default btn-xs">Enable
                            </button></#if>
                    </div>
                </td>
            </tr>
            </#list>
        </tbody>
    </table>
</div>
<#else >
    <#assign readonly = !fm.file.canWrite()>
<script>
    websocket = new WebSocket(wsurl("filemanager/${server.ID}/${fm.stripServer(fm.getFile())}"));
    websocket.onerror =  function (evt) { alert("The websocket errored. Refresh the page!") }
    websocket.onclose =  function (evt) { alert("The websocket closed. Refresh the page!") }

    function send(data)
    {
        websocket.send(data);
    }
</script>
<div class="panel panel-<#if readonly>warning<#elseif fm.getEditor()??>success<#else>danger</#if>">
    <div class="panel-heading"><#list fm.makeBreadcrumbs() as file> /
        <a href="?server=${server.ID}&file=${fm.stripServer(file)}" <#if file.getName()?ends_with(".dat") && Helper.getUsernameFromUUID(file.getName())??>rel="tooltip" data-toggle="tooltip" data-placement="top" title="${Helper.getUsernameFromUUID(file.getName())}"</#if>>${file.getName()}</a></#list>
    </div>
    <#if fm.getEditor()??>
        <#include "editors/" + fm.getEditor()>
    <#else>
        <div class="panel-body">
            <h4>This kind of file can't be displayed.</h4>
        </div>
    </#if>
</div>
</#if>
<script>
    $('[rel=tooltip]').tooltip()
</script>
<#include "footer.ftl">
