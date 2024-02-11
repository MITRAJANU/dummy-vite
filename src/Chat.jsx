import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import CryptoJS from "crypto-js";
import BasicModal from "./components/EditChat";

function Chat() {
  let newsocket;
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  // const [editModalVisible, setEditModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editMessage, setEditMessage] = useState([]);

  const secretKey = "your-secret-key"; // Replace with a secure secret key

  function encryptMessage(message) {
    if (!message) return null;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(message),
      secretKey
    ).toString();
    return encrypted;
  }

  function decryptMessage(encryptedMessage) {
    if (!encryptedMessage) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (error) {
      console.error("Error decrypting message:", error);
      return null;
    }
  }
  useEffect(() => {
    newsocket = io("http://localhost:8787", {
      query: { userId: `${JSON.parse(localStorage.getItem("userId"))}` },
    });
    setSocket(newsocket);

    // Handle incoming edited messages
    const handleChatMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    // Handle incoming chat messages
    newsocket.on("chat message", (msg) => {
      console.log("Message received", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newsocket.on("edited message", (editedMessage) => {
      // Update the UI to reflect the edited message
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg._id === editedMessage._id) {
            // Replace the edited text in the existing message
            return { ...msg, text: editedMessage.text };
          }
          return msg;
        });
        return updatedMessages;
      });
    });

    // Clean up socket connection on component unmount
    return () => {
      newsocket.off("chat message", handleChatMessage);
      newsocket.disconnect();
    };
  }, [setMessages]);

  const handleEdit = (editedText, messageId) => {
    // Ensure that the socket object is defined before using it
    console.log("Socket in edit", socket);
    if (socket && socket.connected) {
      // Update the local state immediately
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg._id === messageId) {
            // Update the text in the existing message
            return { ...msg, text: editedText };
          }
          return msg;
        });
        return updatedMessages;
      });

      // Send an edit event to the server
      // socket.emit("edit message", { _id: messageId, text: editedText });
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8787/api/chat/history"
        );
        const chatHistory = response.data; // Assuming the API response contains the chat history
        console.log("----->", chatHistory);

        const decryptedChatHistory = chatHistory.map((message) => {
          return decryptMessage(message);
        });
        console.log(decryptedChatHistory);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...decryptedChatHistory,
        ]);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []); // Fetch chat history once when the component mounts

  const sendMessage = useCallback(() => {
    // const messageSent = {
    //   uncryptedText: messageInput,
    //   cryptedText: encryptMessage(messageInput),
    // };

    // console.log("To be sent", messageInput);
    // console.log("Decrypted text", decryptMessage(messageSent.cryptedText));
    socket.emit("chat message", encryptMessage(messageInput));
    setMessageInput("");
  }, [messageInput]);
  const editMessagefunc = (message) => {
    console.log("Meesage edit", message);
    setEditMessage(message);
    setOpen(true);
  };

  const handleEditModalClose = () => {
    setOpen(false);
    // Perform any necessary cleanup or state resets here
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    // {edit ? <BasicModal/>:null}
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <h1>
        My name is ------: {JSON.parse(localStorage.getItem("userId"))} ✌️✌️✌️
      </h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg?.userId === JSON.parse(localStorage.getItem("userId"))
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor:
                  msg?.userId === JSON.parse(localStorage.getItem("userId"))
                    ? "#DCF8C6"
                    : "#ECE5DD",
                boxShadow:
                  msg?.userId === JSON.parse(localStorage.getItem("userId"))
                    ? "0 0 10px rgba(0, 128, 0, 0.3)"
                    : "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="buttons"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2rem",
                  alignItems: "center",
                }}
              >
                {msg?.userId === JSON.parse(localStorage.getItem("userId")) ? (
                  <div>
                    <button onClick={() => editMessagefunc(msg)}>Edit</button>
                    <button>Delete</button>
                  </div>
                ) : null}
              </div>
              <h5
                style={{
                  color:
                    msg?.userId === JSON.parse(localStorage.getItem("userId"))
                      ? "#4CAF50" // green for "You"
                      : "#333", // default color for other users
                  marginBottom: "8px",
                  fontSize: "0.8em",
                }}
              >
                {msg?.userId === JSON.parse(localStorage.getItem("userId"))
                  ? "You"
                  : msg?.userId}
              </h5>
              <p
                style={{
                  margin: 0,
                  fontSize: "1em",
                }}
              >
                {msg?.text}
              </p>
              {msg?.edited == true ? "edited 🤞" : null}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <BasicModal
          chat={editMessage}
          setOpen={setOpen}
          open={open}
          onEdit={handleEdit}
          socket={socket}
          // onClose={handleEditModalClose} // Pass a callback to handle modal close
        />
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "8px",
            fontSize: "1em",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            fontSize: "1em",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
