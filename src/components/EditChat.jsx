import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ chat, open, setOpen, onEdit, socket }) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editMessage, setEditMessage] = React.useState(chat);

  const editMsg = (e) => {
    // Update only the text property of the chat object
    setEditMessage((prevChat) => ({
      ...prevChat,
      text: e.target.value,
    }));
  };

  const editvalue = () => {
    // Check if socket is connected before emitting
    console.log("Socket isndie child", socket);
    if (socket && socket.connected) {
      // Call the onEdit function passed from the parent component (Chat)
      onEdit(editMessage.text, chat._id);

      // Emit the "edit message" event to the server
      socket.emit("edit message", { _id: chat._id, text: editMessage.text });
    }

    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <TextField
              id="filled-basic"
              // defaultValue={chat.text}
              value={editMessage.text}
              // label={chat.text}
              sx={{ height: "2rem", marginTop: "-0.9rem" }}
              onChange={editMsg}
            />
            <Button
              variant="outlined"
              sx={{ height: "2.5rem" }}
              onClick={editvalue}
            >
              Change
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
