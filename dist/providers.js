function e(e) {
    if (e && e.__esModule) return e;
    var t = {};
    return (
        e &&
            Object.keys(e).forEach(function(n) {
                var r = Object.getOwnPropertyDescriptor(e, n);
                Object.defineProperty(
                    t,
                    n,
                    r.get
                        ? r
                        : {
                              enumerable: !0,
                              get: function() {
                                  return e[n];
                              }
                          }
                );
            }),
        (t.default = e),
        t
    );
}
function t() {
    return (t =
        Object.assign ||
        function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
        }).apply(this, arguments);
}
function n(e, t) {
    try {
        var n = e();
    } catch (e) {
        return t(e);
    }
    return n && n.then ? n.then(void 0, t) : n;
}
var r = (function() {
        function r(n) {
            var r = this;
            (this.dispatch = n.dispatch),
                (this.customPropertyNamespace = n.customPropertyNamespace),
                new Promise(function(t) {
                    t(e(require("auth0-js")));
                }).then(function(e) {
                    r.auth0 = new (0, e.WebAuth)(t({}, n));
                });
        }
        r.addDefaultParams = function(e, n) {
            return t(
                {
                    redirectUri: n + "/auth0_callback",
                    audience: "https://" + e.domain + "/api/v2/",
                    responseType: "token id_token",
                    scope: "openid profile email"
                },
                e
            );
        };
        var i = r.prototype;
        return (
            (i.authorize = function() {
                var e;
                null == (e = this.auth0) || e.authorize();
            }),
            (i.signup = function() {
                var e;
                null == (e = this.auth0) ||
                    e.authorize({ mode: "signUp", screen_hint: "signup" });
            }),
            (i.logout = function(e) {
                var t;
                null == (t = this.auth0) || t.logout({ returnTo: e });
            }),
            (i.userId = function(e) {
                return e.sub;
            }),
            (i.userRoles = function(e) {
                var t =
                    e[
                        (
                            this.customPropertyNamespace + "/user_metadata"
                        ).replace(/\/+user_metadata/, "/user_metadata")
                    ];
                return (null == t ? void 0 : t.roles) || null;
            }),
            (i.handleLoginCallback = function() {
                try {
                    var e = this;
                    return Promise.resolve(
                        new Promise(function(t, r) {
                            var i;
                            null == (i = e.auth0) ||
                                i.parseHash(function(r, i) {
                                    try {
                                        r &&
                                            (e.dispatch("ERROR", {
                                                error: r,
                                                errorType: "authResult"
                                            }),
                                            t(!1));
                                        var o = n(
                                            function() {
                                                return Promise.resolve(
                                                    e.handleAuthResult(i)
                                                ).then(function(e) {
                                                    t(e);
                                                });
                                            },
                                            function(n) {
                                                e.dispatch("ERROR", {
                                                    error: n,
                                                    errorType: "handleAuth"
                                                }),
                                                    t(!1);
                                            }
                                        );
                                        return Promise.resolve(
                                            o && o.then
                                                ? o.then(function() {})
                                                : void 0
                                        );
                                    } catch (e) {
                                        return Promise.reject(e);
                                    }
                                });
                        })
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            (i.checkSession = function() {
                try {
                    var e = this;
                    return Promise.resolve(
                        new Promise(function(t, r) {
                            var i;
                            null == (i = e.auth0) ||
                                i.checkSession({}, function(i, o) {
                                    try {
                                        var u = (function() {
                                            if (
                                                !i &&
                                                o &&
                                                o.accessToken &&
                                                o.idToken
                                            ) {
                                                var u = n(
                                                    function() {
                                                        return Promise.resolve(
                                                            e.fetchUser(o)
                                                        ).then(function(e) {
                                                            t({
                                                                user: e,
                                                                authResult: o
                                                            });
                                                        });
                                                    },
                                                    function(e) {
                                                        r(e);
                                                    }
                                                );
                                                if (u && u.then)
                                                    return u.then(
                                                        function() {}
                                                    );
                                            } else
                                                r(
                                                    i ||
                                                        new Error(
                                                            "Session invalid"
                                                        )
                                                );
                                        })();
                                        return Promise.resolve(
                                            u && u.then
                                                ? u.then(function() {})
                                                : void 0
                                        );
                                    } catch (e) {
                                        return Promise.reject(e);
                                    }
                                });
                        })
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            (i.handleAuthResult = function(e) {
                try {
                    var t = this;
                    return e && e.accessToken && e.idToken
                        ? Promise.resolve(t.fetchUser(e)).then(function(n) {
                              return (
                                  t.dispatch("AUTHENTICATED", {
                                      authResult: e,
                                      user: n
                                  }),
                                  !0
                              );
                          })
                        : Promise.resolve(!1);
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            (i.fetchUser = function(e) {
                try {
                    var t = this;
                    return Promise.resolve(
                        new Promise(function(n, r) {
                            var i;
                            null == (i = t.auth0) ||
                                i.client.userInfo(
                                    (null == e ? void 0 : e.accessToken) || "",
                                    function(e, t) {
                                        e ? r(e) : n(t);
                                    }
                                );
                        })
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            r
        );
    })(),
    i = (function() {
        function t(t) {
            var n = this;
            (this.dispatch = t.dispatch),
                new Promise(function(t) {
                    t(e(require("netlify-identity-widget")));
                }).then(function(e) {
                    (n.netlifyIdentity = e.default),
                        n.netlifyIdentity.init(t),
                        n.netlifyIdentity.on("error", function(e) {
                            n.dispatch("ERROR", {
                                error: e,
                                errorType: "netlifyError"
                            });
                        }),
                        n.netlifyIdentity.on("login", function(e) {
                            var t;
                            n.dispatch("AUTHENTICATED", {
                                user: e,
                                authResult: {
                                    expiresIn:
                                        null == (t = e.token)
                                            ? void 0
                                            : t.expires_in
                                }
                            });
                        }),
                        n.netlifyIdentity.on("init", function(e) {
                            var t;
                            console.log("INIT", e),
                                e &&
                                    (n.dispatch("LOGIN"),
                                    n.dispatch("AUTHENTICATED", {
                                        user: e,
                                        authResult: {
                                            expiresIn:
                                                null == (t = e.token)
                                                    ? void 0
                                                    : t.expires_in
                                        }
                                    }));
                        });
                });
        }
        t.addDefaultParams = function(e, t) {
            return void 0 === e && (e = {}), e;
        };
        var n = t.prototype;
        return (
            (n.authorize = function() {
                this.dispatch("LOGIN"), this.netlifyIdentity.open("login");
            }),
            (n.signup = function() {
                this.dispatch("LOGIN"), this.netlifyIdentity.open("signup");
            }),
            (n.logout = function(e) {
                this.netlifyIdentity.logout();
            }),
            (n.handleLoginCallback = function(e) {
                try {
                    return (
                        console.warn(
                            "handleLoginCallback is unnecessary with Netlify Identity Widget"
                        ),
                        Promise.resolve(!0)
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            (n.checkSession = function() {
                try {
                    var e = this,
                        t = function(t) {
                            var n,
                                r = e.netlifyIdentity.currentUser();
                            if (r)
                                return {
                                    user: r,
                                    authResult: {
                                        expiresIn:
                                            null == (n = r.token)
                                                ? void 0
                                                : n.expires_in
                                    }
                                };
                            throw new Error("Session invalid");
                        },
                        n = (function(t, n) {
                            try {
                                var r = Promise.resolve(
                                    e.netlifyIdentity.refresh()
                                ).then(function() {});
                            } catch (e) {
                                return n();
                            }
                            return r && r.then ? r.then(void 0, n) : r;
                        })(0, function() {
                            throw new Error("Session invalid");
                        });
                    return Promise.resolve(n && n.then ? n.then(t) : t());
                } catch (e) {
                    return Promise.reject(e);
                }
            }),
            (n.userId = function(e) {
                return e.id;
            }),
            (n.userRoles = function(e) {
                return [e.role] || null;
            }),
            t
        );
    })();
(exports.Auth0 = r), (exports.NetlifyIdentity = i);
//# sourceMappingURL=providers.js.map
