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
            errorType: undefined,
            config: {}
        },
        states: {
            unauthenticated: {
                on: {
                    LOGIN: "authenticating",
                    SET_CONFIG: {
                        actions: ["setConfig"]
                    }
                }
            },
            authenticating: {
                on: {
                    ERROR: "error",
                    AUTHENTICATED: "authenticated",
                    SET_CONFIG: {
                        actions: ["setConfig"]
                    }
                },
                entry: ["startAuthenticating"],
                exit: ["stopAuthenticating"]
            },
            authenticated: {
                on: {
                    LOGOUT: "unauthenticated",
                    SET_CONFIG: {
                        actions: ["setConfig"]
                    }
                },
                entry: ["saveUserToContext", "saveToLocalStorage"],
                exit: ["clearUserFromContext", "clearLocalStorage"]
            },
            error: {
                entry: [
                    "saveErrorToContext",
                    "clearUserFromContext",
                    "clearLocalStorage"
                ]
            }
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
            clearUserFromContext: assign(context => {
                return {
                    user: {},
                    expiresAt: null,
                    authResult: null
                };
            }),
            saveToLocalStorage: (context, event) => {
                const { expiresAt, user } = context;

                if (typeof localStorage !== "undefined") {
                    localStorage.setItem(
                        "useAuth:expires_at",
                        JSON.stringify(expiresAt)
                    );
                    localStorage.setItem("useAuth:user", JSON.stringify(user));
                }
            },
            clearLocalStorage: () => {
                if (typeof localStorage !== "undefined") {
                    localStorage.removeItem("useAuth:expires_at");
                    localStorage.removeItem("useAuth:user");
                }
            },
            saveErrorToContext: assign((context, event) => {
                return {
                    errorType: event.errorType,
                    error: event.error
                };
            }),
            setConfig: assign((context, event) => {
                console.log("SET CONFIG", context, event);
                return {
                    config: {
                        ...context.config,
                        ...event
                    }
                };
            })
        }
    }
);

// check localstorage and login as soon as this file loads
function hydrateFromLocalStorage(send: any) {
    if (typeof localStorage !== "undefined") {
        const expiresAt = new Date(
            JSON.parse(localStorage.getItem("useAuth:expires_at") || "0")
        );

        if (expiresAt > new Date()) {
            const user = JSON.parse(
                localStorage.getItem("useAuth:user") || "{}"
            );
            send("LOGIN");
            send("AUTHENTICATED", {
                user,
                authResult: {
                    expiresIn:
                        (new Date().getTime() - expiresAt.getTime()) / 1000
                }
            });
        }
    }
}

export const authService = interpret(authMachine);
authService.start();

hydrateFromLocalStorage(authService.send);
