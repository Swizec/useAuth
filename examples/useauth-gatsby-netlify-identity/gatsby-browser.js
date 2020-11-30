/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React from "react"
import { useAuth } from "react-use-auth"
import { NetlifyIdentity } from "react-use-auth/dist/providers"
import { navigate } from "gatsby"

// You can delete this file if you're not using it
export const wrapRootElement = ({ element }) => {
  const { dispatch } = useAuth()

  dispatch("SET_CONFIG", {
    authProvider: new NetlifyIdentity(),
    navigate,
    callbackDomain: "",
  })

  return <>{element}</>
}
