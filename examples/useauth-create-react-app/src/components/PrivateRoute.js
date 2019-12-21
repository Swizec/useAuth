import React from "react";
import { Route, Redirect } from "react-router";
import { useAuth } from "react-use-auth";

export const POST_LOGIN_ROUTE_KEY = "postLoginRoute";

export function PrivateRoute({ children, ...rest }) {
    let { isAuthenticated, error, isAuthenticating } = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (isAuthenticating) {
                    return null;
                }

                if (isAuthenticated()) {
                    return children;
                }

                if (error) {
                    return <Redirect to={{ pathname: "/auth-error" }} />;
                }

                // Store the current url in localStorage in order to redirect to
                // to the correct page after authentication (see CallbackPage).
                localStorage.setItem(
                    POST_LOGIN_ROUTE_KEY,
                    `${location.pathname}${location.search}`
                );

                return <Redirect to={{ pathname: "/login" }} />;
            }}
        />
    );
}
