import React, { useState } from "react";
import { PageHeader, Button, Modal, Input, Result } from "antd";
import { UserOutlined, InboxOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CREATE_LOBBY_URL = "http://localhost:5000/";
const WEBSOCKET_URL = "ws://";

export default function Main(props) {
  const username = sessionStorage.getItem("username");
  let [searchLobby, setSearchLobby] = useState(false);
  let [isCreating, setCreating] = useState(false);
  let [lobbyCreated, setLobbyCreated] = useState(false);
  let [chosenLobby, setChosenLobby] = useState(null);
  let [connectFailed, setConnectFailed] = useState(true);
  let [searchModalVisible, setSearchModalVisible] = useState(false);
  let [createdLobbyId, setCreatedLobbyId] = useState(null);

  let createLobby = async function () {
    function generateRandomId() {
      return Math.floor(Math.random() * 1000);
    }

    let id = generateRandomId();

    props.socket.emit("createRoom", id);
    props.socket.emit("join", {
      id: id,
      username: sessionStorage.getItem("username"),
    });

    sessionStorage.setItem("lobbyId", id); 

    setCreatedLobbyId(id);

    setCreating(false);
    setLobbyCreated(true);
  };

  let searchLobbyId = function () {
    setSearchLobby(false);

    console.log("Searching lobby ", chosenLobby);

    props.socket.emit("join", {
      id: chosenLobby,
      username: sessionStorage.getItem("username"),
    });
    props.socket.on("failed", () => {
      console.log("Connection failed");

      setConnectFailed(true);
    });
    props.socket.on("joined", () => {
      console.log("Connected successfully");
      sessionStorage.setItem("lobbyId", chosenLobby); 

      setConnectFailed(false);
    });

    setSearchModalVisible(true);
  };

  let retrySearch = function () {
    setSearchModalVisible(false);
    setSearchLobby(true);
  };

  return (
    <div>
      <PageHeader
        title={<Link to="/profile">{username}</Link>}
        avatar={{
          icon: <UserOutlined />,
          size: "large",
        }}
        extra={<InboxOutlined style={{ fontSize: "32px" }} />}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          style={{ width: "90%", alignSelf: "center", marginTop: "30px" }}
          size={"large"}
          type={"primary"}
          onClick={createLobby}
          loading={isCreating}
        >
          Create new game
        </Button>
        <Button
          style={{ width: "90%", alignSelf: "center", marginTop: "30px" }}
          size={"large"}
          type={"primary"}
          onClick={() => setSearchLobby(true)}
        >
          Join a game
        </Button>
        <Modal
          title={"Join a lobby"}
          visible={searchLobby}
          onCancel={() => setSearchLobby(false)}
          footer={[
            <Button size={"large"} onClick={() => setSearchLobby(false)}>
              Cancel
            </Button>,
            <Button
              size={"large"}
              key="submit"
              type="primary"
              icon={<SearchOutlined />}
              onClick={searchLobbyId}
            >
              Search Lobby
            </Button>,
          ]}
        >
          <Input
            placeholder="enter lobby id"
            onSearch={(value) => console.log(value)}
            enterButton
            size={"large"}
            onChange={(e) => setChosenLobby(e.target.value)}
          />
        </Modal>
        <Modal
          visible={lobbyCreated}
          onCancel={() => setLobbyCreated(false)}
          footer={[]}
        >
          <Result
            status="success"
            title="Lobby Created"
            subTitle={"Your lobby id is: " + createdLobbyId}
            extra={[
              <Link to="/game">
                <Button type="primary" key="console">
                  Go to lobby
                </Button>
              </Link>,
            ]}
          />
        </Modal>
        <Modal
          visible={searchModalVisible}
          onCancel={() => setSearchModalVisible(false)}
          footer={[]}
        >
          <Result
            status={connectFailed ? "error" : "success"}
            title={connectFailed ? "Ain't no lobby" : "lobby found"}
            extra={[
              connectFailed ? (
                <Button type="primary" key={"failed"} onClick={retrySearch}>
                  Try again
                </Button>
              ) : (
                <Link to="/game">
                  <Button type="primary" key="connected">
                    Join Lobby
                  </Button>
                </Link>
              ),
            ]}
          />
        </Modal>
      </div>
    </div>
  );
}
