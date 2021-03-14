import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Grid, ThemeProvider } from "theme-ui";
import theme from "@rebass/preset";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import HeaderLayout from "./layouts/HeaderLayout";
import { Box, Button, Flex, Heading, Text } from "rebass";
// import { useCollectionData } from "react-firebase-hooks/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyClCMTncHfSZERRPNULeGs2F8KSAkphI_Q",
    authDomain: "ginder-app.firebaseapp.com",
    projectId: "ginder-app",
    storageBucket: "ginder-app.appspot.com",
    messagingSenderId: "605363120970",
    appId: "1:605363120970:web:72813cd0fe7ed18bb92fb3",
    measurementId: "G-HFRG26XVBY",
  });
}
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          px: 3,
        }}
      >
        <HeaderLayout />
        <SignOut />
        <section>
          {user ? <ChatRoom auth={auth} firestore={firestore} /> : <SignIn />}
        </section>
      </Box>
    </ThemeProvider>
  );
}

export default App;

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <Button mr={2} onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
}

function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Sign Out</Button>
  );
}
