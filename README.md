<h1 align="center">useAuth – the simplest way to add authentication to your React app</h1>
<p> 
  <a href="#contributors-">
    <img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-11-orange.svg?style=round-square"/>
  </a>
  <img alt="Version" src="https://img.shields.io/badge/version-0.5.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Swizec/useAuth/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

> The simplest way to add authentication to your React app. Handles everything for you. Users, login forms, redirects, sharing state between components. Everything

![](https://s3.amazonaws.com/techletter.app/screenshot-1565368397655.png)

## How to use useAuth

[`useAuth`](https://github.com/Swizec/useAuth) is designed to be quick to setup. You'll need an Auth0 account with an app domain and client id.

### 1. Install the hook

```
$ yarn add react-use-auth
```

Downloads from npm, adds to your package.json, etc. You can use `npm` as well.

### 2. Set up AuthProvider

useAuth uses an `AuthProvider` component to configure the Auth0 client and share state between components. It's using React context with a reducer behind the scenes, but that's an implementation detail.

I recommend adding this around your root component. In Gatsby that's done in `gatsby-browser.js` and `gatsby-ssr.js`. Yes `useAuth` is built so it doesn't break server-side rendering. ✌️

But of course server-side "you" will always be logged out.

```javascript
// gatsby-browser.js

import React from "react";
import { navigate } from "gatsby";

import { AuthProvider } from "react-use-auth";

export const wrapRootElement = ({ element }) => (
    <AuthProvider
        navigate={navigate}
        auth0_domain="useauth.auth0.com"
        auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
    >
        {element}
    </AuthProvider>
);
```

`<AuthProvider>` creates a context, sets up a state reducer, initializes an Auth0 client and so on. Everything you need for authentication to work in your whole app :)

The API takes a couple config options:

1. `navigate` – your navigation function, used for redirects. I've tested with Gatsby, but anything should work
2. `auth0_domain` – from your Auth0 app
3. `auth0_client_id` – from your Auth0 app
4. `auth0_params` – an object that lets you overwrite any of the default Auth0 client parameters

_PS: even though Auth doesn't do anything server-side, useAuth will throw errors during build, if its context doesn't exist_

#### Default Auth0 params

By default `useAuth`'s Auth0 client uses these params:

```javascript
const params = {
    domain: auth0_domain,
    clientID: auth0_client_id,
    redirectUri: `${callback_domain}/auth0_callback`,
    audience: `https://${auth0_audience_domain || auth0_domain}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email"
};
```

`domain` and `clientID` come from your props.

`redirectUri` is set to use the `auth0_callback` page on the current domain. Auth0 redirects here after users login so you can set cookies and stuff. `useAuth` will handle this for you ✌️

`audience` is set to use api/v2. I know this is necessary but honestly have been copypasting it through several of my projects. You can define a custom audience domain with `auth0_audience_domain`.

`responseType` same here. I copy paste this from old projects so I figured it's a good default.

`scope` you need `openid` for social logins and to be able to fetch user profiles after authentication. Profile and Email too. You can add more via the `auth0_params` override.

### 3. Create the callback page

Auth0 and most other authentication providers use OAuth. That requires redirecting your user to _their_ login form. After login, the provider redirects the user back to _your_ app.

Any way of creating React pages should work, here's what I use for Gatsby.

```javascript
// src/pages/auth0_callback

import React, { useEffect } from "react";

import { useAuth } from "react-use-auth";
import Layout from "../components/layout";

const Auth0CallbackPage = () => {
    const { handleAuthentication } = useAuth();
    useEffect(() => {
        handleAuthentication();
    }, []);

    return (
        <Layout>
            <h1>
                This is the auth callback page, you should be redirected
                immediately.
            </h1>
        </Layout>
    );
};

export default Auth0CallbackPage;
```

The goal is to load a page, briefly show some text, and run the `handleAuthentication` method from `useAuth` on page load.

That method will create a cookie in local storage with your user's information and redirect back to the homepage by default.

To redirect to a route other than the homepage after the user is logged in, supply the `handleAuthentication` function an Object Literal with the `postLoginRoute` key and an associated route value. For example, to route to `/account`, call `handleAuthentication` as follows:

```javascript
handleAuthentication({ postLoginRoute: "/account" });
```

**_PS: Make sure you add `<domain>/auth0_callback` as a valid callback URL in your Auth0 config_**

### 4. Enjoy useAuth

[![](https://i.imgur.com/KunEemN.gif)](https://gatsby-useauth-example.now.sh)

You're ready to use `useAuth` for authentication in your React app.

Here's a login button for example:

```javascript
// src/pages/index.js

const Login = () => {
    const { isAuthenticated, login, logout } = useAuth();

    if (isAuthenticated()) {
        return <Button onClick={logout}>Logout</Button>;
    } else {
        return <Button onClick={login}>Login</Button>;
    }
};
```

`isAuthenticated` is a method that checks if the user's cookie is still valid. `login` and `logout` trigger their respective actions.

You can even say hello to your users

```javascript
// src/pages/index.js

const IndexPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi {isAuthenticated() ? user.name : "people"}</h1>
```

Check `isAuthenticated` then use the user object. Simple as that.

`isAuthenticating` is a flag for checking whether or not `useAuth` is in the middle of validating login details. This allows you to then make requests to your user database and work out where to send users from the `auth0_callback` page, e.g. profile page or sign up.

```javascript
const Auth0CallbackPage = () => {
    const { user, isAuthenticating, handleAuthentication } = useAuth();
    const { loading, data, error } = useQuery(QUERY, {
        variables: { id: user.sub }
    });

    if (error) {
        return <h1>There was an error</h1>;
    }

    if (isAuthenticating || loading) {
        return (
            <h1>
                This is the auth callback page, you should be redirected
                immediately.
            </h1>
        );
    }

    const { user: dbUser } = data || {};
    const redirectUrl = dbUser ? "/app/profile" : "/app/signup";

    handleAuthentication({ postLoginRoute: redirectUrl });
};
```

## Checklist for configuring Auth0

There's a couple of required configurations you need to make in Auth0 to make useAuth run smoothly.

**Callback URLs**

You need to allow both local development and your production app in callback URLs. It's a whitelist that tells Auth0 that your login request is coming from the right source.

![](https://i.imgur.com/xz8UK8Z.png)

⚠️ **Allowed Web Origins**

useAuth avoids using local storage for secure tokens. For Auth0 to know that our `checkSession` request is coming from the right source, you need to add your URLs to allowed web origins.

![](https://i.imgur.com/w2mmHH1.png)

**Allowed logout urls**

After logging out, Auth0 redirects back to your app. Again, it needs to know you aren't up to anything shady. If you are getting 400 response errors on page load, this is the most likely culprit.

![](https://i.imgur.com/S160EiI.png)

# Tips & tricks

## Persisting login after refresh

**NB Make sure you're not blocking cookies! Extensions like privacy badger and the Brave browser will prevent Auth0 from setting cookies so refreshing between logins wont work**

After you've set everything up (and you're using social sign on methods) you'll notice that refreshing doesn't keep your user logged in... 👎

If you're using an IdP such as Google or Github to provide identity, you will need to register an app on Auth0 to enable this behaviour. The steps to create this behaviour are a bit nested in docs but can be achieved relatively simply by following the guide [`Set Up Social Connections`](https://auth0.com/docs/dashboard/guides/connections/set-up-connections-social) on the Auth0 site. The guide follows steps for Google sign on, your mileage with other providers may vary...

For a more detailed understanding of why this is happening you can have a read through [this section](https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/#Securing-your-React-App) of Auth0s guide to setting up a secure React application. (Pro tip: search for `Keeping Users Signed In after a Refresh` to jump straight to the section in question).

## User's access tokens

Since version 0.4.0 useAuth exposes the entire Auth0 authResult object so you can access your user's id or access token. This is useful when you have to log the user into your own backend as well as the frontend.

For reference:

-   https://github.com/Swizec/useAuth/issues/11
-   https://github.com/Swizec/useAuth/issues/22

Like this:

```javascript
function SomeComponent() {
    const { authResult } = useAuth();

    console.log(authResult.idToken);
    console.log(authResult.accessToken);
    // etc, I recommend printing the authResult object to see everything that's available
}
```

## Granular role-based permissions

Since version 0.7.0 useAuth supports role-based permissions. Using roles, you can granularly control which parts of your site are available to which users.

You'll need to add some config on Auth0 and when using useAuth.

### Set up a Auth0 Rule

Auth0 rules are little snippets of JavaScript that run when you request user data.

Go to `Rules` and click `Create Rule`. Start an empty rule and add this code:

```javascript
function (user, context, callback) {
  const namespace = 'https://YOUR_DOMAIN';
  const assignedRoles = (context.authorization || {}).roles;

  user.user_metadata = user.user_metadata || {};

  user.user_metadata.roles = assignedRoles;

  context.idToken[namespace + '/user_metadata'] = user.user_metadata;

  callback(null, user, context);
}
```

This rule adds user roles to their meta data. You have to define the `namespace`. Make sure it looks like a URL.

### Add customPropertyNamespace to AuthProvider

When rendering your `<AuthProvider>` add the custom property namespace. Make sure it matches the namespace you used above.

```javascript
export const wrapPageElement = ({ element, props }) => (
  <AuthProvider
    navigate={navigate}
    // ...
    customPropertyNamespace="https://YOUR_DOMAIN"
  >
```

### use isAuthorized to check role permissions

Now you can use `isAuthorized` to check if the current user has access to some part of your site.

```javascript
        {isAuthorized("Student") ? (
          <Content
            {...props}
            fullwidth={fullwidth}
            menu={menu}
            setMenu={setMenu}
            nav={nav}
          />
        : null}
```

If current user is authenticated _and_ has the `Student` role, show the content. Otherwise null.

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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
