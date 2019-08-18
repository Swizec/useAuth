import React from "react";
import "./App.css";
import { Switch, Route, withRouter } from "react-router-dom";
import { AuthProvider } from "react-use-auth";

import Home from "./pages/Home";
import AUTHCallback from "./pages/AUTHCallback";

function App(props) {
  return (
    <AuthProvider
      navigate={props.history.push}
      auth0_domain="useauth.auth0.com"
      auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
    >
      <Switch>
        <Route path="/auth0_callback" component={AUTHCallback} />
        <Route path="/" component={Home} />
      </Switch>
    </AuthProvider>
  );
}

export default withRouter(App);
