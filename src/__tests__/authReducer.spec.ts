import { authReducer } from "../authReducer";
import { AuthState, AuthAction } from "src/types";

describe("authReducer", () => {
    describe("login", () => {});

    describe("logout", () => {});

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
        const state: AuthState = {
            user: { sub: "1234" },
            expiresAt: new Date().getTime(),
            isAuthenticating: false
        };
        const action: AuthAction = {
            type: "startAuthenticating"
        };

        it("changes isAuthenticating to true", () => {
            expect(authReducer(state, action).isAuthenticating).toBe(true);
        });

        it("preserves other properties", () => {
            expect(authReducer(state, action).user).toStrictEqual(state.user);
            expect(authReducer(state, action).expiresAt).toStrictEqual(
                state.expiresAt
            );
        });
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

    // describe("default", () => {
    //     it("returns state", () => {
    //         const state: AuthState = {
    //             user: { sub: "1234" },
    //             expiresAt: new Date().getTime(),
    //             isAuthenticating: false
    //         };

    //         expect(authReducer(state, { type: null })).toStrictEqual(state);
    //     });
    // });
});
