import React from "react";
import { useAuth } from "react-use-auth";
import { Flex, Button, Box } from "rebass";
import { Link } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, login, logout } = useAuth();
  if (isAuthenticated()) {
    return <Button onClick={logout}>Logout</Button>;
  } else {
    return <Button onClick={login}>Login</Button>;
  }
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Flex style={{ justifyContent: "center" }}>
      <Box>
        <h1>Hi {isAuthenticated() ? user.name : "people"}</h1>
        <p>Welcome to your new Gatsby site.</p>
        <p>Now go build something great.</p>
        <Login />
        <p>Go to <Link to="/private">Private page</Link></p>

        <div>
          <h2>How to use useAuth</h2>
          <p>
            <a href="https://github.com/Swizec/useAuth">
              <code>useAuth</code>
            </a>{" "}
            is designed to be quick to setup. You'll need an Auth0 account with
            an app domain and client id.
          </p>
          <h3>1. Install the hook</h3>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=null&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=%24%20yarn%20add%20react-use-auth"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.amazonaws.com/techletter.app/screenshot-1565368399494.png"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            Downloads from npm, adds to your package.json, etc. You can use{" "}
            <code>npm</code> as well.
          </p>
          <h3>2. Set up AuthProvider</h3>
          <p>
            useAuth uses an <code>AuthProvider</code> component to configure the
            Auth0 client and share state between components. It's using React
            context with a reducer behind the scenes, but that's an
            implementation detail.
          </p>
          <p>
            I recommend adding this around your root component. In Gatsby that's
            done in <code>gatsby-browser.js</code> and{" "}
            <code>gatsby-ssr.js</code>. Yes <code>useAuth</code> is built so it
            doesn't break server-side rendering. ✌️
          </p>
          <p>But of course server-side "you" will always be logged out.</p>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=javascript&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=%2F%2F%20gatsby-browser.js%0A%0Aimport%20React%20from%20%22react%22%0Aimport%20%7B%20navigate%20%7D%20from%20%22gatsby%22%0A%0Aimport%20%7B%20AuthProvider%20%7D%20from%20%22react-use-auth%22%0A%0Aexport%20const%20wrapRootElement%20%3D%20(%7B%20element%20%7D)%20%3D%3E%20(%0A%09%3CAuthProvider%0A%09%20%20navigate%3D%7Bnavigate%7D%0A%09%20%20auth0_domain%3D%22useauth.auth0.com%22%0A%09%20%20auth0_client_id%3D%22GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh%22%0A%09%3E%0A%09%20%20%7Belement%7D%0A%09%3C%2FAuthProvider%3E%0A)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.amazonaws.com/techletter.app/screenshot-1565368399498.png"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            <code>&lt;AuthProvider&gt;</code> creates a context, sets up a state
            reducer, initializes an Auth0 client and so on. Everything you need
            for authentication to work in your whole app :)
          </p>
          <p>The API takes a couple config options:</p>
          <ol>
            <li>
              <code>navigate</code> –&nbsp;your navigation function, used for
              redirects. I've tested with Gatsby, but anything should work
            </li>
            <li>
              <code>auth0_domain</code> –&nbsp;from your Auth0 app
            </li>
            <li>
              <code>auth0_client_id</code> –&nbsp;from your Auth0 app
            </li>
            <li>
              <code>auth0_params</code> –&nbsp;an object that lets you overwrite
              any of the default Auth0 client parameters
            </li>
          </ol>
          <p>
            <em>
              PS: even though Auth doesn't do anything server-side, useAuth will
              throw errors during build, if its context doesn't exist
            </em>
          </p>
          <h4>Default Auth0 params</h4>
          <p>
            By default <code>useAuth</code>'s Auth0 client uses these params:
          </p>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=javascript&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=const%20params%20%3D%20%7B%0A%20%20%20%20domain%3A%20auth0_domain%2C%0A%20%20%20%20clientID%3A%20auth0_client_id%2C%0A%20%20%20%20redirectUri%3A%20%60%24%7Bcallback_domain%7D%2Fauth0_callback%60%2C%0A%20%20%20%20audience%3A%20%60https%3A%2F%2F%24%7Bauth0_domain%7D%2Fapi%2Fv2%2F%60%2C%0A%20%20%20%20responseType%3A%20%22token%20id_token%22%2C%0A%20%20%20%20scope%3A%20%22openid%20profile%20email%22%0A%7D%3B"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/static/media/loader.2cf70bc0.gif"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            <code>domain</code> and <code>clientID</code> come from your props.{" "}
          </p>
          <p>
            <code>redirectUri</code> is set to use the{" "}
            <code>auth0_callback</code> page on the current domain. Auth0
            redirects here after users login so you can set cookies and stuff.{" "}
            <code>useAuth</code> will handle this for you ✌️
          </p>
          <p>
            <code>audience</code> is set to use api/v2. I know this is necessary
            but honestly have been copypasting it through several of my
            projects.
          </p>
          <p>
            <code>responseType</code> same here. I copy paste this from old
            projects so I figured it's a good default.
          </p>
          <p>
            <code>scope</code> you need <code>openid</code> for social logins
            and to be able to fetch user profiles after authentication. Profile
            and Email too. You can add more via the <code>auth0_params</code>{" "}
            override.
          </p>
          <h3>3. Create the callback page</h3>
          <p>
            Auth0 and most other authentication providers use OAuth. That
            requires redirecting your user to <em>their</em> login form. After
            login, the provider redirects the user back to <em>your</em> app.
          </p>
          <p>
            Any way of creating React pages should work, here's what I use for
            Gatsby.
          </p>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=javascript&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=%2F%2F%20src%2Fpages%2Fauth0_callback%0A%0Aimport%20React%2C%20%7B%20useEffect%20%7D%20from%20%22react%22%0A%0Aimport%20%7B%20useAuth%20%7D%20from%20%22react-use-auth%22%0Aimport%20Layout%20from%20%22..%2Fcomponents%2Flayout%22%0A%0Aconst%20Auth0CallbackPage%20%3D%20()%20%3D%3E%20%7B%0A%20%20const%20%7B%20handleAuthentication%20%7D%20%3D%20useAuth()%0A%20%20useEffect(()%20%3D%3E%20%7B%0A%20%20%20%20handleAuthentication()%0A%20%20%7D%2C%20%5B%5D)%0A%0A%20%20return%20(%0A%20%20%20%20%3CLayout%3E%0A%20%20%20%20%20%20%3Ch1%3E%0A%20%20%20%20%20%20%20%20This%20is%20the%20auth%20callback%20page%2C%20you%20should%20be%20redirected%20immediately.%0A%20%20%20%20%20%20%3C%2Fh1%3E%0A%20%20%20%20%3C%2FLayout%3E%0A%20%20)%0A%7D%0A%0Aexport%20default%20Auth0CallbackPage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.amazonaws.com/techletter.app/screenshot-1565368399461.png"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            The goal is to load a page, briefly show some text, and run the{" "}
            <code>handleAuthentication</code> method from <code>useAuth</code>{" "}
            on page load.
          </p>
          <p>
            That method will create a cookie in local storage with your user's
            information and redirect back to homepage. Redirecting to other
            post-login pages currently isn't supported but is a good idea now
            that I thought of it{" "}
            <span role="img" aria-label="thinking">
              🤔
            </span>
          </p>
          <p>
            <strong>
              <em>
                PS: Make sure you add <code>&lt;domain&gt;/auth0_callback</code>{" "}
                as a valid callback URL in your Auth0 config
              </em>
            </strong>
          </p>
          <h3>4. Enjoy useAuth</h3>
          <p>
            <a href="https://gatsby-useauth-example.now.sh">
              <img src="https://i.imgur.com/KunEemN.gif" alt="" />
            </a>
          </p>
          <p>
            You're ready to use <code>useAuth</code> for authentication in your
            React app.
          </p>
          <p>Here's a login button for example:</p>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=javascript&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=%2F%2F%20src%2Fpages%2Findex.js%0A%0Aconst%20Login%20%3D%20()%20%3D%3E%20%7B%0A%20%20const%20%7B%20isAuthenticated%2C%20login%2C%20logout%20%7D%20%3D%20useAuth()%0A%0A%20%20if%20(isAuthenticated())%20%7B%0A%20%20%20%20return%20%3CButton%20onClick%3D%7Blogout%7D%3ELogout%3C%2FButton%3E%0A%20%20%7D%20else%20%7B%0A%20%20%20%20return%20%3CButton%20onClick%3D%7Blogin%7D%3ELogin%3C%2FButton%3E%0A%20%20%7D%0A%7D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.amazonaws.com/techletter.app/screenshot-1565368399596.png"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            <code>isAuthenticated</code> is a method that checks if the user's
            cookie is still valid. <code>login</code> and <code>logout</code>{" "}
            trigger their respective actions.
          </p>
          <p>You can even say hello to your users</p>
          <div>
            <a
              href="https://carbon.now.sh/?bg=rgba(255,255,255,1)&amp;t=seti&amp;l=javascript&amp;ds=true&amp;wc=true&amp;wa=true&amp;pv=48px&amp;ph=32px&amp;ln=false&amp;code=%2F%2F%20src%2Fpages%2Findex.js%0A%0Aconst%20IndexPage%20%3D%20()%20%3D%3E%20%7B%0A%20%20const%20%7B%20isAuthenticated%2C%20user%20%7D%20%3D%20useAuth()%0A%0A%20%20return%20(%0A%20%20%20%20%3CLayout%3E%0A%20%20%20%20%20%20%3CSEO%20title%3D%22Home%22%20%2F%3E%0A%20%20%20%20%20%20%3Ch1%3EHi%20%7BisAuthenticated()%20%3F%20user.name%20%3A%20%22people%22%7D%3C%2Fh1%3E"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.amazonaws.com/techletter.app/screenshot-1565368399488.png"
                alt="Click through for source"
              />
            </a>
          </div>
          <p>
            Check <code>isAuthenticated</code> then use the user object. Simple
            as that.
          </p>
        </div>

        <Link to="/page-2/">Go to page 2</Link>
      </Box>
    </Flex>
  );
};

export default Home;
