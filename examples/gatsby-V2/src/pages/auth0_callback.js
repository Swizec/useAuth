import { Box, Heading } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";
import Layout from "../components/layout";
import SEO from "../components/seo";

const Auth0CallbackPage = () => {
  const { handleAuthentication } = useAuth();
  useEffect(() => {
    handleAuthentication()
  });
  
  // const { colorMode } = useColorMode();

return (
  <Layout>
    <SEO title="Success" />
    <Box  h="94vh" w="100vw" display="flex" alignItems="center" justifyContent="center">
      <Heading as="h2">Login Success</Heading>        
    </Box>
  </Layout>
)
}
export default Auth0CallbackPage;
