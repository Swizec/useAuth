import { interpret } from "xstate";
import { authReducer, authState, authMachine } from "../authReducer";
import { AuthState, AuthAction } from "src/types";

describe("authReducer", () => {
    describe.only("LOGIN", () => {
        const currentTime = new Date().getTime();
        const initialContext: AuthState = {
            user: { sub: "1234" },
            expiresAt: null,
            isAuthenticating: true
        };

        const payload = {
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

        function initStateMachine() {
            const state = interpret(
                authMachine.withContext(initialContext)
            ).start();

            return state;
        }

        it("adds user to local storage", () => {
            const authState = initStateMachine();

            localStorage.removeItem("useAuth:expires_at");
            localStorage.removeItem("useAuth:user");

            authState.send("LOGIN");
            authState.send("AUTHENTICATED", payload);

            expect(
                JSON.parse(localStorage.getItem("useAuth:expires_at")!)
            ).toBeGreaterThanOrEqual(currentTime + 500 * 1000);

            expect(localStorage.getItem("useAuth:user")).toEqual(
                JSON.stringify(payload.user)
            );
        });

        it("sets user", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGIN");
            authState.send("AUTHENTICATED", payload);

            expect(savedContext.user).toEqual(payload.user);
        });
        it("sets expiresAt", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGIN");
            authState.send("AUTHENTICATED", payload);

            expect(savedContext.expiresAt).toBeGreaterThanOrEqual(
                currentTime + 500 * 1000
            );
        });
        it("sets authResult", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGIN");
            authState.send("AUTHENTICATED", payload);

            expect(savedContext.authResult).toBe(payload.authResult);
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

    // describe("LOGIN", () => {
    //     // const state: AuthState = {
    //     //     user: { sub: "1234" },
    //     //     expiresAt: new Date().getTime(),
    //     //     isAuthenticating: false
    //     // };
    //     // const action: AuthAction = {
    //     //     type: "startAuthenticating"
    //     // };
    //     const context: AuthState = {
    //         user: { sub: "1234" },
    //         expiresAt: new Date().getTime(),
    //         isAuthenticating: false
    //     };

    //     it("changes isAuthenticating to true", () => {
    //         const state = interpret(
    //             authMachine.withContext({
    //                 ...context,
    //                 isAuthenticating: false
    //             })
    //         ).start();

    //         let savedContext = context;

    //         state
    //             .onTransition(state => {
    //                 savedContext = state.context;
    //             })
    //             .send("LOGIN");

    //         expect(savedContext.isAuthenticating).toBe(true);
    //     });
    // });

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
