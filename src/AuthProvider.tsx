import React, { useEffect } from "react";
import { AuthOptions as Auth0Options } from "auth0-js";

import { AuthProviderInterface } from "./types";
import { useAuth } from "./useAuth";
import { Auth0 } from "./providers";

export const AuthProvider: AuthProviderInterface = ({
    children,
    navigate,
    auth0_audience_domain,
    auth0_domain,
    auth0_client_id,
    auth0_params = {},
    customPropertyNamespace
}) => {
    const callbackDomain =
        typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.host}`
            : "http://localhost:8000";

    const audienceDomain = auth0_audience_domain || auth0_domain;

    const params: Auth0Options = {
        domain: auth0_domain,
        clientID: auth0_client_id,
        redirectUri: `${callbackDomain}/auth0_callback`,
        audience: `https://${audienceDomain}/api/v2/`,
        responseType: "token id_token",
        scope: "openid profile email"
    };

    const { dispatch } = useAuth();

    // Instantiate Auth0 client

    useEffect(() => {
        const auth0 = new Auth0({
            dispatch,
            customPropertyNamespace,
            ...params,
            ...auth0_params
        });

        dispatch("SET_CONFIG", {
            authProvider: auth0,
            navigate,
            callbackDomain
        });

        dispatch("CHECK_SESSION");
    }, [navigate, customPropertyNamespace, callbackDomain]);

    return <React.Fragment>{children}</React.Fragment>;
};
