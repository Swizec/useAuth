import React from "react"
import { Link } from "gatsby"
import { Button } from "rebass"
import { useAuth } from "react-use-auth"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const Login = () => {
  const { isAuthenticated, login, logout, signup, isAuthenticating } = useAuth()

  if (isAuthenticated()) {
    return (
      <>
        <Button onClick={logout}>Logout</Button>
        <small>{isAuthenticating ? "Verifying ..." : null}</small>
      </>
    )
  } else {
    return (
      <>
        <Button onClick={login}>Login</Button>
        <Button onClick={signup}>Signup</Button>
        <small>{isAuthenticating ? "Verifying ..." : null}</small>
      </>
    )
  }
}

const IndexPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi {isAuthenticated() ? user.name : "people"}</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div id="firebaseui-auth-container"></div>
      <Login />
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>

      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}

export default IndexPage
