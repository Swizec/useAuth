import React, { useEffect } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Auth0 } from "../providers/Auth0";

import { useAuth } from "../useAuth";
import { authService } from "../authReducer";

const auth0 = new Auth0({
    dispatch: authService.send,
    customPropertyNamespace: "localhost:8000",
    domain: "localhost",
    clientID: "12345",
    redirectUri: `localhost/auth0_callback`,
    audience: `https://localhost/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email"
});
auth0.authorize = jest.fn();
auth0.logout = jest.fn();
auth0.checkSession = jest.fn();

describe("useAuth", () => {
    let container: any = null,
        navigate = jest.fn();

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);

        authService.send("SET_CONFIG", {
            authProvider: auth0,
            navigate,
            callbackDomain: "localhost:8000"
        });
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    describe("login", () => {
        it("calls auth0.authorize()", () => {
            const Mock = () => {
                const { login } = useAuth();
                login();

                return null;
            };

            act(() => {
                render(<Mock />, container);
            });

            expect(auth0.authorize).toBeCalled();
        });
    });

    describe("logout", () => {
        const Mock = () => {
            const { logout } = useAuth();
            useEffect(() => {
                logout();
            }, []);

            return null;
        };

        it("calls auth0.logout()", () => {
            act(() => {
                render(<Mock />, container);
            });

            expect(auth0.logout).toBeCalled();
        });

        it("puts user in unauthenticated state", () => {
            act(() => {
                render(<Mock />, container);
            });

            expect(authService.state.value).toBe("unauthenticated");
        });
    });

    describe("handleAuthentication", () => {
        const Mock = () => {
            const { handleAuthentication } = useAuth();
            useEffect(() => {
                handleAuthentication({ postLoginRoute: "/route" });
            }, []);

            return null;
        };

        it("puts user in authenticating state", () => {
            act(() => {
                render(<Mock />, container);
            });

            expect(authService.state.value).toBe("authenticating");
        });

        // TODO: test fails because auth0 doesn't return true
        it.skip("navigates to postLoginRoute", () => {
            act(() => {
                render(<Mock />, container);
            });

            expect(navigate).toBeCalledWith("/route");
        });
    });

    describe("isAuthenticated", () => {
        afterEach(() => {
            act(() => {
                authService.send("LOGOUT");
            });
        });

        it("is false when expiresAt not set", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            act(() => {
                render(<Mock />, container);
            });
        });

        it("is false when expiresAt in the past", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            authService.send("LOGIN");
            authService.send("AUTHENTICATED", {
                authResult: {
                    expiresIn: -10 * 1000 * 60 * 24
                },
                user: { sub: "1234" }
            });

            act(() => {
                render(<Mock />, container);
            });
        });

        it("is true when expiresAt in the future", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                useEffect(() => {
                    expect(isAuthenticated()).toBe(true);
                }, []);

                return null;
            };

            authService.send("LOGIN");
            authService.send("AUTHENTICATED", {
                authResult: {
                    expiresIn: 10 * 1000 * 60 * 24
                },
                user: { sub: "1234" }
            });

            act(() => {
                render(<Mock />, container);
            });
        });
    });

    describe("isAuthorized", () => {
        afterEach(() => {
            act(() => {
                authService.send("LOGOUT");
            });
        });

        it("returns true if role exists", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                useEffect(() => {
                    expect(isAuthorized("testRole")).toBe(true);
                }, []);

                return null;
            };

            authService.send("LOGIN");
            authService.send("AUTHENTICATED", {
                authResult: {
                    expiresIn: 10 * 1000 * 60 * 24
                },
                user: {
                    "localhost:8000/user_metadata": {
                        roles: ["testRole"]
                    },
                    sub: "1234"
                }
            });

            act(() => {
                render(<Mock />, container);
            });
        });

        it("returns false if role does not exist", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                useEffect(() => {
                    expect(isAuthorized("testRole")).toBe(false);
                }, []);

                return null;
            };

            authService.send("LOGIN");
            authService.send("AUTHENTICATED", {
                authResult: {
                    expiresIn: 10 * 1000 * 60 * 24
                },
                user: {
                    "localhost:8000/user_metadata": {
                        roles: []
                    },
                    sub: "1234"
                }
            });

            act(() => {
                render(<Mock />, container);
            });
        });

        it("returns false if role exists but user not authenticated", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                useEffect(() => {
                    expect(isAuthorized("testRole")).toBe(false);
                }, []);

                return null;
            };

            authService.send("LOGIN");
            authService.send("AUTHENTICATED", {
                authResult: {
                    expiresIn: -10 * 1000 * 60 * 24
                },
                user: {
                    "localhost:8000/user_metadata": {
                        roles: ["testRole"]
                    },
                    sub: "1234"
                }
            });

            act(() => {
                render(<Mock />, container);
            });
        });

        describe("array argument", () => {
            afterEach(() => {
                act(() => {
                    authService.send("LOGOUT");
                });
            });

            it("true if at least 1 present", () => {
                const Mock = () => {
                    const { isAuthorized } = useAuth();

                    useEffect(() => {
                        expect(isAuthorized(["testRole1", "testRole2"])).toBe(
                            true
                        );
                    }, []);

                    return null;
                };

                authService.send("LOGIN");
                authService.send("AUTHENTICATED", {
                    authResult: {
                        expiresIn: 10 * 1000 * 60 * 24
                    },
                    user: {
                        "localhost:8000/user_metadata": {
                            roles: ["testRole1"]
                        },
                        sub: "1234"
                    }
                });

                act(() => {
                    render(<Mock />, container);
                });
            });

            it("false if none present", () => {
                const Mock = () => {
                    const { isAuthorized } = useAuth();

                    useEffect(() => {
                        expect(isAuthorized(["testRole1", "testRole2"])).toBe(
                            false
                        );
                    }, []);

                    return null;
                };

                authService.send("LOGIN");
                authService.send("AUTHENTICATED", {
                    authResult: {
                        expiresIn: 10 * 1000 * 60 * 24
                    },
                    user: {
                        "localhost:8000/user_metadata": {
                            roles: ["testRole"]
                        },
                        sub: "1234"
                    }
                });

                act(() => {
                    render(<Mock />, container);
                });
            });
        });
    });
});
