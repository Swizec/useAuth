/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React, { useEffect } from "react"
import { useAuth } from "react-use-auth"
import { Providers } from "react-use-auth"
import { navigate } from "gatsby"

const Config = () => {
  const { dispatch } = useAuth()

  useEffect(() => {
    dispatch("SET_CONFIG", {
      authProvider: new Providers.NetlifyIdentity({ dispatch }),
      navigate,
      callbackDomain: "",
    })
  }, [])

  return null
}

// You can delete this file if you're not using it
export const wrapRootElement = ({ element }) => {
  return (
    <>
      <Config />
      {element}
    </>
  )
}
