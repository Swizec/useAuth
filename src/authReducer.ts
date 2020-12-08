import { addSeconds, differenceInSeconds, isAfter } from "date-fns";
import { Machine, assign, interpret } from "xstate";
import { choose } from "xstate/lib/actions";
import { AuthState } from "./types";

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
            config: {
                navigate: () =>
                    console.error(
                        "Please specify a navigation method that works with your router"
                    ),
                // TODO: detect default
                callbackDomain: "http://localhost:8000"
            }
        },
        states: {
            unauthenticated: {
                on: {
                    LOGIN: "authenticating",
                    CHECK_SESSION: "verifying",
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
            verifying: {
                invoke: {
                    id: "checkSession",
                    src: (context, event) =>
                        context.config.authProvider!.checkSession(),
                    onDone: {
                        target: "authenticated"
                    },
                    onError: {
                        target: "unauthenticated",
                        actions: ["clearUserFromContext", "clearLocalStorage"]
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
                    },
                    CHECK_SESSION: "verifying"
                },
                entry: ["saveUserToContext", "saveToLocalStorage"],
                exit: choose([
                    {
                        cond: (context, event) =>
                            event.type !== "CHECK_SESSION",
                        actions: ["clearUserFromContext", "clearLocalStorage"]
                    }
                ])
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
                const { authResult, user } = event.data ? event.data : event;
                const expiresAt = addSeconds(new Date(), authResult.expiresIn);

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
                        expiresAt ? expiresAt.toISOString() : "0"
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
                localStorage.getItem("useAuth:expires_at") || "0"
            ),
            now = new Date();

        if (isAfter(expiresAt, now)) {
            const user = JSON.parse(
                localStorage.getItem("useAuth:user") || "{}"
            );
            send("LOGIN");
            send("AUTHENTICATED", {
                user,
                authResult: {
                    expiresIn: differenceInSeconds(expiresAt, now)
                }
            });
        }
    }
}

export const authService = interpret(authMachine);
authService.start();

hydrateFromLocalStorage(authService.send);
