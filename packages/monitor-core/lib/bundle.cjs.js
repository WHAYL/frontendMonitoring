'use strict';

var MYSTORAGE_COUNT = 100;
var IMMEDIATE_REPORT_LEVEL = "ERROR";

function e(e, r, t) {
  return Object.fromEntries(e.map(function (e) {
    return [String(e[r]), e[t]];
  }));
}
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

var LogCategory = [
    { label: '其他', key: 'oth', value: 0 },
    { label: '页面生命周期', key: 'pageLifecycle', value: 1 },
    { label: 'js错误，未处理的Promise，console.error', key: 'error', value: 2 },
    { label: 'xhr,fetch请求信息', key: 'xhrFetch', value: 3 },
    { label: '页面性能相关数据', key: 'pagePerformance', value: 4 },
    { label: '系统相关访问数据', key: 'osView', value: 5 },
    { label: '资源加载信息', key: 'resource', value: 6 },
    { label: '用户行为', key: 'userBehavior', value: 7 },
];
var LogCategoryKeyValue = e(LogCategory, 'key', 'value');
exports.ReportLevelEnum = void 0;
(function (ReportLevelEnum) {
    ReportLevelEnum[ReportLevelEnum["ERROR"] = 0] = "ERROR";
    ReportLevelEnum[ReportLevelEnum["WARN"] = 1] = "WARN";
    ReportLevelEnum[ReportLevelEnum["INFO"] = 2] = "INFO";
    ReportLevelEnum[ReportLevelEnum["DEBUG"] = 3] = "DEBUG";
    ReportLevelEnum[ReportLevelEnum["OFF"] = 4] = "OFF";
})(exports.ReportLevelEnum || (exports.ReportLevelEnum = {}));

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

var FrontendMonitor = (function () {
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
        var errorInfo = __assign(__assign({}, info), { fingerprint: this.fingerprint, oldFingerprint: this.oldFingerprint, platform: this.config.platform });
        if (exports.ReportLevelEnum[info.level] <= exports.ReportLevelEnum[this.config.reportLevel]) {
            this.report(errorInfo);
        }
        else {
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
        this.log(__assign(__assign({}, info), { level: level }));
    };
    FrontendMonitor.prototype.checkAndReportStored = function () {
        var _this = this;
        var reportableItems = this.storageQueue.filter(function (item) { return exports.ReportLevelEnum[item.level] <= exports.ReportLevelEnum[_this.config.reportLevel]; });
        if (reportableItems.length > 0) {
            reportableItems.forEach(function (item) { return _this.report(item); });
            this.storageQueue = this.storageQueue.filter(function (item) { return exports.ReportLevelEnum[item.level] > exports.ReportLevelEnum[_this.config.reportLevel]; });
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
            }
            catch (err) {
                console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
            }
        }
        else {
            console.log("[Frontend Monitor] : ".concat(JSON.stringify(errorInfo)));
        }
    };
    FrontendMonitor.prototype.destroy = function () {
        this.clearStorageQueue();
    };
    return FrontendMonitor;
}());

exports.FrontendMonitor = FrontendMonitor;
exports.IMMEDIATE_REPORT_LEVEL = IMMEDIATE_REPORT_LEVEL;
exports.LogCategoryKeyValue = LogCategoryKeyValue;
exports.MYSTORAGE_COUNT = MYSTORAGE_COUNT;
