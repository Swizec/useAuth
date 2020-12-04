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

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <AuthConfig
      authProvider={Providers.Auth0}
      navigate={navigate}
      params={{
        domain: "useauth.auth0.com",
        clientID: "GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh",
      }}
    />
    {element}
  </ThemeProvider>
)
