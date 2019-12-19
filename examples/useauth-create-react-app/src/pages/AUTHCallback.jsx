import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";
import { POST_LOGIN_ROUTE_KEY } from "../components/PrivateRoute";

const AUTHCallback = () => {
  let { handleAuthentication } = useAuth();

  useEffect(() => {
    let route = localStorage.getItem(POST_LOGIN_ROUTE_KEY);
    localStorage.removeItem(POST_LOGIN_ROUTE_KEY);

    let postLoginRoute = route || '/';
    handleAuthentication({ postLoginRoute });
  }, [handleAuthentication]);

  return (
    <h1>
      This is the auth callback page, you should be redirected immediately.
    </h1>
  );
};

export default AUTHCallback;
