import t, {
    useCallback as e,
    useEffect as r,
    createElement as n,
    Fragment as o
} from "react";
import { useService as i } from "@xstate/react";
import {
    addSeconds as a,
    isAfter as u,
    differenceInSeconds as s
} from "date-fns";
import { Machine as c, assign as l, interpret as h } from "xstate";
import { choose as f } from "xstate/lib/actions";
import { NetlifyIdentity as d } from "./providers/NetlifyIdentity.ts";
function v() {
    return (v =
        Object.assign ||
        function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var r = arguments[e];
                for (var n in r)
                    Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
            }
            return t;
        }).apply(this, arguments);
}
var p = h(
    c(
        {
            id: "useAuth",
            initial: "unauthenticated",
            context: {
                user: {},
                expiresAt: null,
                authResult: null,
                isAuthenticating: !1,
                error: void 0,
                errorType: void 0,
                config: {
                    navigate: function() {
                        return console.error(
                            "Please specify a navigation method that works with your router"
                        );
                    },
                    callbackDomain: "http://localhost:8000"
                }
            },
            states: {
                unauthenticated: {
                    on: {
                        LOGIN: "authenticating",
                        CHECK_SESSION: "verifying",
                        SET_CONFIG: { actions: ["setConfig"] }
                    }
                },
                authenticating: {
                    on: {
                        ERROR: "error",
                        AUTHENTICATED: "authenticated",
                        SET_CONFIG: { actions: ["setConfig"] }
                    },
                    entry: ["startAuthenticating"],
                    exit: ["stopAuthenticating"]
                },
                verifying: {
                    invoke: {
                        id: "checkSession",
                        src: function(t, e) {
                            return t.config.authProvider.checkSession();
                        },
                        onDone: { target: "authenticated" },
                        onError: {
                            target: "unauthenticated",
                            actions: [
                                "clearUserFromContext",
                                "clearLocalStorage"
                            ]
                        }
                    },
                    entry: ["startAuthenticating"],
                    exit: ["stopAuthenticating"]
                },
                authenticated: {
                    on: {
                        LOGOUT: "unauthenticated",
                        SET_CONFIG: { actions: ["setConfig"] },
                        CHECK_SESSION: "verifying"
                    },
                    entry: ["saveUserToContext", "saveToLocalStorage"],
                    exit: f([
                        {
                            cond: function(t, e) {
                                return "CHECK_SESSION" !== e.type;
                            },
                            actions: [
                                "clearUserFromContext",
                                "clearLocalStorage"
                            ]
                        }
                    ])
                },
                error: {
                    entry: [
                        "saveErrorToContext",
                        "clearUserFromContext",
                        "clearLocalStorage"
                    ]
                }
            }
        },
        {
            actions: {
                startAuthenticating: l(function(t) {
                    return { isAuthenticating: !0 };
                }),
                stopAuthenticating: l(function(t) {
                    return { isAuthenticating: !1 };
                }),
                saveUserToContext: l(function(t, e) {
                    var r = e.data ? e.data : e,
                        n = r.authResult;
                    return {
                        user: r.user,
                        authResult: n,
                        expiresAt: a(new Date(), n.expiresIn)
                    };
                }),
                clearUserFromContext: l(function(t) {
                    return { user: {}, expiresAt: null, authResult: null };
                }),
                saveToLocalStorage: function(t, e) {
                    var r = t.expiresAt,
                        n = t.user;
                    "undefined" != typeof localStorage &&
                        (localStorage.setItem(
                            "useAuth:expires_at",
                            r ? r.toISOString() : "0"
                        ),
                        localStorage.setItem(
                            "useAuth:user",
                            JSON.stringify(n)
                        ));
                },
                clearLocalStorage: function() {
                    "undefined" != typeof localStorage &&
                        (localStorage.removeItem("useAuth:expires_at"),
                        localStorage.removeItem("useAuth:user"));
                },
                saveErrorToContext: l(function(t, e) {
                    return { errorType: e.errorType, error: e.error };
                }),
                setConfig: l(function(t, e) {
                    return { config: v({}, t.config, e) };
                })
            }
        }
    )
);
p.start(),
    (function(t) {
        if ("undefined" != typeof localStorage) {
            var e = new Date(localStorage.getItem("useAuth:expires_at") || "0"),
                r = new Date();
            if (u(e, r)) {
                var n = JSON.parse(
                    localStorage.getItem("useAuth:user") || "{}"
                );
                t("LOGIN"),
                    t("AUTHENTICATED", {
                        user: n,
                        authResult: { expiresIn: s(e, r) }
                    });
            }
        }
    })(p.send);
