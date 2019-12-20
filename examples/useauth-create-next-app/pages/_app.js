import React from "react";
import App from "next/app";
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

// extend App component and return our function so we can use useRouter :P
export default class _App extends App {
    render() {
        return <MyApp {...this.props} />;
    }
}
