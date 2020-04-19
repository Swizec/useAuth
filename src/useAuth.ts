import { useContext } from "react";

import { AuthContext } from "./AuthProvider";
import {
    useAuthInterface,
    handleAuthResultInterface,
    setSessionInterface
} from "./types";

const setSession: setSessionInterface = async ({
    dispatch,
    auth0,
    authResult
}) => {
    return new Promise((resolve, reject) => {
        resolve();
        // auth0.client.userInfo(
        //     authResult.accessToken || "",
        //     (err: any | null, user: any) => {
        //         if (err) {
        //             dispatch({
        //                 type: "error",
        //                 errorType: "userInfo",
        //                 error: err
        //             });
        //             reject(err);
        //         } else {
        //             dispatch({
        //                 type: "login",
        //                 authResult,
        //                 user
        //             });
        //             resolve(user);
        //         }
        //     }
        // );
    });
};

export const handleAuthResult: handleAuthResultInterface = async ({
    err,
    dispatch,
    auth0,
    authResult
}) => {
    console.log(authResult);

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
        auth0 && auth0.loginWithRedirect();
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

    const handleAuthentication = async ({ postLoginRoute = "/" } = {}) => {
        if (typeof window !== "undefined") {
            dispatch({
                type: "startAuthenticating"
            });

            if (auth0) {
                const authResult = await auth0.handleRedirectCallback();
                await handleAuthResult({ authResult, dispatch, auth0 });
                navigate(postLoginRoute);
            }
        }
    };

    const isAuthenticated = () => {
        return !!(state.expiresAt && new Date().getTime() < state.expiresAt);
    };

    return {
        isAuthenticating: state.isAuthenticating,
        isAuthenticated,
        user: state.user,
        userId: state.user ? state.user.sub : null,
        authResult: state.authResult,
        login,
        logout,
        handleAuthentication
    };
};
