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

import { AuthConfig } from "react-use-auth"
import { FirebaseUI } from "react-use-auth/dist/FirebaseUI"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <AuthConfig
      authProvider={FirebaseUI}
      navigate={navigate}
      params={
        {
          /* ... */
        }
      }
    />
    {element}
  </ThemeProvider>
)
