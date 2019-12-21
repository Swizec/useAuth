import React from "react";
import { Flex, Box, Text, Heading } from "rebass";
import { Link } from "react-router-dom";

export const AuthErrorPage = () => {
    return (
        <Flex style={{ justifyContent: "center" }}>
            <Box>
                <Heading>Uh oh</Heading>
                <Text>
                    An error occourd durin login{" "}
                    <span role="img" aria-label="Face with wide open eyes">
                        😳
                    </span>
                </Text>
                <Box mt={2}>
                    <Link to="/login">Try again</Link>
                </Box>
                <Box mt={2}>
                    <Link to="/">Home</Link>
                </Box>
            </Box>
        </Flex>
    );
};
