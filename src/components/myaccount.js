import React from "react";
import { Avatar } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";

/*
The React component for the multiplayer page.
 */
export default function MyAccount({ username }) {
  let friends = [];

  return (
    <div style={{ margin: "20px" }}>
      <a href="HTML-shell/main.html">
        <ArrowLeftOutlined
          style={{ fontSize: "35px", marginTop: "20px", marginLeft: "20px" }}
        />
      </a>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "row" }}>
        <h1 style={{ margin: "20px", fontSize: "35px" }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <span style={{ margin: "20px" }}>{username}</span>
        </h1>
      </div>
    </div>
  );
}
