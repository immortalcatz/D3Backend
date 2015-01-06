var jsonlint = function ()
{
    var t = {
        trace: function ()
        {
        },
        yy: {},
        symbols_: {
            error: 2,
            JSONString: 3,
            STRING: 4,
            JSONNumber: 5,
            NUMBER: 6,
            JSONNullLiteral: 7,
            NULL: 8,
            JSONBooleanLiteral: 9,
            TRUE: 10,
            FALSE: 11,
            JSONText: 12,
            JSONValue: 13,
            EOF: 14,
            JSONObject: 15,
            JSONArray: 16,
            "{": 17,
            "}": 18,
            JSONMemberList: 19,
            JSONMember: 20,
            ":": 21,
            ",": 22,
            "[": 23,
            "]": 24,
            JSONElementList: 25,
            $accept: 0,
            $end: 1
        },
        terminals_: {2: "error", 4: "STRING", 6: "NUMBER", 8: "NULL", 10: "TRUE", 11: "FALSE", 14: "EOF", 17: "{", 18: "}", 21: ":", 22: ",", 23: "[", 24: "]"},
        productions_: [0, [3, 1], [5, 1], [7, 1], [9, 1], [9, 1], [12, 2], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [15, 2], [15, 3], [20, 3], [19, 1], [19, 3], [16, 2], [16, 3], [25, 1], [25, 3]],
        performAction: function (t, e, i, n, r, s)
        {
            var h = s.length - 1;
            switch (r)
            {
                case 1:
                    this.$ = t.replace(/\\(\\|")/g, "$1").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "	").replace(/\\v/g, "").replace(/\\f/g, "\f").replace(/\\b/g, "\b");
                    break;
                case 2:
                    this.$ = Number(t);
                    break;
                case 3:
                    this.$ = null;
                    break;
                case 4:
                    this.$ = !0;
                    break;
                case 5:
                    this.$ = !1;
                    break;
                case 6:
                    return this.$ = s[h - 1];
                case 13:
                    this.$ = {};
                    break;
                case 14:
                    this.$ = s[h - 1];
                    break;
                case 15:
                    this.$ = [s[h - 2], s[h]];
                    break;
                case 16:
                    this.$ = {}, this.$[s[h][0]] = s[h][1];
                    break;
                case 17:
                    this.$ = s[h - 2], s[h - 2][s[h][0]] = s[h][1];
                    break;
                case 18:
                    this.$ = [];
                    break;
                case 19:
                    this.$ = s[h - 1];
                    break;
                case 20:
                    this.$ = [s[h]];
                    break;
                case 21:
                    this.$ = s[h - 2], s[h - 2].push(s[h])
            }
        },
        table: [
            {3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 12: 1, 13: 2, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15]},
            {1: [3]},
            {14: [1, 16]},
            {14: [2, 7], 18: [2, 7], 22: [2, 7], 24: [2, 7]},
            {14: [2, 8], 18: [2, 8], 22: [2, 8], 24: [2, 8]},
            {14: [2, 9], 18: [2, 9], 22: [2, 9], 24: [2, 9]},
            {14: [2, 10], 18: [2, 10], 22: [2, 10], 24: [2, 10]},
            {14: [2, 11], 18: [2, 11], 22: [2, 11], 24: [2, 11]},
            {14: [2, 12], 18: [2, 12], 22: [2, 12], 24: [2, 12]},
            {14: [2, 3], 18: [2, 3], 22: [2, 3], 24: [2, 3]},
            {14: [2, 4], 18: [2, 4], 22: [2, 4], 24: [2, 4]},
            {14: [2, 5], 18: [2, 5], 22: [2, 5], 24: [2, 5]},
            {14: [2, 1], 18: [2, 1], 21: [2, 1], 22: [2, 1], 24: [2, 1]},
            {14: [2, 2], 18: [2, 2], 22: [2, 2], 24: [2, 2]},
            {3: 20, 4: [1, 12], 18: [1, 17], 19: 18, 20: 19},
            {3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 23, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15], 24: [1, 21], 25: 22},
            {1: [2, 6]},
            {14: [2, 13], 18: [2, 13], 22: [2, 13], 24: [2, 13]},
            {18: [1, 24], 22: [1, 25]},
            {18: [2, 16], 22: [2, 16]},
            {21: [1, 26]},
            {14: [2, 18], 18: [2, 18], 22: [2, 18], 24: [2, 18]},
            {22: [1, 28], 24: [1, 27]},
            {22: [2, 20], 24: [2, 20]},
            {14: [2, 14], 18: [2, 14], 22: [2, 14], 24: [2, 14]},
            {3: 20, 4: [1, 12], 20: 29},
            {3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 30, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15]},
            {14: [2, 19], 18: [2, 19], 22: [2, 19], 24: [2, 19]},
            {3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 31, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15]},
            {18: [2, 17], 22: [2, 17]},
            {18: [2, 15], 22: [2, 15]},
            {22: [2, 21], 24: [2, 21]}
        ],
        defaultActions: {16: [2, 6]},
        parseError: function (t)
        {
            throw new Error(t)
        },
        parse: function (t)
        {
            function e(t)
            {
                r.length = r.length - 2 * t, s.length = s.length - t, h.length = h.length - t
            }

            function i()
            {
                var t;
                return t = n.lexer.lex() || 1, "number" != typeof t && (t = n.symbols_[t] || t), t
            }

            var n = this, r = [0], s = [null], h = [], l = this.table, o = "", a = 0, c = 0, u = 0, y = 2, p = 1;
            this.lexer.setInput(t), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
            var f = this.lexer.yylloc;
            h.push(f), "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
            for (var g, d, m, x, _, b, E, S, k, v = {}; ;)
            {
                if (m = r[r.length - 1], this.defaultActions[m] ? x = this.defaultActions[m] : (null == g && (g = i()), x = l[m] && l[m][g]), "undefined" == typeof x || !x.length || !x[0])
                {
                    if (!u)
                    {
                        k = [];
                        for (b in l[m])this.terminals_[b] && b > 2 && k.push("'" + this.terminals_[b] + "'");
                        var $ = "";
                        $ = this.lexer.showPosition ? "Parse error on line " + (a + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + k.join(", ") + ", got '" + this.terminals_[g] + "'" : "Parse error on line " + (a + 1) + ": Unexpected " + (1 == g ? "end of input" : "'" + (this.terminals_[g] || g) + "'"), this.parseError($, {
                            text: this.lexer.match,
                            token: this.terminals_[g] || g,
                            line: this.lexer.yylineno,
                            loc: f,
                            expected: k
                        })
                    }
                    if (3 == u)
                    {
                        if (g == p)throw new Error($ || "Parsing halted.");
                        c = this.lexer.yyleng, o = this.lexer.yytext, a = this.lexer.yylineno, f = this.lexer.yylloc, g = i()
                    }
                    for (; ;)
                    {
                        if (y.toString()in l[m])break;
                        if (0 == m)throw new Error($ || "Parsing halted.");
                        e(1), m = r[r.length - 1]
                    }
                    d = g, g = y, m = r[r.length - 1], x = l[m] && l[m][y], u = 3
                }
                if (x[0]instanceof Array && x.length > 1)throw new Error("Parse Error: multiple actions possible at state: " + m + ", token: " + g);
                switch (x[0])
                {
                    case 1:
                        r.push(g), s.push(this.lexer.yytext), h.push(this.lexer.yylloc), r.push(x[1]), g = null, d ? (g = d, d = null) : (c = this.lexer.yyleng, o = this.lexer.yytext, a = this.lexer.yylineno, f = this.lexer.yylloc, u > 0 && u--);
                        break;
                    case 2:
                        if (E = this.productions_[x[1]][1], v.$ = s[s.length - E], v._$ = {
                                first_line: h[h.length - (E || 1)].first_line,
                                last_line: h[h.length - 1].last_line,
                                first_column: h[h.length - (E || 1)].first_column,
                                last_column: h[h.length - 1].last_column
                            }, _ = this.performAction.call(v, o, c, a, this.yy, x[1], s, h), "undefined" != typeof _)
                        {
                            return _;
                        }
                        E && (r = r.slice(0, -1 * E * 2), s = s.slice(0, -1 * E), h = h.slice(0, -1 * E)), r.push(this.productions_[x[1]][0]), s.push(v.$), h.push(v._$), S = l[r[r.length - 2]][r[r.length - 1]], r.push(S);
                        break;
                    case 3:
                        return !0
                }
            }
            return !0
        }
    }, e = function ()
    {
        var t = {
            EOF: 1, parseError: function (t, e)
            {
                if (!this.yy.parseError)throw new Error(t);
                this.yy.parseError(t, e)
            }, setInput: function (t)
            {
                return this._input = t, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                }, this
            }, input: function ()
            {
                var t = this._input[0];
                this.yytext += t, this.yyleng++, this.match += t, this.matched += t;
                var e = t.match(/\n/);
                return e && this.yylineno++, this._input = this._input.slice(1), t
            }, unput: function (t)
            {
                return this._input = t + this._input, this
            }, more: function ()
            {
                return this._more = !0, this
            }, less: function (t)
            {
                this._input = this.match.slice(t) + this._input
            }, pastInput: function ()
            {
                var t = this.matched.substr(0, this.matched.length - this.match.length);
                return (t.length > 20 ? "..." : "") + t.substr(-20).replace(/\n/g, "")
            }, upcomingInput: function ()
            {
                var t = this.match;
                return t.length < 20 && (t += this._input.substr(0, 20 - t.length)), (t.substr(0, 20) + (t.length > 20 ? "..." : "")).replace(/\n/g, "")
            }, showPosition: function ()
            {
                var t = this.pastInput(), e = new Array(t.length + 1).join("-");
                return t + this.upcomingInput() + "\n" + e + "^"
            }, next: function ()
            {
                if (this.done)return this.EOF;
                this._input || (this.done = !0);
                var t, e, i, n, r;
                this._more || (this.yytext = "", this.match = "");
                for (var s = this._currentRules(), h = 0; h < s.length && (i = this._input.match(this.rules[s[h]]), !i || e && !(i[0].length > e[0].length) || (e = i, n = h, this.options.flex)); h++);
                return e ? (r = e[0].match(/\n.*/g), r && (this.yylineno += r.length), this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: r ? r[r.length - 1].length - 1 : this.yylloc.last_column + e[0].length
                }, this.yytext += e[0], this.match += e[0], this.yyleng = this.yytext.length, this._more = !1, this._input = this._input.slice(e[0].length), this.matched += e[0], t = this.performAction.call(this, this.yy, this, s[n], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), t ? t : void 0) : "" === this._input ? this.EOF : void this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                    text: "",
                    token: null,
                    line: this.yylineno
                })
            }, lex: function ()
            {
                var t = this.next();
                return "undefined" != typeof t ? t : this.lex()
            }, begin: function (t)
            {
                this.conditionStack.push(t)
            }, popState: function ()
            {
                return this.conditionStack.pop()
            }, _currentRules: function ()
            {
                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            }, topState: function ()
            {
                return this.conditionStack[this.conditionStack.length - 2]
            }, pushState: function (t)
            {
                this.begin(t)
            }
        };
        return t.options = {}, t.performAction = function (t, e, i, n)
        {
            switch (i)
            {
                case 0:
                    break;
                case 1:
                    return 6;
                case 2:
                    return e.yytext = e.yytext.substr(1, e.yyleng - 2), 4;
                case 3:
                    return 17;
                case 4:
                    return 18;
                case 5:
                    return 23;
                case 6:
                    return 24;
                case 7:
                    return 22;
                case 8:
                    return 21;
                case 9:
                    return 10;
                case 10:
                    return 11;
                case 11:
                    return 8;
                case 12:
                    return 14;
                case 13:
                    return "INVALID"
            }
        }, t.rules = [/^(?:\s+)/, /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/, /^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/, /^(?:\{)/, /^(?:\})/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?::)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:$)/, /^(?:.)/], t.conditions = {
            INITIAL: {
                rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                inclusive: !0
            }
        }, t
    }();
    return t.lexer = e, t
}();
"undefined" != typeof require && "undefined" != typeof exports && (exports.parser = jsonlint, exports.parse = function ()
{
    return jsonlint.parse.apply(jsonlint, arguments)
}, exports.main = function (t)
{
    if (!t[1])throw new Error("Usage: " + t[0] + " FILE");
    if ("undefined" != typeof process)
    {
        var e = require("fs").readFileSync(require("path").join(process.cwd(), t[1]), "utf8");
    }
    else
    {
        var i = require("file").path(require("file").cwd()), e = i.join(t[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(e)
}, "undefined" != typeof module && require.main === module && exports.main("undefined" != typeof process ? process.argv.slice(1) : require("system").args));