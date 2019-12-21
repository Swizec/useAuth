import { useEffect } from "react";
import { useAuth } from "react-use-auth";
import { POST_LOGIN_ROUTE_KEY } from "../components/PrivateRoute";

const AUTHCallback = () => {
  let { handleAuthentication } = useAuth();

  useEffect(() => {
    let route = localStorage.getItem(POST_LOGIN_ROUTE_KEY);
    localStorage.removeItem(POST_LOGIN_ROUTE_KEY);

    let postLoginRoute = route || '/';
    handleAuthentication({ postLoginRoute });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default AUTHCallback;
