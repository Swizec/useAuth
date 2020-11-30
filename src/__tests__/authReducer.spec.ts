import { interpret } from "xstate";
import { authMachine } from "../authReducer";
import { AuthState } from "src/types";
import { addSeconds } from "date-fns";

describe("authReducer", () => {
    const loginPayload = {
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
    const initialContext: AuthState = {
        user: { sub: "1234" },
        expiresAt: null,
        isAuthenticating: true,
        config: {
            navigate: () => null,
            callbackDomain: "localhost:8000"
        }
    };

    describe("LOGIN", () => {
        const currentTime = new Date();

        function initStateMachine() {
            const state = interpret(
                authMachine.withContext(initialContext)
            ).start();

            return state;
        }

        // init with values to easily tell TypeScript the type
        let authState = initStateMachine(),
            savedContext = initialContext;

        beforeEach(() => {
            authState = initStateMachine();

            authState.subscribe(state => {
                savedContext = state.context;
            });
        });

        it("adds user to local storage", () => {
            localStorage.removeItem("useAuth:expires_at");
            localStorage.removeItem("useAuth:user");

            authState.send("LOGIN");
            authState.send("AUTHENTICATED", loginPayload);

            expect(
                new Date(localStorage.getItem("useAuth:expires_at")!).getTime()
            ).toBeGreaterThanOrEqual(addSeconds(currentTime, 400).getTime());

            expect(localStorage.getItem("useAuth:user")).toEqual(
                JSON.stringify(loginPayload.user)
            );
        });

        it("sets user", () => {
            authState.send("LOGIN");
            authState.send("AUTHENTICATED", loginPayload);

            expect(savedContext.user).toEqual(loginPayload.user);
        });
        it("sets expiresAt", () => {
            authState.send("LOGIN");
            authState.send("AUTHENTICATED", loginPayload);

            expect(savedContext.expiresAt!.getTime()).toBeGreaterThanOrEqual(
                addSeconds(currentTime, 400).getTime()
            );
        });
        it("sets authResult", () => {
            authState.send("LOGIN");
            authState.send("AUTHENTICATED", loginPayload);

            expect(savedContext.authResult).toBe(loginPayload.authResult);
        });
    });

    describe("LOGOUT", () => {
        function initStateMachine() {
            const state = interpret(authMachine).start();
            state.send("LOGIN");
            state.send("AUTHENTICATED", loginPayload);

            return state;
        }

        it("removes user from local storage", () => {
            const authState = initStateMachine();

            localStorage.setItem("useAuth:expires_at", "12345");
            localStorage.setItem("useAuth:user", "12345");

            authState.send("LOGOUT");

            expect(localStorage.getItem("useAuth:expires_at")).toEqual(null);
            expect(localStorage.getItem("useAuth:user")).toEqual(null);
        });

        it("empties user", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGOUT");

            expect(savedContext.user).toEqual({});
        });
        it("nullifies expiresAt", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGOUT");

            expect(savedContext.expiresAt).toEqual(null);
        });
        it("nullifies authResult", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("LOGOUT");

            expect(savedContext.authResult).toBe(null);
        });
    });

    describe("ERROR", () => {
        const errorPayload = {
            errorType: "auth error",
            error: new Error()
        };

        function initStateMachine() {
            const state = interpret(authMachine).start();
            state.send("LOGIN");

            return state;
        }

        it("sets errorType", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("ERROR", errorPayload);

            expect(savedContext.errorType).toEqual("auth error");
        });

        it("sets error", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("ERROR", errorPayload);

            expect(savedContext.error).toBeDefined();
        });
        it("empties user", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("ERROR", errorPayload);

            expect(savedContext.user).toEqual({});
        });
        it("nullifies expiresAt", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("ERROR", errorPayload);

            expect(savedContext.expiresAt).toEqual(null);
        });
        it("nullifies authResult", () => {
            const authState = initStateMachine();

            let savedContext: AuthState = initialContext;

            authState.subscribe(state => {
                savedContext = state.context;
            });

            authState.send("ERROR", errorPayload);

            expect(savedContext.authResult).toBe(null);
        });
    });
});
