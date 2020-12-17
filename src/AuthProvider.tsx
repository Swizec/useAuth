import React, { useEffect } from "react";
import { AuthOptions as Auth0Options } from "auth0-js";

import { AuthProviderInterface } from "./types";
import { useAuth } from "./useAuth";
// import { Auth0 } from "./providers/auth0";

export const AuthProvider: AuthProviderInterface = ({
    children,
    navigate,
    auth0_audience_domain,
    auth0_domain,
    auth0_client_id,
    auth0_params = {},
    customPropertyNamespace
}) => {
    useEffect(() => {
        console.error(
            "The AuthProvider root component no longer works. Please take 5min to migrate to AuthConfig. 👉 https://useauth.dev/docs/upgrading"
        );
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};