var g = function() {
        var t = i(p),
            r = t[0],
            n = t[1],
            o = r.context.config,
            a = o.authProvider,
            s = o.navigate,
            c = o.callbackDomain,
            l = e(
                function(t) {
                    var e = (void 0 === t ? {} : t).postLoginRoute,
                        r = void 0 === e ? "/" : e;
                    try {
                        if (!a || !s)
                            return (
                                console.warn("authProvider not configured yet"),
                                Promise.resolve()
                            );
                        var o = (function() {
                            if ("undefined" != typeof window)
                                return (
                                    n("LOGIN"),
                                    Promise.resolve(
                                        a.handleLoginCallback(n)
                                    ).then(function(t) {
                                        t && s(r);
                                    })
                                );
                        })();
                        return Promise.resolve(
                            o && o.then ? o.then(function() {}) : void 0
                        );
                    } catch (t) {
                        return Promise.reject(t);
                    }
                },
                [a, s]
            ),
            h = function() {
                return !(
                    !r.context.expiresAt || !u(r.context.expiresAt, new Date())
                );
            };
        return {
            isAuthenticating: r.context.isAuthenticating,
            isAuthenticated: h,
            isAuthorized: function(t) {
                var e = Array.isArray(t) ? t : [t],
                    n = null == a ? void 0 : a.userRoles(r.context.user);
                return (
                    !(!h() || !n) &&
                    e.some(function(t) {
                        return n.includes(t);
                    })
                );
            },
            user: r.context.user,
            userId: null == a ? void 0 : a.userId(r.context.user),
            authResult: r.context.authResult,
            login: function() {
                null == a || a.authorize();
            },
            signup: function() {
                null == a || a.signup();
            },
            logout: function(t) {
                "string" == typeof t
                    ? null == a || a.logout("" + c + t)
                    : null == a || a.logout(),
                    n("LOGOUT"),
                    s("string" == typeof t ? t : "/");
            },
            handleAuthentication: l,
            dispatch: n
        };
    },
    m = function(e) {
        var n = e.children;
        return (
            g(),
            r(function() {
                console.warn(
                    "Using the AuthProvider root component is deprecated. Migrate to AuthConfig or manual dispatching. Takes  5min."
                );
            }, []),
            t.createElement(t.Fragment, null, n)
        );
    },
    y = function(t) {
        var e = t.authProvider,
            i = t.params,
            a = t.navigate,
            u = t.children,
            s = g().dispatch,
            c =
                "undefined" != typeof window
                    ? window.location.protocol + "//" + window.location.host
                    : "http://localhost:8000";
        return (
            r(
                function() {
                    var t = new e(v({ dispatch: s }, e.addDefaultParams(i, c)));
                    s("SET_CONFIG", {
                        authProvider: t,
                        navigate: a,
                        callbackDomain: c
                    }),
                        s("CHECK_SESSION");
                },
                [s, e, i, a]
            ),
            n(o, null, u)
        );
    };
