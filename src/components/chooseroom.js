import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// the list of room events.
const roomEvents = {
  joinRoom: "join-room",
  createRoom: "createRoom",
  newUserJoined: "new-user-joined",
  chatroomMessage: "chatroom-message",
  mousePosition: "mouse-position",
  roomCreated: "room-created",
};

/*
The component where for the multiplayer mode where the user can choose to create
a room or join a room.
 */
export default function ChooseRoom({ socket, username, changeRoomID }) {
  let [isCreateButtonLoading, setCreateButtonLoading] = useState(false);
  let [chosenRoom, setChosenRoom] = useState(0);

  let handleCreateRoom = function () {
    setCreateButtonLoading(true);
    socket.emit(roomEvents.createRoom);
    socket.off(roomEvents.roomCreated).on(roomEvents.roomCreated, (roomID) => {
      setCreateButtonLoading(false);
      Modal.success({
        title: "Your room was created",
        content: `Your room id is: ${roomID}`,
        okText: "Go to the room!",
        onOk: () => (window.location.href = "/react/multiplayer"),
      });
      localStorage.setItem("room-id", roomID);
    });
  };

  let handleJoinRoom = function () {
    localStorage.setItem("room-id", chosenRoom);
    window.location.href = "/react/multiplayer";
  };

  return (
    <div
      style={{
        margin: "20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <a
          href="/HTML-shell/main.html"
          style={{ color: "#3aa89b", fontSize: "20pt" }}
        >
          <ArrowLeftOutlined style={{ float: "left", fontSize: "20pt" }} />
        </a>
        <Button
          href="/HTML-shell/aboutus.html"
          type="link"
          style={{
            float: "right",
            fontSize: "20pt",
            color: "#3aa89b",
          }}
        >
          About us
        </Button>
      </div>
      <div>
        <h1>Multiplayer Mode</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            loading={isCreateButtonLoading}
            onClick={handleCreateRoom}
            style={{
              backgroundColor: "#3aa89b",
              margin: "auto",
              width: "60%",
              marginTop: "10px",
              fontSize: "25px",
              height: "50px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
            type="primary"
          >
            Create new room
          </Button>
          <p>Or</p>
          <div
            style={{
              margin: "auto",
              width: "60%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Input
              onChange={(e) => setChosenRoom(e.target.value)}
              style={{ margin: "auto", fontSize: "25px", height: "50px" }}
              placeholder="1234"
            />
            <Button
              style={{
                backgroundColor: "#3aa89b",
                margin: "auto",
                width: "60%",
                marginTop: "10px",
                fontSize: "25px",
                height: "50px",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
              type="primary"
              onClick={handleJoinRoom}
            >
              Join a room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCreatedModal({ isVisible }) {}
