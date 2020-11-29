import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import "./app.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <title>abagnale</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
