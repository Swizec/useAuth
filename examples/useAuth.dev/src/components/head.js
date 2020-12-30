import React from "react";
import { Helmet } from "react-helmet";
import { useThemeUI } from "theme-ui";
import pkg from "react-use-auth/package.json";

const Head = (props) => {
    const title = [
        props.title,
        props.pageContext.frontmatter
            ? props.pageContext.frontmatter.title
            : false,
        props._frontmatter ? props._frontmatter.title : false,
        "useAuth Docs"
    ]
        .filter(Boolean)
        .join(" – ");

    const { theme } = useThemeUI();

    return (
        <Helmet htmlAttributes={{ lang: "en-US" }}>
            <title>{title}</title>
            <meta name="description" content={pkg.description} />
            <link rel="icon" type="image/png" href="/icon.png" />
            <link
                rel="icon"
                media="(prefers-color-scheme:dark)"
                href="/icon.png"
                type="image/png"
            />
            <link rel="apple-touch-icon" type="image/png" href="/icon.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:image"
                content="https://useauth.dev/useauth-card.png"
            />
            <meta name="twitter:title" content={title} />
            <meta
                name="twitter:description"
                content="Add authentication to your React app in 5 minutes. Supports various auth providers."
            />
            <meta name="theme-color" content={theme.colors.background} />

            <meta property="og:url" content="https://useauth.dev" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="useAuth" />
            <meta
                property="og:description"
                content="Add authentication to your React app in 5 minutes. Supports various auth providers."
            />
            <meta
                property="og:image"
                content="https://useauth.dev/useauth-card.png"
            />
        </Helmet>
    );
};

export default Head;
