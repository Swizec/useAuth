import { useContext } from "react";

import { AuthContext } from "./AuthProvider";

export const useAuth = () => {
    const { state, dispatch, auth0, navigate } = useContext(AuthContext);

    const login = () => {
        auth0.authorize();
    };

    const logout = () => {
        dispatch({
            type: "logout"
        });

        // Return to the homepage after logout.
        navigate("/");
    };

    const handleAuthentication = () => {
        if (typeof window !== "undefined") {
            auth0.parseHash((err, authResult) => {
                if (
                    authResult &&
                    authResult.accessToken &&
                    authResult.idToken
                ) {
                    setSession(authResult);
                } else if (err) {
                    console.log(err);
                }
            });
        }
    };

    const setSession = authResult => {
        auth0.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                dispatch({
                    type: "login",
                    authResult,
                    user
                });
            }

            navigate("/");
        });
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
