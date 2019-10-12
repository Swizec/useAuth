import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import { Flex, Button, Box } from "rebass";
import { useAuth } from "react-use-auth";

const Login = () => {
    const { isAuthenticated, login, logout } = useAuth();
    console.log(isAuthenticated);
    if (isAuthenticated()) {
        return (
            <Button onClick={logout} style={{ backgroundColor: "#067df7" }}>
                Logout
            </Button>
        );
    } else {
        return (
            <Button onClick={login} style={{ backgroundColor: "#067df7" }}>
                Login
            </Button>
        );
    }
};

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div>
            <Head>
                <title>Home</title>
                <link rel="icon" href="/static/favicon.ico" />
            </Head>

            <Nav />

            <div className="hero">
                <h1 className="title">Welcome to useAuth Next.js example!</h1>
                <p className="description">
                    To get started, click that button 👇👇👇
                </p>
                <p className="description">
                    <Login />
                </p>

                <h1 className="title">
                    Hi {isAuthenticated() ? user.name : "people"}
                </h1>
            </div>

            <style jsx>{`
                .hero {
                    width: 100%;
                    color: #333;
                }
                .title {
                    margin: 0;
                    width: 100%;
                    padding-top: 80px;
                    line-height: 1.15;
                    font-size: 48px;
                }
                .title,
                .description {
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Home;
