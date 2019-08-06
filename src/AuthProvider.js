import React, { createContext, useReducer } from "react";
import Auth0 from "auth0-js";

import { authReducer } from "./authReducer";

const AUTH0_DOMAIN = "sparkjoy.auth0.com";
const AUTH0_CLIENT_ID = "GGfO12E5R8iHPBPh87bym5b3gzmdaYY9";
const CALLBACK_DOMAIN =
    typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : "https://spark-joy.netlify.com/";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigate }) => {
    const auth0 = new Auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        redirectUri: `${CALLBACK_DOMAIN}/auth0_callback`,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        responseType: "token id_token",
        scope: "openidw profile email"
    });

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
