import { Box, Heading, useColorMode } from "@chakra-ui/core";
import styled from '@emotion/styled';
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import React from 'react';
import Header from "./header";

const DocsStyles = styled.div`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
     outline: none;
     box-shadow: none;
   }

    html {
      scroll-behavior: smooth;
    }

    @media screen and (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
    }

    body {
      font-family: Roboto !important;
      overflow: hidden;
      padding: 0;
    }

    h2 {
      font-family: Roboto !important;
      font-size: 1.6rem !important;
    }

    @media (min-width: 360px) {
      .h1 {
        font-size: 1.4rem !important;
      }

      .h2 {
        font-size: 1.1rem !important;
      }
      .sidenav li{
        font-family: Roboto !important;
        font-weight: bold;
      }
    }

    @media (min-width: 500px) {
      .h1 {
        font-size: 1.5rem !important;
      }

      .h2 {
        font-size: 1.3rem !important;
      }
      .sidenav li{
        font-family: Roboto !important;
        font-weight: bold;
      }
    }

    @media (min-width: 768px) {
      .h1 {
        font-size: 1.7rem !important;
      }

      .h2 {
        font-size: 1.4rem !important;
      }
      .sidenav li{
        font-family: Roboto !important;
        font-weight: bold;
      }
    }

    @media (min-width: 1024px) {
      .h1 {
        font-size: 2rem !important;
      }

      .h2 {
        font-size: 1.6rem !important;
      }
    }

    .container {
      height: 100vh;
      width: 100vw;
      display: grid;
      grid-template-columns: 1fr;

      /*  to add a footer, use 1fr 30px(for the footer) etc in grid-template-rows  */
      grid-template-rows: 1fr;
    }

    .body {
      font-family: Roboto !important;
      display: grid;
      grid-template-columns: .75fr 3fr;
      overflow: hidden;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .body {
          grid-template-columns: 1fr;
      }
    }

    .body p {
        padding-bottom: 1.25rem;
    }



    .sidebar li {
      font-family: Roboto !important;
      font-weight: bold;
      cursor: pointer;

      margin-bottom: .5rem;
    }


    .sidenav li{
      font-size: 1.05rem;
      list-style-type: none;
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }
  

    .footer {
        border-top: 1px solid lightgrey;
    }

    .content {
      margin-top: .4rem;
      overflow-y: scroll;
    }



    pre {
      padding-top: .5rem;
      padding-left: .5rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: auto;
    }

    @media (min-width: 360px) {
      pre {
        font-size: .8rem;
      }
    }

    @media (min-width: 500px) {
      pre {
        font-size: .9rem;
        color: #569CD6;
        background-color: #0E0E0E;
        padding: 4px;
        border-radius: 3px;
      }
    }

    @media (min-width: 768px) {
      pre {
        font-size: 1rem;
        color: #569CD6;
        background-color: #0E0E0E;
        padding: 4px;
        border-radius: 3px;
      }
    }

    @media (min-width: 360px) {
      code {
        font-size: .9rem;
        color: #569CD6;
        background-color: #0E0E0E;
        padding: 4px;
        border-radius: 3px;
      }
    }

    @media (min-width: 768px) {
      code {
        font-size: 1rem;
        color: #569CD6;
        background-color: #0E0E0E;
        padding: 4px;
        border-radius: 3px;
      }
    }

    @media (min-width: 1024px) {
      code {
        font-size: 1.1rem;
        color: #569CD6;
        background-color: #0E0E0E;
        padding: 4px;
        border-radius: 3px;
      }
    }
 
`;


const Layout = ({ children }) => {
  
  const { colorMode } = useColorMode();
  
  const h1Style = {    
    font: '700 2rem Roboto',
    fontWeight: 'bold',
  }

  const h2Style = {
    font: '700 1rem Roboto',
    fontWeight: 'bold',
  }



  const components = {
    h1: props => <Heading as="h1" className="h1" style={h1Style} mb=".75rem" mt="-3px" {...props} />,
    h2: props => <Heading as="h2" className="h2" style={h2Style} mt='-1rem' mb="1rem" {...props} />,
    h3: props => <Heading as="h3" size="md" mb="1rem" {...props} />
  }
  
  return (
    <>
      <DocsStyles>
      <Header />
      <Box className="container" bg={colorMode === "light"? "gray.50" : "gray.900"}>
        <Box className="body">
          <Box ml={4} display={{ sm: 'none', md: 'block' }} className="sidebar" color={colorMode === "light"? "#000" : "#ccc"}>
            <ul className='sidenav'>
            <li></li>
              <li><Link to="/docs/getting-started/">Getting Started</Link></li>
              <li><Link to="/docs/auth/">Auth Provider</Link></li>
              <li><Link to="/docs/callback">Callback Page</Link></li>
              <li><Link to="/docs/enjoy">Enjoy</Link></li>
            </ul>
          </Box>
          <MDXProvider components={components}>
          <Box fontSize={["sm", "md", "lg", "xl"]} maxW="40rem" pl='2rem' pr='1rem' width={{sm: 'full'}} color={colorMode === "light"? "#000" : "#ccc"} display='block' className="content">
            {children}
          </Box>
          </MDXProvider>
        </Box>
        {/* <Box>
            <h3>docs footer</h3>
          </Box> */}
        </Box>    
        </DocsStyles> 
    </>
  )
}



export default Layout;
