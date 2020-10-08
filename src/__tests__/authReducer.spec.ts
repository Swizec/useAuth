import { authReducer, authState } from "../authReducer";
import { AuthState, AuthAction } from "src/types";

describe("authReducer", () => {
    describe("login", () => {
        const currentTime = new Date().getTime();
        const state: AuthState = {
            user: { sub: "1234" },
            expiresAt: null,
            isAuthenticating: true
        };
        const action: AuthAction = {
            type: "login",
            authResult: { accessToken: "12345", expiresIn: 500 },
            user: {
                name: "swizec",
                nickname: "swiz",
                picture: "https://avatar",
                user_id: "12345",
                clientID: "12345",
                identities: [],
                created_at: "2020-03-22",
                updated_at: "2020-03-22",
                sub: "12345"
            }
        };

        it("adds user to local storage", () => {
            localStorage.removeItem("useAuth:expires_at");
            localStorage.removeItem("useAuth:user");

            authReducer(state, action);

            expect(
                JSON.parse(localStorage.getItem("useAuth:expires_at")!)
            ).toBeGreaterThanOrEqual(currentTime + 500 * 1000);

            expect(localStorage.getItem("useAuth:user")).toEqual(
                JSON.stringify(action.user)
            );
        });

        it("sets user", () => {
            expect(authReducer(state, action).user).toEqual(action.user);
        });
        it("sets expiresAt", () => {
            expect(authReducer(state, action).expiresAt).toBeGreaterThanOrEqual(
                currentTime + 500 * 1000
            );
        });
        it("sets authResult", () => {
            expect(authReducer(state, action).authResult).toBe(
                action.authResult
            );
        });
    });

    describe("logout", () => {
        const state: AuthState = {
            user: { sub: "1234" },
            expiresAt: new Date().getTime(),
            isAuthenticating: true
        };
        const action: AuthAction = {
            type: "logout"
        };

        it("removes user from local storage", () => {
            localStorage.setItem("useAuth:expires_at", "12345");
            localStorage.setItem("useAuth:user", "12345");

            authReducer(state, action);

            expect(localStorage.getItem("useAuth:expires_at")).toEqual(null);
            expect(localStorage.getItem("useAuth:user")).toEqual(null);
        });

        it("empties user", () => {
            expect(authReducer(state, action).user).toEqual({});
        });
        it("nullifies expiresAt", () => {
            expect(authReducer(state, action).expiresAt).toEqual(null);
        });
        it("nullifies authResult", () => {
            expect(authReducer(state, action).authResult).toBe(null);
        });
    });

    describe("stopAuthenticating", () => {
        const state: AuthState = {
            user: { sub: "1234" },
            expiresAt: new Date().getTime(),
            isAuthenticating: true
        };
        const action: AuthAction = {
            type: "stopAuthenticating"
        };

        it("changes isAuthenticating to false", () => {
            expect(authReducer(state, action).isAuthenticating).toBe(false);
        });

        it("preserves other properties", () => {
            expect(authReducer(state, action).user).toStrictEqual(state.user);
            expect(authReducer(state, action).expiresAt).toStrictEqual(
                state.expiresAt
            );
        });
    });

    describe("startAuthenticating", () => {
        // const state: AuthState = {
        //     user: { sub: "1234" },
        //     expiresAt: new Date().getTime(),
        //     isAuthenticating: false
        // };
        // const action: AuthAction = {
        //     type: "startAuthenticating"
        // };

        const state = authState.start();

        it.only("changes isAuthenticating to true", () => {
            let context = { isAuthenticating: false };

            state
                .onTransition(state => {
                    context = state.context;
                })
                .send("LOGIN");

            expect(context.isAuthenticating).toBe(true);
            // expect(authReducer(state, action).isAuthenticating).toBe(true);
        });

        // it("preserves other properties", () => {
        //     expect(authReducer(state, action).user).toStrictEqual(state.user);
        //     expect(authReducer(state, action).expiresAt).toStrictEqual(
        //         state.expiresAt
        //     );
        // });
    });

    describe("error", () => {
        const state: AuthState = {
            user: { sub: "1234" },
            expiresAt: new Date().getTime(),
            isAuthenticating: false
        };
        const action: AuthAction = {
            type: "error",
            errorType: "auth error",
            error: new Error()
        };

        it("sets errorType", () => {
            expect(authReducer(state, action).errorType).toEqual("auth error");
        });

        it("sets error", () => {
            expect(authReducer(state, action).error).toBeDefined();
        });
        it("empties user", () => {
            expect(authReducer(state, action).user).toEqual({});
        });
        it("nullifies expiresAt", () => {
            expect(authReducer(state, action).expiresAt).toEqual(null);
        });
        it("nullifies authResult", () => {
            expect(authReducer(state, action).authResult).toBe(null);
        });
    });
});
