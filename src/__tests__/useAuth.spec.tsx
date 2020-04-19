import React from "react";
import ReactRenderer from "react-test-renderer";

import { useAuth, handleAuthResult } from "../useAuth";
import { AuthContext } from "../AuthProvider";
import { AuthContextState } from "../types";
import createAuth0Client from "@auth0/auth0-spa-js";

// async mock for auth0
async function auth0() {
    const auth0 = await createAuth0Client({
        domain: "localhost",
        client_id: "12345",
        redirect_uri: `localhost/auth0_callback`,
        audience: `https://localhost/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    });
    auth0.loginWithRedirect = jest.fn();
    auth0.logout = jest.fn();

    return auth0;
}

describe("useAuth", () => {
    // helper to mock up a react context
    async function context() {
        const context: AuthContextState = {
            state: {
                user: { sub: "1234" },
                expiresAt: null,
                isAuthenticating: true
            },
            dispatch: jest.fn(),
            auth0: await auth0(),
            callback_domain: "localhost",
            navigate: jest.fn()
        };

        return context;
    }

    const render = (context: any, Mock: any) =>
        ReactRenderer.create(
            <AuthContext.Provider value={context}>
                <Mock />
            </AuthContext.Provider>
        );

    describe("login", () => {
        it("calls auth0.loginWithRedirect()", async () => {
            const Mock = () => {
                const { login } = useAuth();
                login();

                return null;
            };

            const _context = await context();

            render(_context, Mock);

            expect(_context.auth0.loginWithRedirect).toBeCalled();
        });
    });

    describe("logout", () => {
        const Mock = () => {
            const { logout } = useAuth();
            logout();

            return null;
        };

        it("calls auth0.logout()", async () => {
            const _context = await context();

            render(_context, Mock);

            expect(_context.auth0.logout).toBeCalledWith({
                returnTo: _context.callback_domain
            });
        });

        it("dispatches logout action", async () => {
            const _context = await context();

            render(_context, Mock);

            expect(_context.dispatch).toBeCalledWith({
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

        it("dispatches startAuthenticating", async () => {
            const _context = await context();

            render(_context, Mock);

            expect(_context.dispatch).toBeCalledWith({
                type: "startAuthenticating"
            });
        });

        it("navigates to postLoginRoute", async () => {
            const _context = await context();

            render(_context, Mock);

            expect(_context.navigate).toBeCalledWith("/route");
        });
    });

    describe("isAuthenticated", () => {
        it("is false when expiresAt not set", async () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            const _context = await context();

            _context.state.expiresAt = null;

            render(_context, Mock);
        });

        it("is false when expiresAt in the past", async () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(false);

                return null;
            };

            const _context = await context();

            _context.state.expiresAt = new Date().getTime() - 3600 * 1000;

            render(_context, Mock);
        });

        it("is true when expiresAt in the future", async () => {
            const Mock = () => {
                const { isAuthenticated } = useAuth();

                expect(isAuthenticated()).toBe(true);

                return null;
            };

            const _context = await context();

            _context.state.expiresAt = new Date().getTime() + 3600 * 1000;

            render(_context, Mock);
        });
    });
});

// describe("handleAuthResult", () => {
//     const user = {
//         name: "swizec",
//         nickname: "swiz",
//         picture: "https://avatar",
//         user_id: "12345",
//         clientID: "12345",
//         identities: [],
//         created_at: "2020-03-22",
//         updated_at: "2020-03-22",
//         sub: "12345"
//     };

//     const dispatch = jest.fn((action: any) => null);

//     // const _auth0 = await auth0();

//     beforeEach(() => {
//         // mock auth0.client.userInfo for success
//         _auth0.client.userInfo = jest.fn((accessToken, callback) =>
//             callback(null, user)
//         );
//     });

//     it("dispatches stopAuthenticating", async () => {
//         await handleAuthResult({ dispatch, auth0, authResult: {} });

//         expect(dispatch).toBeCalledWith({ type: "stopAuthenticating" });
//     });

//     describe("success", () => {
//         const authResult = {
//             accessToken: "12345",
//             idToken: "12345"
//         };

//         it("dispatches login", async () => {
//             await handleAuthResult({ dispatch, auth0, authResult });

//             expect(dispatch).toBeCalledWith({
//                 type: "login",
//                 authResult,
//                 user
//             });
//         });

//         it("returns true", async () => {
//             expect(
//                 await handleAuthResult({ dispatch, auth0, authResult })
//             ).toBe(true);
//         });
//     });

//     describe("no userInfo returned from auth0.client", () => {
//         const authResult = {
//             accessToken: "12345",
//             idToken: "12345"
//         };
//         const error = {
//             error: "no info"
//         };

//         beforeEach(() => {
//             // mock auth0.client.userInfo for failure
//             auth0.client.userInfo = jest.fn((accessToken, callback) =>
//                 callback(error, user)
//             );
//         });

//         it("dispatches error", async () => {
//             await handleAuthResult({ dispatch, auth0, authResult });

//             expect(dispatch).toBeCalledWith({
//                 type: "error",
//                 errorType: "userInfo",
//                 error
//             });
//         });

//         it("returns false", async () => {
//             expect(
//                 await handleAuthResult({ dispatch, auth0, authResult })
//             ).toBe(false);
//         });
//     });

//     describe("error", () => {
//         it("dispatches error", async () => {
//             const err = new Error();

//             await handleAuthResult({ err, dispatch, auth0, authResult: {} });

//             expect(dispatch).toBeCalledWith({
//                 type: "error",
//                 errorType: "authResult",
//                 error: err
//             });
//         });

//         it("returns false", async () => {
//             expect(
//                 await handleAuthResult({ dispatch, auth0, authResult: {} })
//             ).toBe(false);
//         });
//     });

//     describe("bad data", () => {
//         it("returns false", async () => {
//             expect(
//                 await handleAuthResult({ dispatch, auth0, authResult: {} })
//             ).toBe(false);
//         });
//     });
// });
