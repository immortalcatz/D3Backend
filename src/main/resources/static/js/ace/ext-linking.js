ace.define("ace/ext/linking", ["require", "exports", "module", "ace/editor", "ace/config"], function (e, t, n) {
    function i(e) {
        var t = e.editor, n = e.getAccelKey();
        if (n) {
            var t = e.editor, r = e.getDocumentPosition(), i = t.session, s = i.getTokenAt(r.row, r.column);
            t._emit("linkHover", {position: r, token: s})
        }
    }

    function s(e) {
        var t = e.getAccelKey(), n = e.getButton();
        if (n == 0 && t) {
            var r = e.editor, i = e.getDocumentPosition(), s = r.session, o = s.getTokenAt(i.row, i.column);
            r._emit("linkClick", {position: i, token: o})
        }
    }

    var r = e("ace/editor").Editor;
    e("../config").defineOptions(r.prototype, "editor", {enableLinking: {set: function (e) {
        e ? (this.on("click", s), this.on("mousemove", i)) : (this.off("click", s), this.off("mousemove", i))
    }, value: !1}})
});
(function () {
    ace.require(["ace/ext/linking"], function () {
    });
})();
            