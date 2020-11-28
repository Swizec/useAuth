import { useCallback } from "react";

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
import { useService } from "@xstate/react";
import { authService } from "./authReducer";
import { isAfter } from "date-fns";

const setSession: setSessionInterface = async ({
    dispatch,
    authProvider,
    authResult
}) => {
    return new Promise((resolve, reject) => {
        authProvider.client.userInfo(
            authResult.accessToken || "",
            (err: Auth0Error | null, user: Auth0UserProfile) => {
                if (err) {
                    dispatch("ERROR", {
                        errorType: "userInfo",
                        error: err
                    });
                    reject(err);
                } else {
                    dispatch("AUTHENTICATED", {
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
    dispatch,
    authProvider,
    authResult
}) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
        try {
            await setSession({ dispatch, authProvider, authResult });

            return true;
        } catch (e) {
            return false;
        }
    } else if (err) {
        console.error(err);
        dispatch("ERROR", {
            error: err,
            errorType: "authResult"
        });

        return false;
    } else {
        return false;
    }
};

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
    const [state, dispatch] = useService(authService);

    const {
        authProvider,
        navigate,
        callbackDomain,
        customPropertyNamespace
    } = state.context.config;

    const login = () => {
        authProvider && authProvider.authorize();
    };

    const signup = () => {
        authProvider &&
            authProvider.authorize({ mode: "signUp", screen_hint: "signup" });
    };

    const logout = () => {
        authProvider &&
            authProvider.logout({
                returnTo: callbackDomain
            });
        dispatch("LOGOUT");

        // Return to the homepage after logout.
        navigate("/");
    };

    const handleAuthentication = useCallback(
        ({ postLoginRoute = "/" } = {}) => {
            if (!authProvider || !navigate || !callbackDomain) {
                console.warn("authProvider not configured yet");
                return;
            }

            if (typeof window !== "undefined") {
                dispatch("LOGIN");

                authProvider.parseHash(
                    async (
                        err: Auth0ParseHashError | null,
                        authResult: Auth0DecodedHash | null
                    ) => {
                        await handleAuthResult({
                            err,
                            authResult,
                            dispatch,
                            authProvider
                        });

                        navigate(postLoginRoute);
                    }
                );
            }
        },
        [authProvider, navigate, callbackDomain]
    );

    const isAuthenticated = () => {
        // console.log("isAuthenticated", state.context.expiresAt, new Date());
        return !!(
            state.context.expiresAt &&
            isAfter(state.context.expiresAt, new Date())
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
        handleAuthentication,
        dispatch
    };
};
