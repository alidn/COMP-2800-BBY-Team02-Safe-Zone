import React, { useState, useEffect } from "react";
import { List, Avatar, Input, Button, Space, Empty, Divider } from "antd";

export default function Chat(props) {
  let [messages, setMessages] = useState([]);
  let [received, setReceived] = useState(false);

  props.socket.off("msg").on("msg", (message) => {
    setReceived(true);
    setMessages((prev) => prev.concat(message));
    setMessages((prev) => prev.slice(prev.length - 12, prev.length));
  });

  let [message, setMessage] = useState("");

  let send = function () {
    console.log("sending", message);
    props.socket.emit("message", {
      username: sessionStorage.getItem("username"),
      message: message,
    });
    console.log(messages);
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #1890FF",
        padding: "30px",
        marginRight: "10px",
        marginLeft: "20px",
        width: "500px",
        borderRadius: "10px",
      }}
    >
      <h1>Chatroom</h1>
      <Divider />
      <List itemLayout="horizontal">
        {!received ? (
          <Empty description={"No message yet"} />
        ) : (
          messages.map((item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar />}
                title={item.username}
                description={item.message}
              />
            </List.Item>
          ))
        )}
      </List>
      <Space />
      <div style={{ position: "absolute", bottom: 0, marginBottom: "30px" }}>
        <Input
          placeholder={"Enter a message"}
          size={"large"}
          style={{ margin: "auto", width: "400px" }}
          onChange={(e) => setMessage(e.target.value)}
        ></Input>
        <Divider type="vertical" />
        <Button
          size={"large"}
          style={{ marginTop: "10px" }}
          onClick={send}
          type="primary"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
