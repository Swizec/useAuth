import React, { createContext, useReducer } from "react";
import Auth0 from "auth0-js";

import { authReducer } from "./authReducer";

export const AuthContext = createContext(null);

export const AuthProvider = ({
    children,
    navigate,
    auth0_domain,
    auth0_client_id,
    auth0_params
}) => {
    const callback_domain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    const params = {
        domain: auth0_domain,
        clientID: auth0_client_id,
        redirectUri: `${callback_domain}/auth0_callback`,
        audience: `https://${auth0_domain}/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    };

    const auth0 = new Auth0.WebAuth({ ...params, ...auth0_params });

    const [state, dispatch] = useReducer(authReducer, {
        user:
            typeof localStorage !== "undefined"
                ? JSON.parse(localStorage.getItem("user"))
                : {},
        expiresAt:
            typeof localStorage !== "undefined"
                ? JSON.parse(localStorage.getItem("expires_at"))
                : null
    });

    console.log("auth provider", { state });

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch,
                auth0,
                navigate
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
