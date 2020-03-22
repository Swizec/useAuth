import React from "react";
import ReactRenderer from "react-test-renderer";

import { useAuth, handleAuthResult } from "../useAuth";
import { AuthContext } from "../AuthProvider";
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

describe("useAuth", () => {
    const context = {
        state: {
            user: { sub: "1234" },
            expiresAt: null,
            isAuthenticating: true
        },
        dispatch: jest.fn(),
        auth0,
        callback_domain: "localhost",
        navigate: jest.fn()
    };

    describe("login", () => {
        it("calls auth0.authorize()", () => {
            const Mock = () => {
                const { login } = useAuth();
                login();

                return null;
            };

            ReactRenderer.create(
                <AuthContext.Provider value={context}>
                    <Mock />
                </AuthContext.Provider>
            );

            expect(auth0.authorize).toBeCalled();
        });
    });

    describe("logout", () => {});

    describe("handleAuthentication", () => {});

    describe("isAuthenticated", () => {});
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
