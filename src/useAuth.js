import { useContext } from "react";

import { AuthContext } from "./AuthProvider";

async function setSession({ dispatch, auth0, authResult }) {
    return new Promise((resolve, reject) => {
        auth0.client.userInfo(authResult.accessToken, (err, user) => {
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
        });
    });
}

export const handleAuthResult = async ({ err, dispatch, auth0, authResult }) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
        await setSession({ dispatch, auth0, authResult });

        return true;
    } else if (err) {
        console.error(err);
        dispatch({
            type: "error",
            error: err,
            errorType: "authResult"
        });

        return false;
    }
};

export const useAuth = () => {
    const { state, dispatch, auth0, callback_domain, navigate } = useContext(
        AuthContext
    );

    const login = () => {
        auth0.authorize();
    };

    const logout = () => {
        auth0.logout({
            returnTo: callback_domain
        });
        dispatch({
            type: "logout"
        });

        // Return to the homepage after logout.
        navigate("/");
    };

    const handleAuthentication = () => {
        if (typeof window !== "undefined") {
            auth0.parseHash(async (err, authResult) => {
                await handleAuthResult({ err, authResult, dispatch, auth0 });

                navigate("/");
            });
        }
    };

    const isAuthenticated = () => {
        return state.expiresAt && new Date().getTime() < state.expiresAt;
    };

    return {
        isAuthenticated,
        user: state.user,
        userId: state.user ? state.user.sub : null,
        login,
        logout,
        handleAuthentication
    };
};
