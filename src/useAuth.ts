import { useContext } from "react";

import { AuthContext } from "./AuthProvider";
import {
    useAuthInterface,
    handleAuthResultInterface,
    setSessionInterface
} from "./types";
import {
    Auth0DecodedHash,
    Auth0UserProfile,
    Auth0Error,
    Auth0ParseHashError
} from "auth0-js";
import { interpret } from "xstate";
import { authMachine } from "./authReducer";
import { useService } from "@xstate/react";

const setSession: setSessionInterface = async ({ send, auth0, authResult }) => {
    return new Promise((resolve, reject) => {
        auth0.client.userInfo(
            authResult.accessToken || "",
            (err: Auth0Error | null, user: Auth0UserProfile) => {
                if (err) {
                    send("ERROR", {
                        errorType: "userInfo",
                        error: err
                    });
                    reject(err);
                } else {
                    send("AUTHENTICATED", {
                        authResult,
                        user
                    });
                    resolve(user);
                }
            }
        );
    });
};

export const handleAuthResult: handleAuthResultInterface = async ({
    err,
    send,
    auth0,
    authResult
}) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
        try {
            await setSession({ send, auth0, authResult });

            return true;
        } catch (e) {
            return false;
        }
    } else if (err) {
        console.error(err);
        send("ERROR", {
            error: err,
            errorType: "authResult"
        });

        return false;
    } else {
        return false;
    }
};

const authService = interpret(authMachine);

/**
 * The main API for useAuth
 *
 * @return {boolean} isAuthenticated is current user authenticated
 * @return {boolean} isAuthenticating currently running authentication
 * @return {function} isAuthorized check if current user is authenticated and matches list of roles
 * @return {object} user current user
 * @return {string} userId current user's identifier
 * @return {object} authResult raw authentication result object from auth provider
 * @return {function} login start the login process
 * @return {function} signup same as login, passes { mode: "signUp", screen_hint: "signup" } to Auth0
 * @return {function} logout start the logout process
 * @return {function} handleAuthentication function to call on your callback page
 */
export const useAuth: useAuthInterface = () => {
    const {
        auth0,
        callback_domain,
        navigate,
        customPropertyNamespace
    } = useContext(AuthContext);

    const [state, send] = useService(authService);

    const login = () => {
        auth0 && auth0.authorize();
    };

    const signup = () => {
        auth0 && auth0.authorize({ mode: "signUp", screen_hint: "signup" });
    };

    const logout = () => {
        auth0 &&
            auth0.logout({
                returnTo: callback_domain
            });
        send("LOGOUT");

        // Return to the homepage after logout.
        navigate("/");
    };

    const handleAuthentication = ({ postLoginRoute = "/" } = {}) => {
        if (typeof window !== "undefined") {
            send("LOGIN");
            auth0 &&
                auth0.parseHash(
                    async (
                        err: Auth0ParseHashError | null,
                        authResult: Auth0DecodedHash | null
                    ) => {
                        await handleAuthResult({
                            err,
                            authResult,
                            send,
                            auth0
                        });

                        navigate(postLoginRoute);
                    }
                );
        }
    };

    const isAuthenticated = () => {
        return !!(
            state.context.expiresAt &&
            new Date().getTime() < state.context.expiresAt
        );
    };

    const isAuthorized = (roles: string | string[]) => {
        const _roles = Array.isArray(roles) ? roles : [roles];
        const metadata =
            state.context.user[
                // make this friendlier to use if you leave a trailing slash in config
                `${customPropertyNamespace}/user_metadata`.replace(
                    /\/+user_metadata/,
                    "/user_metadata"
                )
            ];

        if (!isAuthenticated() || !metadata) {
            return false;
        } else {
            return _roles.some(role => metadata.roles.includes(role));
        }
    };

    return {
        isAuthenticating: state.context.isAuthenticating,
        isAuthenticated,
        isAuthorized,
        user: state.context.user,
        userId: state.context.user ? state.context.user.sub : null,
        authResult: state.context.authResult,
        login,
        signup,
        logout,
        handleAuthentication
    };
};
