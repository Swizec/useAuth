import React from "react";
import { Flex, Box, Heading, Text } from "rebass";
import { Link } from "react-router-dom";

export const SuperSecretPage = () => {
    return (
        <Flex style={{ justifyContent: "center" }}>
            <Box>
                <Heading>Supersecret page <span role="img" aria-label="cool">😎</span></Heading>
                <Text>Only authenticated user can access this page.</Text>
                <Link to="/">{"←"} Back</Link>
            </Box>
        </Flex>
    );
};
