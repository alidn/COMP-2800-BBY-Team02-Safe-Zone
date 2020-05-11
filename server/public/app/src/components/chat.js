import React, { useState, useEffect } from "react";
import { List, Avatar, Input, Button, Space, Empty } from "antd";

export default function Chat(props) {
  let [messages, setMessages] = useState([]);

  props.socket.off("msg").on("msg", (message) => {
    console.log("Received message", message);
    console.log(messages);
    setMessages((prev) => prev.concat(message));
    // setMessages((prev) => prev.slice(prev.length - 6, prev.length));
  });

  let [message, setMessage] = useState("");

  console.log(messages);

  let send = function () {
    console.log("sending", message);
    props.socket.emit("message", {
      username: sessionStorage.getItem("username"),
      message: message,
    });
    console.log(messages);
  };

  return (
    <div style={{ marginRight: "10px" }}>
      <List itemLayout="horizontal">
        {messages === [] ? (
          <Empty description={false} />
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
      <Input onChange={(e) => setMessage(e.target.value)}></Input>
      <Button style={{ marginTop: "10px" }} onClick={send} type="primary">
        Send
      </Button>
    </div>
  );
}
