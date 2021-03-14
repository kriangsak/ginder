import React, { useRef, useState } from "react";
import { Button, Input } from "theme-ui";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";

function ChatRoom(props) {
    const firestore = props.firestore;
    const auth = props.auth;

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
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} auth={auth} />)}
  
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
    const auth = props.auth;
  
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

  export default ChatRoom;