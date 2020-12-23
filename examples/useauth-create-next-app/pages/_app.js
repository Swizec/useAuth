
import { AuthConfig } from "react-use-auth";
import { Auth0 } from "react-use-auth/auth0";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return (
        <>
            <AuthConfig
                authProvider={Auth0}
                navigate={(url) => router.push(url)}
                params={{
                    domain: "webreplay.us.auth0.com",
                    clientID: "E1B33wDDkz0J4mUC2WAVA2552Fj91uux"
                }}
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp
