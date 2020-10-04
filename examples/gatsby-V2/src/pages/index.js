import { Box, Button, Heading, IconButton, useColorMode } from "@chakra-ui/core";
import { css } from '@emotion/core';
import { Link } from "gatsby";
import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = (props) => {


  const { colorMode } = useColorMode();
  
  const codeStyleLight = {
    fontFamily: "Menlo, monospace",
    color: "#416B9C"
  }

  const codeStyleDark = {
    fontFamily: "Menlo, monospace",
    color: "#9DDDFF"
  }

  const logoStyle = css`
    letter-spacing: -4px;
    font: 600 3.2rem Asap;
  `

  const h2Style = {
    font: '600 1.5rem Roboto'
  }

  const buttonStyle = {
    font: '600 1.2rem Roboto'
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Box bg={colorMode === "light"? "gray.50" : "gray.900"} h="95vh" w="100vw" display="flex" flexDir="column" alignItems="center" justifyContent="center">
        <Box>
          <Box display="flex" alignItems="center" mt="-12rem">
            <IconButton
              icon="lock"
              aria-label='Lock icon'
              isRound="true"
              variant="ghost"
              color="#00AC20"
              padding="0"
              ml="-.3rem"
              fontSize="36px"            
            />
            <Heading as="h1" color={colorMode === "light"? "#000" : "#ccc"} fontSize={50} className="logo-style" css={logoStyle}>useAuth</Heading>
          </Box>
          <Heading as="h2" style={h2Style} color={colorMode === "light"? "#000" : "#ccc"} size="lg" mb={2}
          >
            React App Authentication
          </Heading>
          <span style={colorMode === "light"? codeStyleLight : codeStyleDark}>yarn add react-use-auth</span>
          <br />
          <span style={colorMode === "light"? codeStyleLight : codeStyleDark}>npm i react-use-auth</span>          
          <br />
          <Link to="/docs/getting-started">
            <Button size="lg" style={buttonStyle} mt={4} bg="#008D19" color="#fff" _hover={{ bg: "#00A51D" }} rightIcon="arrow-forward">Get Started</Button>
          </Link>
        </Box>
      </Box>


    </Layout>
  )
}
export default IndexPage
