/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { ThemeProvider } from "emotion-theming"
import theme from "@rebass/preset"

import { Providers, AuthConfig } from "react-use-auth"

// function AuthConfig() {
//   const { dispatch } = useAuth()

//   useEffect(() => {
//     dispatch("SET_CONFIG", {
//       authProvider: new Providers.Auth0({
//         dispatch,
//         domain: "useauth.auth0.com",
//         clientID: "GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh",
//         redirectUri: "http://localhost:8000/auth0_callback",
//         responseType: "token id_token",
//         scope: "openid profile email",
//       }),
//       navigate,
//       callbackDomain: "",
//     })
//   }, [dispatch])

//   return null
// }

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <AuthConfig
      authProvider={Providers.Auth0}
      navigate={navigate}
      params={{
        domain: "useauth.auth0.com",
        clientID: "GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh",
        redirectUri: "http://localhost:8000/auth0_callback",
        responseType: "token id_token",
        scope: "openid profile email",
      }}
    />
    {element}
  </ThemeProvider>
)
