<h1 align="center">useAuth</h1>
<h2 align="center">the quickest way to add authentication to your React app</h2>
<p> 
  <a href="#contributors-">
    <img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-20-orange.svg?style=round-square"/>
  </a>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-green.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Swizec/useAuth/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

<div align="center">
<a href="https://useAuth.dev"><img src="https://useauth.dev/useauth-card.png" alt="useAuth.dev" title="useAuth.dev" /></a>
</div>

## Getting Started

[`useAuth`](https://useauth.dev) is designed to be quick to setup. You'll need an account with Auth0 or Netlify Identity and the appropriate access keys.

### 1. Install the hook

```
$ yarn add react-use-auth
```

Downloads from npm, adds to your package.json, etc. You can use npm as well.

### 2. Install your auth client

[`useAuth`](https://useauth.dev) does not install its own authentication clients. Instead they're marked as peer dependencies.

Install `auth0-js` or `netlify-identity-widget` depending on what you'd like to use. More coming soon :)

```
$ yarn add auth0-js
```

or

```
$ yarn add netlify-identity-widget
```

You'll see warnings about missing peer dependencies for the client you aren't using. That's okay.

### 3. Configure with AuthConfig

[`useAuth`](https://useauth.dev) uses an `<AuthConfig>` component to configure your authentication client. We use XState behind the scenes to manage authentication state for you.

Ensure `AuthConfig` renders on every page.

With Gatsby, add it to `gatsby-browser.js`. With NextJS, `_app.js` is best. You don't _need_ to wrap your component tree, but you can if you prefer. We make sure useAuth doesn't break server-side rendering. ✌️

```jsx
// gatsby-browser.js
import * as React from "react";
import { navigate } from "gatsby";

import { AuthConfig } from "react-use-auth";
import { Auth0 } from "react-use-auth/auth0";

export const wrapRootElement = ({ element }) => (
    <>
        <AuthConfig
            navigate={navigate}
            authProvider={Auth0}
            params={{
                domain: "useauth.auth0.com",
                clientID: "GjWNFNOHqlino7lQNjBwEywalaYtbIzh"
            }}
        />
        {element}
    </>
);
```

`<AuthConfig>` initializes the global XState state machine, sets up an Auth0 client, and validates user sessions on every load. You now have easy access to authentication in your whole app :)

The config options are:

1. `navigate` – your navigation function, used for redirects. Tested with Gatsby, NextJS, and React Router. Anything should work.

2. `authProvider` – the useAuth interface to your authentication provider.

3. `params` – parameters for your authentication provider

[`useAuth`](https://useauth.dev) client wrappers provide smart defaults.

More detail on using custom configuration for each client in [Use with Auth0](https://useauth.dev/docs/auth0), and [Use with Netlify Identity](https://useauth.dev/docs/netlify-identity). To learn about how this works, go to [Create an auth provider](https://useauth.dev/docs/auth-providers)

PS: feel free to use my Auth0 domain and clientID to see if [`useAuth`](https://useauth.dev) is a good fit for you. That's why they're visible in the code snippet 😊

### 4. Create the callback page

Auth0 and most other authentication providers use OAuth. That requires redirecting your user to their login form. After login, the provider redirects users back to your app.

You can skip this step with Netlify Identity. It uses an in-page popup.

Any way of creating React pages should work, here's the code I use for Gatsby:

```jsx
import * as React from "react"
import { useAuth } from "react-use-auth"

const Auth0CallbackPage = () => {
    const { handleAuthentication } = useAuth()
    React.useEffect(() => {
        handleAuthentication()
    }, [handleAuthentication])

    return (
        <h1>
            This is the auth callback page,
            you should be redirected immediately!
        </h1>
    )
}

export default Auth0CallbackPage
```

The goal is to load a page, briefly show some text, and run the `handleAuthentication` method from [`useAuth`](https://useauth.dev) on page load.

That method will create a cookie in local storage with your user's information and redirect back to homepage. You can pass a `postLoginRoute` param to redirect to a different page.

Make sure you add `<domain>/auth0_callback` as a valid callback URL in your Auth0 config.

### 5. Enjoy useAuth

You're ready to use [`useAuth`](https://useauth.dev) for authentication in your React app. 🤘

Here's a login button for example:

```jsx
const Login = () => {
    const { isAuthenticated, login, logout } = useAuth();

    if (isAuthenticated()) {
        return <Button onClick={logout}>Logout</Button>;
    } else {
        return <Button onClick={login}>Login</Button>;
    }
};
```

`isAuthenticated` is a method that checks if the user's cookie is still valid.

`login` and `logout` trigger their respective actions.

You can even say hello to your users:

```jsx
// src/pages/index.js

const IndexPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi {isAuthenticated() ? user.name : "people"}</h1>
  )
}
```

Check `isAuthenticated` then use the `user` object. ✌️

---

For more detailed docs visit [useAuth.dev](https://useauth.dev)

---

You can try it out here 👉 https://gatsby-useauth-example.now.sh/

## Author

👤 **Swizec Teller <swizec@swizec.com>**

-   Github: [@swizec](https://github.com/swizec)
-   Twitter: [@swizec](https://twitter.com/swizec)
-   Blog: [swizec.com/blog](https://swizec.com/blog)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Swizec/useAuth/issues).

I am looking to support other authentication providers. Please help :)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Swizec Teller <swizec@swizec.com>](https://github.com/swizec).<br />
This project is [MIT](https://github.com/Swizec/useAuth/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dejanstrancar"><img src="https://avatars1.githubusercontent.com/u/3260215?v=4" width="100px;" alt=""/><br /><sub><b>Dejan</b></sub></a><br /><a href="#example-dejanstrancar" title="Examples">💡</a></td>
    <td align="center"><a href="https://jasonformat.com"><img src="https://avatars2.githubusercontent.com/u/105127?v=4" width="100px;" alt=""/><br /><sub><b>Jason Miller</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=developit" title="Code">💻</a></td>
    <td align="center"><a href="https://graham.now.sh"><img src="https://avatars1.githubusercontent.com/u/4955937?v=4" width="100px;" alt=""/><br /><sub><b>Graham Barber</b></sub></a><br /><a href="#question-puregarlic" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/MateusGabi"><img src="https://avatars3.githubusercontent.com/u/14940643?v=4" width="100px;" alt=""/><br /><sub><b>Mateus Gabi</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=MateusGabi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jgalat.dev/"><img src="https://avatars3.githubusercontent.com/u/9066191?v=4" width="100px;" alt=""/><br /><sub><b>Jorge Galat</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=jgalat" title="Code">💻</a></td>
    <td align="center"><a href="http://swizec.com"><img src="https://avatars0.githubusercontent.com/u/56883?v=4" width="100px;" alt=""/><br /><sub><b>Swizec Teller</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=Swizec" title="Code">💻</a> <a href="https://github.com/Swizec/useAuth/commits?author=Swizec" title="Documentation">📖</a> <a href="#blog-Swizec" title="Blogposts">📝</a> <a href="#example-Swizec" title="Examples">💡</a> <a href="#maintenance-Swizec" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/NWRichmond"><img src="https://avatars0.githubusercontent.com/u/5732000?v=4" width="100px;" alt=""/><br /><sub><b>Nick Richmond</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=NWRichmond" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://olliemonk.com"><img src="https://avatars0.githubusercontent.com/u/7108120?v=4" width="100px;" alt=""/><br /><sub><b>Ollie Monk</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=omonk" title="Documentation">📖</a> <a href="https://github.com/Swizec/useAuth/commits?author=omonk" title="Code">💻</a></td>
    <td align="center"><a href="http://henrikwenz.de/"><img src="https://avatars3.githubusercontent.com/u/1265681?v=4" width="100px;" alt=""/><br /><sub><b>Henrik Wenz</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/issues?q=author%3AHaNdTriX" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://twitter.com/maxchehab"><img src="https://avatars1.githubusercontent.com/u/13038919?v=4" width="100px;" alt=""/><br /><sub><b>Max Chehab</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=maxchehab" title="Documentation">📖</a></td>
    <td align="center"><a href="https://joelb.dev"><img src="https://avatars0.githubusercontent.com/u/6668097?v=4" width="100px;" alt=""/><br /><sub><b>Joel Bartlett</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=murbar" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/smehdii"><img src="https://avatars1.githubusercontent.com/u/22805576?v=4" width="100px;" alt=""/><br /><sub><b>SIDDIK MEHDI </b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=smehdii" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sophister"><img src="https://avatars1.githubusercontent.com/u/219501?v=4" width="100px;" alt=""/><br /><sub><b>Jess</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/issues?q=author%3Asophister" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/vasco3"><img src="https://avatars0.githubusercontent.com/u/804301?v=4" width="100px;" alt=""/><br /><sub><b>Jorge Cuadra</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=vasco3" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.oyvinmar.com/"><img src="https://avatars0.githubusercontent.com/u/364853?v=4" width="100px;" alt=""/><br /><sub><b>Øyvind Marthinsen</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=oyvinmar" title="Code">💻</a></td>
    <td align="center"><a href="http://feed.no"><img src="https://avatars3.githubusercontent.com/u/764318?v=4" width="100px;" alt=""/><br /><sub><b>Fredrik Søgaard</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=fredrik-sogaard" title="Code">💻</a></td>
    <td align="center"><a href="http://ottofeller.com"><img src="https://avatars1.githubusercontent.com/u/58164?v=4" width="100px;" alt=""/><br /><sub><b>Artem Rudenko</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=gvidon" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/traverspinkerton"><img src="https://avatars3.githubusercontent.com/u/6158476?v=4" width="100px;" alt=""/><br /><sub><b>Travers Pinkerton</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=traverspinkerton" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/erichodges"><img src="https://avatars2.githubusercontent.com/u/14981329?v=4" width="100px;" alt=""/><br /><sub><b>Eric Hodges</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=erichodges" title="Code">💻</a></td>
    <td align="center"><a href="http://fitzsimons.dev"><img src="https://avatars0.githubusercontent.com/u/3719502?v=4" width="100px;" alt=""/><br /><sub><b>Devin Fitzsimons</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=aisflat439" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jasonLaster"><img src="https://avatars1.githubusercontent.com/u/254562?v=4" width="100px;" alt=""/><br /><sub><b>Jason Laster</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=jasonLaster" title="Documentation">📖</a> <a href="https://github.com/Swizec/useAuth/commits?author=jasonLaster" title="Code">💻</a> <a href="https://github.com/Swizec/useAuth/issues?q=author%3AjasonLaster" title="Bug reports">🐛</a></td>
  <tr>
    <td align="center"><a href="https://patrick.wtf"><img src="https://avatars1.githubusercontent.com/u/667029?v=4" width="100px;" alt=""/><br /><sub><b>Patrick Arminio</b></sub></a><br /><a href="https://github.com/Swizec/useAuth/commits?author=patrick91" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
