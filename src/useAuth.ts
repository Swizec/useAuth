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

export const useAuth: useAuthInterface = () => {
    const { state, dispatch, auth0, callback_domain, navigate } = useContext(
        AuthContext
    );

    const login = () => {
        auth0 && auth0.authorize();
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

    const isAuthorized = (role: string) => {
        return (
            isAuthenticated() &&
            (state.user.user_metadata &&
                state.user.user_metadata.roles.includes(role))
        );
    };

    return {
        isAuthenticating: state.isAuthenticating,
        isAuthenticated,
        isAuthorized,
        user: state.user,
        userId: state.user ? state.user.sub : null,
        authResult: state.authResult,
        login,
        logout,
        handleAuthentication
    };
};
