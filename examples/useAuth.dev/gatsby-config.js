const remarkPlugins = [require("remark-slug")];

module.exports = {
    plugins: [
        "gatsby-plugin-preload-fonts",
        "gatsby-plugin-theme-ui",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-catch-links",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "docsImages",
                path: `${__dirname}/src/pages/docs/images`
            }
        },
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                extensions: [".mdx", ".md"],
                remarkPlugins,
                gatsbyRemarkPlugins: [
                    "gatsby-remark-copy-linked-files",
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            markdownCaptions: false,
                            maxWidth: 890,
                            linkImagestoOriginal: false,
                            showCaptions: ["title", "alt"],
                            withWebp: true,
                            wrapperStyle:
                                "text-align: center; font-style: italic",
                            tracedSVG: {
                                color: `lightgray`,
                                optTolerance: 0.4,
                                turdSize: 100,
                                turnPolicy: "TURNPOLICY_MAJORITY"
                            },
                            loading: "lazy"
                        }
                    }
                ]
            }
        },
        "gatsby-plugin-simple-analytics"
    ]
};
