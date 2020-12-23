import { AuthConfig } from "react-use-auth";
import { Auth0 } from "react-use-auth/auth0";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return (
        <>
            <AuthConfig
                authProvider={Auth0}
                navigate={url => router.push(url)}
                params={{
                    auth0_domain: "useauth.auth0.com",
                    auth0_client_id: "GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
                }}
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
