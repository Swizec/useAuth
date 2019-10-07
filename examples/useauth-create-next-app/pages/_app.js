import React from "react";
import { AuthProvider } from "react-use-auth";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <AuthProvider
            navigate={router.push}
            auth0_domain="useauth.auth0.com"
            auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
        >
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
