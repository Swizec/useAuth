/** @jsx jsx */
import { jsx } from "theme-ui";
import { AuthConfig, Providers } from "react-use-auth";
import { navigate } from "gatsby";
import Layout from "./components/layout";

export const wrapPageElement = ({ element, props }) => (
    <Layout {...props}>
        <AuthConfig
            authProvider={Providers.Auth0}
            navigate={navigate}
            params={{
                domain: "useauth.auth0.com",
                clientID: "GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
            }}
        />
        {element}
    </Layout>
);

export { default as Banner } from "./components/banner";
export { default as Cards } from "./components/cards";
export { default as Note } from "./components/note";
export { default as Tiles } from "./components/tiles";
