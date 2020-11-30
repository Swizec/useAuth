/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React from "react"
import { useAuth } from "react-use-auth"
import { Providers } from "react-use-auth"
import { navigate } from "gatsby"

// You can delete this file if you're not using it
export const wrapRootElement = ({ element }) => {
  const { dispatch } = useAuth()

  dispatch("SET_CONFIG", {
    authProvider: new Providers.NetlifyIdentity(),
    navigate,
    callbackDomain: "",
  })

  return <>{element}</>
}
