import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { ThemeProvider, Button, Input } from "theme-ui";
import theme from "@rebass/preset";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
      <div
        sx={{
          maxWidth: 512,
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        <header>
          <h1>กินเดอร์ Ginder 🔥</h1>
          <SignOut />
        </header>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </div>
    </ThemeProvider>
  );
}

export default App;

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(1000);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { displayName, uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      displayName,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <Input
          mb={3}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <Button variant="primary" mr={2} type="submit" disabled={!formValue}>
          🕊️ sent
        </Button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { displayName, text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}
