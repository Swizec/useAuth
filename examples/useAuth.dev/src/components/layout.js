/** @jsx jsx */
import { Box, Flex, Button, Link as TLink } from "@theme-ui/components";
import { AccordionNav } from "@theme-ui/sidenav";
import { Link } from "gatsby";
import { useRef, useState } from "react";
import { jsx, Styled, useColorMode } from "theme-ui";
import { useAuth } from "react-use-auth";

import Sidebar from "../sidebar.mdx";
import Head from "./head";
import MenuButton from "./menu-button";
import NavLink from "./nav-link";
import Pagination from "./pagination";
import SkipLink from "./skip-link";
import EricButton from "./button";
import { IoIosLock } from "react-icons/io";

const modes = ["default", "deep", "light"];

const sidebar = {
    wrapper: AccordionNav,
    a: NavLink
};

const getModeName = (mode) => {
    switch (mode) {
        case "light":
            return "Light";
        case "deep":
            return "Deep";
        case "default":
            return "Dark";
        default:
            return mode;
    }
};

const DemoButton = () => {
    const { isAuthenticated, login, logout, user } = useAuth();

    if (isAuthenticated()) {
        return (
            <Button
                sx={{ minWidth: 150, cursor: "pointer" }}
                variant="secondary"
                onClick={logout}
            >
                Logout {user.nickname || user.email}
            </Button>
        );
    } else {
        return (
            <Button
                sx={{ minWidth: 100, cursor: "pointer" }}
                variant="secondary"
                onClick={login}
            >
                Try it!
            </Button>
        );
    }
};

export default (props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const nav = useRef(null);
    const [mode, setMode] = useColorMode();
    const fullwidth =
        (props.pageContext.frontmatter &&
            props.pageContext.frontmatter.fullwidth) ||
        props.location.pathname === "/home";
    const showNav = !props.pageContext?.frontmatter?.hidenav;

    const cycleMode = (e) => {
        const i = modes.indexOf(mode);
        const next = modes[(i + 1) % modes.length];
        setMode(next);
    };

    return (
        <Styled.root>
            <Head {...props} />
            <SkipLink>Skip to content</SkipLink>
            <Flex
                sx={{
                    flexDirection: "column",
                    minHeight: "100vh"
                }}
            >
                {showNav && (
                    <Flex
                        as="header"
                        sx={{
                            height: 64,
                            px: 3,
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Flex sx={{ alignItems: "center" }}>
                            <MenuButton
                                onClick={(e) => {
                                    setMenuOpen(!menuOpen);
                                    if (!nav.current) return;
                                    const navLink = nav.current.querySelector(
                                        "a"
                                    );
                                    if (navLink) navLink.focus();
                                }}
                            />
                            <Link
                                to="/"
                                sx={{
                                    variant: "text.logo",
                                    fontSize: ["1.6rem", "2.2rem", "2.2rem"],
                                    fontWeight: "bold",
                                    letterSpacing: "-3px",
                                    fontFamily: "Asap, sans-serif"
                                }}
                            >
                                <IoIosLock
                                    sx={{
                                        size: [18, 38, 38],
                                        fill: "primary",
                                        display: "inline-block",
                                        marginBottom: [0, "-5px", "-5px"],
                                        marginLeft: "-8px"
                                    }}
                                />
                                useAuth
                            </Link>
                        </Flex>

                        <Flex>
                            <DemoButton />
                            <NavLink
                                href="https://github.com/Swizec/useAuth"
                                sx={{ mr: 2 }}
                            >
                                GitHub
                            </NavLink>
                            <EricButton
                                sx={{
                                    mr: 2,
                                    cursor: "pointer",
                                    variant: "styles.navlink"
                                }}
                                onClick={cycleMode}
                            >
                                {getModeName(mode)}
                            </EricButton>
                        </Flex>
                    </Flex>
                )}
                <Box
                    sx={{
                        flex: "1 1 auto"
                    }}
                >
                    <div
                        sx={{
                            display: ["block", "flex"]
                        }}
                    >
                        <div
                            ref={nav}
                            onFocus={(e) => {
                                setMenuOpen(true);
                            }}
                            onBlur={(e) => {
                                setMenuOpen(false);
                            }}
                            onClick={(e) => {
                                setMenuOpen(false);
                            }}
                        >
                            <Sidebar
                                open={menuOpen}
                                components={sidebar}
                                pathname={props.location.pathname}
                                sx={{
                                    display: [
                                        null,
                                        fullwidth ? "none" : "block"
                                    ],
                                    width: 256,
                                    flex: "none",
                                    px: 3,
                                    pt: 3,
                                    pb: 4,
                                    mt: [64, 0]
                                }}
                            />
                        </div>
                        <main
                            id="content"
                            sx={{
                                width: "100%",
                                minWidth: 0,
                                maxWidth: fullwidth ? "none" : 700,
                                mx: "auto",
                                px: fullwidth ? 0 : 3,
                                marginTop: "-.3rem",
                                fontSize: [2, 3]
                            }}
                        >
                            {props.children}
                            {!fullwidth && <Pagination />}
                        </main>
                    </div>
                </Box>
            </Flex>
            <Box
                sx={{
                    position: "fixed",
                    bottom: "0px",
                    bg: "accent",
                    p: 2,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    width: ["100%", 255, 255],
                    color: "white"
                }}
            >
                Created with ❤️ by{" "}
                <TLink
                    href="https://swizec.com"
                    sx={{
                        color: "white !important",
                        textDecoration: "underline !important"
                    }}
                >
                    Swizec
                </TLink>{" "}
                et. al.
            </Box>
        </Styled.root>
    );
};