function A(t, e) {
    try {
        var r = t();
    } catch (t) {
        return e(t);
    }
    return r && r.then ? r.then(void 0, e) : r;
}
var S = {
    __proto__: null,
    Auth0: (function() {
        function t(t) {
            var e = this;
            (this.dispatch = t.dispatch),
                (this.customPropertyNamespace = t.customPropertyNamespace),
                import("auth0-js").then(function(r) {
                    e.auth0 = new (0, r.WebAuth)(v({}, t));
                });
        }
        t.addDefaultParams = function(t, e) {
            return v(
                {
                    redirectUri: e + "/auth0_callback",
                    audience: "https://" + t.domain + "/api/v2/",
                    responseType: "token id_token",
                    scope: "openid profile email"
                },
                t
            );
        };
        var e = t.prototype;
        return (
            (e.authorize = function() {
                var t;
                null == (t = this.auth0) || t.authorize();
            }),
            (e.signup = function() {
                var t;
                null == (t = this.auth0) ||
                    t.authorize({ mode: "signUp", screen_hint: "signup" });
            }),
            (e.logout = function(t) {
                var e;
                null == (e = this.auth0) || e.logout({ returnTo: t });
            }),
            (e.userId = function(t) {
                return t.sub;
            }),
            (e.userRoles = function(t) {
                var e =
                    t[
                        (
                            this.customPropertyNamespace + "/user_metadata"
                        ).replace(/\/+user_metadata/, "/user_metadata")
                    ];
                return (null == e ? void 0 : e.roles) || null;
            }),
            (e.handleLoginCallback = function() {
                try {
                    var t = this;
                    return Promise.resolve(
                        new Promise(function(e, r) {
                            var n;
                            null == (n = t.auth0) ||
                                n.parseHash(function(r, n) {
                                    try {
                                        r &&
                                            (t.dispatch("ERROR", {
                                                error: r,
                                                errorType: "authResult"
                                            }),
                                            e(!1));
                                        var o = A(
                                            function() {
                                                return Promise.resolve(
                                                    t.handleAuthResult(n)
                                                ).then(function(t) {
                                                    e(t);
                                                });
                                            },
                                            function(r) {
                                                t.dispatch("ERROR", {
                                                    error: r,
                                                    errorType: "handleAuth"
                                                }),
                                                    e(!1);
                                            }
                                        );
                                        return Promise.resolve(
                                            o && o.then
                                                ? o.then(function() {})
                                                : void 0
                                        );
                                    } catch (t) {
                                        return Promise.reject(t);
                                    }
                                });
                        })
                    );
                } catch (t) {
                    return Promise.reject(t);
                }
            }),
            (e.checkSession = function() {
                try {
                    var t = this;
                    return Promise.resolve(
                        new Promise(function(e, r) {
                            var n;
                            null == (n = t.auth0) ||
                                n.checkSession({}, function(n, o) {
                                    try {
                                        var i = (function() {
                                            if (
                                                !n &&
                                                o &&
                                                o.accessToken &&
                                                o.idToken
                                            ) {
                                                var i = A(
                                                    function() {
                                                        return Promise.resolve(
                                                            t.fetchUser(o)
                                                        ).then(function(t) {
                                                            e({
                                                                user: t,
                                                                authResult: o
                                                            });
                                                        });
                                                    },
                                                    function(t) {
                                                        r(t);
                                                    }
                                                );
                                                if (i && i.then)
                                                    return i.then(
                                                        function() {}
                                                    );
                                            } else
                                                r(
                                                    n ||
                                                        new Error(
                                                            "Session invalid"
                                                        )
                                                );
                                        })();
                                        return Promise.resolve(
                                            i && i.then
                                                ? i.then(function() {})
                                                : void 0
                                        );
                                    } catch (t) {
                                        return Promise.reject(t);
                                    }
                                });
                        })
                    );
                } catch (t) {
                    return Promise.reject(t);
                }
            }),
            (e.handleAuthResult = function(t) {
                try {
                    var e = this;
                    return t && t.accessToken && t.idToken
                        ? Promise.resolve(e.fetchUser(t)).then(function(r) {
                              return (
                                  e.dispatch("AUTHENTICATED", {
                                      authResult: t,
                                      user: r
                                  }),
                                  !0
                              );
                          })
                        : Promise.resolve(!1);
                } catch (t) {
                    return Promise.reject(t);
                }
            }),
            (e.fetchUser = function(t) {
                try {
                    var e = this;
                    return Promise.resolve(
                        new Promise(function(r, n) {
                            var o;
                            null == (o = e.auth0) ||
                                o.client.userInfo(
                                    (null == t ? void 0 : t.accessToken) || "",
                                    function(t, e) {
                                        t ? n(t) : r(e);
                                    }
                                );
                        })
                    );
                } catch (t) {
                    return Promise.reject(t);
                }
            }),
            t
        );
    })(),
    NetlifyIdentity: d
};
export { y as AuthConfig, m as AuthProvider, S as Providers, g as useAuth };
//# sourceMappingURL=react-use-auth.esm.js.map
