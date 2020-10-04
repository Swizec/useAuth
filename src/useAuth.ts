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

const setSession: setSessionInterface = async ({
    dispatch,
    auth0,
    authResult
}) => {
    return new Promise((resolve, reject) => {
        auth0.client.userInfo(
            authResult.accessToken || "",
            (err: Auth0Error | null, user: Auth0UserProfile) => {
                if (err) {
                    dispatch({
                        type: "error",
                        errorType: "userInfo",
                        error: err
                    });
                    reject(err);
                } else {
                    dispatch({
                        type: "login",
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
    auth0,
    authResult
}) => {
    dispatch({
        type: "stopAuthenticating"
    });

    if (authResult && authResult.accessToken && authResult.idToken) {
        try {
            await setSession({ dispatch, auth0, authResult });

            return true;
        } catch (e) {
            return false;
        }
    } else if (err) {
        console.error(err);
        dispatch({
            type: "error",
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
    const {
        state,
        dispatch,
        auth0,
        callback_domain,
        navigate,
        customPropertyNamespace
    } = useContext(AuthContext);

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
        dispatch({
            type: "logout"
        });

        // Return to the homepage after logout.
        navigate("/");
    };

    const handleAuthentication = ({ postLoginRoute = "/" } = {}) => {
        if (typeof window !== "undefined") {
            dispatch({
                type: "startAuthenticating"
            });

            auth0 &&
                auth0.parseHash(
                    async (
                        err: Auth0ParseHashError | null,
                        authResult: Auth0DecodedHash | null
                    ) => {
                        await handleAuthResult({
                            err,
                            authResult,
                            dispatch,
                            auth0
                        });

                        navigate(postLoginRoute);
                    }
                );
        }
    };

    const isAuthenticated = () => {
        return !!(state.expiresAt && new Date().getTime() < state.expiresAt);
    };

    const isAuthorized = (roles: string | string[]) => {
        const _roles = Array.isArray(roles) ? roles : [roles];
        const metadata =
            state.user[
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
        isAuthenticating: state.isAuthenticating,
        isAuthenticated,
        isAuthorized,
        user: state.user,
        userId: state.user ? state.user.sub : null,
        authResult: state.authResult,
        login,
        signup,
        logout,
        handleAuthentication
    };
};
