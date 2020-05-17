import React from "react";
import ReactRenderer from "react-test-renderer";

import { useAuth, handleAuthResult } from "../useAuth";
import { AuthContext } from "../AuthProvider";
import { AuthContextState } from "../types";
import Auth0 from "auth0-js";

const auth0 = new Auth0.WebAuth({
    domain: "localhost",
    clientID: "12345",
    redirectUri: `localhost/auth0_callback`,
    audience: `https://localhost/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email"
});
auth0.authorize = jest.fn();
auth0.logout = jest.fn();

describe("useAuth", () => {
    const context: AuthContextState = {
        state: {
            user: { sub: "1234" },
            expiresAt: null,
            isAuthenticating: true
        },
        dispatch: jest.fn(),
        auth0,
        callback_domain: "localhost",
        customPropertyNamespace: "localhost",
        navigate: jest.fn()
    };

    const render = (context: any, Mock: any) =>
        ReactRenderer.create(
            <AuthContext.Provider value={context}>
                <Mock />
            </AuthContext.Provider>
        );

    describe("login", () => {
        it("calls auth0.authorize()", () => {
            const Mock = () => {
                const { login } = useAuth();
                login();

                return null;
            };

            render(context, Mock);

            expect(auth0.authorize).toBeCalled();
        });
    });

    describe("logout", () => {
        const Mock = () => {
            const { logout } = useAuth();
            logout();

            return null;
        };

        it("calls auth0.logout()", () => {
            render(context, Mock);

            expect(auth0.logout).toBeCalledWith({
                returnTo: context.callback_domain
            });
        });

        it("dispatches logout action", () => {
            render(context, Mock);

            expect(context.dispatch).toBeCalledWith({
                type: "logout"
            });
        });
    });

    describe("handleAuthentication", () => {
        const Mock = () => {
            const { handleAuthentication } = useAuth();
            handleAuthentication({ postLoginRoute: "/route" });

            return null;
        };

        it("dispatches startAuthenticating", () => {
            render(context, Mock);

            expect(context.dispatch).toBeCalledWith({
                type: "startAuthenticating"
            });
        });

        it("navigates to postLoginRoute", () => {
            render(context, Mock);

            expect(context.navigate).toBeCalledWith("/route");
        });
    });

    describe("isAuthenticated", () => {
        it("is false when expiresAt not set", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            context.state.expiresAt = null;

            render(context, Mock);
        });

        it("is false when expiresAt in the past", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            context.state.expiresAt = new Date().getTime() - 3600 * 1000;

            render(context, Mock);
        });

        it("is true when expiresAt in the future", () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(true);

                return null;
            };

            context.state.expiresAt = new Date().getTime() + 3600 * 1000;

            render(context, Mock);
        });
    });

    describe("isAuthorized", () => {
        it("returns true if role exists", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                expect(isAuthorized("testRole")).toBe(true);

                return null;
            };

            context.state.user["localhost/user_metadata"] = {
                roles: ["testRole"]
            };

            render(context, Mock);
        });

        it("returns false if role does not exist", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                expect(isAuthorized("testRole")).toBe(false);

                return null;
            };

            context.state.user["localhost/user_metadata"] = { roles: [] };

            render(context, Mock);
        });

        it("returns false if role exists but user not authenticated", () => {
            const Mock = () => {
                const { isAuthorized } = useAuth();

                expect(isAuthorized("testRole")).toBe(false);

                return null;
            };

            context.state.user["localhost/user_metadata"] = {
                roles: ["testRole"]
            };
            context.state.expiresAt = new Date().getTime() - 3600 * 1000;

            render(context, Mock);
        });
    });
});

describe("handleAuthResult", () => {
    const user = {
        name: "swizec",
        nickname: "swiz",
        picture: "https://avatar",
        user_id: "12345",
        clientID: "12345",
        identities: [],
        created_at: "2020-03-22",
        updated_at: "2020-03-22",
        sub: "12345"
    };

    const dispatch = jest.fn((action: any) => null);

    beforeEach(() => {
        // mock auth0.client.userInfo for success
        auth0.client.userInfo = jest.fn((accessToken, callback) =>
            callback(null, user)
        );
    });

    it("dispatches stopAuthenticating", async () => {
        await handleAuthResult({ dispatch, auth0, authResult: {} });

        expect(dispatch).toBeCalledWith({ type: "stopAuthenticating" });
    });

    describe("success", () => {
        const authResult = {
            accessToken: "12345",
            idToken: "12345"
        };

        it("dispatches login", async () => {
            await handleAuthResult({ dispatch, auth0, authResult });

            expect(dispatch).toBeCalledWith({
                type: "login",
                authResult,
                user
            });
        });

        it("returns true", async () => {
            expect(
                await handleAuthResult({ dispatch, auth0, authResult })
            ).toBe(true);
        });
    });

    describe("no userInfo returned from auth0.client", () => {
        const authResult = {
            accessToken: "12345",
            idToken: "12345"
        };
        const error = {
            error: "no info"
        };

        beforeEach(() => {
            // mock auth0.client.userInfo for failure
            auth0.client.userInfo = jest.fn((accessToken, callback) =>
                callback(error, user)
            );
        });

        it("dispatches error", async () => {
            await handleAuthResult({ dispatch, auth0, authResult });

            expect(dispatch).toBeCalledWith({
                type: "error",
                errorType: "userInfo",
                error
            });
        });

        it("returns false", async () => {
            expect(
                await handleAuthResult({ dispatch, auth0, authResult })
            ).toBe(false);
        });
    });

    describe("error", () => {
        it("dispatches error", async () => {
            const err = new Error();

            await handleAuthResult({ err, dispatch, auth0, authResult: {} });

            expect(dispatch).toBeCalledWith({
                type: "error",
                errorType: "authResult",
                error: err
            });
        });

        it("returns false", async () => {
            expect(
                await handleAuthResult({ dispatch, auth0, authResult: {} })
            ).toBe(false);
        });
    });

    describe("bad data", () => {
        it("returns false", async () => {
            expect(
                await handleAuthResult({ dispatch, auth0, authResult: {} })
            ).toBe(false);
        });
    });
});
