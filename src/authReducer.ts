import { Machine, assign, interpret } from "xstate";
import { AuthState, AuthAction } from "./types";

export const authMachine = Machine<AuthState>(
    {
        id: "useAuth",
        initial: "unauthenticated",
        context: {
            user: {},
            expiresAt: null,
            authResult: null,
            isAuthenticating: false,
            error: undefined,
            errorType: undefined
        },
        states: {
            unauthenticated: {
                on: {
                    LOGIN: "authenticating"
                }
            },
            authenticating: {
                on: {
                    ERROR: "error",
                    AUTHENTICATED: "authenticated"
                },
                entry: ["startAuthenticating"],
                exit: ["stopAuthenticating"]
            },
            authenticated: {
                on: {
                    LOGOUT: "unauthenticated"
                },
                entry: ["saveUserToContext", "saveUserToLocalstorage"]
            },
            error: {}
        }
    },
    {
        actions: {
            startAuthenticating: assign(context => {
                return {
                    isAuthenticating: true
                };
            }),
            stopAuthenticating: assign(context => {
                return {
                    isAuthenticating: false
                };
            }),
            saveUserToContext: assign((context, event) => {
                const { authResult, user } = event;
                const expiresAt =
                    authResult.expiresIn! * 1000 + new Date().getTime();

                return {
                    user,
                    authResult,
                    expiresAt
                };
            }),
            saveUserToLocalstorage: (context, event) => {
                const { expiresAt, user } = context;

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem(
                        "useAuth:expires_at",
                        JSON.stringify(expiresAt)
                    );
                    localStorage.setItem("useAuth:user", JSON.stringify(user));
                }
            }
        }
    }
);

export const authState = interpret(authMachine);

export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "login":
            const { authResult, user } = action;
            const expiresAt =
                authResult.expiresIn! * 1000 + new Date().getTime();

            if (typeof localStorage !== "undefined") {
                localStorage.setItem(
                    "useAuth:expires_at",
                    JSON.stringify(expiresAt)
                );
                localStorage.setItem("useAuth:user", JSON.stringify(user));
            }

            return {
                ...state,
                user,
                expiresAt,
                authResult
            };
        case "logout":
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem("useAuth:expires_at");
                localStorage.removeItem("useAuth:user");
            }

            return {
                ...state,
                user: {},
                expiresAt: null,
                authResult: null
            };
        case "stopAuthenticating":
            return {
                ...state,
                isAuthenticating: false
            };
        case "startAuthenticating":
            return {
                ...state,
                isAuthenticating: true
            };
        case "error":
            const { errorType, error } = action;
            return {
                ...state,
                user: {},
                expiresAt: null,
                authResult: null,
                errorType,
                error
            };
        default:
            return state;
    }
};
