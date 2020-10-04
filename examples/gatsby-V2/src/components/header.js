/** @jsx jsx */
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, IconButton, Stack, Text, useColorMode, useDisclosure } from "@chakra-ui/core";
import { css, jsx } from '@emotion/core';
import styled from "@emotion/styled";
import { Link } from "gatsby";
import React from "react";
import { useAuth } from "react-use-auth";

const Login = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { colorMode } = useColorMode();

  const loginButtonStyle = {
    fontFamily: 'Roboto',
    font: 'Roboto !important',
    fontWeight: '600',
    fontSize: '1.05rem'
  }

  if (isAuthenticated()) {
    return (
      <>
        <Button style={loginButtonStyle} onClick={logout} color={colorMode === "light"? "black" : "#ccc"}>Logout</Button>
      </>
    )
  } else {
    return (
      <>
        <Button style={loginButtonStyle} onClick={login} color={colorMode === "light"? "black" : "#ccc"}>Login</Button>
      </>
    )
  }
}

const ShowHamburger = styled.div`
  margin: 0;
  paddiing: 0;
  
  @media screen and (min-width: 30rem) {
    display: block;
    }

  @media screen and (min-width: 48rem) {
    display: none;
    }
`;

const ShowMenuItems = styled.div`
  @media screen and (min-width: 48rem) {
    display: block;
    }

  @media screen and (max-width: 48rem) {
    display: none;
    }
`;

const Header = props => {
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();


  const iconButtonStyle = {
    outline: 'none',
    boxShadow: 'none',
    cursor: 'pointer'
  }

  const logoStyle = {
    font: '600 2.5rem Asap',
    letterSpacing: '-3px'
    
  }
  
  const menuItemStyle = {
    font: '600 1.05rem Roboto'
  }

  const drawerItemStyle = {
    font: '700 1.05rem Roboto'
  }

  const drawerHeadingStyle = {
    font: '600 2.5rem Asap',
    letterSpacing: '-3px',

  }

  return (
    
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      margin="0"
      padding=".6rem"
      bg={colorMode === "light"? "gray.50" : "gray.900"}
      color={colorMode === "light"? "black" : "#ccc"}
      {...props}
    >
      <Flex  align="center" >
        <ShowHamburger>
          <Box mt=".7rem" ml=".5rem" mr={4}  ref={btnRef} onClick={onOpen} css={css`cursor: pointer; padding-bottom: 2px;`}>
            <svg
              fill={colorMode === "light"? "black" : "#ccc"}
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              style={{cursor: 'pointer'}}
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </Box>
        </ShowHamburger>
        {/* ====== Drawer Section ====== */}
        <Flex align="center" ml=".4rem">         
          <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
          >
          <DrawerOverlay />
          <DrawerContent bg={colorMode === "light"? "gray.50" : "#171923"} color={colorMode === "light"? "#000" : "#ccc"}>
            <DrawerCloseButton />
            <DrawerHeader style={drawerHeadingStyle}><b>useAuth</b></DrawerHeader>
              
            <DrawerBody>
              <Stack spacing="10p">
                <Link to="/docs/getting-started" style={drawerItemStyle}>
                  <span><b>Getting Started</b></span>
                </Link>
                <br />
                <Link to="/docs/auth/" style={drawerItemStyle}>
                  <b>Auth Provider</b>
                </Link>
                <br />
                <Link to="/docs/callback" style={drawerItemStyle}>
                  <b>Callback Page</b>
                </Link>
                <br />
                <Link to="/docs/enjoy" style={drawerItemStyle}>
                  <b>Enjoy</b>
                </Link>
              </Stack>
            </DrawerBody>
  
            <DrawerFooter>
              {/* Drawer Footer content here */}
              
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {/* ====== End Drawer Section ====== */}
        
          <Link to='/'><Heading as="h1" color={colorMode === "light"? "#000" : "#ccc"} fontSize={40} m={0} style={logoStyle}>
            useAuth
          </Heading>
          </Link>
        </Flex>
      </Flex>

      <IconButton
        onClick={toggleColorMode}
        display={{ xs: "block", sm: "block", md: "none" }}
        icon={colorMode === "light" ? "moon" : "sun"}
        style={iconButtonStyle}
        isRound="true"
        variant="ghost"
        color="current"
        ml="2"
        fontSize="20px"
        aria-label={`Switch to ${
          colorMode === "light" ? "light" : "dark"
          } mode`
        }            
      /> 

      <Box
        display={{ sm: "none", md: "flex"}}
        width={{ sm: "full", md: "auto" }}
        alignContent="center"
        alignItems="center"
      >
        <ShowMenuItems>
          <Box display="flex" color={colorMode === "light"? "black" : "#ccc"} alignContent="center" alignItems="center" mx={5}>
            <Link to="/docs/getting-started">
            <Box><Text  style={menuItemStyle} mt={{ base: 4, md: 0 }} mr={4} display="block">Docs &nbsp;</Text></Box>
            </Link>
            
            {/* <MenuItems>Examples</MenuItems> */}

            <Box><Text style={menuItemStyle} mt={{ base: 4, md: 0 }} mr={4} display="block"><a href="https://github.com/Swizec/useAuth">GitHub &nbsp;</a></Text></Box>
            <Login />
          </Box>
        </ShowMenuItems>
        <Box
          display={{ xs: "none", sm: "none", md: "flex" }}
          mt={{ base: 4, md: 0 }}
        >
          <IconButton
            style={iconButtonStyle}
            icon={colorMode === "light" ? "moon" : "sun"}
            onClick={toggleColorMode}
            isRound="true"
            variant="ghost"
            color="current"
            ml="2"
            fontSize="20px"
            aria-label={`Switch to ${
              colorMode === "light" ? "light" : "dark"
              } mode`
            }            
          />          
         </Box>
      </Box> 
    </Flex>
  );
};

export default Header;