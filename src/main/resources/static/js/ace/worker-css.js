"no use strict";
(function (e) {
    if (typeof e.window != "undefined" && e.document)return;
    e.console = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        postMessage({type: "log", data: e})
    }, e.console.error = e.console.warn = e.console.log = e.console.trace = e.console, e.window = e, e.ace = e, e.onerror = function (e, t, n, r, i) {
        postMessage({type: "error", data: {message: e, file: t, line: n, col: r, stack: i.stack}})
    }, e.normalizeModule = function (t, n) {
        if (n.indexOf("!") !== -1) {
            var r = n.split("!");
            return e.normalizeModule(t, r[0]) + "!" + e.normalizeModule(t, r[1])
        }
        if (n.charAt(0) == ".") {
            var i = t.split("/").slice(0, -1).join("/");
            n = (i ? i + "/" : "") + n;
            while (n.indexOf(".") !== -1 && s != n) {
                var s = n;
                n = n.replace(/^\.\//, "").replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "")
            }
        }
        return n
    }, e.require = function (t, n) {
        n || (n = t, t = null);
        if (!n.charAt)throw new Error("worker.js require() accepts only (parentId, id) as arguments");
        n = e.normalizeModule(t, n);
        var r = e.require.modules[n];
        if (r)return r.initialized || (r.initialized = !0, r.exports = r.factory().exports), r.exports;
        var i = n.split("/");
        if (!e.require.tlns)return console.log("unable to load " + n);
        i[0] = e.require.tlns[i[0]] || i[0];
        var s = i.join("/") + ".js";
        return e.require.id = n, importScripts(s), e.require(t, n)
    }, e.require.modules = {}, e.require.tlns = {}, e.define = function (t, n, r) {
        arguments.length == 2 ? (r = n, typeof t != "string" && (n = t, t = e.require.id)) : arguments.length == 1 && (r = t, n = [], t = e.require.id);
        if (typeof r != "function") {
            e.require.modules[t] = {exports: r, initialized: !0};
            return
        }
        n.length || (n = ["require", "exports", "module"]);
        var i = function (n) {
            return e.require(t, n)
        };
        e.require.modules[t] = {exports: {}, factory: function () {
            var e = this, t = r.apply(this, n.map(function (t) {
                switch (t) {
                    case"require":
                        return i;
                    case"exports":
                        return e.exports;
                    case"module":
                        return e;
                    default:
                        return i(t)
                }
            }));
            return t && (e.exports = t), e
        }}
    }, e.define.amd = {}, e.initBaseUrls = function (t) {
        require.tlns = t
    }, e.initSender = function () {
        var n = e.require("ace/lib/event_emitter").EventEmitter, r = e.require("ace/lib/oop"), i = function () {
        };
        return function () {
            r.implement(this, n), this.callback = function (e, t) {
                postMessage({type: "call", id: t, data: e})
            }, this.emit = function (e, t) {
                postMessage({type: "event", name: e, data: t})
            }
        }.call(i.prototype), new i
    };
    var t = e.main = null, n = e.sender = null;
    e.onmessage = function (r) {
        var i = r.data;
        if (i.command) {
            if (!t[i.command])throw new Error("Unknown command:" + i.command);
            t[i.command].apply(t, i.args)
        } else if (i.init) {
            initBaseUrls(i.tlns), require("ace/lib/es5-shim"), n = e.sender = initSender();
            var s = require(i.module)[i.classname];
            t = e.main = new s(n)
        } else i.event && n && n._signal(i.event, i.data)
    }
})(this), ace.define("ace/lib/oop", ["require", "exports", "module"], function (e, t, n) {
    "use strict";
    t.inherits = function (e, t) {
        e.super_ = t, e.prototype = Object.create(t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}})
    }, t.mixin = function (e, t) {
        for (var n in t)e[n] = t[n];
        return e
    }, t.implement = function (e, n) {
        t.mixin(e, n)
    }
}), ace.define("ace/lib/lang", ["require", "exports", "module"], function (e, t, n) {
    "use strict";
    t.last = function (e) {
        return e[e.length - 1]
    }, t.stringReverse = function (e) {
        return e.split("").reverse().join("")
    }, t.stringRepeat = function (e, t) {
        var n = "";
        while (t > 0) {
            t & 1 && (n += e);
            if (t >>= 1)e += e
        }
        return n
    };
    var r = /^\s\s*/, i = /\s\s*$/;
    t.stringTrimLeft = function (e) {
        return e.replace(r, "")
    }, t.stringTrimRight = function (e) {
        return e.replace(i, "")
    }, t.copyObject = function (e) {
        var t = {};
        for (var n in e)t[n] = e[n];
        return t
    }, t.copyArray = function (e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)e[n] && typeof e[n] == "object" ? t[n] = this.copyObject(e[n]) : t[n] = e[n];
        return t
    }, t.deepCopy = function (e) {
        if (typeof e != "object" || !e)return e;
        var n = e.constructor;
        if (n === RegExp)return e;
        var r = n();
        for (var i in e)typeof e[i] == "object" ? r[i] = t.deepCopy(e[i]) : r[i] = e[i];
        return r
    }, t.arrayToMap = function (e) {
        var t = {};
        for (var n = 0; n < e.length; n++)t[e[n]] = 1;
        return t
    }, t.createMap = function (e) {
        var t = Object.create(null);
        for (var n in e)t[n] = e[n];
        return t
    }, t.arrayRemove = function (e, t) {
        for (var n = 0; n <= e.length; n++)t === e[n] && e.splice(n, 1)
    }, t.escapeRegExp = function (e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    }, t.escapeHTML = function (e) {
        return e.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;")
    }, t.getMatchOffsets = function (e, t) {
        var n = [];
        return e.replace(t, function (e) {
            n.push({offset: arguments[arguments.length - 2], length: e.length})
        }), n
    }, t.deferredCall = function (e) {
        var t = null, n = function () {
            t = null, e()
        }, r = function (e) {
            return r.cancel(), t = setTimeout(n, e || 0), r
        };
        return r.schedule = r, r.call = function () {
            return this.cancel(), e(), r
        }, r.cancel = function () {
            return clearTimeout(t), t = null, r
        }, r.isPending = function () {
            return t
        }, r
    }, t.delayedCall = function (e, t) {
        var n = null, r = function () {
            n = null, e()
        }, i = function (e) {
            n == null && (n = setTimeout(r, e || t))
        };
        return i.delay = function (e) {
            n && clearTimeout(n), n = setTimeout(r, e || t)
        }, i.schedule = i, i.call = function () {
            this.cancel(), e()
        }, i.cancel = function () {
            n && clearTimeout(n), n = null
        }, i.isPending = function () {
            return n
        }, i
    }
}), ace.define("ace/lib/event_emitter", ["require", "exports", "module"], function (e, t, n) {
    "use strict";
    var r = {}, i = function () {
        this.propagationStopped = !0
    }, s = function () {
        this.defaultPrevented = !0
    };
    r._emit = r._dispatchEvent = function (e, t) {
        this._eventRegistry || (this._eventRegistry = {}), this._defaultHandlers || (this._defaultHandlers = {});
        var n = this._eventRegistry[e] || [], r = this._defaultHandlers[e];
        if (!n.length && !r)return;
        if (typeof t != "object" || !t)t = {};
        t.type || (t.type = e), t.stopPropagation || (t.stopPropagation = i), t.preventDefault || (t.preventDefault = s), n = n.slice();
        for (var o = 0; o < n.length; o++) {
            n[o](t, this);
            if (t.propagationStopped)break
        }
        if (r && !t.defaultPrevented)return r(t, this)
    }, r._signal = function (e, t) {
        var n = (this._eventRegistry || {})[e];
        if (!n)return;
        n = n.slice();
        for (var r = 0; r < n.length; r++)n[r](t, this)
    }, r.once = function (e, t) {
        var n = this;
        t && this.addEventListener(e, function r() {
            n.removeEventListener(e, r), t.apply(null, arguments)
        })
    }, r.setDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        n || (n = this._defaultHandlers = {_disabled_: {}});
        if (n[e]) {
            var r = n[e], i = n._disabled_[e];
            i || (n._disabled_[e] = i = []), i.push(r);
            var s = i.indexOf(t);
            s != -1 && i.splice(s, 1)
        }
        n[e] = t
    }, r.removeDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        if (!n)return;
        var r = n._disabled_[e];
        if (n[e] == t) {
            var i = n[e];
            r && this.setDefaultHandler(e, r.pop())
        } else if (r) {
            var s = r.indexOf(t);
            s != -1 && r.splice(s, 1)
        }
    }, r.on = r.addEventListener = function (e, t, n) {
        this._eventRegistry = this._eventRegistry || {};
        var r = this._eventRegistry[e];
        return r || (r = this._eventRegistry[e] = []), r.indexOf(t) == -1 && r[n ? "unshift" : "push"](t), t
    }, r.off = r.removeListener = r.removeEventListener = function (e, t) {
        this._eventRegistry = this._eventRegistry || {};
        var n = this._eventRegistry[e];
        if (!n)return;
        var r = n.indexOf(t);
        r !== -1 && n.splice(r, 1)
    }, r.removeAllListeners = function (e) {
        this._eventRegistry && (this._eventRegistry[e] = [])
    }, t.EventEmitter = r
}), ace.define("ace/range", ["require", "exports", "module"], function (e, t, n) {
    "use strict";
    var r = function (e, t) {
        return e.row - t.row || e.column - t.column
    }, i = function (e, t, n, r) {
        this.start = {row: e, column: t}, this.end = {row: n, column: r}
    };
    (function () {
        this.isEqual = function (e) {
            return this.start.row === e.start.row && this.end.row === e.end.row && this.start.column === e.start.column && this.end.column === e.end.column
        }, this.toString = function () {
            return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
        }, this.contains = function (e, t) {
            return this.compare(e, t) == 0
        }, this.compareRange = function (e) {
            var t, n = e.end, r = e.start;
            return t = this.compare(n.row, n.column), t == 1 ? (t = this.compare(r.row, r.column), t == 1 ? 2 : t == 0 ? 1 : 0) : t == -1 ? -2 : (t = this.compare(r.row, r.column), t == -1 ? -1 : t == 1 ? 42 : 0)
        }, this.comparePoint = function (e) {
            return this.compare(e.row, e.column)
        }, this.containsRange = function (e) {
            return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
        }, this.intersects = function (e) {
            var t = this.compareRange(e);
            return t == -1 || t == 0 || t == 1
        }, this.isEnd = function (e, t) {
            return this.end.row == e && this.end.column == t
        }, this.isStart = function (e, t) {
            return this.start.row == e && this.start.column == t
        }, this.setStart = function (e, t) {
            typeof e == "object" ? (this.start.column = e.column, this.start.row = e.row) : (this.start.row = e, this.start.column = t)
        }, this.setEnd = function (e, t) {
            typeof e == "object" ? (this.end.column = e.column, this.end.row = e.row) : (this.end.row = e, this.end.column = t)
        }, this.inside = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0 : !1
        }, this.insideStart = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) ? !1 : !0 : !1
        }, this.insideEnd = function (e, t) {
            return this.compare(e, t) == 0 ? this.isStart(e, t) ? !1 : !0 : !1
        }, this.compare = function (e, t) {
            return!this.isMultiLine() && e === this.start.row ? t < this.start.column ? -1 : t > this.end.column ? 1 : 0 : e < this.start.row ? -1 : e > this.end.row ? 1 : this.start.row === e ? t >= this.start.column ? 0 : -1 : this.end.row === e ? t <= this.end.column ? 0 : 1 : 0
        }, this.compareStart = function (e, t) {
            return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
        }, this.compareEnd = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t)
        }, this.compareInside = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
        }, this.clipRows = function (e, t) {
            if (this.end.row > t)var n = {row: t + 1, column: 0}; else if (this.end.row < e)var n = {row: e, column: 0};
            if (this.start.row > t)var r = {row: t + 1, column: 0}; else if (this.start.row < e)var r = {row: e, column: 0};
            return i.fromPoints(r || this.start, n || this.end)
        }, this.extend = function (e, t) {
            var n = this.compare(e, t);
            if (n == 0)return this;
            if (n == -1)var r = {row: e, column: t}; else var s = {row: e, column: t};
            return i.fromPoints(r || this.start, s || this.end)
        }, this.isEmpty = function () {
            return this.start.row === this.end.row && this.start.column === this.end.column
        }, this.isMultiLine = function () {
            return this.start.row !== this.end.row
        }, this.clone = function () {
            return i.fromPoints(this.start, this.end)
        }, this.collapseRows = function () {
            return this.end.column == 0 ? new i(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new i(this.start.row, 0, this.end.row, 0)
        }, this.toScreenRange = function (e) {
            var t = e.documentToScreenPosition(this.start), n = e.documentToScreenPosition(this.end);
            return new i(t.row, t.column, n.row, n.column)
        }, this.moveBy = function (e, t) {
            this.start.row += e, this.start.column += t, this.end.row += e, this.end.column += t
        }
    }).call(i.prototype), i.fromPoints = function (e, t) {
        return new i(e.row, e.column, t.row, t.column)
    }, i.comparePoints = r, i.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column
    }, t.Range = i
}), ace.define("ace/anchor", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"], function (e, t, n) {
    "use strict";
    var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter, s = t.Anchor = function (e, t, n) {
        this.$onChange = this.onChange.bind(this), this.attach(e), typeof n == "undefined" ? this.setPosition(t.row, t.column) : this.setPosition(t, n)
    };
    (function () {
        r.implement(this, i), this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column)
        }, this.getDocument = function () {
            return this.document
        }, this.$insertRight = !1, this.onChange = function (e) {
            var t = e.data, n = t.range;
            if (n.start.row == n.end.row && n.start.row != this.row)return;
            if (n.start.row > this.row)return;
            if (n.start.row == this.row && n.start.column > this.column)return;
            var r = this.row, i = this.column, s = n.start, o = n.end;
            if (t.action === "insertText")if (s.row === r && s.column <= i) {
                if (s.column !== i || !this.$insertRight)s.row === o.row ? i += o.column - s.column : (i -= s.column, r += o.row - s.row)
            } else s.row !== o.row && s.row < r && (r += o.row - s.row); else t.action === "insertLines" ? (s.row !== r || i !== 0 || !this.$insertRight) && s.row <= r && (r += o.row - s.row) : t.action === "removeText" ? s.row === r && s.column < i ? o.column >= i ? i = s.column : i = Math.max(0, i - (o.column - s.column)) : s.row !== o.row && s.row < r ? (o.row === r && (i = Math.max(0, i - o.column) + s.column), r -= o.row - s.row) : o.row === r && (r -= o.row - s.row, i = Math.max(0, i - o.column) + s.column) : t.action == "removeLines" && s.row <= r && (o.row <= r ? r -= o.row - s.row : (r = s.row, i = 0));
            this.setPosition(r, i, !0)
        }, this.setPosition = function (e, t, n) {
            var r;
            n ? r = {row: e, column: t} : r = this.$clipPositionToDocument(e, t);
            if (this.row == r.row && this.column == r.column)return;
            var i = {row: this.row, column: this.column};
            this.row = r.row, this.column = r.column, this._signal("change", {old: i, value: r})
        }, this.detach = function () {
            this.document.removeEventListener("change", this.$onChange)
        }, this.attach = function (e) {
            this.document = e || this.document, this.document.on("change", this.$onChange)
        }, this.$clipPositionToDocument = function (e, t) {
            var n = {};
            return e >= this.document.getLength() ? (n.row = Math.max(0, this.document.getLength() - 1), n.column = this.document.getLine(n.row).length) : e < 0 ? (n.row = 0, n.column = 0) : (n.row = e, n.column = Math.min(this.document.getLine(n.row).length, Math.max(0, t))), t < 0 && (n.column = 0), n
        }
    }).call(s.prototype)
}), ace.define("ace/document", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter", "ace/range", "ace/anchor"], function (e, t, n) {
    "use strict";
    var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter, s = e("./range").Range, o = e("./anchor").Anchor, u = function (e) {
        this.$lines = [], e.length === 0 ? this.$lines = [""] : Array.isArray(e) ? this._insertLines(0, e) : this.insert({row: 0, column: 0}, e)
    };
    (function () {
        r.implement(this, i), this.setValue = function (e) {
            var t = this.getLength();
            this.remove(new s(0, 0, t, this.getLine(t - 1).length)), this.insert({row: 0, column: 0}, e)
        }, this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter())
        }, this.createAnchor = function (e, t) {
            return new o(this, e, t)
        }, "aaa".split(/a/).length === 0 ? this.$split = function (e) {
            return e.replace(/\r\n|\r/g, "\n").split("\n")
        } : this.$split = function (e) {
            return e.split(/\r\n|\r|\n/)
        }, this.$detectNewLine = function (e) {
            var t = e.match(/^.*?(\r\n|\r|\n)/m);
            this.$autoNewLine = t ? t[1] : "\n", this._signal("changeNewLineMode")
        }, this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
                case"windows":
                    return"\r\n";
                case"unix":
                    return"\n";
                default:
                    return this.$autoNewLine || "\n"
            }
        }, this.$autoNewLine = "", this.$newLineMode = "auto", this.setNewLineMode = function (e) {
            if (this.$newLineMode === e)return;
            this.$newLineMode = e, this._signal("changeNewLineMode")
        }, this.getNewLineMode = function () {
            return this.$newLineMode
        }, this.isNewLine = function (e) {
            return e == "\r\n" || e == "\r" || e == "\n"
        }, this.getLine = function (e) {
            return this.$lines[e] || ""
        }, this.getLines = function (e, t) {
            return this.$lines.slice(e, t + 1)
        }, this.getAllLines = function () {
            return this.getLines(0, this.getLength())
        }, this.getLength = function () {
            return this.$lines.length
        }, this.getTextRange = function (e) {
            if (e.start.row == e.end.row)return this.getLine(e.start.row).substring(e.start.column, e.end.column);
            var t = this.getLines(e.start.row, e.end.row);
            t[0] = (t[0] || "").substring(e.start.column);
            var n = t.length - 1;
            return e.end.row - e.start.row == n && (t[n] = t[n].substring(0, e.end.column)), t.join(this.getNewLineCharacter())
        }, this.$clipPosition = function (e) {
            var t = this.getLength();
            return e.row >= t ? (e.row = Math.max(0, t - 1), e.column = this.getLine(t - 1).length) : e.row < 0 && (e.row = 0), e
        }, this.insert = function (e, t) {
            if (!t || t.length === 0)return e;
            e = this.$clipPosition(e), this.getLength() <= 1 && this.$detectNewLine(t);
            var n = this.$split(t), r = n.splice(0, 1)[0], i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
            return e = this.insertInLine(e, r), i !== null && (e = this.insertNewLine(e), e = this._insertLines(e.row, n), e = this.insertInLine(e, i || "")), e
        }, this.insertLines = function (e, t) {
            return e >= this.getLength() ? this.insert({row: e, column: 0}, "\n" + t.join("\n")) : this._insertLines(Math.max(e, 0), t)
        }, this._insertLines = function (e, t) {
            if (t.length == 0)return{row: e, column: 0};
            while (t.length > 61440) {
                var n = this._insertLines(e, t.slice(0, 61440));
                t = t.slice(61440), e = n.row
            }
            var r = [e, 0];
            r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
            var i = new s(e, 0, e + t.length, 0), o = {action: "insertLines", range: i, lines: t};
            return this._signal("change", {data: o}), i.end
        }, this.insertNewLine = function (e) {
            e = this.$clipPosition(e);
            var t = this.$lines[e.row] || "";
            this.$lines[e.row] = t.substring(0, e.column), this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
            var n = {row: e.row + 1, column: 0}, r = {action: "insertText", range: s.fromPoints(e, n), text: this.getNewLineCharacter()};
            return this._signal("change", {data: r}), n
        }, this.insertInLine = function (e, t) {
            if (t.length == 0)return e;
            var n = this.$lines[e.row] || "";
            this.$lines[e.row] = n.substring(0, e.column) + t + n.substring(e.column);
            var r = {row: e.row, column: e.column + t.length}, i = {action: "insertText", range: s.fromPoints(e, r), text: t};
            return this._signal("change", {data: i}), r
        }, this.remove = function (e) {
            e instanceof s || (e = s.fromPoints(e.start, e.end)), e.start = this.$clipPosition(e.start), e.end = this.$clipPosition(e.end);
            if (e.isEmpty())return e.start;
            var t = e.start.row, n = e.end.row;
            if (e.isMultiLine()) {
                var r = e.start.column == 0 ? t : t + 1, i = n - 1;
                e.end.column > 0 && this.removeInLine(n, 0, e.end.column), i >= r && this._removeLines(r, i), r != t && (this.removeInLine(t, e.start.column, this.getLine(t).length), this.removeNewLine(e.start.row))
            } else this.removeInLine(t, e.start.column, e.end.column);
            return e.start
        }, this.removeInLine = function (e, t, n) {
            if (t == n)return;
            var r = new s(e, t, e, n), i = this.getLine(e), o = i.substring(t, n), u = i.substring(0, t) + i.substring(n, i.length);
            this.$lines.splice(e, 1, u);
            var a = {action: "removeText", range: r, text: o};
            return this._signal("change", {data: a}), r.start
        }, this.removeLines = function (e, t) {
            return e < 0 || t >= this.getLength() ? this.remove(new s(e, 0, t + 1, 0)) : this._removeLines(e, t)
        }, this._removeLines = function (e, t) {
            var n = new s(e, 0, t + 1, 0), r = this.$lines.splice(e, t - e + 1), i = {action: "removeLines", range: n, nl: this.getNewLineCharacter(), lines: r};
            return this._signal("change", {data: i}), r
        }, this.removeNewLine = function (e) {
            var t = this.getLine(e), n = this.getLine(e + 1), r = new s(e, t.length, e + 1, 0), i = t + n;
            this.$lines.splice(e, 2, i);
            var o = {action: "removeText", range: r, text: this.getNewLineCharacter()};
            this._signal("change", {data: o})
        }, this.replace = function (e, t) {
            e instanceof s || (e = s.fromPoints(e.start, e.end));
            if (t.length == 0 && e.isEmpty())return e.start;
            if (t == this.getTextRange(e))return e.end;
            this.remove(e);
            if (t)var n = this.insert(e.start, t); else n = e.start;
            return n
        }, this.applyDeltas = function (e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == "insertLines" ? this.insertLines(r.start.row, n.lines) : n.action == "insertText" ? this.insert(r.start, n.text) : n.action == "removeLines" ? this._removeLines(r.start.row, r.end.row - 1) : n.action == "removeText" && this.remove(r)
            }
        }, this.revertDeltas = function (e) {
            for (var t = e.length - 1; t >= 0; t--) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == "insertLines" ? this._removeLines(r.start.row, r.end.row - 1) : n.action == "insertText" ? this.remove(r) : n.action == "removeLines" ? this._insertLines(r.start.row, n.lines) : n.action == "removeText" && this.insert(r.start, n.text)
            }
        }, this.indexToPosition = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length;
            for (var i = t || 0, s = n.length; i < s; i++) {
                e -= n[i].length + r;
                if (e < 0)return{row: i, column: e + n[i].length + r}
            }
            return{row: s - 1, column: n[s - 1].length}
        }, this.positionToIndex = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length, i = 0, s = Math.min(e.row, n.length);
            for (var o = t || 0; o < s; ++o)i += n[o].length + r;
            return i + e.column
        }
    }).call(u.prototype), t.Document = u
}), ace.define("ace/worker/mirror", ["require", "exports", "module", "ace/document", "ace/lib/lang"], function (e, t, n) {
    "use strict";
    var r = e("../document").Document, i = e("../lib/lang"), s = t.Mirror = function (e) {
        this.sender = e;
        var t = this.doc = new r(""), n = this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this)), s = this;
        e.on("change", function (e) {
            t.applyDeltas(e.data);
            if (s.$timeout)return n.schedule(s.$timeout);
            s.onUpdate()
        })
    };
    (function () {
        this.$timeout = 500, this.setTimeout = function (e) {
            this.$timeout = e
        }, this.setValue = function (e) {
            this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout)
        }, this.getValue = function (e) {
            this.sender.callback(this.doc.getValue(), e)
        }, this.onUpdate = function () {
        }, this.isPending = function () {
            return this.deferredUpdate.isPending()
        }
    }).call(s.prototype)
}), ace.define("ace/mode/css/csslint", ["require", "exports", "module"], function (require, exports, module) {
    function objectToString(e) {
        return Object.prototype.toString.call(e)
    }

    function clone(e, t, n, r) {
        function u(e, n) {
            if (e === null)return null;
            if (n == 0)return e;
            var a;
            if (typeof e != "object")return e;
            if (util.isArray(e))a = []; else if (util.isRegExp(e))a = new RegExp(e.source, util.getRegExpFlags(e)), e.lastIndex && (a.lastIndex = e.lastIndex); else if (util.isDate(e))a = new Date(e.getTime()); else {
                if (o && Buffer.isBuffer(e))return a = new Buffer(e.length), e.copy(a), a;
                typeof r == "undefined" ? a = Object.create(Object.getPrototypeOf(e)) : a = Object.create(r)
            }
            if (t) {
                var f = i.indexOf(e);
                if (f != -1)return s[f];
                i.push(e), s.push(a)
            }
            for (var l in e)a[l] = u(e[l], n - 1);
            return a
        }

        var i = [], s = [], o = typeof Buffer != "undefined";
        return typeof t == "undefined" && (t = !0), typeof n == "undefined" && (n = Infinity), u(e, n)
    }

    function Reporter(e, t) {
        this.messages = [], this.stats = [], this.lines = e, this.ruleset = t
    }

    var parserlib = {};
    (function () {
        function e() {
            this._listeners = {}
        }

        function t(e) {
            this._input = e.replace(/\n\r?/g, "\n"), this._line = 1, this._col = 1, this._cursor = 0
        }

        function n(e, t, n) {
            this.col = n, this.line = t, this.message = e
        }

        function r(e, t, n, r) {
            this.col = n, this.line = t, this.text = e, this.type = r
        }

        function i(e, n) {
            this._reader = e ? new t(e.toString()) : null, this._token = null, this._tokenData = n, this._lt = [], this._ltIndex = 0, this._ltIndexCache = []
        }

        e.prototype = {constructor: e, addListener: function (e, t) {
            this._listeners[e] || (this._listeners[e] = []), this._listeners[e].push(t)
        }, fire: function (e) {
            typeof e == "string" && (e = {type: e}), typeof e.target != "undefined" && (e.target = this);
            if (typeof e.type == "undefined")throw new Error("Event object missing 'type' property.");
            if (this._listeners[e.type]) {
                var t = this._listeners[e.type].concat();
                for (var n = 0, r = t.length; n < r; n++)t[n].call(this, e)
            }
        }, removeListener: function (e, t) {
            if (this._listeners[e]) {
                var n = this._listeners[e];
                for (var r = 0, i = n.length; r < i; r++)if (n[r] === t) {
                    n.splice(r, 1);
                    break
                }
            }
        }}, t.prototype = {constructor: t, getCol: function () {
            return this._col
        }, getLine: function () {
            return this._line
        }, eof: function () {
            return this._cursor == this._input.length
        }, peek: function (e) {
            var t = null;
            return e = typeof e == "undefined" ? 1 : e, this._cursor < this._input.length && (t = this._input.charAt(this._cursor + e - 1)), t
        }, read: function () {
            var e = null;
            return this._cursor < this._input.length && (this._input.charAt(this._cursor) == "\n" ? (this._line++, this._col = 1) : this._col++, e = this._input.charAt(this._cursor++)), e
        }, mark: function () {
            this._bookmark = {cursor: this._cursor, line: this._line, col: this._col}
        }, reset: function () {
            this._bookmark && (this._cursor = this._bookmark.cursor, this._line = this._bookmark.line, this._col = this._bookmark.col, delete this._bookmark)
        }, readTo: function (e) {
            var t = "", n;
            while (t.length < e.length || t.lastIndexOf(e) != t.length - e.length) {
                n = this.read();
                if (!n)throw new Error('Expected "' + e + '" at line ' + this._line + ", col " + this._col + ".");
                t += n
            }
            return t
        }, readWhile: function (e) {
            var t = "", n = this.read();
            while (n !== null && e(n))t += n, n = this.read();
            return t
        }, readMatch: function (e) {
            var t = this._input.substring(this._cursor), n = null;
            return typeof e == "string" ? t.indexOf(e) === 0 && (n = this.readCount(e.length)) : e instanceof RegExp && e.test(t) && (n = this.readCount(RegExp.lastMatch.length)), n
        }, readCount: function (e) {
            var t = "";
            while (e--)t += this.read();
            return t
        }}, n.prototype = new Error, r.fromToken = function (e) {
            return new r(e.value, e.startLine, e.startCol)
        }, r.prototype = {constructor: r, valueOf: function () {
            return this.text
        }, toString: function () {
            return this.text
        }}, i.createTokenData = function (e) {
            var t = [], n = {}, r = e.concat([]), i = 0, s = r.length + 1;
            r.UNKNOWN = -1, r.unshift({name: "EOF"});
            for (; i < s; i++)t.push(r[i].name), r[r[i].name] = i, r[i].text && (n[r[i].text] = i);
            return r.name = function (e) {
                return t[e]
            }, r.type = function (e) {
                return n[e]
            }, r
        }, i.prototype = {constructor: i, match: function (e, t) {
            e instanceof Array || (e = [e]);
            var n = this.get(t), r = 0, i = e.length;
            while (r < i)if (n == e[r++])return!0;
            return this.unget(), !1
        }, mustMatch: function (e, t) {
            var r;
            e instanceof Array || (e = [e]);
            if (!this.match.apply(this, arguments))throw r = this.LT(1), new n("Expected " + this._tokenData[e[0]].name + " at line " + r.startLine + ", col " + r.startCol + ".", r.startLine, r.startCol)
        }, advance: function (e, t) {
            while (this.LA(0) !== 0 && !this.match(e, t))this.get();
            return this.LA(0)
        }, get: function (e) {
            var t = this._tokenData, n = this._reader, r, i = 0, s = t.length, o = !1, u, a;
            if (this._lt.length && this._ltIndex >= 0 && this._ltIndex < this._lt.length) {
                i++, this._token = this._lt[this._ltIndex++], a = t[this._token.type];
                while (a.channel !== undefined && e !== a.channel && this._ltIndex < this._lt.length)this._token = this._lt[this._ltIndex++], a = t[this._token.type], i++;
                if ((a.channel === undefined || e === a.channel) && this._ltIndex <= this._lt.length)return this._ltIndexCache.push(i), this._token.type
            }
            return u = this._getToken(), u.type > -1 && !t[u.type].hide && (u.channel = t[u.type].channel, this._token = u, this._lt.push(u), this._ltIndexCache.push(this._lt.length - this._ltIndex + i), this._lt.length > 5 && this._lt.shift(), this._ltIndexCache.length > 5 && this._ltIndexCache.shift(), this._ltIndex = this._lt.length), a = t[u.type], a && (a.hide || a.channel !== undefined && e !== a.channel) ? this.get(e) : u.type
        }, LA: function (e) {
            var t = e, n;
            if (e > 0) {
                if (e > 5)throw new Error("Too much lookahead.");
                while (t)n = this.get(), t--;
                while (t < e)this.unget(), t++
            } else if (e < 0) {
                if (!this._lt[this._ltIndex + e])throw new Error("Too much lookbehind.");
                n = this._lt[this._ltIndex + e].type
            } else n = this._token.type;
            return n
        }, LT: function (e) {
            return this.LA(e), this._lt[this._ltIndex + e - 1]
        }, peek: function () {
            return this.LA(1)
        }, token: function () {
            return this._token
        }, tokenName: function (e) {
            return e < 0 || e > this._tokenData.length ? "UNKNOWN_TOKEN" : this._tokenData[e].name
        }, tokenType: function (e) {
            return this._tokenData[e] || -1
        }, unget: function () {
            if (!this._ltIndexCache.length)throw new Error("Too much lookahead.");
            this._ltIndex -= this._ltIndexCache.pop(), this._token = this._lt[this._ltIndex - 1]
        }}, parserlib.util = {StringReader: t, SyntaxError: n, SyntaxUnit: r, EventTarget: e, TokenStreamBase: i}
    })(), function () {
        function Combinator(e, t, n) {
            SyntaxUnit.call(this, e, t, n, Parser.COMBINATOR_TYPE), this.type = "unknown", /^\s+$/.test(e) ? this.type = "descendant" : e == ">" ? this.type = "child" : e == "+" ? this.type = "adjacent-sibling" : e == "~" && (this.type = "sibling")
        }

        function MediaFeature(e, t) {
            SyntaxUnit.call(this, "(" + e + (t !== null ? ":" + t : "") + ")", e.startLine, e.startCol, Parser.MEDIA_FEATURE_TYPE), this.name = e, this.value = t
        }

        function MediaQuery(e, t, n, r, i) {
            SyntaxUnit.call(this, (e ? e + " " : "") + (t ? t : "") + (t && n.length > 0 ? " and " : "") + n.join(" and "), r, i, Parser.MEDIA_QUERY_TYPE), this.modifier = e, this.mediaType = t, this.features = n
        }

        function Parser(e) {
            EventTarget.call(this), this.options = e || {}, this._tokenStream = null
        }

        function PropertyName(e, t, n, r) {
            SyntaxUnit.call(this, e, n, r, Parser.PROPERTY_NAME_TYPE), this.hack = t
        }

        function PropertyValue(e, t, n) {
            SyntaxUnit.call(this, e.join(" "), t, n, Parser.PROPERTY_VALUE_TYPE), this.parts = e
        }

        function PropertyValueIterator(e) {
            this._i = 0, this._parts = e.parts, this._marks = [], this.value = e
        }

        function PropertyValuePart(text, line, col) {
            SyntaxUnit.call(this, text, line, col, Parser.PROPERTY_VALUE_PART_TYPE), this.type = "unknown";
            var temp;
            if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)) {
                this.type = "dimension", this.value = +RegExp.$1, this.units = RegExp.$2;
                switch (this.units.toLowerCase()) {
                    case"em":
                    case"rem":
                    case"ex":
                    case"px":
                    case"cm":
                    case"mm":
                    case"in":
                    case"pt":
                    case"pc":
                    case"ch":
                    case"vh":
                    case"vw":
                    case"vmax":
                    case"vmin":
                        this.type = "length";
                        break;
                    case"deg":
                    case"rad":
                    case"grad":
                        this.type = "angle";
                        break;
                    case"ms":
                    case"s":
                        this.type = "time";
                        break;
                    case"hz":
                    case"khz":
                        this.type = "frequency";
                        break;
                    case"dpi":
                    case"dpcm":
                        this.type = "resolution"
                }
            } else/^([+\-]?[\d\.]+)%$/i.test(text) ? (this.type = "percentage", this.value = +RegExp.$1) : /^([+\-]?\d+)$/i.test(text) ? (this.type = "integer", this.value = +RegExp.$1) : /^([+\-]?[\d\.]+)$/i.test(text) ? (this.type = "number", this.value = +RegExp.$1) : /^#([a-f0-9]{3,6})/i.test(text) ? (this.type = "color", temp = RegExp.$1, temp.length == 3 ? (this.red = parseInt(temp.charAt(0) + temp.charAt(0), 16), this.green = parseInt(temp.charAt(1) + temp.charAt(1), 16), this.blue = parseInt(temp.charAt(2) + temp.charAt(2), 16)) : (this.red = parseInt(temp.substring(0, 2), 16), this.green = parseInt(temp.substring(2, 4), 16), this.blue = parseInt(temp.substring(4, 6), 16))) : /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3) : /^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100) : /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3, this.alpha = +RegExp.$4) : /^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100, this.alpha = +RegExp.$4) : /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100) : /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100, this.alpha = +RegExp.$4) : /^url\(["']?([^\)"']+)["']?\)/i.test(text) ? (this.type = "uri", this.uri = RegExp.$1) : /^([^\(]+)\(/i.test(text) ? (this.type = "function", this.name = RegExp.$1, this.value = text) : /^["'][^"']*["']/.test(text) ? (this.type = "string", this.value = eval(text)) : Colors[text.toLowerCase()] ? (this.type = "color", temp = Colors[text.toLowerCase()].substring(1), this.red = parseInt(temp.substring(0, 2), 16), this.green = parseInt(temp.substring(2, 4), 16), this.blue = parseInt(temp.substring(4, 6), 16)) : /^[\,\/]$/.test(text) ? (this.type = "operator", this.value = text) : /^[a-z\-_\u0080-\uFFFF][a-z0-9\-_\u0080-\uFFFF]*$/i.test(text) && (this.type = "identifier", this.value = text)
        }

        function Selector(e, t, n) {
            SyntaxUnit.call(this, e.join(" "), t, n, Parser.SELECTOR_TYPE), this.parts = e, this.specificity = Specificity.calculate(this)
        }

        function SelectorPart(e, t, n, r, i) {
            SyntaxUnit.call(this, n, r, i, Parser.SELECTOR_PART_TYPE), this.elementName = e, this.modifiers = t
        }

        function SelectorSubPart(e, t, n, r) {
            SyntaxUnit.call(this, e, n, r, Parser.SELECTOR_SUB_PART_TYPE), this.type = t, this.args = []
        }

        function Specificity(e, t, n, r) {
            this.a = e, this.b = t, this.c = n, this.d = r
        }

        function isHexDigit(e) {
            return e !== null && h.test(e)
        }

        function isDigit(e) {
            return e !== null && /\d/.test(e)
        }

        function isWhitespace(e) {
            return e !== null && /\s/.test(e)
        }

        function isNewLine(e) {
            return e !== null && nl.test(e)
        }

        function isNameStart(e) {
            return e !== null && /[a-z_\u0080-\uFFFF\\]/i.test(e)
        }

        function isNameChar(e) {
            return e !== null && (isNameStart(e) || /[0-9\-\\]/.test(e))
        }

        function isIdentStart(e) {
            return e !== null && (isNameStart(e) || /\-\\/.test(e))
        }

        function mix(e, t) {
            for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }

        function TokenStream(e) {
            TokenStreamBase.call(this, e, Tokens)
        }

        function ValidationError(e, t, n) {
            this.col = n, this.line = t, this.message = e
        }

        var EventTarget = parserlib.util.EventTarget, TokenStreamBase = parserlib.util.TokenStreamBase, StringReader = parserlib.util.StringReader, SyntaxError = parserlib.util.SyntaxError, SyntaxUnit = parserlib.util.SyntaxUnit, Colors = {aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgrey: "#a9a9a9", darkgreen: "#006400", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", grey: "#808080", green: "#008000", greenyellow: "#adff2f", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgrey: "#d3d3d3", lightgreen: "#90ee90", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370d8", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#d87093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32", activeBorder: "Active window border.", activecaption: "Active window caption.", appworkspace: "Background color of multiple document interface.", background: "Desktop background.", buttonface: "The face background color for 3-D elements that appear 3-D due to one layer of surrounding border.", buttonhighlight: "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border.", buttonshadow: "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border.", buttontext: "Text on push buttons.", captiontext: "Text in caption, size box, and scrollbar arrow box.", graytext: "Grayed (disabled) text. This color is set to #000 if the current display driver does not support a solid gray color.", greytext: "Greyed (disabled) text. This color is set to #000 if the current display driver does not support a solid grey color.", highlight: "Item(s) selected in a control.", highlighttext: "Text of item(s) selected in a control.", inactiveborder: "Inactive window border.", inactivecaption: "Inactive window caption.", inactivecaptiontext: "Color of text in an inactive caption.", infobackground: "Background color for tooltip controls.", infotext: "Text color for tooltip controls.", menu: "Menu background.", menutext: "Text in menus.", scrollbar: "Scroll bar gray area.", threeddarkshadow: "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedface: "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedhighlight: "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedlightshadow: "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", threedshadow: "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.", window: "Window background.", windowframe: "Window frame.", windowtext: "Text in windows."};
        Combinator.prototype = new SyntaxUnit, Combinator.prototype.constructor = Combinator, MediaFeature.prototype = new SyntaxUnit, MediaFeature.prototype.constructor = MediaFeature, MediaQuery.prototype = new SyntaxUnit, MediaQuery.prototype.constructor = MediaQuery, Parser.DEFAULT_TYPE = 0, Parser.COMBINATOR_TYPE = 1, Parser.MEDIA_FEATURE_TYPE = 2, Parser.MEDIA_QUERY_TYPE = 3, Parser.PROPERTY_NAME_TYPE = 4, Parser.PROPERTY_VALUE_TYPE = 5, Parser.PROPERTY_VALUE_PART_TYPE = 6, Parser.SELECTOR_TYPE = 7, Parser.SELECTOR_PART_TYPE = 8, Parser.SELECTOR_SUB_PART_TYPE = 9, Parser.prototype = function () {
            var e = new EventTarget, t, n = {constructor: Parser, DEFAULT_TYPE: 0, COMBINATOR_TYPE: 1, MEDIA_FEATURE_TYPE: 2, MEDIA_QUERY_TYPE: 3, PROPERTY_NAME_TYPE: 4, PROPERTY_VALUE_TYPE: 5, PROPERTY_VALUE_PART_TYPE: 6, SELECTOR_TYPE: 7, SELECTOR_PART_TYPE: 8, SELECTOR_SUB_PART_TYPE: 9, _stylesheet: function () {
                var e = this._tokenStream, t = null, n, r, i;
                this.fire("startstylesheet"), this._charset(), this._skipCruft();
                while (e.peek() == Tokens.IMPORT_SYM)this._import(), this._skipCruft();
                while (e.peek() == Tokens.NAMESPACE_SYM)this._namespace(), this._skipCruft();
                i = e.peek();
                while (i > Tokens.EOF) {
                    try {
                        switch (i) {
                            case Tokens.MEDIA_SYM:
                                this._media(), this._skipCruft();
                                break;
                            case Tokens.PAGE_SYM:
                                this._page(), this._skipCruft();
                                break;
                            case Tokens.FONT_FACE_SYM:
                                this._font_face(), this._skipCruft();
                                break;
                            case Tokens.KEYFRAMES_SYM:
                                this._keyframes(), this._skipCruft();
                                break;
                            case Tokens.VIEWPORT_SYM:
                                this._viewport(), this._skipCruft();
                                break;
                            case Tokens.UNKNOWN_SYM:
                                e.get();
                                if (!!this.options.strict)throw new SyntaxError("Unknown @ rule.", e.LT(0).startLine, e.LT(0).startCol);
                                this.fire({type: "error", error: null, message: "Unknown @ rule: " + e.LT(0).value + ".", line: e.LT(0).startLine, col: e.LT(0).startCol}), n = 0;
                                while (e.advance([Tokens.LBRACE, Tokens.RBRACE]) == Tokens.LBRACE)n++;
                                while (n)e.advance([Tokens.RBRACE]), n--;
                                break;
                            case Tokens.S:
                                this._readWhitespace();
                                break;
                            default:
                                if (!this._ruleset())switch (i) {
                                    case Tokens.CHARSET_SYM:
                                        throw r = e.LT(1), this._charset(!1), new SyntaxError("@charset not allowed here.", r.startLine, r.startCol);
                                    case Tokens.IMPORT_SYM:
                                        throw r = e.LT(1), this._import(!1), new SyntaxError("@import not allowed here.", r.startLine, r.startCol);
                                    case Tokens.NAMESPACE_SYM:
                                        throw r = e.LT(1), this._namespace(!1), new SyntaxError("@namespace not allowed here.", r.startLine, r.startCol);
                                    default:
                                        e.get(), this._unexpectedToken(e.token())
                                }
                        }
                    } catch (s) {
                        if (!(s instanceof SyntaxError && !this.options.strict))throw s;
                        this.fire({type: "error", error: s, message: s.message, line: s.line, col: s.col})
                    }
                    i = e.peek()
                }
                i != Tokens.EOF && this._unexpectedToken(e.token()), this.fire("endstylesheet")
            }, _charset: function (e) {
                var t = this._tokenStream, n, r, i, s;
                t.match(Tokens.CHARSET_SYM) && (i = t.token().startLine, s = t.token().startCol, this._readWhitespace(), t.mustMatch(Tokens.STRING), r = t.token(), n = r.value, this._readWhitespace(), t.mustMatch(Tokens.SEMICOLON), e !== !1 && this.fire({type: "charset", charset: n, line: i, col: s}))
            }, _import: function (e) {
                var t = this._tokenStream, n, r, i, s = [];
                t.mustMatch(Tokens.IMPORT_SYM), i = t.token(), this._readWhitespace(), t.mustMatch([Tokens.STRING, Tokens.URI]), r = t.token().value.replace(/^(?:url\()?["']?([^"']+?)["']?\)?$/, "$1"), this._readWhitespace(), s = this._media_query_list(), t.mustMatch(Tokens.SEMICOLON), this._readWhitespace(), e !== !1 && this.fire({type: "import", uri: r, media: s, line: i.startLine, col: i.startCol})
            }, _namespace: function (e) {
                var t = this._tokenStream, n, r, i, s;
                t.mustMatch(Tokens.NAMESPACE_SYM), n = t.token().startLine, r = t.token().startCol, this._readWhitespace(), t.match(Tokens.IDENT) && (i = t.token().value, this._readWhitespace()), t.mustMatch([Tokens.STRING, Tokens.URI]), s = t.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1"), this._readWhitespace(), t.mustMatch(Tokens.SEMICOLON), this._readWhitespace(), e !== !1 && this.fire({type: "namespace", prefix: i, uri: s, line: n, col: r})
            }, _media: function () {
                var e = this._tokenStream, t, n, r;
                e.mustMatch(Tokens.MEDIA_SYM), t = e.token().startLine, n = e.token().startCol, this._readWhitespace(), r = this._media_query_list(), e.mustMatch(Tokens.LBRACE), this._readWhitespace(), this.fire({type: "startmedia", media: r, line: t, col: n});
                for (; ;)if (e.peek() == Tokens.PAGE_SYM)this._page(); else if (e.peek() == Tokens.FONT_FACE_SYM)this._font_face(); else if (e.peek() == Tokens.VIEWPORT_SYM)this._viewport(); else if (!this._ruleset())break;
                e.mustMatch(Tokens.RBRACE), this._readWhitespace(), this.fire({type: "endmedia", media: r, line: t, col: n})
            }, _media_query_list: function () {
                var e = this._tokenStream, t = [];
                this._readWhitespace(), (e.peek() == Tokens.IDENT || e.peek() == Tokens.LPAREN) && t.push(this._media_query());
                while (e.match(Tokens.COMMA))this._readWhitespace(), t.push(this._media_query());
                return t
            }, _media_query: function () {
                var e = this._tokenStream, t = null, n = null, r = null, i = [];
                e.match(Tokens.IDENT) && (n = e.token().value.toLowerCase(), n != "only" && n != "not" ? (e.unget(), n = null) : r = e.token()), this._readWhitespace(), e.peek() == Tokens.IDENT ? (t = this._media_type(), r === null && (r = e.token())) : e.peek() == Tokens.LPAREN && (r === null && (r = e.LT(1)), i.push(this._media_expression()));
                if (t === null && i.length === 0)return null;
                this._readWhitespace();
                while (e.match(Tokens.IDENT))e.token().value.toLowerCase() != "and" && this._unexpectedToken(e.token()), this._readWhitespace(), i.push(this._media_expression());
                return new MediaQuery(n, t, i, r.startLine, r.startCol)
            }, _media_type: function () {
                return this._media_feature()
            }, _media_expression: function () {
                var e = this._tokenStream, t = null, n, r = null;
                return e.mustMatch(Tokens.LPAREN), t = this._media_feature(), this._readWhitespace(), e.match(Tokens.COLON) && (this._readWhitespace(), n = e.LT(1), r = this._expression()), e.mustMatch(Tokens.RPAREN), this._readWhitespace(), new MediaFeature(t, r ? new SyntaxUnit(r, n.startLine, n.startCol) : null)
            }, _media_feature: function () {
                var e = this._tokenStream;
                return e.mustMatch(Tokens.IDENT), SyntaxUnit.fromToken(e.token())
            }, _page: function () {
                var e = this._tokenStream, t, n, r = null, i = null;
                e.mustMatch(Tokens.PAGE_SYM), t = e.token().startLine, n = e.token().startCol, this._readWhitespace(), e.match(Tokens.IDENT) && (r = e.token().value, r.toLowerCase() === "auto" && this._unexpectedToken(e.token())), e.peek() == Tokens.COLON && (i = this._pseudo_page()), this._readWhitespace(), this.fire({type: "startpage", id: r, pseudo: i, line: t, col: n}), this._readDeclarations(!0, !0), this.fire({type: "endpage", id: r, pseudo: i, line: t, col: n})
            }, _margin: function () {
                var e = this._tokenStream, t, n, r = this._margin_sym();
                return r ? (t = e.token().startLine, n = e.token().startCol, this.fire({type: "startpagemargin", margin: r, line: t, col: n}), this._readDeclarations(!0), this.fire({type: "endpagemargin", margin: r, line: t, col: n}), !0) : !1
            }, _margin_sym: function () {
                var e = this._tokenStream;
                return e.match([Tokens.TOPLEFTCORNER_SYM, Tokens.TOPLEFT_SYM, Tokens.TOPCENTER_SYM, Tokens.TOPRIGHT_SYM, Tokens.TOPRIGHTCORNER_SYM, Tokens.BOTTOMLEFTCORNER_SYM, Tokens.BOTTOMLEFT_SYM, Tokens.BOTTOMCENTER_SYM, Tokens.BOTTOMRIGHT_SYM, Tokens.BOTTOMRIGHTCORNER_SYM, Tokens.LEFTTOP_SYM, Tokens.LEFTMIDDLE_SYM, Tokens.LEFTBOTTOM_SYM, Tokens.RIGHTTOP_SYM, Tokens.RIGHTMIDDLE_SYM, Tokens.RIGHTBOTTOM_SYM]) ? SyntaxUnit.fromToken(e.token()) : null
            }, _pseudo_page: function () {
                var e = this._tokenStream;
                return e.mustMatch(Tokens.COLON), e.mustMatch(Tokens.IDENT), e.token().value
            }, _font_face: function () {
                var e = this._tokenStream, t, n;
                e.mustMatch(Tokens.FONT_FACE_SYM), t = e.token().startLine, n = e.token().startCol, this._readWhitespace(), this.fire({type: "startfontface", line: t, col: n}), this._readDeclarations(!0), this.fire({type: "endfontface", line: t, col: n})
            }, _viewport: function () {
                var e = this._tokenStream, t, n;
                e.mustMatch(Tokens.VIEWPORT_SYM), t = e.token().startLine, n = e.token().startCol, this._readWhitespace(), this.fire({type: "startviewport", line: t, col: n}), this._readDeclarations(!0), this.fire({type: "endviewport", line: t, col: n})
            }, _operator: function (e) {
                var t = this._tokenStream, n = null;
                if (t.match([Tokens.SLASH, Tokens.COMMA]) || e && t.match([Tokens.PLUS, Tokens.STAR, Tokens.MINUS]))n = t.token(), this._readWhitespace();
                return n ? PropertyValuePart.fromToken(n) : null
            }, _combinator: function () {
                var e = this._tokenStream, t = null, n;
                return e.match([Tokens.PLUS, Tokens.GREATER, Tokens.TILDE]) && (n = e.token(), t = new Combinator(n.value, n.startLine, n.startCol), this._readWhitespace()), t
            }, _unary_operator: function () {
                var e = this._tokenStream;
                return e.match([Tokens.MINUS, Tokens.PLUS]) ? e.token().value : null
            }, _property: function () {
                var e = this._tokenStream, t = null, n = null, r, i, s, o;
                return e.peek() == Tokens.STAR && this.options.starHack && (e.get(), i = e.token(), n = i.value, s = i.startLine, o = i.startCol), e.match(Tokens.IDENT) && (i = e.token(), r = i.value, r.charAt(0) == "_" && this.options.underscoreHack && (n = "_", r = r.substring(1)), t = new PropertyName(r, n, s || i.startLine, o || i.startCol), this._readWhitespace()), t
            }, _ruleset: function () {
                var e = this._tokenStream, t, n;
                try {
                    n = this._selectors_group()
                } catch (r) {
                    if (r instanceof SyntaxError && !this.options.strict) {
                        this.fire({type: "error", error: r, message: r.message, line: r.line, col: r.col}), t = e.advance([Tokens.RBRACE]);
                        if (t != Tokens.RBRACE)throw r;
                        return!0
                    }
                    throw r
                }
                return n && (this.fire({type: "startrule", selectors: n, line: n[0].line, col: n[0].col}), this._readDeclarations(!0), this.fire({type: "endrule", selectors: n, line: n[0].line, col: n[0].col})), n
            }, _selectors_group: function () {
                var e = this._tokenStream, t = [], n;
                n = this._selector();
                if (n !== null) {
                    t.push(n);
                    while (e.match(Tokens.COMMA))this._readWhitespace(), n = this._selector(), n !== null ? t.push(n) : this._unexpectedToken(e.LT(1))
                }
                return t.length ? t : null
            }, _selector: function () {
                var e = this._tokenStream, t = [], n = null, r = null, i = null;
                n = this._simple_selector_sequence();
                if (n === null)return null;
                t.push(n);
                do {
                    r = this._combinator();
                    if (r !== null)t.push(r), n = this._simple_selector_sequence(), n === null ? this._unexpectedToken(e.LT(1)) : t.push(n); else {
                        if (!this._readWhitespace())break;
                        i = new Combinator(e.token().value, e.token().startLine, e.token().startCol), r = this._combinator(), n = this._simple_selector_sequence(), n === null ? r !== null && this._unexpectedToken(e.LT(1)) : (r !== null ? t.push(r) : t.push(i), t.push(n))
                    }
                } while (!0);
                return new Selector(t, t[0].line, t[0].col)
            }, _simple_selector_sequence: function () {
                var e = this._tokenStream, t = null, n = [], r = "", i = [function () {
                    return e.match(Tokens.HASH) ? new SelectorSubPart(e.token().value, "id", e.token().startLine, e.token().startCol) : null
                }, this._class, this._attrib, this._pseudo, this._negation], s = 0, o = i.length, u = null, a = !1, f, l;
                f = e.LT(1).startLine, l = e.LT(1).startCol, t = this._type_selector(), t || (t = this._universal()), t !== null && (r += t);
                for (; ;) {
                    if (e.peek() === Tokens.S)break;
                    while (s < o && u === null)u = i[s++].call(this);
                    if (u === null) {
                        if (r === "")return null;
                        break
                    }
                    s = 0, n.push(u), r += u.toString(), u = null
                }
                return r !== "" ? new SelectorPart(t, n, r, f, l) : null
            }, _type_selector: function () {
                var e = this._tokenStream, t = this._namespace_prefix(), n = this._element_name();
                return n ? (t && (n.text = t + n.text, n.col -= t.length), n) : (t && (e.unget(), t.length > 1 && e.unget()), null)
            }, _class: function () {
                var e = this._tokenStream, t;
                return e.match(Tokens.DOT) ? (e.mustMatch(Tokens.IDENT), t = e.token(), new SelectorSubPart("." + t.value, "class", t.startLine, t.startCol - 1)) : null
            }, _element_name: function () {
                var e = this._tokenStream, t;
                return e.match(Tokens.IDENT) ? (t = e.token(), new SelectorSubPart(t.value, "elementName", t.startLine, t.startCol)) : null
            }, _namespace_prefix: function () {
                var e = this._tokenStream, t = "";
                if (e.LA(1) === Tokens.PIPE || e.LA(2) === Tokens.PIPE)e.match([Tokens.IDENT, Tokens.STAR]) && (t += e.token().value), e.mustMatch(Tokens.PIPE), t += "|";
                return t.length ? t : null
            }, _universal: function () {
                var e = this._tokenStream, t = "", n;
                return n = this._namespace_prefix(), n && (t += n), e.match(Tokens.STAR) && (t += "*"), t.length ? t : null
            }, _attrib: function () {
                var e = this._tokenStream, t = null, n, r;
                return e.match(Tokens.LBRACKET) ? (r = e.token(), t = r.value, t += this._readWhitespace(), n = this._namespace_prefix(), n && (t += n), e.mustMatch(Tokens.IDENT), t += e.token().value, t += this._readWhitespace(), e.match([Tokens.PREFIXMATCH, Tokens.SUFFIXMATCH, Tokens.SUBSTRINGMATCH, Tokens.EQUALS, Tokens.INCLUDES, Tokens.DASHMATCH]) && (t += e.token().value, t += this._readWhitespace(), e.mustMatch([Tokens.IDENT, Tokens.STRING]), t += e.token().value, t += this._readWhitespace()), e.mustMatch(Tokens.RBRACKET), new SelectorSubPart(t + "]", "attribute", r.startLine, r.startCol)) : null
            }, _pseudo: function () {
                var e = this._tokenStream, t = null, n = ":", r, i;
                return e.match(Tokens.COLON) && (e.match(Tokens.COLON) && (n += ":"), e.match(Tokens.IDENT) ? (t = e.token().value, r = e.token().startLine, i = e.token().startCol - n.length) : e.peek() == Tokens.FUNCTION && (r = e.LT(1).startLine, i = e.LT(1).startCol - n.length, t = this._functional_pseudo()), t && (t = new SelectorSubPart(n + t, "pseudo", r, i))), t
            }, _functional_pseudo: function () {
                var e = this._tokenStream, t = null;
                return e.match(Tokens.FUNCTION) && (t = e.token().value, t += this._readWhitespace(), t += this._expression(), e.mustMatch(Tokens.RPAREN), t += ")"), t
            }, _expression: function () {
                var e = this._tokenStream, t = "";
                while (e.match([Tokens.PLUS, Tokens.MINUS, Tokens.DIMENSION, Tokens.NUMBER, Tokens.STRING, Tokens.IDENT, Tokens.LENGTH, Tokens.FREQ, Tokens.ANGLE, Tokens.TIME, Tokens.RESOLUTION, Tokens.SLASH]))t += e.token().value, t += this._readWhitespace();
                return t.length ? t : null
            }, _negation: function () {
                var e = this._tokenStream, t, n, r = "", i, s = null;
                return e.match(Tokens.NOT) && (r = e.token().value, t = e.token().startLine, n = e.token().startCol, r += this._readWhitespace(), i = this._negation_arg(), r += i, r += this._readWhitespace(), e.match(Tokens.RPAREN), r += e.token().value, s = new SelectorSubPart(r, "not", t, n), s.args.push(i)), s
            }, _negation_arg: function () {
                var e = this._tokenStream, t = [this._type_selector, this._universal, function () {
                    return e.match(Tokens.HASH) ? new SelectorSubPart(e.token().value, "id", e.token().startLine, e.token().startCol) : null
                }, this._class, this._attrib, this._pseudo], n = null, r = 0, i = t.length, s, o, u, a;
                o = e.LT(1).startLine, u = e.LT(1).startCol;
                while (r < i && n === null)n = t[r].call(this), r++;
                return n === null && this._unexpectedToken(e.LT(1)), n.type == "elementName" ? a = new SelectorPart(n, [], n.toString(), o, u) : a = new SelectorPart(null, [n], n.toString(), o, u), a
            }, _declaration: function () {
                var e = this._tokenStream, t = null, n = null, r = null, i = null, s = null, o = "";
                t = this._property();
                if (t !== null) {
                    e.mustMatch(Tokens.COLON), this._readWhitespace(), n = this._expr(), (!n || n.length === 0) && this._unexpectedToken(e.LT(1)), r = this._prio(), o = t.toString();
                    if (this.options.starHack && t.hack == "*" || this.options.underscoreHack && t.hack == "_")o = t.text;
                    try {
                        this._validateProperty(o, n)
                    } catch (u) {
                        s = u
                    }
                    return this.fire({type: "property", property: t, value: n, important: r, line: t.line, col: t.col, invalid: s}), !0
                }
                return!1
            }, _prio: function () {
                var e = this._tokenStream, t = e.match(Tokens.IMPORTANT_SYM);
                return this._readWhitespace(), t
            }, _expr: function (e) {
                var t = this._tokenStream, n = [], r = null, i = null;
                r = this._term(e);
                if (r !== null) {
                    n.push(r);
                    do {
                        i = this._operator(e), i && n.push(i), r = this._term(e);
                        if (r === null)break;
                        n.push(r)
                    } while (!0)
                }
                return n.length > 0 ? new PropertyValue(n, n[0].line, n[0].col) : null
            }, _term: function (e) {
                var t = this._tokenStream, n = null, r = null, i = null, s, o, u;
                return n = this._unary_operator(), n !== null && (o = t.token().startLine, u = t.token().startCol), t.peek() == Tokens.IE_FUNCTION && this.options.ieFilters ? (r = this._ie_function(), n === null && (o = t.token().startLine, u = t.token().startCol)) : e && t.match([Tokens.LPAREN, Tokens.LBRACE, Tokens.LBRACKET]) ? (s = t.token(), i = s.endChar, r = s.value + this._expr(e).text, n === null && (o = t.token().startLine, u = t.token().startCol), t.mustMatch(Tokens.type(i)), r += i, this._readWhitespace()) : t.match([Tokens.NUMBER, Tokens.PERCENTAGE, Tokens.LENGTH, Tokens.ANGLE, Tokens.TIME, Tokens.FREQ, Tokens.STRING, Tokens.IDENT, Tokens.URI, Tokens.UNICODE_RANGE]) ? (r = t.token().value, n === null && (o = t.token().startLine, u = t.token().startCol), this._readWhitespace()) : (s = this._hexcolor(), s === null ? (n === null && (o = t.LT(1).startLine, u = t.LT(1).startCol), r === null && (t.LA(3) == Tokens.EQUALS && this.options.ieFilters ? r = this._ie_function() : r = this._function())) : (r = s.value, n === null && (o = s.startLine, u = s.startCol))), r !== null ? new PropertyValuePart(n !== null ? n + r : r, o, u) : null
            }, _function: function () {
                var e = this._tokenStream, t = null, n = null, r;
                if (e.match(Tokens.FUNCTION)) {
                    t = e.token().value, this._readWhitespace(), n = this._expr(!0), t += n;
                    if (this.options.ieFilters && e.peek() == Tokens.EQUALS)do {
                        this._readWhitespace() && (t += e.token().value), e.LA(0) == Tokens.COMMA && (t += e.token().value), e.match(Tokens.IDENT), t += e.token().value, e.match(Tokens.EQUALS), t += e.token().value, r = e.peek();
                        while (r != Tokens.COMMA && r != Tokens.S && r != Tokens.RPAREN)e.get(), t += e.token().value, r = e.peek()
                    } while (e.match([Tokens.COMMA, Tokens.S]));
                    e.match(Tokens.RPAREN), t += ")", this._readWhitespace()
                }
                return t
            }, _ie_function: function () {
                var e = this._tokenStream, t = null, n = null, r;
                if (e.match([Tokens.IE_FUNCTION, Tokens.FUNCTION])) {
                    t = e.token().value;
                    do {
                        this._readWhitespace() && (t += e.token().value), e.LA(0) == Tokens.COMMA && (t += e.token().value), e.match(Tokens.IDENT), t += e.token().value, e.match(Tokens.EQUALS), t += e.token().value, r = e.peek();
                        while (r != Tokens.COMMA && r != Tokens.S && r != Tokens.RPAREN)e.get(), t += e.token().value, r = e.peek()
                    } while (e.match([Tokens.COMMA, Tokens.S]));
                    e.match(Tokens.RPAREN), t += ")", this._readWhitespace()
                }
                return t
            }, _hexcolor: function () {
                var e = this._tokenStream, t = null, n;
                if (e.match(Tokens.HASH)) {
                    t = e.token(), n = t.value;
                    if (!/#[a-f0-9]{3,6}/i.test(n))throw new SyntaxError("Expected a hex color but found '" + n + "' at line " + t.startLine + ", col " + t.startCol + ".", t.startLine, t.startCol);
                    this._readWhitespace()
                }
                return t
            }, _keyframes: function () {
                var e = this._tokenStream, t, n, r, i = "";
                e.mustMatch(Tokens.KEYFRAMES_SYM), t = e.token(), /^@\-([^\-]+)\-/.test(t.value) && (i = RegExp.$1), this._readWhitespace(), r = this._keyframe_name(), this._readWhitespace(), e.mustMatch(Tokens.LBRACE), this.fire({type: "startkeyframes", name: r, prefix: i, line: t.startLine, col: t.startCol}), this._readWhitespace(), n = e.peek();
                while (n == Tokens.IDENT || n == Tokens.PERCENTAGE)this._keyframe_rule(), this._readWhitespace(), n = e.peek();
                this.fire({type: "endkeyframes", name: r, prefix: i, line: t.startLine, col: t.startCol}), this._readWhitespace(), e.mustMatch(Tokens.RBRACE)
            }, _keyframe_name: function () {
                var e = this._tokenStream, t;
                return e.mustMatch([Tokens.IDENT, Tokens.STRING]), SyntaxUnit.fromToken(e.token())
            }, _keyframe_rule: function () {
                var e = this._tokenStream, t, n = this._key_list();
                this.fire({type: "startkeyframerule", keys: n, line: n[0].line, col: n[0].col}), this._readDeclarations(!0), this.fire({type: "endkeyframerule", keys: n, line: n[0].line, col: n[0].col})
            }, _key_list: function () {
                var e = this._tokenStream, t, n, r = [];
                r.push(this._key()), this._readWhitespace();
                while (e.match(Tokens.COMMA))this._readWhitespace(), r.push(this._key()), this._readWhitespace();
                return r
            }, _key: function () {
                var e = this._tokenStream, t;
                if (e.match(Tokens.PERCENTAGE))return SyntaxUnit.fromToken(e.token());
                if (e.match(Tokens.IDENT)) {
                    t = e.token();
                    if (/from|to/i.test(t.value))return SyntaxUnit.fromToken(t);
                    e.unget()
                }
                this._unexpectedToken(e.LT(1))
            }, _skipCruft: function () {
                while (this._tokenStream.match([Tokens.S, Tokens.CDO, Tokens.CDC]));
            }, _readDeclarations: function (e, t) {
                var n = this._tokenStream, r;
                this._readWhitespace(), e && n.mustMatch(Tokens.LBRACE), this._readWhitespace();
                try {
                    for (; ;) {
                        if (!(n.match(Tokens.SEMICOLON) || t && this._margin())) {
                            if (!this._declaration())break;
                            if (!n.match(Tokens.SEMICOLON))break
                        }
                        this._readWhitespace()
                    }
                    n.mustMatch(Tokens.RBRACE), this._readWhitespace()
                } catch (i) {
                    if (!(i instanceof SyntaxError && !this.options.strict))throw i;
                    this.fire({type: "error", error: i, message: i.message, line: i.line, col: i.col}), r = n.advance([Tokens.SEMICOLON, Tokens.RBRACE]);
                    if (r == Tokens.SEMICOLON)this._readDeclarations(!1, t); else if (r != Tokens.RBRACE)throw i
                }
            }, _readWhitespace: function () {
                var e = this._tokenStream, t = "";
                while (e.match(Tokens.S))t += e.token().value;
                return t
            }, _unexpectedToken: function (e) {
                throw new SyntaxError("Unexpected token '" + e.value + "' at line " + e.startLine + ", col " + e.startCol + ".", e.startLine, e.startCol)
            }, _verifyEnd: function () {
                this._tokenStream.LA(1) != Tokens.EOF && this._unexpectedToken(this._tokenStream.LT(1))
            }, _validateProperty: function (e, t) {
                Validation.validate(e, t)
            }, parse: function (e) {
                this._tokenStream = new TokenStream(e, Tokens), this._stylesheet()
            }, parseStyleSheet: function (e) {
                return this.parse(e)
            }, parseMediaQuery: function (e) {
                this._tokenStream = new TokenStream(e, Tokens);
                var t = this._media_query();
                return this._verifyEnd(), t
            }, parsePropertyValue: function (e) {
                this._tokenStream = new TokenStream(e, Tokens), this._readWhitespace();
                var t = this._expr();
                return this._readWhitespace(), this._verifyEnd(), t
            }, parseRule: function (e) {
                this._tokenStream = new TokenStream(e, Tokens), this._readWhitespace();
                var t = this._ruleset();
                return this._readWhitespace(), this._verifyEnd(), t
            }, parseSelector: function (e) {
                this._tokenStream = new TokenStream(e, Tokens), this._readWhitespace();
                var t = this._selector();
                return this._readWhitespace(), this._verifyEnd(), t
            }, parseStyleAttribute: function (e) {
                e += "}", this._tokenStream = new TokenStream(e, Tokens), this._readDeclarations()
            }};
            for (t in n)n.hasOwnProperty(t) && (e[t] = n[t]);
            return e
        }();
        var Properties = {"align-items": "flex-start | flex-end | center | baseline | stretch", "align-content": "flex-start | flex-end | center | space-between | space-around | stretch", "align-self": "auto | flex-start | flex-end | center | baseline | stretch", "-webkit-align-items": "flex-start | flex-end | center | baseline | stretch", "-webkit-align-content": "flex-start | flex-end | center | space-between | space-around | stretch", "-webkit-align-self": "auto | flex-start | flex-end | center | baseline | stretch", "alignment-adjust": "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>", "alignment-baseline": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", animation: 1, "animation-delay": {multi: "<time>", comma: !0}, "animation-direction": {multi: "normal | alternate", comma: !0}, "animation-duration": {multi: "<time>", comma: !0}, "animation-fill-mode": {multi: "none | forwards | backwards | both", comma: !0}, "animation-iteration-count": {multi: "<number> | infinite", comma: !0}, "animation-name": {multi: "none | <ident>", comma: !0}, "animation-play-state": {multi: "running | paused", comma: !0}, "animation-timing-function": 1, "-moz-animation-delay": {multi: "<time>", comma: !0}, "-moz-animation-direction": {multi: "normal | alternate", comma: !0}, "-moz-animation-duration": {multi: "<time>", comma: !0}, "-moz-animation-iteration-count": {multi: "<number> | infinite", comma: !0}, "-moz-animation-name": {multi: "none | <ident>", comma: !0}, "-moz-animation-play-state": {multi: "running | paused", comma: !0}, "-ms-animation-delay": {multi: "<time>", comma: !0}, "-ms-animation-direction": {multi: "normal | alternate", comma: !0}, "-ms-animation-duration": {multi: "<time>", comma: !0}, "-ms-animation-iteration-count": {multi: "<number> | infinite", comma: !0}, "-ms-animation-name": {multi: "none | <ident>", comma: !0}, "-ms-animation-play-state": {multi: "running | paused", comma: !0}, "-webkit-animation-delay": {multi: "<time>", comma: !0}, "-webkit-animation-direction": {multi: "normal | alternate", comma: !0}, "-webkit-animation-duration": {multi: "<time>", comma: !0}, "-webkit-animation-fill-mode": {multi: "none | forwards | backwards | both", comma: !0}, "-webkit-animation-iteration-count": {multi: "<number> | infinite", comma: !0}, "-webkit-animation-name": {multi: "none | <ident>", comma: !0}, "-webkit-animation-play-state": {multi: "running | paused", comma: !0}, "-o-animation-delay": {multi: "<time>", comma: !0}, "-o-animation-direction": {multi: "normal | alternate", comma: !0}, "-o-animation-duration": {multi: "<time>", comma: !0}, "-o-animation-iteration-count": {multi: "<number> | infinite", comma: !0}, "-o-animation-name": {multi: "none | <ident>", comma: !0}, "-o-animation-play-state": {multi: "running | paused", comma: !0}, appearance: "icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal | none | inherit", azimuth: function (e) {
            var t = "<angle> | leftwards | rightwards | inherit", n = "left-side | far-left | left | center-left | center | center-right | right | far-right | right-side", r = !1, i = !1, s;
            ValidationTypes.isAny(e, t) || (ValidationTypes.isAny(e, "behind") && (r = !0, i = !0), ValidationTypes.isAny(e, n) && (i = !0, r || ValidationTypes.isAny(e, "behind")));
            if (e.hasNext())throw s = e.next(), i ? new ValidationError("Expected end of value but found '" + s + "'.", s.line, s.col) : new ValidationError("Expected (<'azimuth'>) but found '" + s + "'.", s.line, s.col)
        }, "backface-visibility": "visible | hidden", background: 1, "background-attachment": {multi: "<attachment>", comma: !0}, "background-clip": {multi: "<box>", comma: !0}, "background-color": "<color> | inherit", "background-image": {multi: "<bg-image>", comma: !0}, "background-origin": {multi: "<box>", comma: !0}, "background-position": {multi: "<bg-position>", comma: !0}, "background-repeat": {multi: "<repeat-style>"}, "background-size": {multi: "<bg-size>", comma: !0}, "baseline-shift": "baseline | sub | super | <percentage> | <length>", behavior: 1, binding: 1, bleed: "<length>", "bookmark-label": "<content> | <attr> | <string>", "bookmark-level": "none | <integer>", "bookmark-state": "open | closed", "bookmark-target": "none | <uri> | <attr>", border: "<border-width> || <border-style> || <color>", "border-bottom": "<border-width> || <border-style> || <color>", "border-bottom-color": "<color> | inherit", "border-bottom-left-radius": "<x-one-radius>", "border-bottom-right-radius": "<x-one-radius>", "border-bottom-style": "<border-style>", "border-bottom-width": "<border-width>", "border-collapse": "collapse | separate | inherit", "border-color": {multi: "<color> | inherit", max: 4}, "border-image": 1, "border-image-outset": {multi: "<length> | <number>", max: 4}, "border-image-repeat": {multi: "stretch | repeat | round", max: 2}, "border-image-slice": function (e) {
            var t = !1, n = "<number> | <percentage>", r = !1, i = 0, s = 4, o;
            ValidationTypes.isAny(e, "fill") && (r = !0, t = !0);
            while (e.hasNext() && i < s) {
                t = ValidationTypes.isAny(e, n);
                if (!t)break;
                i++
            }
            r ? t = !0 : ValidationTypes.isAny(e, "fill");
            if (e.hasNext())throw o = e.next(), t ? new ValidationError("Expected end of value but found '" + o + "'.", o.line, o.col) : new ValidationError("Expected ([<number> | <percentage>]{1,4} && fill?) but found '" + o + "'.", o.line, o.col)
        }, "border-image-source": "<image> | none", "border-image-width": {multi: "<length> | <percentage> | <number> | auto", max: 4}, "border-left": "<border-width> || <border-style> || <color>", "border-left-color": "<color> | inherit", "border-left-style": "<border-style>", "border-left-width": "<border-width>", "border-radius": function (e) {
            var t = !1, n = "<length> | <percentage> | inherit", r = !1, i = !1, s = 0, o = 8, u;
            while (e.hasNext() && s < o) {
                t = ValidationTypes.isAny(e, n);
                if (!t) {
                    if (!(e.peek() == "/" && s > 0 && !r))break;
                    r = !0, o = s + 5, e.next()
                }
                s++
            }
            if (e.hasNext())throw u = e.next(), t ? new ValidationError("Expected end of value but found '" + u + "'.", u.line, u.col) : new ValidationError("Expected (<'border-radius'>) but found '" + u + "'.", u.line, u.col)
        }, "border-right": "<border-width> || <border-style> || <color>", "border-right-color": "<color> | inherit", "border-right-style": "<border-style>", "border-right-width": "<border-width>", "border-spacing": {multi: "<length> | inherit", max: 2}, "border-style": {multi: "<border-style>", max: 4}, "border-top": "<border-width> || <border-style> || <color>", "border-top-color": "<color> | inherit", "border-top-left-radius": "<x-one-radius>", "border-top-right-radius": "<x-one-radius>", "border-top-style": "<border-style>", "border-top-width": "<border-width>", "border-width": {multi: "<border-width>", max: 4}, bottom: "<margin-width> | inherit", "-moz-box-align": "start | end | center | baseline | stretch", "-moz-box-decoration-break": "slice |clone", "-moz-box-direction": "normal | reverse | inherit", "-moz-box-flex": "<number>", "-moz-box-flex-group": "<integer>", "-moz-box-lines": "single | multiple", "-moz-box-ordinal-group": "<integer>", "-moz-box-orient": "horizontal | vertical | inline-axis | block-axis | inherit", "-moz-box-pack": "start | end | center | justify", "-webkit-box-align": "start | end | center | baseline | stretch", "-webkit-box-decoration-break": "slice |clone", "-webkit-box-direction": "normal | reverse | inherit", "-webkit-box-flex": "<number>", "-webkit-box-flex-group": "<integer>", "-webkit-box-lines": "single | multiple", "-webkit-box-ordinal-group": "<integer>", "-webkit-box-orient": "horizontal | vertical | inline-axis | block-axis | inherit", "-webkit-box-pack": "start | end | center | justify", "box-shadow": function (e) {
            var t = !1, n;
            if (!ValidationTypes.isAny(e, "none"))Validation.multiProperty("<shadow>", e, !0, Infinity); else if (e.hasNext())throw n = e.next(), new ValidationError("Expected end of value but found '" + n + "'.", n.line, n.col)
        }, "box-sizing": "content-box | border-box | inherit", "break-after": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column", "break-before": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column", "break-inside": "auto | avoid | avoid-page | avoid-column", "caption-side": "top | bottom | inherit", clear: "none | right | left | both | inherit", clip: 1, color: "<color> | inherit", "color-profile": 1, "column-count": "<integer> | auto", "column-fill": "auto | balance", "column-gap": "<length> | normal", "column-rule": "<border-width> || <border-style> || <color>", "column-rule-color": "<color>", "column-rule-style": "<border-style>", "column-rule-width": "<border-width>", "column-span": "none | all", "column-width": "<length> | auto", columns: 1, content: 1, "counter-increment": 1, "counter-reset": 1, crop: "<shape> | auto", cue: "cue-after | cue-before | inherit", "cue-after": 1, "cue-before": 1, cursor: 1, direction: "ltr | rtl | inherit", display: "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | grid | inline-grid | none | inherit | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box | -ms-flexbox | -ms-inline-flexbox | flex | -webkit-flex | inline-flex | -webkit-inline-flex", "dominant-baseline": 1, "drop-initial-after-adjust": "central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>", "drop-initial-after-align": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", "drop-initial-before-adjust": "before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>", "drop-initial-before-align": "caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical", "drop-initial-size": "auto | line | <length> | <percentage>", "drop-initial-value": "initial | <integer>", elevation: "<angle> | below | level | above | higher | lower | inherit", "empty-cells": "show | hide | inherit", filter: 1, fit: "fill | hidden | meet | slice", "fit-position": 1, flex: "<flex>", "flex-basis": "<width>", "flex-direction": "row | row-reverse | column | column-reverse", "flex-flow": "<flex-direction> || <flex-wrap>", "flex-grow": "<number>", "flex-shrink": "<number>", "flex-wrap": "nowrap | wrap | wrap-reverse", "-webkit-flex": "<flex>", "-webkit-flex-basis": "<width>", "-webkit-flex-direction": "row | row-reverse | column | column-reverse", "-webkit-flex-flow": "<flex-direction> || <flex-wrap>", "-webkit-flex-grow": "<number>", "-webkit-flex-shrink": "<number>", "-webkit-flex-wrap": "nowrap | wrap | wrap-reverse", "-ms-flex": "<flex>", "-ms-flex-align": "start | end | center | stretch | baseline", "-ms-flex-direction": "row | row-reverse | column | column-reverse | inherit", "-ms-flex-order": "<number>", "-ms-flex-pack": "start | end | center | justify", "-ms-flex-wrap": "nowrap | wrap | wrap-reverse", "float": "left | right | none | inherit", "float-offset": 1, font: 1, "font-family": 1, "font-size": "<absolute-size> | <relative-size> | <length> | <percentage> | inherit", "font-size-adjust": "<number> | none | inherit", "font-stretch": "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | inherit", "font-style": "normal | italic | oblique | inherit", "font-variant": "normal | small-caps | inherit", "font-weight": "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit", "grid-cell-stacking": "columns | rows | layer", "grid-column": 1, "grid-columns": 1, "grid-column-align": "start | end | center | stretch", "grid-column-sizing": 1, "grid-column-span": "<integer>", "grid-flow": "none | rows | columns", "grid-layer": "<integer>", "grid-row": 1, "grid-rows": 1, "grid-row-align": "start | end | center | stretch", "grid-row-span": "<integer>", "grid-row-sizing": 1, "hanging-punctuation": 1, height: "<margin-width> | <content-sizing> | inherit", "hyphenate-after": "<integer> | auto", "hyphenate-before": "<integer> | auto", "hyphenate-character": "<string> | auto", "hyphenate-lines": "no-limit | <integer>", "hyphenate-resource": 1, hyphens: "none | manual | auto", icon: 1, "image-orientation": "angle | auto", "image-rendering": 1, "image-resolution": 1, "inline-box-align": "initial | last | <integer>", "justify-content": "flex-start | flex-end | center | space-between | space-around", "-webkit-justify-content": "flex-start | flex-end | center | space-between | space-around", left: "<margin-width> | inherit", "letter-spacing": "<length> | normal | inherit", "line-height": "<number> | <length> | <percentage> | normal | inherit", "line-break": "auto | loose | normal | strict", "line-stacking": 1, "line-stacking-ruby": "exclude-ruby | include-ruby", "line-stacking-shift": "consider-shifts | disregard-shifts", "line-stacking-strategy": "inline-line-height | block-line-height | max-height | grid-height", "list-style": 1, "list-style-image": "<uri> | none | inherit", "list-style-position": "inside | outside | inherit", "list-style-type": "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit", margin: {multi: "<margin-width> | inherit", max: 4}, "margin-bottom": "<margin-width> | inherit", "margin-left": "<margin-width> | inherit", "margin-right": "<margin-width> | inherit", "margin-top": "<margin-width> | inherit", mark: 1, "mark-after": 1, "mark-before": 1, marks: 1, "marquee-direction": 1, "marquee-play-count": 1, "marquee-speed": 1, "marquee-style": 1, "max-height": "<length> | <percentage> | <content-sizing> | none | inherit", "max-width": "<length> | <percentage> | <content-sizing> | none | inherit", "min-height": "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats | inherit", "min-width": "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats | inherit", "move-to": 1, "nav-down": 1, "nav-index": 1, "nav-left": 1, "nav-right": 1, "nav-up": 1, opacity: "<number> | inherit", order: "<integer>", "-webkit-order": "<integer>", orphans: "<integer> | inherit", outline: 1, "outline-color": "<color> | invert | inherit", "outline-offset": 1, "outline-style": "<border-style> | inherit", "outline-width": "<border-width> | inherit", overflow: "visible | hidden | scroll | auto | inherit", "overflow-style": 1, "overflow-wrap": "normal | break-word", "overflow-x": 1, "overflow-y": 1, padding: {multi: "<padding-width> | inherit", max: 4}, "padding-bottom": "<padding-width> | inherit", "padding-left": "<padding-width> | inherit", "padding-right": "<padding-width> | inherit", "padding-top": "<padding-width> | inherit", page: 1, "page-break-after": "auto | always | avoid | left | right | inherit", "page-break-before": "auto | always | avoid | left | right | inherit", "page-break-inside": "auto | avoid | inherit", "page-policy": 1, pause: 1, "pause-after": 1, "pause-before": 1, perspective: 1, "perspective-origin": 1, phonemes: 1, pitch: 1, "pitch-range": 1, "play-during": 1, "pointer-events": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit", position: "static | relative | absolute | fixed | inherit", "presentation-level": 1, "punctuation-trim": 1, quotes: 1, "rendering-intent": 1, resize: 1, rest: 1, "rest-after": 1, "rest-before": 1, richness: 1, right: "<margin-width> | inherit", rotation: 1, "rotation-point": 1, "ruby-align": 1, "ruby-overhang": 1, "ruby-position": 1, "ruby-span": 1, size: 1, speak: "normal | none | spell-out | inherit", "speak-header": "once | always | inherit", "speak-numeral": "digits | continuous | inherit", "speak-punctuation": "code | none | inherit", "speech-rate": 1, src: 1, stress: 1, "string-set": 1, "table-layout": "auto | fixed | inherit", "tab-size": "<integer> | <length>", target: 1, "target-name": 1, "target-new": 1, "target-position": 1, "text-align": "left | right | center | justify | inherit", "text-align-last": 1, "text-decoration": 1, "text-emphasis": 1, "text-height": 1, "text-indent": "<length> | <percentage> | inherit", "text-justify": "auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida", "text-outline": 1, "text-overflow": 1, "text-rendering": "auto | optimizeSpeed | optimizeLegibility | geometricPrecision | inherit", "text-shadow": 1, "text-transform": "capitalize | uppercase | lowercase | none | inherit", "text-wrap": "normal | none | avoid", top: "<margin-width> | inherit", "-ms-touch-action": "auto | none | pan-x | pan-y", "touch-action": "auto | none | pan-x | pan-y", transform: 1, "transform-origin": 1, "transform-style": 1, transition: 1, "transition-delay": 1, "transition-duration": 1, "transition-property": 1, "transition-timing-function": 1, "unicode-bidi": "normal | embed | isolate | bidi-override | isolate-override | plaintext | inherit", "user-modify": "read-only | read-write | write-only | inherit", "user-select": "none | text | toggle | element | elements | all | inherit", "vertical-align": "auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length>", visibility: "visible | hidden | collapse | inherit", "voice-balance": 1, "voice-duration": 1, "voice-family": 1, "voice-pitch": 1, "voice-pitch-range": 1, "voice-rate": 1, "voice-stress": 1, "voice-volume": 1, volume: 1, "white-space": "normal | pre | nowrap | pre-wrap | pre-line | inherit | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap", "white-space-collapse": 1, widows: "<integer> | inherit", width: "<length> | <percentage> | <content-sizing> | auto | inherit", "word-break": "normal | keep-all | break-all", "word-spacing": "<length> | normal | inherit", "word-wrap": "normal | break-word", "writing-mode": "horizontal-tb | vertical-rl | vertical-lr | lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb | inherit", "z-index": "<integer> | auto | inherit", zoom: "<number> | <percentage> | normal"};
        PropertyName.prototype = new SyntaxUnit, PropertyName.prototype.constructor = PropertyName, PropertyName.prototype.toString = function () {
            return(this.hack ? this.hack : "") + this.text
        }, PropertyValue.prototype = new SyntaxUnit, PropertyValue.prototype.constructor = PropertyValue, PropertyValueIterator.prototype.count = function () {
            return this._parts.length
        }, PropertyValueIterator.prototype.isFirst = function () {
            return this._i === 0
        }, PropertyValueIterator.prototype.hasNext = function () {
            return this._i < this._parts.length
        }, PropertyValueIterator.prototype.mark = function () {
            this._marks.push(this._i)
        }, PropertyValueIterator.prototype.peek = function (e) {
            return this.hasNext() ? this._parts[this._i + (e || 0)] : null
        }, PropertyValueIterator.prototype.next = function () {
            return this.hasNext() ? this._parts[this._i++] : null
        }, PropertyValueIterator.prototype.previous = function () {
            return this._i > 0 ? this._parts[--this._i] : null
        }, PropertyValueIterator.prototype.restore = function () {
            this._marks.length && (this._i = this._marks.pop())
        }, PropertyValuePart.prototype = new SyntaxUnit, PropertyValuePart.prototype.constructor = PropertyValuePart, PropertyValuePart.fromToken = function (e) {
            return new PropertyValuePart(e.value, e.startLine, e.startCol)
        };
        var Pseudos = {":first-letter": 1, ":first-line": 1, ":before": 1, ":after": 1};
        Pseudos.ELEMENT = 1, Pseudos.CLASS = 2, Pseudos.isElement = function (e) {
            return e.indexOf("::") === 0 || Pseudos[e.toLowerCase()] == Pseudos.ELEMENT
        }, Selector.prototype = new SyntaxUnit, Selector.prototype.constructor = Selector, SelectorPart.prototype = new SyntaxUnit, SelectorPart.prototype.constructor = SelectorPart, SelectorSubPart.prototype = new SyntaxUnit, SelectorSubPart.prototype.constructor = SelectorSubPart, Specificity.prototype = {constructor: Specificity, compare: function (e) {
            var t = ["a", "b", "c", "d"], n, r;
            for (n = 0, r = t.length; n < r; n++) {
                if (this[t[n]] < e[t[n]])return-1;
                if (this[t[n]] > e[t[n]])return 1
            }
            return 0
        }, valueOf: function () {
            return this.a * 1e3 + this.b * 100 + this.c * 10 + this.d
        }, toString: function () {
            return this.a + "," + this.b + "," + this.c + "," + this.d
        }}, Specificity.calculate = function (e) {
            function u(e) {
                var t, n, r, a, f = e.elementName ? e.elementName.text : "", l;
                f && f.charAt(f.length - 1) != "*" && o++;
                for (t = 0, r = e.modifiers.length; t < r; t++) {
                    l = e.modifiers[t];
                    switch (l.type) {
                        case"class":
                        case"attribute":
                            s++;
                            break;
                        case"id":
                            i++;
                            break;
                        case"pseudo":
                            Pseudos.isElement(l.text) ? o++ : s++;
                            break;
                        case"not":
                            for (n = 0, a = l.args.length; n < a; n++)u(l.args[n])
                    }
                }
            }

            var t, n, r, i = 0, s = 0, o = 0;
            for (t = 0, n = e.parts.length; t < n; t++)r = e.parts[t], r instanceof SelectorPart && u(r);
            return new Specificity(0, i, s, o)
        };
        var h = /^[0-9a-fA-F]$/, nonascii = /^[\u0080-\uFFFF]$/, nl = /\n|\r\n|\r|\f/;
        TokenStream.prototype = mix(new TokenStreamBase, {_getToken: function (e) {
            var t, n = this._reader, r = null, i = n.getLine(), s = n.getCol();
            t = n.read();
            while (t) {
                switch (t) {
                    case"/":
                        n.peek() == "*" ? r = this.commentToken(t, i, s) : r = this.charToken(t, i, s);
                        break;
                    case"|":
                    case"~":
                    case"^":
                    case"$":
                    case"*":
                        n.peek() == "=" ? r = this.comparisonToken(t, i, s) : r = this.charToken(t, i, s);
                        break;
                    case'"':
                    case"'":
                        r = this.stringToken(t, i, s);
                        break;
                    case"#":
                        isNameChar(n.peek()) ? r = this.hashToken(t, i, s) : r = this.charToken(t, i, s);
                        break;
                    case".":
                        isDigit(n.peek()) ? r = this.numberToken(t, i, s) : r = this.charToken(t, i, s);
                        break;
                    case"-":
                        n.peek() == "-" ? r = this.htmlCommentEndToken(t, i, s) : isNameStart(n.peek()) ? r = this.identOrFunctionToken(t, i, s) : r = this.charToken(t, i, s);
                        break;
                    case"!":
                        r = this.importantToken(t, i, s);
                        break;
                    case"@":
                        r = this.atRuleToken(t, i, s);
                        break;
                    case":":
                        r = this.notToken(t, i, s);
                        break;
                    case"<":
                        r = this.htmlCommentStartToken(t, i, s);
                        break;
                    case"U":
                    case"u":
                        if (n.peek() == "+") {
                            r = this.unicodeRangeToken(t, i, s);
                            break
                        }
                        ;
                    default:
                        isDigit(t) ? r = this.numberToken(t, i, s) : isWhitespace(t) ? r = this.whitespaceToken(t, i, s) : isIdentStart(t) ? r = this.identOrFunctionToken(t, i, s) : r = this.charToken(t, i, s)
                }
                break
            }
            return!r && t === null && (r = this.createToken(Tokens.EOF, null, i, s)), r
        }, createToken: function (e, t, n, r, i) {
            var s = this._reader;
            return i = i || {}, {value: t, type: e, channel: i.channel, endChar: i.endChar, hide: i.hide || !1, startLine: n, startCol: r, endLine: s.getLine(), endCol: s.getCol()}
        }, atRuleToken: function (e, t, n) {
            var r = e, i = this._reader, s = Tokens.CHAR, o = !1, u, a;
            i.mark(), u = this.readName(), r = e + u, s = Tokens.type(r.toLowerCase());
            if (s == Tokens.CHAR || s == Tokens.UNKNOWN)r.length > 1 ? s = Tokens.UNKNOWN_SYM : (s = Tokens.CHAR, r = e, i.reset());
            return this.createToken(s, r, t, n)
        }, charToken: function (e, t, n) {
            var r = Tokens.type(e), i = {};
            return r == -1 ? r = Tokens.CHAR : i.endChar = Tokens[r].endChar, this.createToken(r, e, t, n, i)
        }, commentToken: function (e, t, n) {
            var r = this._reader, i = this.readComment(e);
            return this.createToken(Tokens.COMMENT, i, t, n)
        }, comparisonToken: function (e, t, n) {
            var r = this._reader, i = e + r.read(), s = Tokens.type(i) || Tokens.CHAR;
            return this.createToken(s, i, t, n)
        }, hashToken: function (e, t, n) {
            var r = this._reader, i = this.readName(e);
            return this.createToken(Tokens.HASH, i, t, n)
        }, htmlCommentStartToken: function (e, t, n) {
            var r = this._reader, i = e;
            return r.mark(), i += r.readCount(3), i == "<!--" ? this.createToken(Tokens.CDO, i, t, n) : (r.reset(), this.charToken(e, t, n))
        }, htmlCommentEndToken: function (e, t, n) {
            var r = this._reader, i = e;
            return r.mark(), i += r.readCount(2), i == "-->" ? this.createToken(Tokens.CDC, i, t, n) : (r.reset(), this.charToken(e, t, n))
        }, identOrFunctionToken: function (e, t, n) {
            var r = this._reader, i = this.readName(e), s = Tokens.IDENT;
            return r.peek() == "(" ? (i += r.read(), i.toLowerCase() == "url(" ? (s = Tokens.URI, i = this.readURI(i), i.toLowerCase() == "url(" && (s = Tokens.FUNCTION)) : s = Tokens.FUNCTION) : r.peek() == ":" && i.toLowerCase() == "progid" && (i += r.readTo("("), s = Tokens.IE_FUNCTION), this.createToken(s, i, t, n)
        }, importantToken: function (e, t, n) {
            var r = this._reader, i = e, s = Tokens.CHAR, o, u;
            r.mark(), u = r.read();
            while (u) {
                if (u == "/") {
                    if (r.peek() != "*")break;
                    o = this.readComment(u);
                    if (o === "")break
                } else {
                    if (!isWhitespace(u)) {
                        if (/i/i.test(u)) {
                            o = r.readCount(8), /mportant/i.test(o) && (i += u + o, s = Tokens.IMPORTANT_SYM);
                            break
                        }
                        break
                    }
                    i += u + this.readWhitespace()
                }
                u = r.read()
            }
            return s == Tokens.CHAR ? (r.reset(), this.charToken(e, t, n)) : this.createToken(s, i, t, n)
        }, notToken: function (e, t, n) {
            var r = this._reader, i = e;
            return r.mark(), i += r.readCount(4), i.toLowerCase() == ":not(" ? this.createToken(Tokens.NOT, i, t, n) : (r.reset(), this.charToken(e, t, n))
        }, numberToken: function (e, t, n) {
            var r = this._reader, i = this.readNumber(e), s, o = Tokens.NUMBER, u = r.peek();
            return isIdentStart(u) ? (s = this.readName(r.read()), i += s, /^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vmax$|^vmin$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(s) ? o = Tokens.LENGTH : /^deg|^rad$|^grad$/i.test(s) ? o = Tokens.ANGLE : /^ms$|^s$/i.test(s) ? o = Tokens.TIME : /^hz$|^khz$/i.test(s) ? o = Tokens.FREQ : /^dpi$|^dpcm$/i.test(s) ? o = Tokens.RESOLUTION : o = Tokens.DIMENSION) : u == "%" && (i += r.read(), o = Tokens.PERCENTAGE), this.createToken(o, i, t, n)
        }, stringToken: function (e, t, n) {
            var r = e, i = e, s = this._reader, o = e, u = Tokens.STRING, a = s.read();
            while (a) {
                i += a;
                if (a == r && o != "\\")break;
                if (isNewLine(s.peek()) && a != "\\") {
                    u = Tokens.INVALID;
                    break
                }
                o = a, a = s.read()
            }
            return a === null && (u = Tokens.INVALID), this.createToken(u, i, t, n)
        }, unicodeRangeToken: function (e, t, n) {
            var r = this._reader, i = e, s, o = Tokens.CHAR;
            return r.peek() == "+" && (r.mark(), i += r.read(), i += this.readUnicodeRangePart(!0), i.length == 2 ? r.reset() : (o = Tokens.UNICODE_RANGE, i.indexOf("?") == -1 && r.peek() == "-" && (r.mark(), s = r.read(), s += this.readUnicodeRangePart(!1), s.length == 1 ? r.reset() : i += s))), this.createToken(o, i, t, n)
        }, whitespaceToken: function (e, t, n) {
            var r = this._reader, i = e + this.readWhitespace();
            return this.createToken(Tokens.S, i, t, n)
        }, readUnicodeRangePart: function (e) {
            var t = this._reader, n = "", r = t.peek();
            while (isHexDigit(r) && n.length < 6)t.read(), n += r, r = t.peek();
            if (e)while (r == "?" && n.length < 6)t.read(), n += r, r = t.peek();
            return n
        }, readWhitespace: function () {
            var e = this._reader, t = "", n = e.peek();
            while (isWhitespace(n))e.read(), t += n, n = e.peek();
            return t
        }, readNumber: function (e) {
            var t = this._reader, n = e, r = e == ".", i = t.peek();
            while (i) {
                if (isDigit(i))n += t.read(); else {
                    if (i != ".")break;
                    if (r)break;
                    r = !0, n += t.read()
                }
                i = t.peek()
            }
            return n
        }, readString: function () {
            var e = this._reader, t = e.read(), n = t, r = t, i = e.peek();
            while (i) {
                i = e.read(), n += i;
                if (i == t && r != "\\")break;
                if (isNewLine(e.peek()) && i != "\\") {
                    n = "";
                    break
                }
                r = i, i = e.peek()
            }
            return i === null && (n = ""), n
        }, readURI: function (e) {
            var t = this._reader, n = e, r = "", i = t.peek();
            t.mark();
            while (i && isWhitespace(i))t.read(), i = t.peek();
            i == "'" || i == '"' ? r = this.readString() : r = this.readURL(), i = t.peek();
            while (i && isWhitespace(i))t.read(), i = t.peek();
            return r === "" || i != ")" ? (n = e, t.reset()) : n += r + t.read(), n
        }, readURL: function () {
            var e = this._reader, t = "", n = e.peek();
            while (/^[!#$%&\\*-~]$/.test(n))t += e.read(), n = e.peek();
            return t
        }, readName: function (e) {
            var t = this._reader, n = e || "", r = t.peek();
            for (; ;)if (r == "\\")n += this.readEscape(t.read()), r = t.peek(); else {
                if (!r || !isNameChar(r))break;
                n += t.read(), r = t.peek()
            }
            return n
        }, readEscape: function (e) {
            var t = this._reader, n = e || "", r = 0, i = t.peek();
            if (isHexDigit(i))do n += t.read(), i = t.peek(); while (i && isHexDigit(i) && ++r < 6);
            return n.length == 3 && /\s/.test(i) || n.length == 7 || n.length == 1 ? t.read() : i = "", n + i
        }, readComment: function (e) {
            var t = this._reader, n = e || "", r = t.read();
            if (r == "*") {
                while (r) {
                    n += r;
                    if (n.length > 2 && r == "*" && t.peek() == "/") {
                        n += t.read();
                        break
                    }
                    r = t.read()
                }
                return n
            }
            return""
        }});
        var Tokens = [
            {name: "CDO"},
            {name: "CDC"},
            {name: "S", whitespace: !0},
            {name: "COMMENT", comment: !0, hide: !0, channel: "comment"},
            {name: "INCLUDES", text: "~="},
            {name: "DASHMATCH", text: "|="},
            {name: "PREFIXMATCH", text: "^="},
            {name: "SUFFIXMATCH", text: "$="},
            {name: "SUBSTRINGMATCH", text: "*="},
            {name: "STRING"},
            {name: "IDENT"},
            {name: "HASH"},
            {name: "IMPORT_SYM", text: "@import"},
            {name: "PAGE_SYM", text: "@page"},
            {name: "MEDIA_SYM", text: "@media"},
            {name: "FONT_FACE_SYM", text: "@font-face"},
            {name: "CHARSET_SYM", text: "@charset"},
            {name: "NAMESPACE_SYM", text: "@namespace"},
            {name: "VIEWPORT_SYM", text: ["@viewport", "@-ms-viewport"]},
            {name: "UNKNOWN_SYM"},
            {name: "KEYFRAMES_SYM", text: ["@keyframes", "@-webkit-keyframes", "@-moz-keyframes", "@-o-keyframes"]},
            {name: "IMPORTANT_SYM"},
            {name: "LENGTH"},
            {name: "ANGLE"},
            {name: "TIME"},
            {name: "FREQ"},
            {name: "DIMENSION"},
            {name: "PERCENTAGE"},
            {name: "NUMBER"},
            {name: "URI"},
            {name: "FUNCTION"},
            {name: "UNICODE_RANGE"},
            {name: "INVALID"},
            {name: "PLUS", text: "+"},
            {name: "GREATER", text: ">"},
            {name: "COMMA", text: ","},
            {name: "TILDE", text: "~"},
            {name: "NOT"},
            {name: "TOPLEFTCORNER_SYM", text: "@top-left-corner"},
            {name: "TOPLEFT_SYM", text: "@top-left"},
            {name: "TOPCENTER_SYM", text: "@top-center"},
            {name: "TOPRIGHT_SYM", text: "@top-right"},
            {name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner"},
            {name: "BOTTOMLEFTCORNER_SYM", text: "@bottom-left-corner"},
            {name: "BOTTOMLEFT_SYM", text: "@bottom-left"},
            {name: "BOTTOMCENTER_SYM", text: "@bottom-center"},
            {name: "BOTTOMRIGHT_SYM", text: "@bottom-right"},
            {name: "BOTTOMRIGHTCORNER_SYM", text: "@bottom-right-corner"},
            {name: "LEFTTOP_SYM", text: "@left-top"},
            {name: "LEFTMIDDLE_SYM", text: "@left-middle"},
            {name: "LEFTBOTTOM_SYM", text: "@left-bottom"},
            {name: "RIGHTTOP_SYM", text: "@right-top"},
            {name: "RIGHTMIDDLE_SYM", text: "@right-middle"},
            {name: "RIGHTBOTTOM_SYM", text: "@right-bottom"},
            {name: "RESOLUTION", state: "media"},
            {name: "IE_FUNCTION"},
            {name: "CHAR"},
            {name: "PIPE", text: "|"},
            {name: "SLASH", text: "/"},
            {name: "MINUS", text: "-"},
            {name: "STAR", text: "*"},
            {name: "LBRACE", endChar: "}", text: "{"},
            {name: "RBRACE", text: "}"},
            {name: "LBRACKET", endChar: "]", text: "["},
            {name: "RBRACKET", text: "]"},
            {name: "EQUALS", text: "="},
            {name: "COLON", text: ":"},
            {name: "SEMICOLON", text: ";"},
            {name: "LPAREN", endChar: ")", text: "("},
            {name: "RPAREN", text: ")"},
            {name: "DOT", text: "."}
        ];
        (function () {
            var e = [], t = {};
            Tokens.UNKNOWN = -1, Tokens.unshift({name: "EOF"});
            for (var n = 0, r = Tokens.length; n < r; n++) {
                e.push(Tokens[n].name), Tokens[Tokens[n].name] = n;
                if (Tokens[n].text)if (Tokens[n].text instanceof Array)for (var i = 0; i < Tokens[n].text.length; i++)t[Tokens[n].text[i]] = n; else t[Tokens[n].text] = n
            }
            Tokens.name = function (t) {
                return e[t]
            }, Tokens.type = function (e) {
                return t[e] || -1
            }
        })();
        var Validation = {validate: function (e, t) {
            var n = e.toString().toLowerCase(), r = t.parts, i = new PropertyValueIterator(t), s = Properties[n], o, u, a, f, l, c, h, p, d, v, m;
            if (!s) {
                if (n.indexOf("-") !== 0)throw new ValidationError("Unknown property '" + e + "'.", e.line, e.col)
            } else typeof s != "number" && (typeof s == "string" ? s.indexOf("||") > -1 ? this.groupProperty(s, i) : this.singleProperty(s, i, 1) : s.multi ? this.multiProperty(s.multi, i, s.comma, s.max || Infinity) : typeof s == "function" && s(i))
        }, singleProperty: function (e, t, n, r) {
            var i = !1, s = t.value, o = 0, u;
            while (t.hasNext() && o < n) {
                i = ValidationTypes.isAny(t, e);
                if (!i)break;
                o++
            }
            if (!i)throw t.hasNext() && !t.isFirst() ? (u = t.peek(), new ValidationError("Expected end of value but found '" + u + "'.", u.line, u.col)) : new ValidationError("Expected (" + e + ") but found '" + s + "'.", s.line, s.col);
            if (t.hasNext())throw u = t.next(), new ValidationError("Expected end of value but found '" + u + "'.", u.line, u.col)
        }, multiProperty: function (e, t, n, r) {
            var i = !1, s = t.value, o = 0, u = !1, a;
            while (t.hasNext() && !i && o < r) {
                if (!ValidationTypes.isAny(t, e))break;
                o++;
                if (!t.hasNext())i = !0; else if (n) {
                    if (t.peek() != ",")break;
                    a = t.next()
                }
            }
            if (!i)throw t.hasNext() && !t.isFirst() ? (a = t.peek(), new ValidationError("Expected end of value but found '" + a + "'.", a.line, a.col)) : (a = t.previous(), n && a == "," ? new ValidationError("Expected end of value but found '" + a + "'.", a.line, a.col) : new ValidationError("Expected (" + e + ") but found '" + s + "'.", s.line, s.col));
            if (t.hasNext())throw a = t.next(), new ValidationError("Expected end of value but found '" + a + "'.", a.line, a.col)
        }, groupProperty: function (e, t, n) {
            var r = !1, i = t.value, s = e.split("||").length, o = {count: 0}, u = !1, a, f;
            while (t.hasNext() && !r) {
                a = ValidationTypes.isAnyOfGroup(t, e);
                if (!a)break;
                if (o[a])break;
                o[a] = 1, o.count++, u = !0;
                if (o.count == s || !t.hasNext())r = !0
            }
            if (!r)throw u && t.hasNext() ? (f = t.peek(), new ValidationError("Expected end of value but found '" + f + "'.", f.line, f.col)) : new ValidationError("Expected (" + e + ") but found '" + i + "'.", i.line, i.col);
            if (t.hasNext())throw f = t.next(), new ValidationError("Expected end of value but found '" + f + "'.", f.line, f.col)
        }};
        ValidationError.prototype = new Error;
        var ValidationTypes = {isLiteral: function (e, t) {
            var n = e.text.toString().toLowerCase(), r = t.split(" | "), i, s, o = !1;
            for (i = 0, s = r.length; i < s && !o; i++)n == r[i].toLowerCase() && (o = !0);
            return o
        }, isSimple: function (e) {
            return!!this.simple[e]
        }, isComplex: function (e) {
            return!!this.complex[e]
        }, isAny: function (e, t) {
            var n = t.split(" | "), r, i, s = !1;
            for (r = 0, i = n.length; r < i && !s && e.hasNext(); r++)s = this.isType(e, n[r]);
            return s
        }, isAnyOfGroup: function (e, t) {
            var n = t.split(" || "), r, i, s = !1;
            for (r = 0, i = n.length; r < i && !s; r++)s = this.isType(e, n[r]);
            return s ? n[r - 1] : !1
        }, isType: function (e, t) {
            var n = e.peek(), r = !1;
            return t.charAt(0) != "<" ? (r = this.isLiteral(n, t), r && e.next()) : this.simple[t] ? (r = this.simple[t](n), r && e.next()) : r = this.complex[t](e), r
        }, simple: {"<absolute-size>": function (e) {
            return ValidationTypes.isLiteral(e, "xx-small | x-small | small | medium | large | x-large | xx-large")
        }, "<attachment>": function (e) {
            return ValidationTypes.isLiteral(e, "scroll | fixed | local")
        }, "<attr>": function (e) {
            return e.type == "function" && e.name == "attr"
        }, "<bg-image>": function (e) {
            return this["<image>"](e) || this["<gradient>"](e) || e == "none"
        }, "<gradient>": function (e) {
            return e.type == "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial\-|linear\-)?gradient/i.test(e)
        }, "<box>": function (e) {
            return ValidationTypes.isLiteral(e, "padding-box | border-box | content-box")
        }, "<content>": function (e) {
            return e.type == "function" && e.name == "content"
        }, "<relative-size>": function (e) {
            return ValidationTypes.isLiteral(e, "smaller | larger")
        }, "<ident>": function (e) {
            return e.type == "identifier"
        }, "<length>": function (e) {
            return e.type == "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?calc/i.test(e) ? !0 : e.type == "length" || e.type == "number" || e.type == "integer" || e == "0"
        }, "<color>": function (e) {
            return e.type == "color" || e == "transparent"
        }, "<number>": function (e) {
            return e.type == "number" || this["<integer>"](e)
        }, "<integer>": function (e) {
            return e.type == "integer"
        }, "<line>": function (e) {
            return e.type == "integer"
        }, "<angle>": function (e) {
            return e.type == "angle"
        }, "<uri>": function (e) {
            return e.type == "uri"
        }, "<image>": function (e) {
            return this["<uri>"](e)
        }, "<percentage>": function (e) {
            return e.type == "percentage" || e == "0"
        }, "<border-width>": function (e) {
            return this["<length>"](e) || ValidationTypes.isLiteral(e, "thin | medium | thick")
        }, "<border-style>": function (e) {
            return ValidationTypes.isLiteral(e, "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset")
        }, "<content-sizing>": function (e) {
            return ValidationTypes.isLiteral(e, "fill-available | -moz-available | -webkit-fill-available | max-content | -moz-max-content | -webkit-max-content | min-content | -moz-min-content | -webkit-min-content | fit-content | -moz-fit-content | -webkit-fit-content")
        }, "<margin-width>": function (e) {
            return this["<length>"](e) || this["<percentage>"](e) || ValidationTypes.isLiteral(e, "auto")
        }, "<padding-width>": function (e) {
            return this["<length>"](e) || this["<percentage>"](e)
        }, "<shape>": function (e) {
            return e.type == "function" && (e.name == "rect" || e.name == "inset-rect")
        }, "<time>": function (e) {
            return e.type == "time"
        }, "<flex-grow>": function (e) {
            return this["<number>"](e)
        }, "<flex-shrink>": function (e) {
            return this["<number>"](e)
        }, "<width>": function (e) {
            return this["<margin-width>"](e)
        }, "<flex-basis>": function (e) {
            return this["<width>"](e)
        }, "<flex-direction>": function (e) {
            return ValidationTypes.isLiteral(e, "row | row-reverse | column | column-reverse")
        }, "<flex-wrap>": function (e) {
            return ValidationTypes.isLiteral(e, "nowrap | wrap | wrap-reverse")
        }}, complex: {"<bg-position>": function (e) {
            var t = this, n = !1, r = "<percentage> | <length>", i = "left | right", s = "top | bottom", o = 0, u = function () {
                return e.hasNext() && e.peek() != ","
            };
            while (e.peek(o) && e.peek(o) != ",")o++;
            return o < 3 ? ValidationTypes.isAny(e, i + " | center | " + r) ? (n = !0, ValidationTypes.isAny(e, s + " | center | " + r)) : ValidationTypes.isAny(e, s) && (n = !0, ValidationTypes.isAny(e, i + " | center")) : ValidationTypes.isAny(e, i) ? ValidationTypes.isAny(e, s) ? (n = !0, ValidationTypes.isAny(e, r)) : ValidationTypes.isAny(e, r) && (ValidationTypes.isAny(e, s) ? (n = !0, ValidationTypes.isAny(e, r)) : ValidationTypes.isAny(e, "center") && (n = !0)) : ValidationTypes.isAny(e, s) ? ValidationTypes.isAny(e, i) ? (n = !0, ValidationTypes.isAny(e, r)) : ValidationTypes.isAny(e, r) && (ValidationTypes.isAny(e, i) ? (n = !0, ValidationTypes.isAny(e, r)) : ValidationTypes.isAny(e, "center") && (n = !0)) : ValidationTypes.isAny(e, "center") && ValidationTypes.isAny(e, i + " | " + s) && (n = !0, ValidationTypes.isAny(e, r)), n
        }, "<bg-size>": function (e) {
            var t = this, n = !1, r = "<percentage> | <length> | auto", i, s, o;
            return ValidationTypes.isAny(e, "cover | contain") ? n = !0 : ValidationTypes.isAny(e, r) && (n = !0, ValidationTypes.isAny(e, r)), n
        }, "<repeat-style>": function (e) {
            var t = !1, n = "repeat | space | round | no-repeat", r;
            return e.hasNext() && (r = e.next(), ValidationTypes.isLiteral(r, "repeat-x | repeat-y") ? t = !0 : ValidationTypes.isLiteral(r, n) && (t = !0, e.hasNext() && ValidationTypes.isLiteral(e.peek(), n) && e.next())), t
        }, "<shadow>": function (e) {
            var t = !1, n = 0, r = !1, i = !1, s;
            if (e.hasNext()) {
                ValidationTypes.isAny(e, "inset") && (r = !0), ValidationTypes.isAny(e, "<color>") && (i = !0);
                while (ValidationTypes.isAny(e, "<length>") && n < 4)n++;
                e.hasNext() && (i || ValidationTypes.isAny(e, "<color>"), r || ValidationTypes.isAny(e, "inset")), t = n >= 2 && n <= 4
            }
            return t
        }, "<x-one-radius>": function (e) {
            var t = !1, n = "<length> | <percentage> | inherit";
            return ValidationTypes.isAny(e, n) && (t = !0, ValidationTypes.isAny(e, n)), t
        }, "<flex>": function (e) {
            var t, n = !1;
            ValidationTypes.isAny(e, "none | inherit") ? n = !0 : ValidationTypes.isType(e, "<flex-grow>") ? e.peek() ? ValidationTypes.isType(e, "<flex-shrink>") ? e.peek() ? n = ValidationTypes.isType(e, "<flex-basis>") : n = !0 : ValidationTypes.isType(e, "<flex-basis>") && (n = e.peek() === null) : n = !0 : ValidationTypes.isType(e, "<flex-basis>") && (n = !0);
            if (!n)throw t = e.peek(), new ValidationError("Expected (none | [ <flex-grow> <flex-shrink>? || <flex-basis> ]) but found '" + e.value.text + "'.", t.line, t.col);
            return n
        }}};
        parserlib.css = {Colors: Colors, Combinator: Combinator, Parser: Parser, PropertyName: PropertyName, PropertyValue: PropertyValue, PropertyValuePart: PropertyValuePart, MediaFeature: MediaFeature, MediaQuery: MediaQuery, Selector: Selector, SelectorPart: SelectorPart, SelectorSubPart: SelectorSubPart, Specificity: Specificity, TokenStream: TokenStream, Tokens: Tokens, ValidationError: ValidationError}
    }(), function () {
        for (var e in parserlib)exports[e] = parserlib[e]
    }();
    var util = {isArray: function (e) {
        return Array.isArray(e) || typeof e == "object" && objectToString(e) === "[object Array]"
    }, isDate: function (e) {
        return typeof e == "object" && objectToString(e) === "[object Date]"
    }, isRegExp: function (e) {
        return typeof e == "object" && objectToString(e) === "[object RegExp]"
    }, getRegExpFlags: function (e) {
        var t = "";
        return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), t
    }};
    typeof module == "object" && (module.exports = clone), clone.clonePrototype = function (e) {
        if (e === null)return null;
        var t = function () {
        };
        return t.prototype = e, new t
    };
    var CSSLint = function () {
        function i(e, t) {
            var r, i = e && e.match(n), s = i && i[1];
            return s && (r = {"true": 2, "": 1, "false": 0, 2: 2, 1: 1, 0: 0}, s.toLowerCase().split(",").forEach(function (e) {
                var n = e.split(":"), i = n[0] || "", s = n[1] || "";
                t[i.trim()] = r[s.trim()]
            })), t
        }

        var e = [], t = [], n = /\/\*csslint([^\*]*)\*\//, r = new parserlib.util.EventTarget;
        return r.version = "@VERSION@", r.addRule = function (t) {
            e.push(t), e[t.id] = t
        }, r.clearRules = function () {
            e = []
        }, r.getRules = function () {
            return[].concat(e).sort(function (e, t) {
                return e.id > t.id ? 1 : 0
            })
        }, r.getRuleset = function () {
            var t = {}, n = 0, r = e.length;
            while (n < r)t[e[n++].id] = 1;
            return t
        }, r.addFormatter = function (e) {
            t[e.id] = e
        }, r.getFormatter = function (e) {
            return t[e]
        }, r.format = function (e, t, n, r) {
            var i = this.getFormatter(n), s = null;
            return i && (s = i.startFormat(), s += i.formatResults(e, t, r || {}), s += i.endFormat()), s
        }, r.hasFormat = function (e) {
            return t.hasOwnProperty(e)
        }, r.verify = function (t, r) {
            var s = 0, o, u, a, f = new parserlib.css.Parser({starHack: !0, ieFilters: !0, underscoreHack: !0, strict: !1});
            u = t.replace(/\n\r?/g, "$split$").split("$split$"), r || (r = this.getRuleset()), n.test(t) && (r = clone(r), r = i(t, r)), o = new Reporter(u, r), r.errors = 2;
            for (s in r)r.hasOwnProperty(s) && r[s] && e[s] && e[s].init(f, o);
            try {
                f.parse(t)
            } catch (l) {
                o.error("Fatal error, cannot continue: " + l.message, l.line, l.col, {})
            }
            return a = {messages: o.messages, stats: o.stats, ruleset: o.ruleset}, a.messages.sort(function (e, t) {
                return e.rollup && !t.rollup ? 1 : !e.rollup && t.rollup ? -1 : e.line - t.line
            }), a
        }, r
    }();
    Reporter.prototype = {constructor: Reporter, error: function (e, t, n, r) {
        this.messages.push({type: "error", line: t, col: n, message: e, evidence: this.lines[t - 1], rule: r || {}})
    }, warn: function (e, t, n, r) {
        this.report(e, t, n, r)
    }, report: function (e, t, n, r) {
        this.messages.push({type: this.ruleset[r.id] === 2 ? "error" : "warning", line: t, col: n, message: e, evidence: this.lines[t - 1], rule: r})
    }, info: function (e, t, n, r) {
        this.messages.push({type: "info", line: t, col: n, message: e, evidence: this.lines[t - 1], rule: r})
    }, rollupError: function (e, t) {
        this.messages.push({type: "error", rollup: !0, message: e, rule: t})
    }, rollupWarn: function (e, t) {
        this.messages.push({type: "warning", rollup: !0, message: e, rule: t})
    }, stat: function (e, t) {
        this.stats[e] = t
    }}, CSSLint._Reporter = Reporter, CSSLint.Util = {mix: function (e, t) {
        var n;
        for (n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
        return n
    }, indexOf: function (e, t) {
        if (e.indexOf)return e.indexOf(t);
        for (var n = 0, r = e.length; n < r; n++)if (e[n] === t)return n;
        return-1
    }, forEach: function (e, t) {
        if (e.forEach)return e.forEach(t);
        for (var n = 0, r = e.length; n < r; n++)t(e[n], n, e)
    }}, CSSLint.addRule({id: "adjoining-classes", name: "Disallow adjoining classes", desc: "Don't use adjoining classes.", browsers: "IE6", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (r) {
            var i = r.selectors, s, o, u, a, f, l, c;
            for (f = 0; f < i.length; f++) {
                s = i[f];
                for (l = 0; l < s.parts.length; l++) {
                    o = s.parts[l];
                    if (o.type === e.SELECTOR_PART_TYPE) {
                        a = 0;
                        for (c = 0; c < o.modifiers.length; c++)u = o.modifiers[c], u.type === "class" && a++, a > 1 && t.report("Don't use adjoining classes.", o.line, o.col, n)
                    }
                }
            }
        })
    }}), CSSLint.addRule({id: "box-model", name: "Beware of broken box size", desc: "Don't use width or height when using padding or border.", browsers: "All", init: function (e, t) {
        function u() {
            s = {}, o = !1
        }

        function a() {
            var e, u;
            if (!o) {
                if (s.height)for (e in i)i.hasOwnProperty(e) && s[e] && (u = s[e].value, (e !== "padding" || u.parts.length !== 2 || u.parts[0].value !== 0) && t.report("Using height with " + e + " can sometimes make elements larger than you expect.", s[e].line, s[e].col, n));
                if (s.width)for (e in r)r.hasOwnProperty(e) && s[e] && (u = s[e].value, (e !== "padding" || u.parts.length !== 2 || u.parts[1].value !== 0) && t.report("Using width with " + e + " can sometimes make elements larger than you expect.", s[e].line, s[e].col, n))
            }
        }

        var n = this, r = {border: 1, "border-left": 1, "border-right": 1, padding: 1, "padding-left": 1, "padding-right": 1}, i = {border: 1, "border-bottom": 1, "border-top": 1, padding: 1, "padding-bottom": 1, "padding-top": 1}, s, o = !1;
        e.addListener("startrule", u), e.addListener("startfontface", u), e.addListener("startpage", u), e.addListener("startpagemargin", u), e.addListener("startkeyframerule", u), e.addListener("property", function (e) {
            var t = e.property.text.toLowerCase();
            i[t] || r[t] ? !/^0\S*$/.test(e.value) && (t !== "border" || e.value.toString() !== "none") && (s[t] = {line: e.property.line, col: e.property.col, value: e.value}) : /^(width|height)/i.test(t) && /^(length|percentage)/.test(e.value.parts[0].type) ? s[t] = 1 : t === "box-sizing" && (o = !0)
        }), e.addListener("endrule", a), e.addListener("endfontface", a), e.addListener("endpage", a), e.addListener("endpagemargin", a), e.addListener("endkeyframerule", a)
    }}), CSSLint.addRule({id: "box-sizing", name: "Disallow use of box-sizing", desc: "The box-sizing properties isn't supported in IE6 and IE7.", browsers: "IE6, IE7", tags: ["Compatibility"], init: function (e, t) {
        var n = this;
        e.addListener("property", function (e) {
            var r = e.property.text.toLowerCase();
            r === "box-sizing" && t.report("The box-sizing property isn't supported in IE6 and IE7.", e.line, e.col, n)
        })
    }}), CSSLint.addRule({id: "bulletproof-font-face", name: "Use the bulletproof @font-face syntax", desc: "Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).", browsers: "All", init: function (e, t) {
        var n = this, r = !1, i = !0, s = !1, o, u;
        e.addListener("startfontface", function () {
            r = !0
        }), e.addListener("property", function (e) {
            if (!r)return;
            var t = e.property.toString().toLowerCase(), n = e.value.toString();
            o = e.line, u = e.col;
            if (t === "src") {
                var a = /^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;
                !n.match(a) && i ? (s = !0, i = !1) : n.match(a) && !i && (s = !1)
            }
        }), e.addListener("endfontface", function () {
            r = !1, s && t.report("@font-face declaration doesn't follow the fontspring bulletproof syntax.", o, u, n)
        })
    }}), CSSLint.addRule({id: "compatible-vendor-prefixes", name: "Require compatible vendor prefixes", desc: "Include all compatible vendor prefixes to reach a wider range of users.", browsers: "All", init: function (e, t) {
        var n = this, r, i, s, o, u, a, f, l = !1, c = Array.prototype.push, h = [];
        r = {animation: "webkit moz", "animation-delay": "webkit moz", "animation-direction": "webkit moz", "animation-duration": "webkit moz", "animation-fill-mode": "webkit moz", "animation-iteration-count": "webkit moz", "animation-name": "webkit moz", "animation-play-state": "webkit moz", "animation-timing-function": "webkit moz", appearance: "webkit moz", "border-end": "webkit moz", "border-end-color": "webkit moz", "border-end-style": "webkit moz", "border-end-width": "webkit moz", "border-image": "webkit moz o", "border-radius": "webkit", "border-start": "webkit moz", "border-start-color": "webkit moz", "border-start-style": "webkit moz", "border-start-width": "webkit moz", "box-align": "webkit moz ms", "box-direction": "webkit moz ms", "box-flex": "webkit moz ms", "box-lines": "webkit ms", "box-ordinal-group": "webkit moz ms", "box-orient": "webkit moz ms", "box-pack": "webkit moz ms", "box-sizing": "webkit moz", "box-shadow": "webkit moz", "column-count": "webkit moz ms", "column-gap": "webkit moz ms", "column-rule": "webkit moz ms", "column-rule-color": "webkit moz ms", "column-rule-style": "webkit moz ms", "column-rule-width": "webkit moz ms", "column-width": "webkit moz ms", hyphens: "epub moz", "line-break": "webkit ms", "margin-end": "webkit moz", "margin-start": "webkit moz", "marquee-speed": "webkit wap", "marquee-style": "webkit wap", "padding-end": "webkit moz", "padding-start": "webkit moz", "tab-size": "moz o", "text-size-adjust": "webkit ms", transform: "webkit moz ms o", "transform-origin": "webkit moz ms o", transition: "webkit moz o", "transition-delay": "webkit moz o", "transition-duration": "webkit moz o", "transition-property": "webkit moz o", "transition-timing-function": "webkit moz o", "user-modify": "webkit moz", "user-select": "webkit moz ms", "word-break": "epub ms", "writing-mode": "epub ms"};
        for (s in r)if (r.hasOwnProperty(s)) {
            o = [], u = r[s].split(" ");
            for (a = 0, f = u.length; a < f; a++)o.push("-" + u[a] + "-" + s);
            r[s] = o, c.apply(h, o)
        }
        e.addListener("startrule", function () {
            i = []
        }), e.addListener("startkeyframes", function (e) {
            l = e.prefix || !0
        }), e.addListener("endkeyframes", function () {
            l = !1
        }), e.addListener("property", function (e) {
            var t = e.property;
            CSSLint.Util.indexOf(h, t.text) > -1 && (!l || typeof l != "string" || t.text.indexOf("-" + l + "-") !== 0) && i.push(t)
        }), e.addListener("endrule", function () {
            if (!i.length)return;
            var e = {}, s, o, u, a, f, l, c, h, p, d;
            for (s = 0, o = i.length; s < o; s++) {
                u = i[s];
                for (a in r)r.hasOwnProperty(a) && (f = r[a], CSSLint.Util.indexOf(f, u.text) > -1 && (e[a] || (e[a] = {full: f.slice(0), actual: [], actualNodes: []}), CSSLint.Util.indexOf(e[a].actual, u.text) === -1 && (e[a].actual.push(u.text), e[a].actualNodes.push(u))))
            }
            for (a in e)if (e.hasOwnProperty(a)) {
                l = e[a], c = l.full, h = l.actual;
                if (c.length > h.length)for (s = 0, o = c.length; s < o; s++)p = c[s], CSSLint.Util.indexOf(h, p) === -1 && (d = h.length === 1 ? h[0] : h.length === 2 ? h.join(" and ") : h.join(", "), t.report("The property " + p + " is compatible with " + d + " and should be included as well.", l.actualNodes[0].line, l.actualNodes[0].col, n))
            }
        })
    }}), CSSLint.addRule({id: "display-property-grouping", name: "Require properties appropriate for display", desc: "Certain properties shouldn't be used with certain display property values.", browsers: "All", init: function (e, t) {
        function s(e, s, o) {
            i[e] && (typeof r[e] != "string" || i[e].value.toLowerCase() !== r[e]) && t.report(o || e + " can't be used with display: " + s + ".", i[e].line, i[e].col, n)
        }

        function o() {
            i = {}
        }

        function u() {
            var e = i.display ? i.display.value : null;
            if (e)switch (e) {
                case"inline":
                    s("height", e), s("width", e), s("margin", e), s("margin-top", e), s("margin-bottom", e), s("float", e, "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).");
                    break;
                case"block":
                    s("vertical-align", e);
                    break;
                case"inline-block":
                    s("float", e);
                    break;
                default:
                    e.indexOf("table-") === 0 && (s("margin", e), s("margin-left", e), s("margin-right", e), s("margin-top", e), s("margin-bottom", e), s("float", e))
            }
        }

        var n = this, r = {display: 1, "float": "none", height: 1, width: 1, margin: 1, "margin-left": 1, "margin-right": 1, "margin-bottom": 1, "margin-top": 1, padding: 1, "padding-left": 1, "padding-right": 1, "padding-bottom": 1, "padding-top": 1, "vertical-align": 1}, i;
        e.addListener("startrule", o), e.addListener("startfontface", o), e.addListener("startkeyframerule", o), e.addListener("startpagemargin", o), e.addListener("startpage", o), e.addListener("property", function (e) {
            var t = e.property.text.toLowerCase();
            r[t] && (i[t] = {value: e.value.text, line: e.property.line, col: e.property.col})
        }), e.addListener("endrule", u), e.addListener("endfontface", u), e.addListener("endkeyframerule", u), e.addListener("endpagemargin", u), e.addListener("endpage", u)
    }}), CSSLint.addRule({id: "duplicate-background-images", name: "Disallow duplicate background images", desc: "Every background-image should be unique. Use a common class for e.g. sprites.", browsers: "All", init: function (e, t) {
        var n = this, r = {};
        e.addListener("property", function (e) {
            var i = e.property.text, s = e.value, o, u;
            if (i.match(/background/i))for (o = 0, u = s.parts.length; o < u; o++)s.parts[o].type === "uri" && (typeof r[s.parts[o].uri] == "undefined" ? r[s.parts[o].uri] = e : t.report("Background image '" + s.parts[o].uri + "' was used multiple times, first declared at line " + r[s.parts[o].uri].line + ", col " + r[s.parts[o].uri].col + ".", e.line, e.col, n))
        })
    }}), CSSLint.addRule({id: "duplicate-properties", name: "Disallow duplicate properties", desc: "Duplicate properties must appear one after the other.", browsers: "All", init: function (e, t) {
        function s() {
            r = {}
        }

        var n = this, r, i;
        e.addListener("startrule", s), e.addListener("startfontface", s), e.addListener("startpage", s), e.addListener("startpagemargin", s), e.addListener("startkeyframerule", s), e.addListener("property", function (e) {
            var s = e.property, o = s.text.toLowerCase();
            r[o] && (i !== o || r[o] === e.value.text) && t.report("Duplicate property '" + e.property + "' found.", e.line, e.col, n), r[o] = e.value.text, i = o
        })
    }}), CSSLint.addRule({id: "empty-rules", name: "Disallow empty rules", desc: "Rules without any properties specified should be removed.", browsers: "All", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("startrule", function () {
            r = 0
        }), e.addListener("property", function () {
            r++
        }), e.addListener("endrule", function (e) {
            var i = e.selectors;
            r === 0 && t.report("Rule is empty.", i[0].line, i[0].col, n)
        })
    }}), CSSLint.addRule({id: "errors", name: "Parsing Errors", desc: "This rule looks for recoverable syntax errors.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("error", function (e) {
            t.error(e.message, e.line, e.col, n)
        })
    }}), CSSLint.addRule({id: "fallback-colors", name: "Require fallback colors", desc: "For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.", browsers: "IE6,IE7,IE8", init: function (e, t) {
        function o() {
            s = {}, r = null
        }

        var n = this, r, i = {color: 1, background: 1, "border-color": 1, "border-top-color": 1, "border-right-color": 1, "border-bottom-color": 1, "border-left-color": 1, border: 1, "border-top": 1, "border-right": 1, "border-bottom": 1, "border-left": 1, "background-color": 1}, s;
        e.addListener("startrule", o), e.addListener("startfontface", o), e.addListener("startpage", o), e.addListener("startpagemargin", o), e.addListener("startkeyframerule", o), e.addListener("property", function (e) {
            var s = e.property, o = s.text.toLowerCase(), u = e.value.parts, a = 0, f = "", l = u.length;
            if (i[o])while (a < l)u[a].type === "color" && ("alpha"in u[a] || "hue"in u[a] ? (/([^\)]+)\(/.test(u[a]) && (f = RegExp.$1.toUpperCase()), (!r || r.property.text.toLowerCase() !== o || r.colorType !== "compat") && t.report("Fallback " + o + " (hex or RGB) should precede " + f + " " + o + ".", e.line, e.col, n)) : e.colorType = "compat"), a++;
            r = e
        })
    }}), CSSLint.addRule({id: "floats", name: "Disallow too many floats", desc: "This rule tests if the float property is used too many times", browsers: "All", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("property", function (e) {
            e.property.text.toLowerCase() === "float" && e.value.text.toLowerCase() !== "none" && r++
        }), e.addListener("endstylesheet", function () {
            t.stat("floats", r), r >= 10 && t.rollupWarn("Too many floats (" + r + "), you're probably using them for layout. Consider using a grid system instead.", n)
        })
    }}), CSSLint.addRule({id: "font-faces", name: "Don't use too many web fonts", desc: "Too many different web fonts in the same stylesheet.", browsers: "All", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("startfontface", function () {
            r++
        }), e.addListener("endstylesheet", function () {
            r > 5 && t.rollupWarn("Too many @font-face declarations (" + r + ").", n)
        })
    }}), CSSLint.addRule({id: "font-sizes", name: "Disallow too many font sizes", desc: "Checks the number of font-size declarations.", browsers: "All", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("property", function (e) {
            e.property.toString() === "font-size" && r++
        }), e.addListener("endstylesheet", function () {
            t.stat("font-sizes", r), r >= 10 && t.rollupWarn("Too many font-size declarations (" + r + "), abstraction needed.", n)
        })
    }}), CSSLint.addRule({id: "gradients", name: "Require all gradient definitions", desc: "When using a vendor-prefixed gradient, make sure to use them all.", browsers: "All", init: function (e, t) {
        var n = this, r;
        e.addListener("startrule", function () {
            r = {moz: 0, webkit: 0, oldWebkit: 0, o: 0}
        }), e.addListener("property", function (e) {
            /\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(e.value) ? r[RegExp.$1] = 1 : /\-webkit\-gradient/i.test(e.value) && (r.oldWebkit = 1)
        }), e.addListener("endrule", function (e) {
            var i = [];
            r.moz || i.push("Firefox 3.6+"), r.webkit || i.push("Webkit (Safari 5+, Chrome)"), r.oldWebkit || i.push("Old Webkit (Safari 4+, Chrome)"), r.o || i.push("Opera 11.1+"), i.length && i.length < 4 && t.report("Missing vendor-prefixed CSS gradients for " + i.join(", ") + ".", e.selectors[0].line, e.selectors[0].col, n)
        })
    }}), CSSLint.addRule({id: "ids", name: "Disallow IDs in selectors", desc: "Selectors should not contain IDs.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (r) {
            var i = r.selectors, s, o, u, a, f, l, c;
            for (f = 0; f < i.length; f++) {
                s = i[f], a = 0;
                for (l = 0; l < s.parts.length; l++) {
                    o = s.parts[l];
                    if (o.type === e.SELECTOR_PART_TYPE)for (c = 0; c < o.modifiers.length; c++)u = o.modifiers[c], u.type === "id" && a++
                }
                a === 1 ? t.report("Don't use IDs in selectors.", s.line, s.col, n) : a > 1 && t.report(a + " IDs in the selector, really?", s.line, s.col, n)
            }
        })
    }}), CSSLint.addRule({id: "import", name: "Disallow @import", desc: "Don't use @import, use <link> instead.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("import", function (e) {
            t.report("@import prevents parallel downloads, use <link> instead.", e.line, e.col, n)
        })
    }}), CSSLint.addRule({id: "important", name: "Disallow !important", desc: "Be careful when using !important declaration", browsers: "All", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("property", function (e) {
            e.important === !0 && (r++, t.report("Use of !important", e.line, e.col, n))
        }), e.addListener("endstylesheet", function () {
            t.stat("important", r), r >= 10 && t.rollupWarn("Too many !important declarations (" + r + "), try to use less than 10 to avoid specificity issues.", n)
        })
    }}), CSSLint.addRule({id: "known-properties", name: "Require use of known properties", desc: "Properties should be known (listed in CSS3 specification) or be a vendor-prefixed property.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("property", function (e) {
            e.invalid && t.report(e.invalid.message, e.line, e.col, n)
        })
    }}), CSSLint.addRule({id: "order-alphabetical", name: "Alphabetical order", desc: "Assure properties are in alphabetical order", browsers: "All", init: function (e, t) {
        var n = this, r, i = function () {
            r = []
        };
        e.addListener("startrule", i), e.addListener("startfontface", i), e.addListener("startpage", i), e.addListener("startpagemargin", i), e.addListener("startkeyframerule", i), e.addListener("property", function (e) {
            var t = e.property.text, n = t.toLowerCase().replace(/^-.*?-/, "");
            r.push(n)
        }), e.addListener("endrule", function (e) {
            var i = r.join(","), s = r.sort().join(",");
            i !== s && t.report("Rule doesn't have all its properties in alphabetical ordered.", e.line, e.col, n)
        })
    }}), CSSLint.addRule({id: "outline-none", name: "Disallow outline: none", desc: "Use of outline: none or outline: 0 should be limited to :focus rules.", browsers: "All", tags: ["Accessibility"], init: function (e, t) {
        function i(e) {
            e.selectors ? r = {line: e.line, col: e.col, selectors: e.selectors, propCount: 0, outline: !1} : r = null
        }

        function s() {
            r && r.outline && (r.selectors.toString().toLowerCase().indexOf(":focus") === -1 ? t.report("Outlines should only be modified using :focus.", r.line, r.col, n) : r.propCount === 1 && t.report("Outlines shouldn't be hidden unless other visual changes are made.", r.line, r.col, n))
        }

        var n = this, r;
        e.addListener("startrule", i), e.addListener("startfontface", i), e.addListener("startpage", i), e.addListener("startpagemargin", i), e.addListener("startkeyframerule", i), e.addListener("property", function (e) {
            var t = e.property.text.toLowerCase(), n = e.value;
            r && (r.propCount++, t === "outline" && (n.toString() === "none" || n.toString() === "0") && (r.outline = !0))
        }), e.addListener("endrule", s), e.addListener("endfontface", s), e.addListener("endpage", s), e.addListener("endpagemargin", s), e.addListener("endkeyframerule", s)
    }}), CSSLint.addRule({id: "overqualified-elements", name: "Disallow overqualified elements", desc: "Don't use classes or IDs with elements (a.foo or a#foo).", browsers: "All", init: function (e, t) {
        var n = this, r = {};
        e.addListener("startrule", function (i) {
            var s = i.selectors, o, u, a, f, l, c;
            for (f = 0; f < s.length; f++) {
                o = s[f];
                for (l = 0; l < o.parts.length; l++) {
                    u = o.parts[l];
                    if (u.type === e.SELECTOR_PART_TYPE)for (c = 0; c < u.modifiers.length; c++)a = u.modifiers[c], u.elementName && a.type === "id" ? t.report("Element (" + u + ") is overqualified, just use " + a + " without element name.", u.line, u.col, n) : a.type === "class" && (r[a] || (r[a] = []), r[a].push({modifier: a, part: u}))
                }
            }
        }), e.addListener("endstylesheet", function () {
            var e;
            for (e in r)r.hasOwnProperty(e) && r[e].length === 1 && r[e][0].part.elementName && t.report("Element (" + r[e][0].part + ") is overqualified, just use " + r[e][0].modifier + " without element name.", r[e][0].part.line, r[e][0].part.col, n)
        })
    }}), CSSLint.addRule({id: "qualified-headings", name: "Disallow qualified headings", desc: "Headings should not be qualified (namespaced).", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (r) {
            var i = r.selectors, s, o, u, a;
            for (u = 0; u < i.length; u++) {
                s = i[u];
                for (a = 0; a < s.parts.length; a++)o = s.parts[a], o.type === e.SELECTOR_PART_TYPE && o.elementName && /h[1-6]/.test(o.elementName.toString()) && a > 0 && t.report("Heading (" + o.elementName + ") should not be qualified.", o.line, o.col, n)
            }
        })
    }}), CSSLint.addRule({id: "regex-selectors", name: "Disallow selectors that look like regexs", desc: "Selectors that look like regular expressions are slow and should be avoided.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (r) {
            var i = r.selectors, s, o, u, a, f, l;
            for (a = 0; a < i.length; a++) {
                s = i[a];
                for (f = 0; f < s.parts.length; f++) {
                    o = s.parts[f];
                    if (o.type === e.SELECTOR_PART_TYPE)for (l = 0; l < o.modifiers.length; l++)u = o.modifiers[l], u.type === "attribute" && /([\~\|\^\$\*]=)/.test(u) && t.report("Attribute selectors with " + RegExp.$1 + " are slow!", u.line, u.col, n)
                }
            }
        })
    }}), CSSLint.addRule({id: "rules-count", name: "Rules Count", desc: "Track how many rules there are.", browsers: "All", init: function (e, t) {
        var n = 0;
        e.addListener("startrule", function () {
            n++
        }), e.addListener("endstylesheet", function () {
            t.stat("rule-count", n)
        })
    }}), CSSLint.addRule({id: "selector-max-approaching", name: "Warn when approaching the 4095 selector limit for IE", desc: "Will warn when selector count is >= 3800 selectors.", browsers: "IE", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("startrule", function (e) {
            r += e.selectors.length
        }), e.addListener("endstylesheet", function () {
            r >= 3800 && t.report("You have " + r + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", 0, 0, n)
        })
    }}), CSSLint.addRule({id: "selector-max", name: "Error when past the 4095 selector limit for IE", desc: "Will error when selector count is > 4095.", browsers: "IE", init: function (e, t) {
        var n = this, r = 0;
        e.addListener("startrule", function (e) {
            r += e.selectors.length
        }), e.addListener("endstylesheet", function () {
            r > 4095 && t.report("You have " + r + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", 0, 0, n)
        })
    }}), CSSLint.addRule({id: "selector-newline", name: "Disallow new-line characters in selectors", desc: "New-line characters in selectors are usually a forgotten comma and not a descendant combinator.", browsers: "All", init: function (e, t) {
        function r(e) {
            var r, i, s, o, u, a, f, l, c, h, p, d = e.selectors;
            for (r = 0, i = d.length; r < i; r++) {
                s = d[r];
                for (o = 0, a = s.parts.length; o < a; o++)for (u = o + 1; u < a; u++)f = s.parts[o], l = s.parts[u], c = f.type, h = f.line, p = l.line, c === "descendant" && p > h && t.report("newline character found in selector (forgot a comma?)", h, d[r].parts[0].col, n)
            }
        }

        var n = this;
        e.addListener("startrule", r)
    }}), CSSLint.addRule({id: "shorthand", name: "Require shorthand properties", desc: "Use shorthand properties where possible.", browsers: "All", init: function (e, t) {
        function f() {
            u = {}
        }

        function l(e) {
            var r, i, s, o;
            for (r in a)if (a.hasOwnProperty(r)) {
                o = 0;
                for (i = 0, s = a[r].length; i < s; i++)o += u[a[r][i]] ? 1 : 0;
                o === a[r].length && t.report("The properties " + a[r].join(", ") + " can be replaced by " + r + ".", e.line, e.col, n)
            }
        }

        var n = this, r, i, s, o = {}, u, a = {margin: ["margin-top", "margin-bottom", "margin-left", "margin-right"], padding: ["padding-top", "padding-bottom", "padding-left", "padding-right"]};
        for (r in a)if (a.hasOwnProperty(r))for (i = 0, s = a[r].length; i < s; i++)o[a[r][i]] = r;
        e.addListener("startrule", f), e.addListener("startfontface", f), e.addListener("property", function (e) {
            var t = e.property.toString().toLowerCase();
            o[t] && (u[t] = 1)
        }), e.addListener("endrule", l), e.addListener("endfontface", l)
    }}), CSSLint.addRule({id: "star-property-hack", name: "Disallow properties with a star prefix", desc: "Checks for the star property hack (targets IE6/7)", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("property", function (e) {
            var r = e.property;
            r.hack === "*" && t.report("Property with star prefix found.", e.property.line, e.property.col, n)
        })
    }}), CSSLint.addRule({id: "text-indent", name: "Disallow negative text-indent", desc: "Checks for text indent less than -99px", browsers: "All", init: function (e, t) {
        function s() {
            r = !1, i = "inherit"
        }

        function o() {
            r && i !== "ltr" && t.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", r.line, r.col, n)
        }

        var n = this, r, i;
        e.addListener("startrule", s), e.addListener("startfontface", s), e.addListener("property", function (e) {
            var t = e.property.toString().toLowerCase(), n = e.value;
            t === "text-indent" && n.parts[0].value < -99 ? r = e.property : t === "direction" && n.toString() === "ltr" && (i = "ltr")
        }), e.addListener("endrule", o), e.addListener("endfontface", o)
    }}), CSSLint.addRule({id: "underscore-property-hack", name: "Disallow properties with an underscore prefix", desc: "Checks for the underscore property hack (targets IE6)", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("property", function (e) {
            var r = e.property;
            r.hack === "_" && t.report("Property with underscore prefix found.", e.property.line, e.property.col, n)
        })
    }}), CSSLint.addRule({id: "unique-headings", name: "Headings should only be defined once", desc: "Headings should be defined only once.", browsers: "All", init: function (e, t) {
        var n = this, r = {h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0};
        e.addListener("startrule", function (e) {
            var i = e.selectors, s, o, u, a, f;
            for (a = 0; a < i.length; a++) {
                s = i[a], o = s.parts[s.parts.length - 1];
                if (o.elementName && /(h[1-6])/i.test(o.elementName.toString())) {
                    for (f = 0; f < o.modifiers.length; f++)if (o.modifiers[f].type === "pseudo") {
                        u = !0;
                        break
                    }
                    u || (r[RegExp.$1]++, r[RegExp.$1] > 1 && t.report("Heading (" + o.elementName + ") has already been defined.", o.line, o.col, n))
                }
            }
        }), e.addListener("endstylesheet", function () {
            var e, i = [];
            for (e in r)r.hasOwnProperty(e) && r[e] > 1 && i.push(r[e] + " " + e + "s");
            i.length && t.rollupWarn("You have " + i.join(", ") + " defined in this stylesheet.", n)
        })
    }}), CSSLint.addRule({id: "universal-selector", name: "Disallow universal selector", desc: "The universal selector (*) is known to be slow.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (e) {
            var r = e.selectors, i, s, o;
            for (o = 0; o < r.length; o++)i = r[o], s = i.parts[i.parts.length - 1], s.elementName === "*" && t.report(n.desc, s.line, s.col, n)
        })
    }}), CSSLint.addRule({id: "unqualified-attributes", name: "Disallow unqualified attribute selectors", desc: "Unqualified attribute selectors are known to be slow.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("startrule", function (r) {
            var i = r.selectors, s, o, u, a, f;
            for (a = 0; a < i.length; a++) {
                s = i[a], o = s.parts[s.parts.length - 1];
                if (o.type === e.SELECTOR_PART_TYPE)for (f = 0; f < o.modifiers.length; f++)u = o.modifiers[f], u.type === "attribute" && (!o.elementName || o.elementName === "*") && t.report(n.desc, o.line, o.col, n)
            }
        })
    }}), CSSLint.addRule({id: "vendor-prefix", name: "Require standard property with vendor prefix", desc: "When using a vendor-prefixed property, make sure to include the standard one.", browsers: "All", init: function (e, t) {
        function o() {
            r = {}, i = 1
        }

        function u() {
            var e, i, o, u, a, f = [];
            for (e in r)s[e] && f.push({actual: e, needed: s[e]});
            for (i = 0, o = f.length; i < o; i++)u = f[i].needed, a = f[i].actual, r[u] ? r[u][0].pos < r[a][0].pos && t.report("Standard property '" + u + "' should come after vendor-prefixed property '" + a + "'.", r[a][0].name.line, r[a][0].name.col, n) : t.report("Missing standard property '" + u + "' to go along with '" + a + "'.", r[a][0].name.line, r[a][0].name.col, n)
        }

        var n = this, r, i, s = {"-webkit-border-radius": "border-radius", "-webkit-border-top-left-radius": "border-top-left-radius", "-webkit-border-top-right-radius": "border-top-right-radius", "-webkit-border-bottom-left-radius": "border-bottom-left-radius", "-webkit-border-bottom-right-radius": "border-bottom-right-radius", "-o-border-radius": "border-radius", "-o-border-top-left-radius": "border-top-left-radius", "-o-border-top-right-radius": "border-top-right-radius", "-o-border-bottom-left-radius": "border-bottom-left-radius", "-o-border-bottom-right-radius": "border-bottom-right-radius", "-moz-border-radius": "border-radius", "-moz-border-radius-topleft": "border-top-left-radius", "-moz-border-radius-topright": "border-top-right-radius", "-moz-border-radius-bottomleft": "border-bottom-left-radius", "-moz-border-radius-bottomright": "border-bottom-right-radius", "-moz-column-count": "column-count", "-webkit-column-count": "column-count", "-moz-column-gap": "column-gap", "-webkit-column-gap": "column-gap", "-moz-column-rule": "column-rule", "-webkit-column-rule": "column-rule", "-moz-column-rule-style": "column-rule-style", "-webkit-column-rule-style": "column-rule-style", "-moz-column-rule-color": "column-rule-color", "-webkit-column-rule-color": "column-rule-color", "-moz-column-rule-width": "column-rule-width", "-webkit-column-rule-width": "column-rule-width", "-moz-column-width": "column-width", "-webkit-column-width": "column-width", "-webkit-column-span": "column-span", "-webkit-columns": "columns", "-moz-box-shadow": "box-shadow", "-webkit-box-shadow": "box-shadow", "-moz-transform": "transform", "-webkit-transform": "transform", "-o-transform": "transform", "-ms-transform": "transform", "-moz-transform-origin": "transform-origin", "-webkit-transform-origin": "transform-origin", "-o-transform-origin": "transform-origin", "-ms-transform-origin": "transform-origin", "-moz-box-sizing": "box-sizing", "-webkit-box-sizing": "box-sizing"};
        e.addListener("startrule", o), e.addListener("startfontface", o), e.addListener("startpage", o), e.addListener("startpagemargin", o), e.addListener("startkeyframerule", o), e.addListener("property", function (e) {
            var t = e.property.text.toLowerCase();
            r[t] || (r[t] = []), r[t].push({name: e.property, value: e.value, pos: i++})
        }), e.addListener("endrule", u), e.addListener("endfontface", u), e.addListener("endpage", u), e.addListener("endpagemargin", u), e.addListener("endkeyframerule", u)
    }}), CSSLint.addRule({id: "zero-units", name: "Disallow units for 0 values", desc: "You don't need to specify units when a value is 0.", browsers: "All", init: function (e, t) {
        var n = this;
        e.addListener("property", function (e) {
            var r = e.value.parts, i = 0, s = r.length;
            while (i < s)(r[i].units || r[i].type === "percentage") && r[i].value === 0 && r[i].type !== "time" && t.report("Values of 0 shouldn't have units specified.", r[i].line, r[i].col, n), i++
        })
    }}), function () {
        var e = function (e) {
            return!e || e.constructor !== String ? "" : e.replace(/[\"&><]/g, function (e) {
                switch (e) {
                    case'"':
                        return"&quot;";
                    case"&":
                        return"&amp;";
                    case"<":
                        return"&lt;";
                    case">":
                        return"&gt;"
                }
            })
        };
        CSSLint.addFormatter({id: "checkstyle-xml", name: "Checkstyle XML format", startFormat: function () {
            return'<?xml version="1.0" encoding="utf-8"?><checkstyle>'
        }, endFormat: function () {
            return"</checkstyle>"
        }, readError: function (t, n) {
            return'<file name="' + e(t) + '"><error line="0" column="0" severty="error" message="' + e(n) + '"></error></file>'
        }, formatResults: function (t, n) {
            var r = t.messages, i = [], s = function (e) {
                return!!e && "name"in e ? "net.csslint." + e.name.replace(/\s/g, "") : ""
            };
            return r.length > 0 && (i.push('<file name="' + n + '">'), CSSLint.Util.forEach(r, function (t) {
                t.rollup || i.push('<error line="' + t.line + '" column="' + t.col + '" severity="' + t.type + '"' + ' message="' + e(t.message) + '" source="' + s(t.rule) + '"/>')
            }), i.push("</file>")), i.join("")
        }})
    }(), CSSLint.addFormatter({id: "compact", name: "Compact, 'porcelain' format", startFormat: function () {
        return""
    }, endFormat: function () {
        return""
    }, formatResults: function (e, t, n) {
        var r = e.messages, i = "";
        n = n || {};
        var s = function (e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        };
        return r.length === 0 ? n.quiet ? "" : t + ": Lint Free!" : (CSSLint.Util.forEach(r, function (e) {
            e.rollup ? i += t + ": " + s(e.type) + " - " + e.message + "\n" : i += t + ": " + "line " + e.line + ", col " + e.col + ", " + s(e.type) + " - " + e.message + " (" + e.rule.id + ")\n"
        }), i)
    }}), CSSLint.addFormatter({id: "csslint-xml", name: "CSSLint XML format", startFormat: function () {
        return'<?xml version="1.0" encoding="utf-8"?><csslint>'
    }, endFormat: function () {
        return"</csslint>"
    }, formatResults: function (e, t) {
        var n = e.messages, r = [], i = function (e) {
            return!e || e.constructor !== String ? "" : e.replace(/\"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        };
        return n.length > 0 && (r.push('<file name="' + t + '">'), CSSLint.Util.forEach(n, function (e) {
            e.rollup ? r.push('<issue severity="' + e.type + '" reason="' + i(e.message) + '" evidence="' + i(e.evidence) + '"/>') : r.push('<issue line="' + e.line + '" char="' + e.col + '" severity="' + e.type + '"' + ' reason="' + i(e.message) + '" evidence="' + i(e.evidence) + '"/>')
        }), r.push("</file>")), r.join("")
    }}), CSSLint.addFormatter({id: "junit-xml", name: "JUNIT XML format", startFormat: function () {
        return'<?xml version="1.0" encoding="utf-8"?><testsuites>'
    }, endFormat: function () {
        return"</testsuites>"
    }, formatResults: function (e, t) {
        var n = e.messages, r = [], i = {error: 0, failure: 0}, s = function (e) {
            return!!e && "name"in e ? "net.csslint." + e.name.replace(/\s/g, "") : ""
        }, o = function (e) {
            return!e || e.constructor !== String ? "" : e.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        };
        return n.length > 0 && (n.forEach(function (e) {
            var t = e.type === "warning" ? "error" : e.type;
            e.rollup || (r.push('<testcase time="0" name="' + s(e.rule) + '">'), r.push("<" + t + ' message="' + o(e.message) + '"><![CDATA[' + e.line + ":" + e.col + ":" + o(e.evidence) + "]]></" + t + ">"), r.push("</testcase>"), i[t] += 1)
        }), r.unshift('<testsuite time="0" tests="' + n.length + '" skipped="0" errors="' + i.error + '" failures="' + i.failure + '" package="net.csslint" name="' + t + '">'), r.push("</testsuite>")), r.join("")
    }}), CSSLint.addFormatter({id: "lint-xml", name: "Lint XML format", startFormat: function () {
        return'<?xml version="1.0" encoding="utf-8"?><lint>'
    }, endFormat: function () {
        return"</lint>"
    }, formatResults: function (e, t) {
        var n = e.messages, r = [], i = function (e) {
            return!e || e.constructor !== String ? "" : e.replace(/\"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        };
        return n.length > 0 && (r.push('<file name="' + t + '">'), CSSLint.Util.forEach(n, function (e) {
            e.rollup ? r.push('<issue severity="' + e.type + '" reason="' + i(e.message) + '" evidence="' + i(e.evidence) + '"/>') : r.push('<issue line="' + e.line + '" char="' + e.col + '" severity="' + e.type + '"' + ' reason="' + i(e.message) + '" evidence="' + i(e.evidence) + '"/>')
        }), r.push("</file>")), r.join("")
    }}), CSSLint.addFormatter({id: "text", name: "Plain Text", startFormat: function () {
        return""
    }, endFormat: function () {
        return""
    }, formatResults: function (e, t, n) {
        var r = e.messages, i = "";
        n = n || {};
        if (r.length === 0)return n.quiet ? "" : "\n\ncsslint: No errors in " + t + ".";
        i = "\n\ncsslint: There ", r.length === 1 ? i += "is 1 problem" : i += "are " + r.length + " problems", i += " in " + t + ".";
        var s = t.lastIndexOf("/"), o = t;
        return s === -1 && (s = t.lastIndexOf("\\")), s > -1 && (o = t.substring(s + 1)), CSSLint.Util.forEach(r, function (e, t) {
            i = i + "\n\n" + o, e.rollup ? (i += "\n" + (t + 1) + ": " + e.type, i += "\n" + e.message) : (i += "\n" + (t + 1) + ": " + e.type + " at line " + e.line + ", col " + e.col, i += "\n" + e.message, i += "\n" + e.evidence)
        }), i
    }}), module.exports.CSSLint = CSSLint
}), ace.define("ace/mode/css_worker", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/worker/mirror", "ace/mode/css/csslint"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("../lib/lang"), s = e("../worker/mirror").Mirror, o = e("./css/csslint").CSSLint, u = t.Worker = function (e) {
        s.call(this, e), this.setTimeout(400), this.ruleset = null, this.setDisabledRules("ids|order-alphabetical"), this.setInfoRules("adjoining-classes|qualified-headings|zero-units|gradients|import|outline-none|vendor-prefix")
    };
    r.inherits(u, s), function () {
        this.setInfoRules = function (e) {
            typeof e == "string" && (e = e.split("|")), this.infoRules = i.arrayToMap(e), this.doc.getValue() && this.deferredUpdate.schedule(100)
        }, this.setDisabledRules = function (e) {
            if (!e)this.ruleset = null; else {
                typeof e == "string" && (e = e.split("|"));
                var t = {};
                o.getRules().forEach(function (e) {
                    t[e.id] = !0
                }), e.forEach(function (e) {
                    delete t[e]
                }), this.ruleset = t
            }
            this.doc.getValue() && this.deferredUpdate.schedule(100)
        }, this.onUpdate = function () {
            var e = this.doc.getValue();
            if (!e)return this.sender.emit("csslint", []);
            var t = this.infoRules, n = o.verify(e, this.ruleset);
            this.sender.emit("csslint", n.messages.map(function (e) {
                return{row: e.line - 1, column: e.col - 1, text: e.message, type: t[e.rule.id] ? "info" : e.type, rule: e.rule.name}
            }))
        }
    }.call(u.prototype)
}), ace.define("ace/lib/es5-shim", ["require", "exports", "module"], function (e, t, n) {
    function r() {
    }

    function w(e) {
        try {
            return Object.defineProperty(e, "sentinel", {}), "sentinel"in e
        } catch (t) {
        }
    }

    function H(e) {
        return e = +e, e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e
    }

    function B(e) {
        var t = typeof e;
        return e === null || t === "undefined" || t === "boolean" || t === "number" || t === "string"
    }

    function j(e) {
        var t, n, r;
        if (B(e))return e;
        n = e.valueOf;
        if (typeof n == "function") {
            t = n.call(e);
            if (B(t))return t
        }
        r = e.toString;
        if (typeof r == "function") {
            t = r.call(e);
            if (B(t))return t
        }
        throw new TypeError
    }

    Function.prototype.bind || (Function.prototype.bind = function (t) {
        var n = this;
        if (typeof n != "function")throw new TypeError("Function.prototype.bind called on incompatible " + n);
        var i = u.call(arguments, 1), s = function () {
            if (this instanceof s) {
                var e = n.apply(this, i.concat(u.call(arguments)));
                return Object(e) === e ? e : this
            }
            return n.apply(t, i.concat(u.call(arguments)))
        };
        return n.prototype && (r.prototype = n.prototype, s.prototype = new r, r.prototype = null), s
    });
    var i = Function.prototype.call, s = Array.prototype, o = Object.prototype, u = s.slice, a = i.bind(o.toString), f = i.bind(o.hasOwnProperty), l, c, h, p, d;
    if (d = f(o, "__defineGetter__"))l = i.bind(o.__defineGetter__), c = i.bind(o.__defineSetter__), h = i.bind(o.__lookupGetter__), p = i.bind(o.__lookupSetter__);
    if ([1, 2].splice(0).length != 2)if (!function () {
        function e(e) {
            var t = new Array(e + 2);
            return t[0] = t[1] = 0, t
        }

        var t = [], n;
        t.splice.apply(t, e(20)), t.splice.apply(t, e(26)), n = t.length, t.splice(5, 0, "XXX"), n + 1 == t.length;
        if (n + 1 == t.length)return!0
    }())Array.prototype.splice = function (e, t) {
        var n = this.length;
        e > 0 ? e > n && (e = n) : e == void 0 ? e = 0 : e < 0 && (e = Math.max(n + e, 0)), e + t < n || (t = n - e);
        var r = this.slice(e, e + t), i = u.call(arguments, 2), s = i.length;
        if (e === n)s && this.push.apply(this, i); else {
            var o = Math.min(t, n - e), a = e + o, f = a + s - o, l = n - a, c = n - o;
            if (f < a)for (var h = 0; h < l; ++h)this[f + h] = this[a + h]; else if (f > a)for (h = l; h--;)this[f + h] = this[a + h];
            if (s && e === c)this.length = c, this.push.apply(this, i); else {
                this.length = c + s;
                for (h = 0; h < s; ++h)this[e + h] = i[h]
            }
        }
        return r
    }; else {
        var v = Array.prototype.splice;
        Array.prototype.splice = function (e, t) {
            return arguments.length ? v.apply(this, [e === void 0 ? 0 : e, t === void 0 ? this.length - e : t].concat(u.call(arguments, 2))) : []
        }
    }
    Array.isArray || (Array.isArray = function (t) {
        return a(t) == "[object Array]"
    });
    var m = Object("a"), g = m[0] != "a" || !(0 in m);
    Array.prototype.forEach || (Array.prototype.forEach = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = arguments[1], s = -1, o = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError;
        while (++s < o)s in r && t.call(i, r[s], s, n)
    }), Array.prototype.map || (Array.prototype.map = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = Array(i), o = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var u = 0; u < i; u++)u in r && (s[u] = t.call(o, r[u], u, n));
        return s
    }), Array.prototype.filter || (Array.prototype.filter = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = [], o, u = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var f = 0; f < i; f++)f in r && (o = r[f], t.call(u, o, f, n) && s.push(o));
        return s
    }), Array.prototype.every || (Array.prototype.every = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var o = 0; o < i; o++)if (o in r && !t.call(s, r[o], o, n))return!1;
        return!0
    }), Array.prototype.some || (Array.prototype.some = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var o = 0; o < i; o++)if (o in r && t.call(s, r[o], o, n))return!0;
        return!1
    }), Array.prototype.reduce || (Array.prototype.reduce = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1)throw new TypeError("reduce of empty array with no initial value");
        var s = 0, o;
        if (arguments.length >= 2)o = arguments[1]; else do {
            if (s in r) {
                o = r[s++];
                break
            }
            if (++s >= i)throw new TypeError("reduce of empty array with no initial value")
        } while (!0);
        for (; s < i; s++)s in r && (o = t.call(void 0, o, r[s], s, n));
        return o
    }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (t) {
        var n = F(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1)throw new TypeError("reduceRight of empty array with no initial value");
        var s, o = i - 1;
        if (arguments.length >= 2)s = arguments[1]; else do {
            if (o in r) {
                s = r[o--];
                break
            }
            if (--o < 0)throw new TypeError("reduceRight of empty array with no initial value")
        } while (!0);
        do o in this && (s = t.call(void 0, s, r[o], o, n)); while (o--);
        return s
    });
    if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) != -1)Array.prototype.indexOf = function (t) {
        var n = g && a(this) == "[object String]" ? this.split("") : F(this), r = n.length >>> 0;
        if (!r)return-1;
        var i = 0;
        arguments.length > 1 && (i = H(arguments[1])), i = i >= 0 ? i : Math.max(0, r + i);
        for (; i < r; i++)if (i in n && n[i] === t)return i;
        return-1
    };
    if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) != -1)Array.prototype.lastIndexOf = function (t) {
        var n = g && a(this) == "[object String]" ? this.split("") : F(this), r = n.length >>> 0;
        if (!r)return-1;
        var i = r - 1;
        arguments.length > 1 && (i = Math.min(i, H(arguments[1]))), i = i >= 0 ? i : r - Math.abs(i);
        for (; i >= 0; i--)if (i in n && t === n[i])return i;
        return-1
    };
    Object.getPrototypeOf || (Object.getPrototypeOf = function (t) {
        return t.__proto__ || (t.constructor ? t.constructor.prototype : o)
    });
    if (!Object.getOwnPropertyDescriptor) {
        var y = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (t, n) {
            if (typeof t != "object" && typeof t != "function" || t === null)throw new TypeError(y + t);
            if (!f(t, n))return;
            var r, i, s;
            r = {enumerable: !0, configurable: !0};
            if (d) {
                var u = t.__proto__;
                t.__proto__ = o;
                var i = h(t, n), s = p(t, n);
                t.__proto__ = u;
                if (i || s)return i && (r.get = i), s && (r.set = s), r
            }
            return r.value = t[n], r
        }
    }
    Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (t) {
        return Object.keys(t)
    });
    if (!Object.create) {
        var b;
        Object.prototype.__proto__ === null ? b = function () {
            return{__proto__: null}
        } : b = function () {
            var e = {};
            for (var t in e)e[t] = null;
            return e.constructor = e.hasOwnProperty = e.propertyIsEnumerable = e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf = e.__proto__ = null, e
        }, Object.create = function (t, n) {
            var r;
            if (t === null)r = b(); else {
                if (typeof t != "object")throw new TypeError("typeof prototype[" + typeof t + "] != 'object'");
                var i = function () {
                };
                i.prototype = t, r = new i, r.__proto__ = t
            }
            return n !== void 0 && Object.defineProperties(r, n), r
        }
    }
    if (Object.defineProperty) {
        var E = w({}), S = typeof document == "undefined" || w(document.createElement("div"));
        if (!E || !S)var x = Object.defineProperty
    }
    if (!Object.defineProperty || x) {
        var T = "Property description must be an object: ", N = "Object.defineProperty called on non-object: ", C = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (t, n, r) {
            if (typeof t != "object" && typeof t != "function" || t === null)throw new TypeError(N + t);
            if (typeof r != "object" && typeof r != "function" || r === null)throw new TypeError(T + r);
            if (x)try {
                return x.call(Object, t, n, r)
            } catch (i) {
            }
            if (f(r, "value"))if (d && (h(t, n) || p(t, n))) {
                var s = t.__proto__;
                t.__proto__ = o, delete t[n], t[n] = r.value, t.__proto__ = s
            } else t[n] = r.value; else {
                if (!d)throw new TypeError(C);
                f(r, "get") && l(t, n, r.get), f(r, "set") && c(t, n, r.set)
            }
            return t
        }
    }
    Object.defineProperties || (Object.defineProperties = function (t, n) {
        for (var r in n)f(n, r) && Object.defineProperty(t, r, n[r]);
        return t
    }), Object.seal || (Object.seal = function (t) {
        return t
    }), Object.freeze || (Object.freeze = function (t) {
        return t
    });
    try {
        Object.freeze(function () {
        })
    } catch (k) {
        Object.freeze = function (t) {
            return function (n) {
                return typeof n == "function" ? n : t(n)
            }
        }(Object.freeze)
    }
    Object.preventExtensions || (Object.preventExtensions = function (t) {
        return t
    }), Object.isSealed || (Object.isSealed = function (t) {
        return!1
    }), Object.isFrozen || (Object.isFrozen = function (t) {
        return!1
    }), Object.isExtensible || (Object.isExtensible = function (t) {
        if (Object(t) === t)throw new TypeError;
        var n = "";
        while (f(t, n))n += "?";
        t[n] = !0;
        var r = f(t, n);
        return delete t[n], r
    });
    if (!Object.keys) {
        var L = !0, A = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], O = A.length;
        for (var M in{toString: null})L = !1;
        Object.keys = function I(e) {
            if (typeof e != "object" && typeof e != "function" || e === null)throw new TypeError("Object.keys called on a non-object");
            var I = [];
            for (var t in e)f(e, t) && I.push(t);
            if (L)for (var n = 0, r = O; n < r; n++) {
                var i = A[n];
                f(e, i) && I.push(i)
            }
            return I
        }
    }
    Date.now || (Date.now = function () {
        return(new Date).getTime()
    });
    var _ = "	\n\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";
    if (!String.prototype.trim || _.trim()) {
        _ = "[" + _ + "]";
        var D = new RegExp("^" + _ + _ + "*"), P = new RegExp(_ + _ + "*$");
        String.prototype.trim = function () {
            return String(this).replace(D, "").replace(P, "")
        }
    }
    var F = function (e) {
        if (e == null)throw new TypeError("can't convert " + e + " to object");
        return Object(e)
    }
})