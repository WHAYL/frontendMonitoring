define((function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign$1.apply(this, arguments);
    };
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {
          label: 0,
          sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: []
        },
        f,
        y,
        t,
        g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;
      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    }
    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var MYSTORAGE_COUNT = 100;
    var IMMEDIATE_REPORT_LEVEL = "ERROR";
    function e(e, r, t) {
      return Object.fromEntries(e.map(function (e) {
        return [String(e[r]), e[t]];
      }));
    }
    function t$1(e, r, t, n) {
      return new (t || (t = Promise))(function (i, o) {
        function a(e) {
          try {
            c(n.next(e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          try {
            c(n.throw(e));
          } catch (e) {
            o(e);
          }
        }
        function c(e) {
          var r;
          e.done ? i(e.value) : (r = e.value, r instanceof t ? r : new t(function (e) {
            e(r);
          })).then(a, u);
        }
        c((n = n.apply(e, [])).next());
      });
    }
    function n$1(e, r) {
      var t,
        n,
        i,
        o = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        },
        a = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
      return a.next = u(0), a.throw = u(1), a.return = u(2), "function" == typeof Symbol && (a[Symbol.iterator] = function () {
        return this;
      }), a;
      function u(u) {
        return function (c) {
          return function (u) {
            if (t) throw new TypeError("Generator is already executing.");
            for (; a && (a = 0, u[0] && (o = 0)), o;) try {
              if (t = 1, n && (i = 2 & u[0] ? n.return : u[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, u[1])).done) return i;
              switch (n = 0, i && (u = [2 & u[0], i.value]), u[0]) {
                case 0:
                case 1:
                  i = u;
                  break;
                case 4:
                  return o.label++, {
                    value: u[1],
                    done: !1
                  };
                case 5:
                  o.label++, n = u[1], u = [0];
                  continue;
                case 7:
                  u = o.ops.pop(), o.trys.pop();
                  continue;
                default:
                  if (!(i = o.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
                    o = 0;
                    continue;
                  }
                  if (3 === u[0] && (!i || u[1] > i[0] && u[1] < i[3])) {
                    o.label = u[1];
                    break;
                  }
                  if (6 === u[0] && o.label < i[1]) {
                    o.label = i[1], i = u;
                    break;
                  }
                  if (i && o.label < i[2]) {
                    o.label = i[2], o.ops.push(u);
                    break;
                  }
                  i[2] && o.ops.pop(), o.trys.pop();
                  continue;
              }
              u = r.call(e, o);
            } catch (e) {
              u = [6, e], n = 0;
            } finally {
              t = i = 0;
            }
            if (5 & u[0]) throw u[1];
            return {
              value: u[0] ? u[1] : void 0,
              done: true
            };
          }([u, c]);
        };
      }
    }
    function i$1(e) {
      var r = "function" == typeof Symbol && Symbol.iterator,
        t = r && e[r],
        n = 0;
      if (t) return t.call(e);
      if (e && "number" == typeof e.length) return {
        next: function () {
          return e && n >= e.length && (e = void 0), {
            value: e && e[n++],
            done: !e
          };
        }
      };
      throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function o$1(e, r) {
      var t = "function" == typeof Symbol && e[Symbol.iterator];
      if (!t) return e;
      var n,
        i,
        o = t.call(e),
        a = [];
      try {
        for (; (void 0 === r || r-- > 0) && !(n = o.next()).done;) a.push(n.value);
      } catch (e) {
        i = {
          error: e
        };
      } finally {
        try {
          n && !n.done && (t = o.return) && t.call(o);
        } finally {
          if (i) throw i.error;
        }
      }
      return a;
    }
    function a$1(e, r, t) {
      if (2 === arguments.length) for (var n, i = 0, o = r.length; i < o; i++) !n && i in r || (n || (n = Array.prototype.slice.call(r, 0, i)), n[i] = r[i]);
      return e.concat(n || Array.prototype.slice.call(r));
    }
    "function" == typeof SuppressedError && SuppressedError, Function.prototype.after = function (e) {
      var r = this;
      return function () {
        for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
        return t$1(this, void 0, void 0, function () {
          var t;
          return n$1(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, Promise.resolve(r.apply(void 0, a$1([], o$1(i), false)))];
              case 1:
                return t = n.sent(), e(), [2, t];
            }
          });
        });
      };
    }, Function.prototype.before = function (e) {
      var r = this;
      return function () {
        for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
        return t$1(this, void 0, void 0, function () {
          return n$1(this, function (t) {
            switch (t.label) {
              case 0:
                return e(), [4, Promise.resolve(r.apply(void 0, a$1([], o$1(i), false)))];
              case 1:
                return [2, t.sent()];
            }
          });
        });
      };
    };
    var I$1 = "__lodash_hash_undefined__",
      k$1 = 9007199254740991,
      F$1 = "[object Arguments]",
      W$1 = "[object Boolean]",
      C$1 = "[object Date]",
      $$1 = "[object Function]",
      V$1 = "[object GeneratorFunction]",
      K$1 = "[object Map]",
      B$1 = "[object Number]",
      R$1 = "[object Object]",
      q$1 = "[object Promise]",
      L$1 = "[object RegExp]",
      H$1 = "[object Set]",
      U$1 = "[object String]",
      z$1 = "[object Symbol]",
      G$1 = "[object WeakMap]",
      X$1 = "[object ArrayBuffer]",
      Y$1 = "[object DataView]",
      J$1 = "[object Float32Array]",
      Z$1 = "[object Float64Array]",
      Q$1 = "[object Int8Array]",
      ee$1 = "[object Int16Array]",
      re$1 = "[object Int32Array]",
      te$1 = "[object Uint8Array]",
      ne$1 = "[object Uint8ClampedArray]",
      ie$1 = "[object Uint16Array]",
      oe$1 = "[object Uint32Array]",
      ae$1 = /\w*$/,
      ue$1 = /^\[object .+?Constructor\]$/,
      ce$1 = /^(?:0|[1-9]\d*)$/,
      le$1 = {};
    le$1[F$1] = le$1["[object Array]"] = le$1[X$1] = le$1[Y$1] = le$1[W$1] = le$1[C$1] = le$1[J$1] = le$1[Z$1] = le$1[Q$1] = le$1[ee$1] = le$1[re$1] = le$1[K$1] = le$1[B$1] = le$1[R$1] = le$1[L$1] = le$1[H$1] = le$1[U$1] = le$1[z$1] = le$1[te$1] = le$1[ne$1] = le$1[ie$1] = le$1[oe$1] = true, le$1["[object Error]"] = le$1[$$1] = le$1[G$1] = false;
    var se$1 = "object" == typeof global && global && global.Object === Object && global,
      fe$1 = "object" == typeof self && self && self.Object === Object && self,
      ve$1 = se$1 || fe$1 || Function("return this")(),
      de$1 = "object" == typeof exports && exports && !exports.nodeType && exports,
      he$1 = de$1 && "object" == typeof module && module && !module.nodeType && module,
      pe$1 = he$1 && he$1.exports === de$1;
    function ye$1(e, r) {
      return e.set(r[0], r[1]), e;
    }
    function ge$1(e, r) {
      return e.add(r), e;
    }
    function me$1(e, r, t, n) {
      for (var i = -1, o = e ? e.length : 0; ++i < o;) t = r(t, e[i], i, e);
      return t;
    }
    function we$1(e) {
      var r = false;
      if (null != e && "function" != typeof e.toString) try {
        r = !!(e + "");
      } catch (e) {}
      return r;
    }
    function be$1(e) {
      var r = -1,
        t = Array(e.size);
      return e.forEach(function (e, n) {
        t[++r] = [n, e];
      }), t;
    }
    function _e$1(e, r) {
      return function (t) {
        return e(r(t));
      };
    }
    function Ne$1(e) {
      var r = -1,
        t = Array(e.size);
      return e.forEach(function (e) {
        t[++r] = e;
      }), t;
    }
    var Ae$1,
      Se$1 = Array.prototype,
      Ee$1 = Function.prototype,
      Me$1 = Object.prototype,
      je$1 = ve$1["__core-js_shared__"],
      Te$1 = (Ae$1 = /[^.]+$/.exec(je$1 && je$1.keys && je$1.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Ae$1 : "",
      xe$1 = Ee$1.toString,
      Oe$1 = Me$1.hasOwnProperty,
      Pe$1 = Me$1.toString,
      De$1 = RegExp("^" + xe$1.call(Oe$1).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
      Ie$1 = pe$1 ? ve$1.Buffer : void 0,
      ke$1 = ve$1.Symbol,
      Fe$1 = ve$1.Uint8Array,
      We$1 = _e$1(Object.getPrototypeOf, Object),
      Ce$1 = Object.create,
      $e$1 = Me$1.propertyIsEnumerable,
      Ve$1 = Se$1.splice,
      Ke$1 = Object.getOwnPropertySymbols,
      Be$1 = Ie$1 ? Ie$1.isBuffer : void 0,
      Re$1 = _e$1(Object.keys, Object),
      qe$1 = hr$1(ve$1, "DataView"),
      Le$1 = hr$1(ve$1, "Map"),
      He$1 = hr$1(ve$1, "Promise"),
      Ue$1 = hr$1(ve$1, "Set"),
      ze$1 = hr$1(ve$1, "WeakMap"),
      Ge$1 = hr$1(Object, "create"),
      Xe$1 = wr$1(qe$1),
      Ye$1 = wr$1(Le$1),
      Je$1 = wr$1(He$1),
      Ze$1 = wr$1(Ue$1),
      Qe$1 = wr$1(ze$1),
      er$1 = ke$1 ? ke$1.prototype : void 0,
      rr$1 = er$1 ? er$1.valueOf : void 0;
    function tr$1(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function nr$1(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function ir$1(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function or$1(e) {
      this.__data__ = new nr$1(e);
    }
    function ar$1(e, r) {
      var t = _r$1(e) || function (e) {
          return function (e) {
            return function (e) {
              return !!e && "object" == typeof e;
            }(e) && Nr$1(e);
          }(e) && Oe$1.call(e, "callee") && (!$e$1.call(e, "callee") || Pe$1.call(e) == F$1);
        }(e) ? function (e, r) {
          for (var t = -1, n = Array(e); ++t < e;) n[t] = r(t);
          return n;
        }(e.length, String) : [],
        n = t.length,
        i = !!n;
      for (var o in e) !Oe$1.call(e, o) || i && ("length" == o || gr$1(o, n)) || t.push(o);
      return t;
    }
    function ur$1(e, r, t) {
      var n = e[r];
      Oe$1.call(e, r) && br$1(n, t) && (void 0 !== t || r in e) || (e[r] = t);
    }
    function cr$1(e, r) {
      for (var t = e.length; t--;) if (br$1(e[t][0], r)) return t;
      return -1;
    }
    function lr$1(e, r, t, n, i, o, a) {
      var u;
      if (n && (u = o ? n(e, i, o, a) : n(e)), void 0 !== u) return u;
      if (!Er$1(e)) return e;
      var c = _r$1(e);
      if (c) {
        if (u = function (e) {
          var r = e.length,
            t = e.constructor(r);
          r && "string" == typeof e[0] && Oe$1.call(e, "index") && (t.index = e.index, t.input = e.input);
          return t;
        }(e), !r) return function (e, r) {
          var t = -1,
            n = e.length;
          r || (r = Array(n));
          for (; ++t < n;) r[t] = e[t];
          return r;
        }(e, u);
      } else {
        var l = yr$1(e),
          s = l == $$1 || l == V$1;
        if (Ar$1(e)) return function (e, r) {
          if (r) return e.slice();
          var t = new e.constructor(e.length);
          return e.copy(t), t;
        }(e, r);
        if (l == R$1 || l == F$1 || s && !o) {
          if (we$1(e)) return o ? e : {};
          if (u = function (e) {
            return "function" != typeof e.constructor || mr$1(e) ? {} : (r = We$1(e), Er$1(r) ? Ce$1(r) : {});
            var r;
          }(s ? {} : e), !r) return function (e, r) {
            return vr$1(e, pr$1(e), r);
          }(e, function (e, r) {
            return e && vr$1(r, Mr$1(r), e);
          }(u, e));
        } else {
          if (!le$1[l]) return o ? e : {};
          u = function (e, r, t, n) {
            var i = e.constructor;
            switch (r) {
              case X$1:
                return fr$1(e);
              case W$1:
              case C$1:
                return new i(+e);
              case Y$1:
                return function (e, r) {
                  var t = r ? fr$1(e.buffer) : e.buffer;
                  return new e.constructor(t, e.byteOffset, e.byteLength);
                }(e, n);
              case J$1:
              case Z$1:
              case Q$1:
              case ee$1:
              case re$1:
              case te$1:
              case ne$1:
              case ie$1:
              case oe$1:
                return function (e, r) {
                  var t = r ? fr$1(e.buffer) : e.buffer;
                  return new e.constructor(t, e.byteOffset, e.length);
                }(e, n);
              case K$1:
                return function (e, r, t) {
                  var n = r ? t(be$1(e), true) : be$1(e);
                  return me$1(n, ye$1, new e.constructor());
                }(e, n, t);
              case B$1:
              case U$1:
                return new i(e);
              case L$1:
                return function (e) {
                  var r = new e.constructor(e.source, ae$1.exec(e));
                  return r.lastIndex = e.lastIndex, r;
                }(e);
              case H$1:
                return function (e, r, t) {
                  var n = r ? t(Ne$1(e), true) : Ne$1(e);
                  return me$1(n, ge$1, new e.constructor());
                }(e, n, t);
              case z$1:
                return o = e, rr$1 ? Object(rr$1.call(o)) : {};
            }
            var o;
          }(e, l, lr$1, r);
        }
      }
      a || (a = new or$1());
      var f = a.get(e);
      if (f) return f;
      if (a.set(e, u), !c) var v = t ? function (e) {
        return function (e, r, t) {
          var n = r(e);
          return _r$1(e) ? n : function (e, r) {
            for (var t = -1, n = r.length, i = e.length; ++t < n;) e[i + t] = r[t];
            return e;
          }(n, t(e));
        }(e, Mr$1, pr$1);
      }(e) : Mr$1(e);
      return function (e, r) {
        for (var t = -1, n = e ? e.length : 0; ++t < n && false !== r(e[t], t, e););
      }(v || e, function (i, o) {
        v && (i = e[o = i]), ur$1(u, o, lr$1(i, r, t, n, o, e, a));
      }), u;
    }
    function sr$1(e) {
      return !(!Er$1(e) || (r = e, Te$1 && Te$1 in r)) && (Sr$1(e) || we$1(e) ? De$1 : ue$1).test(wr$1(e));
      var r;
    }
    function fr$1(e) {
      var r = new e.constructor(e.byteLength);
      return new Fe$1(r).set(new Fe$1(e)), r;
    }
    function vr$1(e, r, t, n) {
      t || (t = {});
      for (var i = -1, o = r.length; ++i < o;) {
        var a = r[i];
        ur$1(t, a, e[a]);
      }
      return t;
    }
    function dr$1(e, r) {
      var t,
        n,
        i = e.__data__;
      return ("string" == (n = typeof (t = r)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== t : null === t) ? i["string" == typeof r ? "string" : "hash"] : i.map;
    }
    function hr$1(e, r) {
      var t = function (e, r) {
        return null == e ? void 0 : e[r];
      }(e, r);
      return sr$1(t) ? t : void 0;
    }
    tr$1.prototype.clear = function () {
      this.__data__ = Ge$1 ? Ge$1(null) : {};
    }, tr$1.prototype.delete = function (e) {
      return this.has(e) && delete this.__data__[e];
    }, tr$1.prototype.get = function (e) {
      var r = this.__data__;
      if (Ge$1) {
        var t = r[e];
        return t === I$1 ? void 0 : t;
      }
      return Oe$1.call(r, e) ? r[e] : void 0;
    }, tr$1.prototype.has = function (e) {
      var r = this.__data__;
      return Ge$1 ? void 0 !== r[e] : Oe$1.call(r, e);
    }, tr$1.prototype.set = function (e, r) {
      return this.__data__[e] = Ge$1 && void 0 === r ? I$1 : r, this;
    }, nr$1.prototype.clear = function () {
      this.__data__ = [];
    }, nr$1.prototype.delete = function (e) {
      var r = this.__data__,
        t = cr$1(r, e);
      return !(t < 0) && (t == r.length - 1 ? r.pop() : Ve$1.call(r, t, 1), true);
    }, nr$1.prototype.get = function (e) {
      var r = this.__data__,
        t = cr$1(r, e);
      return t < 0 ? void 0 : r[t][1];
    }, nr$1.prototype.has = function (e) {
      return cr$1(this.__data__, e) > -1;
    }, nr$1.prototype.set = function (e, r) {
      var t = this.__data__,
        n = cr$1(t, e);
      return n < 0 ? t.push([e, r]) : t[n][1] = r, this;
    }, ir$1.prototype.clear = function () {
      this.__data__ = {
        hash: new tr$1(),
        map: new (Le$1 || nr$1)(),
        string: new tr$1()
      };
    }, ir$1.prototype.delete = function (e) {
      return dr$1(this, e).delete(e);
    }, ir$1.prototype.get = function (e) {
      return dr$1(this, e).get(e);
    }, ir$1.prototype.has = function (e) {
      return dr$1(this, e).has(e);
    }, ir$1.prototype.set = function (e, r) {
      return dr$1(this, e).set(e, r), this;
    }, or$1.prototype.clear = function () {
      this.__data__ = new nr$1();
    }, or$1.prototype.delete = function (e) {
      return this.__data__.delete(e);
    }, or$1.prototype.get = function (e) {
      return this.__data__.get(e);
    }, or$1.prototype.has = function (e) {
      return this.__data__.has(e);
    }, or$1.prototype.set = function (e, r) {
      var t = this.__data__;
      if (t instanceof nr$1) {
        var n = t.__data__;
        if (!Le$1 || n.length < 199) return n.push([e, r]), this;
        t = this.__data__ = new ir$1(n);
      }
      return t.set(e, r), this;
    };
    var pr$1 = Ke$1 ? _e$1(Ke$1, Object) : function () {
        return [];
      },
      yr$1 = function (e) {
        return Pe$1.call(e);
      };
    function gr$1(e, r) {
      return !!(r = null == r ? k$1 : r) && ("number" == typeof e || ce$1.test(e)) && e > -1 && e % 1 == 0 && e < r;
    }
    function mr$1(e) {
      var r = e && e.constructor;
      return e === ("function" == typeof r && r.prototype || Me$1);
    }
    function wr$1(e) {
      if (null != e) {
        try {
          return xe$1.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function br$1(e, r) {
      return e === r || e != e && r != r;
    }
    (qe$1 && yr$1(new qe$1(new ArrayBuffer(1))) != Y$1 || Le$1 && yr$1(new Le$1()) != K$1 || He$1 && yr$1(He$1.resolve()) != q$1 || Ue$1 && yr$1(new Ue$1()) != H$1 || ze$1 && yr$1(new ze$1()) != G$1) && (yr$1 = function (e) {
      var r = Pe$1.call(e),
        t = r == R$1 ? e.constructor : void 0,
        n = t ? wr$1(t) : void 0;
      if (n) switch (n) {
        case Xe$1:
          return Y$1;
        case Ye$1:
          return K$1;
        case Je$1:
          return q$1;
        case Ze$1:
          return H$1;
        case Qe$1:
          return G$1;
      }
      return r;
    });
    var _r$1 = Array.isArray;
    function Nr$1(e) {
      return null != e && function (e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && e <= k$1;
      }(e.length) && !Sr$1(e);
    }
    var Ar$1 = Be$1 || function () {
      return false;
    };
    function Sr$1(e) {
      var r = Er$1(e) ? Pe$1.call(e) : "";
      return r == $$1 || r == V$1;
    }
    function Er$1(e) {
      var r = typeof e;
      return !!e && ("object" == r || "function" == r);
    }
    function Mr$1(e) {
      return Nr$1(e) ? ar$1(e) : function (e) {
        if (!mr$1(e)) return Re$1(e);
        var r = [];
        for (var t in Object(e)) Oe$1.call(e, t) && "constructor" != t && r.push(t);
        return r;
      }(e);
    }
    var jr$1 = function (e) {
      return lr$1(e, true, true);
    };
    function Or$1(e, r, t, n, i, o) {
      o = void 0 !== o && o, n = void 0 === n || o, Object.defineProperty(e, r, {
        value: t,
        enumerable: false,
        writable: n,
        configurable: o
      });
    }
    var Pr$1,
      Dr$1 = Array.prototype,
      Ir$1 = Object.create(Dr$1),
      kr$1 = "undefined" != typeof Proxy && "function" == typeof (Pr$1 = Proxy) && /native code/.test(Pr$1.toString()),
      Wr$1 = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
    Wr$1.forEach(function (e) {
      var r = Dr$1[e];
      Or$1(Ir$1, e, function () {
        for (var t, n, o, a, u, c, l, s, f, v, d, h, p, y, g, m, w, b, _, N, A = [], S = arguments.length; S--;) A[S] = arguments[S];
        var E = jr$1(this),
          M = r.apply(this, A);
        if (this.__obc__) if (["push", "pop"].includes(e) && !kr$1) {
          var j = this.__obc__.csKeyMap.get(this),
            T = (null == j ? void 0 : j.labelKey) + "." + (null == j ? void 0 : j.key) + ((null == j ? void 0 : j.key) ? "." : "");
          try {
            for (var x = i$1(this.__obc__.myWaMap), O = x.next(); !O.done; O = x.next()) {
              var P = O.value;
              T.startsWith(P[0]) && ((null === (c = null === (u = P[1]) || void 0 === u ? void 0 : u.props) || void 0 === c ? void 0 : c.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (s = null === (l = P[1]) || void 0 === l ? void 0 : l.props) || void 0 === s ? void 0 : s.deep) ? !(null === (v = null === (f = P[1]) || void 0 === f ? void 0 : f.props) || void 0 === v ? void 0 : v.run) && P[1].fun(this, E) : !(null === (h = null === (d = P[1]) || void 0 === d ? void 0 : d.props) || void 0 === h ? void 0 : h.run) && T === P[0] && P[1].fun(this, E));
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              O && !O.done && (n = x.return) && n.call(x);
            } finally {
              if (t) throw t.error;
            }
          }
        } else try {
          for (var D = i$1(this.__obc__.myWaMap), I = D.next(); !I.done; I = D.next()) {
            P = I.value;
            this.__obc__.currKey.value.startsWith(P[0]) && ((null === (y = null === (p = P[1]) || void 0 === p ? void 0 : p.props) || void 0 === y ? void 0 : y.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (m = null === (g = P[1]) || void 0 === g ? void 0 : g.props) || void 0 === m ? void 0 : m.deep) ? !(null === (b = null === (w = P[1]) || void 0 === w ? void 0 : w.props) || void 0 === b ? void 0 : b.run) && P[1].fun(this, E) : !(null === (N = null === (_ = P[1]) || void 0 === _ ? void 0 : _.props) || void 0 === N ? void 0 : N.run) && this.__obc__.currKey.value === P[0] && P[1].fun(this, E));
          }
        } catch (e) {
          o = {
            error: e
          };
        } finally {
          try {
            I && !I.done && (a = D.return) && a.call(D);
          } finally {
            if (o) throw o.error;
          }
        }
        return M;
      });
    });
    var LogCategory = [{
      label: '其他',
      key: 'oth',
      value: 0
    }, {
      label: '页面生命周期',
      key: 'pageLifecycle',
      value: 1
    }, {
      label: 'js错误，未处理的Promise，console.error',
      key: 'error',
      value: 2
    }, {
      label: 'xhr,fetch请求信息',
      key: 'xhrFetch',
      value: 3
    }, {
      label: '页面性能相关数据',
      key: 'pagePerformance',
      value: 4
    }, {
      label: '系统相关访问数据',
      key: 'osView',
      value: 5
    }, {
      label: '资源加载信息',
      key: 'resource',
      value: 6
    }, {
      label: '用户行为',
      key: 'userBehavior',
      value: 7
    }];
    var LogCategoryKeyValue = e(LogCategory, 'key', 'value');
    var ReportLevelEnum;
    (function (ReportLevelEnum) {
      ReportLevelEnum[ReportLevelEnum["ERROR"] = 0] = "ERROR";
      ReportLevelEnum[ReportLevelEnum["WARN"] = 1] = "WARN";
      ReportLevelEnum[ReportLevelEnum["INFO"] = 2] = "INFO";
      ReportLevelEnum[ReportLevelEnum["DEBUG"] = 3] = "DEBUG";
      ReportLevelEnum[ReportLevelEnum["OFF"] = 4] = "OFF";
    })(ReportLevelEnum || (ReportLevelEnum = {}));

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    var FrontendMonitor = function () {
      function FrontendMonitor() {
        this.config = {
          reportLevel: IMMEDIATE_REPORT_LEVEL,
          enabled: true,
          maxStorageCount: MYSTORAGE_COUNT,
          uploadHandler: null,
          platform: ''
        };
        this.storageQueue = [];
        this.removedItems = [];
        this.fingerprint = '';
        this.oldFingerprint = '';
      }
      FrontendMonitor.prototype.init = function (config) {
        var _a;
        this.config = Object.assign(this.config, config);
        this.fingerprint = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.fingerprint) || "";
      };
      FrontendMonitor.prototype.getConfig = function () {
        return __assign({}, this.config);
      };
      FrontendMonitor.prototype.updateConfig = function (newConfig) {
        var oldConfig = __assign({}, this.config);
        this.config = Object.assign(this.config, newConfig);
        if (oldConfig.reportLevel !== this.config.reportLevel) {
          this.checkAndReportStored();
        }
        if (oldConfig.fingerprint !== this.config.fingerprint && this.config.fingerprint) {
          this.setFingerprint(this.config.fingerprint);
        }
      };
      FrontendMonitor.prototype.getFingerprint = function () {
        return this.fingerprint;
      };
      FrontendMonitor.prototype.setFingerprint = function (fingerprint) {
        this.oldFingerprint = this.fingerprint;
        this.fingerprint = fingerprint;
      };
      FrontendMonitor.prototype.log = function (info) {
        if (!this.config.enabled) {
          return;
        }
        var errorInfo = __assign(__assign({}, info), {
          fingerprint: this.fingerprint,
          oldFingerprint: this.oldFingerprint,
          platform: this.config.platform
        });
        if (ReportLevelEnum[info.level] <= ReportLevelEnum[this.config.reportLevel]) {
          this.report(errorInfo);
        } else {
          this.storageQueue.push(errorInfo);
          if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
            var data = this.storageQueue.shift();
            if (data) {
              if (this.removedItems.length > (this.config.maxStorageCount || MYSTORAGE_COUNT) && this.removedItems.length) {
                this.report(this.removedItems);
                this.removedItems = [];
              }
              this.removedItems.push(data);
            }
          }
        }
      };
      FrontendMonitor.prototype.reportInfo = function (level, info) {
        this.log(__assign(__assign({}, info), {
          level: level
        }));
      };
      FrontendMonitor.prototype.checkAndReportStored = function () {
        var _this = this;
        var reportableItems = this.storageQueue.filter(function (item) {
          return ReportLevelEnum[item.level] <= ReportLevelEnum[_this.config.reportLevel];
        });
        if (reportableItems.length > 0) {
          reportableItems.forEach(function (item) {
            return _this.report(item);
          });
          this.storageQueue = this.storageQueue.filter(function (item) {
            return ReportLevelEnum[item.level] > ReportLevelEnum[_this.config.reportLevel];
          });
        }
      };
      FrontendMonitor.prototype.updateReportLevel = function (level) {
        this.config.reportLevel = level;
        this.checkAndReportStored();
      };
      FrontendMonitor.prototype.getStorageQueue = function () {
        return this.storageQueue;
      };
      FrontendMonitor.prototype.clearStorageQueue = function () {
        this.storageQueue = [];
      };
      FrontendMonitor.prototype.reportStorageQueue = function () {
        if (this.storageQueue.length > 0) {
          this.report(this.storageQueue);
          this.clearStorageQueue();
        }
      };
      FrontendMonitor.prototype.reportRemovedItems = function () {
        if (this.removedItems.length > 0) {
          this.report(this.removedItems);
          this.removedItems = [];
        }
      };
      FrontendMonitor.prototype.reportRestInfo = function () {
        this.reportStorageQueue();
        this.reportRemovedItems();
      };
      FrontendMonitor.prototype.report = function (errorInfo) {
        if (typeof this.config.uploadHandler === 'function') {
          try {
            this.config.uploadHandler(errorInfo);
          } catch (err) {
            console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
          }
        } else {
          console.log("[Frontend Monitor] : ".concat(JSON.stringify(errorInfo)));
        }
      };
      FrontendMonitor.prototype.destroy = function () {
        this.clearStorageQueue();
      };
      return FrontendMonitor;
    }();

    function getTimestamp() {
        return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
            ? performance.now() + performance.timeOrigin
            : Date.now();
    }
    function formatTimestamp(format, timestamp) {
        if (format === void 0) { format = 'YYYY/MM/DD hh:mm:ss.SSS'; }
        var ts = typeof timestamp === 'number' ? timestamp : getTimestamp();
        var d = new Date(Math.floor(ts));
        var pad = function (n, len) {
            if (len === void 0) { len = 2; }
            return n.toString().padStart(len, '0');
        };
        var year = d.getFullYear().toString();
        var month = pad(d.getMonth() + 1);
        var day = pad(d.getDate());
        var hour = pad(d.getHours());
        var minute = pad(d.getMinutes());
        var second = pad(d.getSeconds());
        var ms = pad(d.getMilliseconds(), 3);
        return format
            .replace(/YYYY/g, year)
            .replace(/MM/g, month)
            .replace(/DD/g, day)
            .replace(/hh/g, hour)
            .replace(/mm/g, minute)
            .replace(/ss/g, second)
            .replace(/SSS/g, ms);
    }
    function getQueryString(options) {
        if (options === void 0) { options = {}; }
        var queryString = '';
        if (options && Object.keys(options).length > 0) {
            var params_1 = [];
            Object.entries(options).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                params_1.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
            });
            queryString = '?' + params_1.join('&');
        }
        return queryString;
    }
    function arrayAt(arr, index) {
        if (index >= 0) {
            return arr[index];
        }
        else {
            return arr[arr.length + index];
        }
    }
    function getUniCurrentPages(data) {
        var _a = ({}).index, index = _a === void 0 ? -1 : _a;
        var pages = getCurrentPages();
        if (!pages || pages.length === 0) {
            return {
                pages: [],
                page: 'No page found'
            };
        }
        var page = arrayAt(pages, index);
        if (!page) {
            return {
                pages: pages,
                page: 'No page found'
            };
        }
        var route = page.route, options = page.options;
        if (!route) {
            return {
                pages: pages,
                page: 'No page found'
            };
        }
        return {
            pages: pages,
            page: route + getQueryString(options)
        };
    }
    var DeviceInfo;
    function getDeviceInfo() {
        return new Promise(function (resolve) {
            if (DeviceInfo) {
                resolve(DeviceInfo);
            }
            else {
                uni.getSystemInfo({
                    success: function (res) {
                        DeviceInfo = res;
                        resolve(res);
                    }
                });
            }
        });
    }

    var ConsolePlugin = (function () {
        function ConsolePlugin(config) {
            if (config === void 0) { config = {}; }
            this.name = 'console';
            this.monitor = null;
            this.originalError = null;
            this.originalWarn = null;
            this.name = 'console';
            this.config = __assign$1({ error: true, warn: true }, config);
        }
        ConsolePlugin.prototype.init = function (monitor) {
            this.monitor = monitor;
            this.setupConsoleCapture();
        };
        ConsolePlugin.prototype.setupConsoleCapture = function () {
            var self = this;
            try {
                if (this.config.error === false && this.config.warn === false) {
                    return;
                }
                if (this.originalError || this.originalWarn) {
                    return;
                }
                if (this.config.error === true) {
                    this.originalError = console.error;
                    console.error = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        try {
                            var message = args.map(function (a) {
                                if (typeof a === 'string') {
                                    return a;
                                }
                                try {
                                    return JSON.stringify(a);
                                }
                                catch (_a) {
                                    return String(a);
                                }
                            }).join(' ');
                            var stack = (new Error()).stack;
                            var extraData = { args: args, stack: stack };
                            self.monitor && self.monitor.reportInfo('ERROR', {
                                logCategory: LogCategoryKeyValue.error,
                                pluginName: self.name,
                                message: message || 'console.error',
                                url: getUniCurrentPages().page,
                                extraData: extraData,
                                timestamp: getTimestamp(),
                                date: formatTimestamp()
                            });
                        }
                        catch (e) {
                        }
                        return self.originalError && self.originalError.apply(console, args);
                    };
                }
                if (this.config.warn === true) {
                    this.originalWarn = console.warn;
                    console.warn = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        try {
                            var message = args.map(function (a) {
                                if (typeof a === 'string') {
                                    return a;
                                }
                                try {
                                    return JSON.stringify(a);
                                }
                                catch (_a) {
                                    return String(a);
                                }
                            }).join(' ');
                            var stack = (new Error()).stack;
                            var extraData = { args: args, stack: stack };
                            self.monitor && self.monitor.reportInfo('WARN', {
                                logCategory: LogCategoryKeyValue.error,
                                pluginName: self.name,
                                message: message || 'console.warn',
                                url: getUniCurrentPages().page,
                                extraData: extraData,
                                timestamp: getTimestamp(),
                                date: formatTimestamp()
                            });
                        }
                        catch (e) {
                        }
                        return self.originalWarn && self.originalWarn.apply(console, args);
                    };
                }
            }
            catch (e) {
            }
        };
        ConsolePlugin.prototype.destroy = function () {
            try {
                if (this.originalError) {
                    console.error = this.originalError;
                    this.originalError = null;
                }
                if (this.originalWarn) {
                    console.warn = this.originalWarn;
                    this.originalWarn = null;
                }
            }
            catch (e) {
            }
            this.monitor = null;
        };
        return ConsolePlugin;
    }());

    var ErrorPlugin = (function () {
        function ErrorPlugin() {
            this.name = 'error';
            this.monitor = null;
            this.name = 'error';
        }
        ErrorPlugin.prototype.init = function (monitor) {
            this.monitor = monitor;
            var that = this;
            var methods = ['onError', 'onPageNotFound'];
            methods.forEach(function (methodName) {
                uni[methodName](function (err) {
                    that.monitor && that.monitor.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: that.name,
                        message: 'uni.' + methodName,
                        url: getUniCurrentPages().page,
                        extraData: err,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                });
            });
            this.h5ErrorHandler();
        };
        ErrorPlugin.prototype.h5ErrorHandler = function () {
            var _this = this;
            try {
                if (!window || !window.addEventListener) {
                    return;
                }
                this.abortController = new AbortController();
                var signal = this.abortController.signal;
                window.addEventListener('error', function (event) {
                    var extraData = {
                        message: event.message,
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        error: event.error,
                    };
                    _this.monitor.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: _this.name,
                        message: "JavaScript Error: ".concat(event.message),
                        url: window.location.href,
                        extraData: extraData,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                }, { signal: signal });
                window.addEventListener('unhandledrejection', function (event) {
                    var _a, _b, _c;
                    var extraData = {
                        type: event.type,
                        promise: event.promise,
                        reason: event.reason,
                        reasonType: typeof event.reason,
                        isError: event.reason instanceof Error,
                        errorMessage: (_a = event.reason) === null || _a === void 0 ? void 0 : _a.message,
                        errorStack: (_b = event.reason) === null || _b === void 0 ? void 0 : _b.stack,
                        errorName: (_c = event.reason) === null || _c === void 0 ? void 0 : _c.name,
                    };
                    _this.monitor.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: _this.name,
                        message: "Unhandled Promise Rejection: ".concat(event.reason),
                        url: window.location.href,
                        extraData: extraData,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                }, { signal: signal });
            }
            catch (error) {
            }
        };
        ErrorPlugin.prototype.destroy = function () {
            if (this.abortController) {
                this.abortController.abort();
                this.abortController = null;
            }
            this.monitor = null;
        };
        return ErrorPlugin;
    }());

    function t(e, r, t, n) {
      return new (t || (t = Promise))(function (i, o) {
        function a(e) {
          try {
            c(n.next(e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          try {
            c(n.throw(e));
          } catch (e) {
            o(e);
          }
        }
        function c(e) {
          var r;
          e.done ? i(e.value) : (r = e.value, r instanceof t ? r : new t(function (e) {
            e(r);
          })).then(a, u);
        }
        c((n = n.apply(e, [])).next());
      });
    }
    function n(e, r) {
      var t,
        n,
        i,
        o = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        },
        a = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
      return a.next = u(0), a.throw = u(1), a.return = u(2), "function" == typeof Symbol && (a[Symbol.iterator] = function () {
        return this;
      }), a;
      function u(u) {
        return function (c) {
          return function (u) {
            if (t) throw new TypeError("Generator is already executing.");
            for (; a && (a = 0, u[0] && (o = 0)), o;) try {
              if (t = 1, n && (i = 2 & u[0] ? n.return : u[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, u[1])).done) return i;
              switch (n = 0, i && (u = [2 & u[0], i.value]), u[0]) {
                case 0:
                case 1:
                  i = u;
                  break;
                case 4:
                  return o.label++, {
                    value: u[1],
                    done: !1
                  };
                case 5:
                  o.label++, n = u[1], u = [0];
                  continue;
                case 7:
                  u = o.ops.pop(), o.trys.pop();
                  continue;
                default:
                  if (!(i = o.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
                    o = 0;
                    continue;
                  }
                  if (3 === u[0] && (!i || u[1] > i[0] && u[1] < i[3])) {
                    o.label = u[1];
                    break;
                  }
                  if (6 === u[0] && o.label < i[1]) {
                    o.label = i[1], i = u;
                    break;
                  }
                  if (i && o.label < i[2]) {
                    o.label = i[2], o.ops.push(u);
                    break;
                  }
                  i[2] && o.ops.pop(), o.trys.pop();
                  continue;
              }
              u = r.call(e, o);
            } catch (e) {
              u = [6, e], n = 0;
            } finally {
              t = i = 0;
            }
            if (5 & u[0]) throw u[1];
            return {
              value: u[0] ? u[1] : void 0,
              done: true
            };
          }([u, c]);
        };
      }
    }
    function i(e) {
      var r = "function" == typeof Symbol && Symbol.iterator,
        t = r && e[r],
        n = 0;
      if (t) return t.call(e);
      if (e && "number" == typeof e.length) return {
        next: function () {
          return e && n >= e.length && (e = void 0), {
            value: e && e[n++],
            done: !e
          };
        }
      };
      throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function o(e, r) {
      var t = "function" == typeof Symbol && e[Symbol.iterator];
      if (!t) return e;
      var n,
        i,
        o = t.call(e),
        a = [];
      try {
        for (; (void 0 === r || r-- > 0) && !(n = o.next()).done;) a.push(n.value);
      } catch (e) {
        i = {
          error: e
        };
      } finally {
        try {
          n && !n.done && (t = o.return) && t.call(o);
        } finally {
          if (i) throw i.error;
        }
      }
      return a;
    }
    function a(e, r, t) {
      if (2 === arguments.length) for (var n, i = 0, o = r.length; i < o; i++) !n && i in r || (n || (n = Array.prototype.slice.call(r, 0, i)), n[i] = r[i]);
      return e.concat(n || Array.prototype.slice.call(r));
    }
    function u(e) {
      if (!Array.isArray(e)) throw new Error("EventEmitter(names:string[]):  names must be an array");
      var r = new Map(),
        t = function (r) {
          if (!e.includes(r)) throw new Error("Invalid event name: ".concat(r.toString(), ", must includes [").concat(e.toString(), "]"));
        },
        n = {
          getNames: function () {
            return e;
          },
          clearAll: function () {
            return r.clear();
          },
          on: function (e, n) {
            if (t(e), "function" != typeof n) throw new Error("on(eventName,listener) => listener: ".concat(n, ' for event "').concat(e.toString(), '" is not a function'));
            r.has(e) || r.set(e, new Set()), r.get(e).add(n);
          },
          off: function (e, n) {
            t(e);
            var i = r.get(e);
            i && (i.delete(n), 0 === i.size && r.delete(e));
          },
          emit: function (e) {
            for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
            t(e);
            var u = r.get(e);
            u && u.forEach(function (r) {
              try {
                r.apply(void 0, a([], o(n), !1));
              } catch (r) {
                console.error('Error in listener for event "'.concat(e.toString(), '":'), r);
              }
            });
          }
        };
      return n;
    }
    "function" == typeof SuppressedError && SuppressedError, Function.prototype.after = function (e) {
      var r = this;
      return function () {
        for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
        return t(this, void 0, void 0, function () {
          var t;
          return n(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, Promise.resolve(r.apply(void 0, a([], o(i), false)))];
              case 1:
                return t = n.sent(), e(), [2, t];
            }
          });
        });
      };
    }, Function.prototype.before = function (e) {
      var r = this;
      return function () {
        for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
        return t(this, void 0, void 0, function () {
          return n(this, function (t) {
            switch (t.label) {
              case 0:
                return e(), [4, Promise.resolve(r.apply(void 0, a([], o(i), false)))];
              case 1:
                return [2, t.sent()];
            }
          });
        });
      };
    };
    var I = "__lodash_hash_undefined__",
      k = 9007199254740991,
      F = "[object Arguments]",
      W = "[object Boolean]",
      C = "[object Date]",
      $ = "[object Function]",
      V = "[object GeneratorFunction]",
      K = "[object Map]",
      B = "[object Number]",
      R = "[object Object]",
      q = "[object Promise]",
      L = "[object RegExp]",
      H = "[object Set]",
      U = "[object String]",
      z = "[object Symbol]",
      G = "[object WeakMap]",
      X = "[object ArrayBuffer]",
      Y = "[object DataView]",
      J = "[object Float32Array]",
      Z = "[object Float64Array]",
      Q = "[object Int8Array]",
      ee = "[object Int16Array]",
      re = "[object Int32Array]",
      te = "[object Uint8Array]",
      ne = "[object Uint8ClampedArray]",
      ie = "[object Uint16Array]",
      oe = "[object Uint32Array]",
      ae = /\w*$/,
      ue = /^\[object .+?Constructor\]$/,
      ce = /^(?:0|[1-9]\d*)$/,
      le = {};
    le[F] = le["[object Array]"] = le[X] = le[Y] = le[W] = le[C] = le[J] = le[Z] = le[Q] = le[ee] = le[re] = le[K] = le[B] = le[R] = le[L] = le[H] = le[U] = le[z] = le[te] = le[ne] = le[ie] = le[oe] = true, le["[object Error]"] = le[$] = le[G] = false;
    var se = "object" == typeof global && global && global.Object === Object && global,
      fe = "object" == typeof self && self && self.Object === Object && self,
      ve = se || fe || Function("return this")(),
      de = "object" == typeof exports && exports && !exports.nodeType && exports,
      he = de && "object" == typeof module && module && !module.nodeType && module,
      pe = he && he.exports === de;
    function ye(e, r) {
      return e.set(r[0], r[1]), e;
    }
    function ge(e, r) {
      return e.add(r), e;
    }
    function me(e, r, t, n) {
      for (var i = -1, o = e ? e.length : 0; ++i < o;) t = r(t, e[i], i, e);
      return t;
    }
    function we(e) {
      var r = false;
      if (null != e && "function" != typeof e.toString) try {
        r = !!(e + "");
      } catch (e) {}
      return r;
    }
    function be(e) {
      var r = -1,
        t = Array(e.size);
      return e.forEach(function (e, n) {
        t[++r] = [n, e];
      }), t;
    }
    function _e(e, r) {
      return function (t) {
        return e(r(t));
      };
    }
    function Ne(e) {
      var r = -1,
        t = Array(e.size);
      return e.forEach(function (e) {
        t[++r] = e;
      }), t;
    }
    var Ae,
      Se = Array.prototype,
      Ee = Function.prototype,
      Me = Object.prototype,
      je = ve["__core-js_shared__"],
      Te = (Ae = /[^.]+$/.exec(je && je.keys && je.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Ae : "",
      xe = Ee.toString,
      Oe = Me.hasOwnProperty,
      Pe = Me.toString,
      De = RegExp("^" + xe.call(Oe).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
      Ie = pe ? ve.Buffer : void 0,
      ke = ve.Symbol,
      Fe = ve.Uint8Array,
      We = _e(Object.getPrototypeOf, Object),
      Ce = Object.create,
      $e = Me.propertyIsEnumerable,
      Ve = Se.splice,
      Ke = Object.getOwnPropertySymbols,
      Be = Ie ? Ie.isBuffer : void 0,
      Re = _e(Object.keys, Object),
      qe = hr(ve, "DataView"),
      Le = hr(ve, "Map"),
      He = hr(ve, "Promise"),
      Ue = hr(ve, "Set"),
      ze = hr(ve, "WeakMap"),
      Ge = hr(Object, "create"),
      Xe = wr(qe),
      Ye = wr(Le),
      Je = wr(He),
      Ze = wr(Ue),
      Qe = wr(ze),
      er = ke ? ke.prototype : void 0,
      rr = er ? er.valueOf : void 0;
    function tr(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function nr(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function ir(e) {
      var r = -1,
        t = e ? e.length : 0;
      for (this.clear(); ++r < t;) {
        var n = e[r];
        this.set(n[0], n[1]);
      }
    }
    function or(e) {
      this.__data__ = new nr(e);
    }
    function ar(e, r) {
      var t = _r(e) || function (e) {
          return function (e) {
            return function (e) {
              return !!e && "object" == typeof e;
            }(e) && Nr(e);
          }(e) && Oe.call(e, "callee") && (!$e.call(e, "callee") || Pe.call(e) == F);
        }(e) ? function (e, r) {
          for (var t = -1, n = Array(e); ++t < e;) n[t] = r(t);
          return n;
        }(e.length, String) : [],
        n = t.length,
        i = !!n;
      for (var o in e) !Oe.call(e, o) || i && ("length" == o || gr(o, n)) || t.push(o);
      return t;
    }
    function ur(e, r, t) {
      var n = e[r];
      Oe.call(e, r) && br(n, t) && (void 0 !== t || r in e) || (e[r] = t);
    }
    function cr(e, r) {
      for (var t = e.length; t--;) if (br(e[t][0], r)) return t;
      return -1;
    }
    function lr(e, r, t, n, i, o, a) {
      var u;
      if (n && (u = o ? n(e, i, o, a) : n(e)), void 0 !== u) return u;
      if (!Er(e)) return e;
      var c = _r(e);
      if (c) {
        if (u = function (e) {
          var r = e.length,
            t = e.constructor(r);
          r && "string" == typeof e[0] && Oe.call(e, "index") && (t.index = e.index, t.input = e.input);
          return t;
        }(e), !r) return function (e, r) {
          var t = -1,
            n = e.length;
          r || (r = Array(n));
          for (; ++t < n;) r[t] = e[t];
          return r;
        }(e, u);
      } else {
        var l = yr(e),
          s = l == $ || l == V;
        if (Ar(e)) return function (e, r) {
          if (r) return e.slice();
          var t = new e.constructor(e.length);
          return e.copy(t), t;
        }(e, r);
        if (l == R || l == F || s && !o) {
          if (we(e)) return o ? e : {};
          if (u = function (e) {
            return "function" != typeof e.constructor || mr(e) ? {} : (r = We(e), Er(r) ? Ce(r) : {});
            var r;
          }(s ? {} : e), !r) return function (e, r) {
            return vr(e, pr(e), r);
          }(e, function (e, r) {
            return e && vr(r, Mr(r), e);
          }(u, e));
        } else {
          if (!le[l]) return o ? e : {};
          u = function (e, r, t, n) {
            var i = e.constructor;
            switch (r) {
              case X:
                return fr(e);
              case W:
              case C:
                return new i(+e);
              case Y:
                return function (e, r) {
                  var t = r ? fr(e.buffer) : e.buffer;
                  return new e.constructor(t, e.byteOffset, e.byteLength);
                }(e, n);
              case J:
              case Z:
              case Q:
              case ee:
              case re:
              case te:
              case ne:
              case ie:
              case oe:
                return function (e, r) {
                  var t = r ? fr(e.buffer) : e.buffer;
                  return new e.constructor(t, e.byteOffset, e.length);
                }(e, n);
              case K:
                return function (e, r, t) {
                  var n = r ? t(be(e), true) : be(e);
                  return me(n, ye, new e.constructor());
                }(e, n, t);
              case B:
              case U:
                return new i(e);
              case L:
                return function (e) {
                  var r = new e.constructor(e.source, ae.exec(e));
                  return r.lastIndex = e.lastIndex, r;
                }(e);
              case H:
                return function (e, r, t) {
                  var n = r ? t(Ne(e), true) : Ne(e);
                  return me(n, ge, new e.constructor());
                }(e, n, t);
              case z:
                return o = e, rr ? Object(rr.call(o)) : {};
            }
            var o;
          }(e, l, lr, r);
        }
      }
      a || (a = new or());
      var f = a.get(e);
      if (f) return f;
      if (a.set(e, u), !c) var v = t ? function (e) {
        return function (e, r, t) {
          var n = r(e);
          return _r(e) ? n : function (e, r) {
            for (var t = -1, n = r.length, i = e.length; ++t < n;) e[i + t] = r[t];
            return e;
          }(n, t(e));
        }(e, Mr, pr);
      }(e) : Mr(e);
      return function (e, r) {
        for (var t = -1, n = e ? e.length : 0; ++t < n && false !== r(e[t], t, e););
      }(v || e, function (i, o) {
        v && (i = e[o = i]), ur(u, o, lr(i, r, t, n, o, e, a));
      }), u;
    }
    function sr(e) {
      return !(!Er(e) || (r = e, Te && Te in r)) && (Sr(e) || we(e) ? De : ue).test(wr(e));
      var r;
    }
    function fr(e) {
      var r = new e.constructor(e.byteLength);
      return new Fe(r).set(new Fe(e)), r;
    }
    function vr(e, r, t, n) {
      t || (t = {});
      for (var i = -1, o = r.length; ++i < o;) {
        var a = r[i];
        ur(t, a, e[a]);
      }
      return t;
    }
    function dr(e, r) {
      var t,
        n,
        i = e.__data__;
      return ("string" == (n = typeof (t = r)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== t : null === t) ? i["string" == typeof r ? "string" : "hash"] : i.map;
    }
    function hr(e, r) {
      var t = function (e, r) {
        return null == e ? void 0 : e[r];
      }(e, r);
      return sr(t) ? t : void 0;
    }
    tr.prototype.clear = function () {
      this.__data__ = Ge ? Ge(null) : {};
    }, tr.prototype.delete = function (e) {
      return this.has(e) && delete this.__data__[e];
    }, tr.prototype.get = function (e) {
      var r = this.__data__;
      if (Ge) {
        var t = r[e];
        return t === I ? void 0 : t;
      }
      return Oe.call(r, e) ? r[e] : void 0;
    }, tr.prototype.has = function (e) {
      var r = this.__data__;
      return Ge ? void 0 !== r[e] : Oe.call(r, e);
    }, tr.prototype.set = function (e, r) {
      return this.__data__[e] = Ge && void 0 === r ? I : r, this;
    }, nr.prototype.clear = function () {
      this.__data__ = [];
    }, nr.prototype.delete = function (e) {
      var r = this.__data__,
        t = cr(r, e);
      return !(t < 0) && (t == r.length - 1 ? r.pop() : Ve.call(r, t, 1), true);
    }, nr.prototype.get = function (e) {
      var r = this.__data__,
        t = cr(r, e);
      return t < 0 ? void 0 : r[t][1];
    }, nr.prototype.has = function (e) {
      return cr(this.__data__, e) > -1;
    }, nr.prototype.set = function (e, r) {
      var t = this.__data__,
        n = cr(t, e);
      return n < 0 ? t.push([e, r]) : t[n][1] = r, this;
    }, ir.prototype.clear = function () {
      this.__data__ = {
        hash: new tr(),
        map: new (Le || nr)(),
        string: new tr()
      };
    }, ir.prototype.delete = function (e) {
      return dr(this, e).delete(e);
    }, ir.prototype.get = function (e) {
      return dr(this, e).get(e);
    }, ir.prototype.has = function (e) {
      return dr(this, e).has(e);
    }, ir.prototype.set = function (e, r) {
      return dr(this, e).set(e, r), this;
    }, or.prototype.clear = function () {
      this.__data__ = new nr();
    }, or.prototype.delete = function (e) {
      return this.__data__.delete(e);
    }, or.prototype.get = function (e) {
      return this.__data__.get(e);
    }, or.prototype.has = function (e) {
      return this.__data__.has(e);
    }, or.prototype.set = function (e, r) {
      var t = this.__data__;
      if (t instanceof nr) {
        var n = t.__data__;
        if (!Le || n.length < 199) return n.push([e, r]), this;
        t = this.__data__ = new ir(n);
      }
      return t.set(e, r), this;
    };
    var pr = Ke ? _e(Ke, Object) : function () {
        return [];
      },
      yr = function (e) {
        return Pe.call(e);
      };
    function gr(e, r) {
      return !!(r = null == r ? k : r) && ("number" == typeof e || ce.test(e)) && e > -1 && e % 1 == 0 && e < r;
    }
    function mr(e) {
      var r = e && e.constructor;
      return e === ("function" == typeof r && r.prototype || Me);
    }
    function wr(e) {
      if (null != e) {
        try {
          return xe.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function br(e, r) {
      return e === r || e != e && r != r;
    }
    (qe && yr(new qe(new ArrayBuffer(1))) != Y || Le && yr(new Le()) != K || He && yr(He.resolve()) != q || Ue && yr(new Ue()) != H || ze && yr(new ze()) != G) && (yr = function (e) {
      var r = Pe.call(e),
        t = r == R ? e.constructor : void 0,
        n = t ? wr(t) : void 0;
      if (n) switch (n) {
        case Xe:
          return Y;
        case Ye:
          return K;
        case Je:
          return q;
        case Ze:
          return H;
        case Qe:
          return G;
      }
      return r;
    });
    var _r = Array.isArray;
    function Nr(e) {
      return null != e && function (e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && e <= k;
      }(e.length) && !Sr(e);
    }
    var Ar = Be || function () {
      return false;
    };
    function Sr(e) {
      var r = Er(e) ? Pe.call(e) : "";
      return r == $ || r == V;
    }
    function Er(e) {
      var r = typeof e;
      return !!e && ("object" == r || "function" == r);
    }
    function Mr(e) {
      return Nr(e) ? ar(e) : function (e) {
        if (!mr(e)) return Re(e);
        var r = [];
        for (var t in Object(e)) Oe.call(e, t) && "constructor" != t && r.push(t);
        return r;
      }(e);
    }
    var jr = function (e) {
      return lr(e, true, true);
    };
    function Or(e, r, t, n, i, o) {
      o = void 0 !== o && o, n = void 0 === n || o, Object.defineProperty(e, r, {
        value: t,
        enumerable: false,
        writable: n,
        configurable: o
      });
    }
    var Pr,
      Dr = Array.prototype,
      Ir = Object.create(Dr),
      kr = "undefined" != typeof Proxy && "function" == typeof (Pr = Proxy) && /native code/.test(Pr.toString()),
      Wr = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
    Wr.forEach(function (e) {
      var r = Dr[e];
      Or(Ir, e, function () {
        for (var t, n, o, a, u, c, l, s, f, v, d, h, p, y, g, m, w, b, _, N, A = [], S = arguments.length; S--;) A[S] = arguments[S];
        var E = jr(this),
          M = r.apply(this, A);
        if (this.__obc__) if (["push", "pop"].includes(e) && !kr) {
          var j = this.__obc__.csKeyMap.get(this),
            T = (null == j ? void 0 : j.labelKey) + "." + (null == j ? void 0 : j.key) + ((null == j ? void 0 : j.key) ? "." : "");
          try {
            for (var x = i(this.__obc__.myWaMap), O = x.next(); !O.done; O = x.next()) {
              var P = O.value;
              T.startsWith(P[0]) && ((null === (c = null === (u = P[1]) || void 0 === u ? void 0 : u.props) || void 0 === c ? void 0 : c.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (s = null === (l = P[1]) || void 0 === l ? void 0 : l.props) || void 0 === s ? void 0 : s.deep) ? !(null === (v = null === (f = P[1]) || void 0 === f ? void 0 : f.props) || void 0 === v ? void 0 : v.run) && P[1].fun(this, E) : !(null === (h = null === (d = P[1]) || void 0 === d ? void 0 : d.props) || void 0 === h ? void 0 : h.run) && T === P[0] && P[1].fun(this, E));
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              O && !O.done && (n = x.return) && n.call(x);
            } finally {
              if (t) throw t.error;
            }
          }
        } else try {
          for (var D = i(this.__obc__.myWaMap), I = D.next(); !I.done; I = D.next()) {
            P = I.value;
            this.__obc__.currKey.value.startsWith(P[0]) && ((null === (y = null === (p = P[1]) || void 0 === p ? void 0 : p.props) || void 0 === y ? void 0 : y.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (m = null === (g = P[1]) || void 0 === g ? void 0 : g.props) || void 0 === m ? void 0 : m.deep) ? !(null === (b = null === (w = P[1]) || void 0 === w ? void 0 : w.props) || void 0 === b ? void 0 : b.run) && P[1].fun(this, E) : !(null === (N = null === (_ = P[1]) || void 0 === _ ? void 0 : _.props) || void 0 === N ? void 0 : N.run) && this.__obc__.currKey.value === P[0] && P[1].fun(this, E));
          }
        } catch (e) {
          o = {
            error: e
          };
        } finally {
          try {
            I && !I.done && (a = D.return) && a.call(D);
          } finally {
            if (o) throw o.error;
          }
        }
        return M;
      });
    });

    var UniNavMethods = ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"];
    var UniNavEventBus = u(UniNavMethods);
    var UniAppMethods = ['onAppHide'];
    var UniAppEventBus = u(UniAppMethods);

    var RouterPlugin = (function () {
        function RouterPlugin() {
            this.name = 'router';
            this.monitor = null;
            this.routerList = [];
            this.onAppHideHandel = function () { };
            this.name = 'router';
        }
        RouterPlugin.prototype.init = function (monitor) {
            var _this = this;
            this.monitor = monitor;
            getDeviceInfo().then(function (res) {
                switch (res.uniPlatform) {
                    case 'web':
                        _this.rewriteRouter();
                        break;
                    case 'mp-weixin':
                        break;
                    default: _this.rewriteRouter();
                }
            });
            this.onAppHideHandel = function () {
                console.log('app hide', _this.routerList);
            };
            UniAppEventBus.on('onAppHide', this.onAppHideHandel);
        };
        RouterPlugin.prototype.rewriteRouter = function () {
            try {
                if (!uni) {
                    return;
                }
                var that_1 = this;
                setTimeout(function () {
                    var _a = getUniCurrentPages(), pages = _a.pages, page = _a.page;
                    that_1.routerList.push({
                        page: page,
                        timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                    });
                }, 400);
                UniNavMethods.forEach(function (item) {
                    UniNavEventBus.on(item, function (options) {
                        if (item !== 'navigateBack') {
                            var _a = getUniCurrentPages(), pages = _a.pages, page = _a.page;
                            that_1.routerList.push({
                                page: options.url,
                                timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                            });
                        }
                        else {
                            setTimeout(function () {
                                var _a = getUniCurrentPages(), pages = _a.pages, page = _a.page;
                                that_1.routerList.push({
                                    page: page,
                                    timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                                });
                            }, 40);
                        }
                        console.log('router', item, that_1.routerList);
                    });
                });
            }
            catch (error) {
                console.error(error);
            }
        };
        RouterPlugin.prototype.destroy = function () {
            this.monitor = null;
        };
        return RouterPlugin;
    }());

    var UniAppMonitor = (function () {
        function UniAppMonitor(config) {
            var _this = this;
            this.plugins = [];
            this.monitor = new FrontendMonitor();
            this.abortController = null;
            this.isOnline = true;
            this.cacheLog = [];
            this.config = config;
            getDeviceInfo();
            var _a = config.pluginsUse || {}, _b = _a.consolePluginEnabled, consolePluginEnabled = _b === void 0 ? true : _b, _c = _a.errorPluginEnabled, errorPluginEnabled = _c === void 0 ? true : _c, _d = _a.routerPluginEnabled, routerPluginEnabled = _d === void 0 ? true : _d;
            this.monitor.init(config === null || config === void 0 ? void 0 : config.monitorConfig);
            var pluginsToRegister = [
                consolePluginEnabled && { name: 'ConsolePlugin', creator: function () { return new ConsolePlugin((config === null || config === void 0 ? void 0 : config.consolePluginConfig) || {}); } },
                errorPluginEnabled && { name: 'ErrorPlugin', creator: function () { return new ErrorPlugin(); } },
                routerPluginEnabled && { name: 'RouterPlugin', creator: function () { return new RouterPlugin(); } },
            ].filter(Boolean);
            pluginsToRegister.forEach(function (plugin) {
                _this.use(plugin.creator());
            });
            this.init();
            this.setupNetworkListener();
        }
        UniAppMonitor.prototype.init = function () {
            this.rewriteRouter();
            this.appHide();
        };
        UniAppMonitor.prototype.appHide = function () {
            uni.onAppHide(function () {
                UniAppEventBus.emit('onAppHide', {});
            });
            this.h5Hide();
        };
        UniAppMonitor.prototype.h5Hide = function () {
            try {
                this.abortController = new AbortController();
                if (typeof document !== 'undefined' && 'hidden' in document) {
                    document.addEventListener('visibilitychange', function () {
                        if (document.visibilityState === 'hidden') {
                            UniAppEventBus.emit('onAppHide', {});
                        }
                    }, {
                        signal: this.abortController.signal
                    });
                }
                else if (typeof window !== 'undefined' && 'pagehide' in window) {
                    window.addEventListener('pagehide', function () {
                        UniAppEventBus.emit('onAppHide', {});
                    }, {
                        signal: this.abortController.signal
                    });
                }
                window.addEventListener('beforeunload', function () {
                    UniAppEventBus.emit('onAppHide', {});
                }, {
                    signal: this.abortController.signal
                });
            }
            catch (error) {
            }
        };
        UniAppMonitor.prototype.rewriteRouter = function () {
            try {
                var that = this;
                var originUni_1 = __assign$1({}, uni);
                UniNavMethods.forEach(function (item) {
                    uni[item] = function (obj) {
                        originUni_1[item] && originUni_1[item](__assign$1(__assign$1({}, obj), { success: function (res) {
                                UniNavEventBus.emit(item, obj);
                                obj.success && obj.success(res);
                            } }));
                    };
                });
            }
            catch (error) {
            }
        };
        UniAppMonitor.prototype.reportAllLog = function () {
            this.reportCacheLog();
            this.monitor.reportRestInfo();
        };
        UniAppMonitor.prototype.reportCacheLog = function () {
            var _this = this;
            if (this.cacheLog.length) {
                this.cacheLog.forEach(function (item) {
                    _this.monitor.reportInfo(item.type, item.data);
                });
                this.cacheLog = [];
            }
        };
        UniAppMonitor.prototype.setupNetworkListener = function () {
        };
        UniAppMonitor.prototype.setFingerprint = function (value) {
            this.monitor.setFingerprint(value);
        };
        UniAppMonitor.prototype.getFingerprint = function () {
            return this.monitor.getFingerprint();
        };
        UniAppMonitor.prototype.getNavigatorData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var getCatchDeviceInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, getDeviceInfo()];
                        case 1:
                            getCatchDeviceInfo = _a.sent();
                            return [2, {
                                    userAgent: getCatchDeviceInfo.osName + '----' + getCatchDeviceInfo.ua + '----' + getCatchDeviceInfo.deviceType,
                                    platform: getCatchDeviceInfo.uniPlatform,
                                    language: getCatchDeviceInfo.appLanguage,
                                    onLine: true,
                                    cookieEnabled: true,
                                }];
                    }
                });
            });
        };
        UniAppMonitor.prototype.getDeviceInfoData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var getCatchDeviceInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, getDeviceInfo()];
                        case 1:
                            getCatchDeviceInfo = _a.sent();
                            return [2, {
                                    width: getCatchDeviceInfo.screenWidth,
                                    height: getCatchDeviceInfo.screenHeight,
                                    pixelRatio: getCatchDeviceInfo.devicePixelRatio,
                                }];
                    }
                });
            });
        };
        UniAppMonitor.prototype.reportInfo = function (type, data) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, deviceInfo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = data;
                            return [4, this.getNavigatorData()];
                        case 1:
                            _a.navigator = _b.sent();
                            return [4, this.getDeviceInfoData()];
                        case 2:
                            deviceInfo = _b.sent();
                            if (!this.isOnline) {
                                this.cacheLog.push({ type: type, data: __assign$1(__assign$1({}, data), { deviceInfo: deviceInfo, navigator: data.navigator }) });
                                return [2];
                            }
                            this.monitor.reportInfo(type, __assign$1(__assign$1({}, data), { deviceInfo: deviceInfo }));
                            return [2];
                    }
                });
            });
        };
        UniAppMonitor.prototype.use = function (plugin) {
            if (!plugin.name) {
                console.error('Plugin must have a name property');
                return;
            }
            if (typeof plugin.init !== 'function') {
                console.error("Plugin ".concat(plugin.name, " must have an init method"));
                return;
            }
            var existingPlugin = this.plugins.find(function (p) { return p.name === plugin.name; });
            if (existingPlugin) {
                console.warn("Plugin ".concat(plugin.name, " already exists, skipping addition."));
                return;
            }
            this.plugins.push(plugin);
            plugin.init({ reportInfo: this.reportInfo.bind(this), getFingerprint: this.getFingerprint.bind(this) });
        };
        UniAppMonitor.prototype.destroy = function () {
            if (this.abortController) {
                this.abortController.abort();
                this.abortController = null;
            }
            this.plugins.forEach(function (plugin) {
                if (typeof plugin.destroy === 'function') {
                    plugin.destroy();
                }
            });
            this.plugins = [];
        };
        return UniAppMonitor;
    }());

    return UniAppMonitor;

}));
