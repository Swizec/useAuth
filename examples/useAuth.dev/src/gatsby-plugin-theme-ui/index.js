import prism from "@theme-ui/prism/presets/theme-ui";

export default {
    useColorSchemeMediaQuery: true,
    colors: {
        text: "#ccc",
        background: "#171923",
        primary: "#33ccff",
        secondary: "#5ed7ff",
        muted: "#191919",
        highlight: "#1E212F",
        gray: "#999999",
        accent: "#cc00ff",
        modes: {
            light: {
                text: "#000000",
                background: "#f0f0f0",
                primary: "#0d47a1",
                secondary: "#1565c0",
                muted: "#f6f6f6",
                highlight: "#D9E8F4",
                gray: "#777777",
                accent: "#660099",
                darken: "rgba(0, 0, 0, .25)"
            },
            deep: {
                text: "#ccc",
                background: "#212B30",
                primary: "#33ccff",
                secondary: "#5ed7ff",
                highlight: "#2A363D",
                accent: "hsl(290, 100%, 80%)",
                muted: "hsla(230, 20%, 0%, 20%)",
                gray: "hsl(210, 50%, 60%)"
            }
        }
    },
    fonts: {
        body:
            '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
        logoFont: "Asap, sans-serif",
        heading: "Roboto, sans-serif",
        monospace: "Menlo, monospace"
    },
    // heading: 'Roboto, sans-serif',
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
    fontWeights: {
        body: 400,
        heading: 800,
        bold: 700,
        display: 800
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25
    },
    sizes: {
        sidebar: 256
    },
    text: {
        logo: {
            display: "block",
            width: "100%",
            px: 2,
            py: 2,
            color: "inherit",
            textDecoration: "none",
            fontSize: 1,
            fontWeight: "bold",
            bg: "transparent"
        },
        heading: {
            fontFamily: "heading",
            fontWeight: "heading",
            lineHeight: "heading"
        },
        display: {
            variant: "text.heading",
            fontSize: [4, 5],
            fontWeight: "display",
            letterSpacing: "-0.03em",
            mt: 3
        },
        caps: {
            textTransform: "uppercase",
            letterSpacing: "0.2em"
        },
        body: {
            fontSize: [2]
        }
    },
    buttons: {
        primary: {
            color: "background",
            bg: "primary",
            fontWeight: "bold"
        },
        secondary: {
            variant: "buttons.primary",
            color: "background",
            bg: "secondary"
        },
        black: {
            fontWeight: "bold",
            color: "background",
            bg: "text",
            "&:hover, &:focus": {
                bg: "primary"
            }
        }
    },
    links: {
        button: {
            display: "inline-block",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 2,
            p: 3,
            color: "background",
            bg: "text",
            borderRadius: 6,
            "&:hover, &:focus": {
                color: "background",
                bg: "primary"
            }
        },
        // Left Nav Links       **************
        nav: {
            display: "block",
            width: "100%",
            px: 2,
            py: 2,
            color: "inherit",
            textDecoration: "none",
            fontSize: 1,
            fontWeight: "bold",
            bg: "transparent",
            transitionProperty: "background-color",
            transitionTimingFunction: "ease-out",
            transitionDuration: ".3s",
            borderRadius: 2,
            "&:hover": {
                bg: "highlight",
                color: "primary"
            },
            "&:focus": {
                outline: "none",
                bg: "highlight",
                color: "primary"
            },
            "&.active": {
                color: "primary",
                bg: "highlight"
            }
        }
    },
    badges: {
        primary: {
            color: "background"
        },
        highlight: {
            color: "text",
            bg: "highlight"
        },
        accent: {
            color: "background",
            bg: "accent"
        },
        outline: {
            color: "transparent",
            bg: "transparent",
            boxShadow: "inset 0 0 0 0px"
        },
        circle: {
            height: 16,
            minWidth: 16,
            lineHeight: "16px",
            textAlign: "center",
            borderRadius: 9999
        }
    },
    images: {
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 9999
        }
    },
    cards: {
        primary: {
            padding: 2,
            borderRadius: 4,
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)"
        },
        compact: {
            padding: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "muted"
        }
    },
    forms: {
        label: {
            fontSize: 1,
            fontWeight: "bold"
        },
        input: {
            borderColor: "gray",
            "&:focus": {
                borderColor: "primary",
                boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
                outline: "none"
            }
        },
        select: {
            borderColor: "gray",
            "&:focus": {
                borderColor: "primary",
                boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
                outline: "none"
            }
        },
        textarea: {
            borderColor: "gray",
            "&:focus": {
                borderColor: "primary",
                boxShadow: (t) => `0 0 0 2px ${t.colors.primary}`,
                outline: "none"
            }
        },
        slider: {
            bg: "muted"
        }
    },
    alerts: {
        primary: {
            color: "background"
        },
        secondary: {
            color: "background",
            bg: "secondary"
        },
        accent: {
            color: "background",
            bg: "accent"
        },
        highlight: {
            color: "text",
            bg: "highlight"
        }
    },
    layout: {
        intro: {
            display: "grid",
            width: "100vw",
            height: "93vh",
            padding: 0,
            margin: 0
        },
        container: {
            placeItems: "center"
            // maxWidth: 1024,
        },
        h2: {
            fontFamily: "Roboto, sans-serif",
            margin: 0,
            marginTop: "-15px",
            marginBottom: 0,
            padding: 0
        },
        code: {
            fontFamily: "monospace",
            fontSize: [1, 2],
            color: "secondary",
            bg: "muted",
            lineHeight: "10px"
        },
        button: {
            fontFamily: "Roboto, sans-serif",
            marginTop: "15px",
            outline: "none",
            "&:hover": {
                bg: "secondary"
            },
            "&:focus": {
                bg: "secondary"
            }
        }
    },
    styles: {
        root: {
            margin: 0,
            fontFamily: "body",
            lineHeight: "body",
            fontWeight: "body"
        },
        img: {
            maxWidth: "100%",
            height: "auto"
        },
        h1: {
            variant: "text.heading",
            textDecoration: "none"
        },
        h2: {
            variant: "text.heading",
            textDecoration: "none",
            fontSize: 5
        },
        h3: {
            variant: "text.heading",
            textDecoration: "none",
            fontSize: 4
        },
        h4: {
            variant: "text.heading",
            textDecoration: "none",
            fontSize: 3
        },
        h5: {
            variant: "text.heading",
            textDecoration: "none",
            fontSize: 2
        },
        h6: {
            variant: "text.heading",
            textDecoration: "none",
            fontSize: 1
        },
        a: {
            color: "primary",
            "&:hover": {
                color: "secondary",
                textDecoration: "none !important",
                textDecorationLine: "none !important",
                textDecorationColor: "none !important",
                textDecorationStyle: "none !important"
            },
            textDecorationLine: "none !important",
            padding: "0px 5px 7px 0px"
        },
        pre: {
            fontFamily: "monospace",
            fontSize: 1,
            p: 3,
            color: "text",
            bg: "muted",
            overflow: "auto",
            code: {
                color: "inherit"
            },
            variant: "prism"
        },
        code: {
            fontFamily: "monospace",
            fontSize: 1
        },
        inlineCode: {
            fontFamily: "monospace",
            color: "secondary",
            bg: "muted"
        },
        table: {
            width: "100%",
            my: 4,
            borderCollapse: "separate",
            borderSpacing: 0,
            [["th", "td"]]: {
                textAlign: "left",
                py: "4px",
                pr: "4px",
                pl: 0,
                borderColor: "muted",
                borderBottomStyle: "solid"
            }
        },
        th: {
            verticalAlign: "bottom",
            borderBottomWidth: "2px"
        },
        td: {
            verticalAlign: "top",
            borderBottomWidth: "1px"
        },
        hr: {
            border: 0,
            borderBottom: "1px solid",
            borderColor: "muted"
        },
        xray: {
            "*": {
                outline: "1px solid rgba(0, 192, 255, .25)"
            }
        },
        navlink: {
            fontSize: 1,
            bg: "muted",
            border: 0,
            appearance: "none",
            display: "inline-block",
            fontWeight: "bold",
            font: "body",
            color: "inherit",
            textDecoration: "none",
            outline: "none",
            "&:hover": {
                color: "primary",
                bg: "highlight"
            },
            "&:focus": {
                color: "primary",
                bg: "highlight"
            }
        }
    },
    prism
};
