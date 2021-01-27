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
      params={{
        firebaseConfig: {
          apiKey: "AIzaSyCdtQ6V3qDxpgDO-usa3zWvBhIJKpAd4mM",
          authDomain: "useauth-demo.firebaseapp.com",
          projectId: "useauth-demo",
          storageBucket: "useauth-demo.appspot.com",
          messagingSenderId: "520315046120",
          appId: "1:520315046120:web:4384141e88f49e638c215d",
        },
      }}
    />
    {element}
  </ThemeProvider>
)
