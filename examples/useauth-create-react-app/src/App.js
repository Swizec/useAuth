import React from "react";
import "./App.css";
import { Switch, Route, withRouter, useHistory } from "react-router-dom";
import { AuthProvider } from "react-use-auth";

import Home from "./pages/Home";
import { SuperSecretPage } from "./pages/SuperSecret";
import AUTHCallback from "./pages/AUTHCallback";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/Login";
import { AuthErrorPage } from "./pages/AuthError";

function App(props) {
    let history = useHistory();
    return (
        <AuthProvider
            navigate={history.replace}
            auth0_domain="useauth.auth0.com"
            auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
        >
            <Switch>
                <Route path="/auth0_callback">
                    <AUTHCallback />
                </Route>
                <PrivateRoute path="/private">
                    <SuperSecretPage />
                </PrivateRoute>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/auth-error">
                    <AuthErrorPage />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </AuthProvider>
    );
}

export default withRouter(App);
