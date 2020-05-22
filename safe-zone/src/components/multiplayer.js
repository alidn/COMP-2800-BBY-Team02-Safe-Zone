import React, { useCallback, useRef, useEffect, useState } from "react";
import GamePane from "./GamePane";
import {
  PageHeader,
  Popconfirm,
  Avatar,
  Spin,
  Popover,
  Progress,
  Alert,
  Modal,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import Chat from "./chat";

export default function Multiplayer({ socket, username }) {
  let roomID = localStorage.getItem("room-id");
  let [users, setUsers] = useState([username]);
  let [colors, setColors] = useState([]);
  let [infectionChance, setInfectionChance] = useState(100);
  let [gameLogs, setGameLogs] = useState([]);
  let [score, setScore] = useState(0);
  let [endModalVisible, setEndModalVisible] = useState(false);
  let shouldReportInfection = true;
  let [remTime, setRemTime] = useState(32);
  let sentScore = false;

  const gameLogTypes = {
    savedByMask: {
      message: "You got exposed but were saved by mask",
      type: "info",
    },
    gotExposed: { message: "You got exposed and infected", type: "error" },
    maxExpired: { message: "One of your masks expired", type: "warning" },
    gotMask: { message: "You got a new mask", type: "success" },
  };
  let finalScore;

  let addScoreInterval;
  useEffect(() => {
    let interval = setInterval(() => {
      setRemTime((prev) => {
        if (prev === 1) {
          gamePaneRef.current.stopMovement();
          setEndModalVisible(true);
          if (!sentScore) {
            fetch(`/api/${username}/score`, {
              method: "POST",
              body: JSON.stringify({ score: finalScore }),
              headers: { "Content-Type": "application/json" },
            }).then((a) => console.log(a));
            sentScore = true;
          }
          clearInterval(addScoreInterval);
          return 1;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setGameLogs((prev) => prev.concat(gameLogTypes.gotMask));
    setGameLogs((prev) => prev.slice(prev.length - 4, prev.length));
  }, [infectionChance]);

  let handleLost = function (wasSavedByMask) {
    if (!shouldReportInfection) return;
    if (wasSavedByMask) {
      setGameLogs((prev) => prev.concat(gameLogTypes.savedByMask));
    } else {
      setGameLogs((prev) => prev.concat(gameLogTypes.gotExposed));
      setScore((prevScore) => prevScore - 30);
    }
    setGameLogs((prev) =>
      prev.slice(Math.max(0, prev.length - 4), prev.length)
    );
    shouldReportInfection = false;
    setTimeout(() => {
      shouldReportInfection = true;
    }, 500);
  };

  useEffect(() => {
    socket.emit(roomEvents.joinRoom, roomID, username);
  }, [socket, roomID, username]);

  socket
    .off(roomEvents.mousePosition)
    .on(roomEvents.mousePosition, (u, mousePosition) => {
      if (username !== u) {
        gamePaneRef.current.setTargetPosition(u, mousePosition);
      }
    });

  socket.off(roomEvents.allJoinedUsers).on(roomEvents.allJoinedUsers, (u) => {
    console.log(`got all users ${JSON.stringify(u)}`);
    for (let i = 0; i < u.length; i++) {
      if (users.indexOf(u[i]) === -1) {
        gamePaneRef.current.createExternalUser(u[i]);
        setUsers((prev) => prev.concat(u[i]));
        setColors((prev) =>
          prev.concat(gamePaneRef.current.getUserColor(u[i]))
        );
      }
    }
  });

  let gamePaneRef = useRef(null);

  let canvasNode = useCallback((node) => {
    if (node != null) {
      let gamePane = new GamePane()
        .setCanvasElement(node)
        .setWidthAndHeight(
          getOptimalPaneSize().width,
          getOptimalPaneSize().height
        )
        .addBots(10)
        .createUser()
        .startParticlesMovementsAndTransmission(60)
        .addInfectedCallback(() => console.log("infected!"))
        .addMouseMoveCallback((mouse) => {
          socket.emit(roomEvents.mousePosition, username, mouse.position);
        })
        .addInfectedCallback(handleLost)
        .run();

      gamePaneRef.current = gamePane;
      setTimeout(() => gamePane.startInfecting(), 2000);
      addScoreInterval = setInterval(() => {
        if (
          infectionChance !== Math.max(0, gamePane.thisUserChanceOfInfection)
        ) {
          setInfectionChance((v) =>
            Math.max(0, gamePane.thisUserChanceOfInfection)
          );
        }

        setScore((prevScore) => prevScore + 5);
      }, 500);

      setInterval(() => {
        gamePane.addMask();
      }, 2000);
    }
  }, []);

  return (
    <div>
      <PageHeader
        onBack={() => null}
        title={username}
        subTitle={`Multiplayer lobby ${roomID}`}
        backIcon={
          <Popconfirm title="Are you sure you want to leave the room?">
            <ArrowLeftOutlined style={{ fontSize: "20px" }} />
          </Popconfirm>
        }
        extra={[<UsersAvatars users={users} colors={colors} />]}
      />
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <div>
          <Progress
            style={{ marginLeft: "150px" }}
            type="circle"
            percent={((30 - remTime) / 30) * 100}
            format={(percent) => `${remTime} seconds`}
          />
          <div
            style={{ textAlign: "center", margin: "50px", marginTop: "0px" }}
          >
            <h1>Score: {score}</h1>
            <h2>Chance of infection: {infectionChance}</h2>
            <Progress
              // style={{ width: getOptimalPaneSize().width }}
              percent={infectionChance}
              showInfo={true}
              // steps={10}
              strokeColor="#1890ff"
              size={"large"}
            />
            <GameLogs logs={gameLogs} />
          </div>
        </div>
        <div>
          <canvas
            style={{ margin: "20px", marginTop: "20px" }}
            width="900"
            height="900"
            ref={canvasNode}
          />
        </div>
        <Chat socket={socket} />
      </div>
      <Modal
        title={<h1>GAME ENDED</h1>}
        visible={endModalVisible}
        okText={"Play Again!"}
        cancelText={"See Leaderboard"}
        onCancel={() => (window.location.href = "/ejs/leaderboard")}
        onOk={() => window.location.reload()}
      >
        <h2>
          Your score:
          {(() => {
            finalScore = score;
            return score;
          })()}
        </h2>
      </Modal>
    </div>
  );
}
function GameLogs({ logs }) {
  return (
    <div
      style={{
        margin: "10px",
        border: "1px solid #1890FF",
        borderRadius: "5px",
        width: "300px",
      }}
    >
      <h2 style={{ marginTop: "5px" }}>Game Logs</h2>
      {logs.map((log) => {
        return (
          <Alert
            style={{ margin: "10px" }}
            type={log.type}
            closable={false}
            message={<h2>{log.message}</h2>}
          />
        );
      })}
    </div>
  );
}
function Header({ username, users, roomID, colors }) {
  return (
    <PageHeader
      onBack={() => null}
      title={username}
      subTitle={`Multiplayer lobby ${roomID}`}
      backIcon={
        <Popconfirm title="Are you sure you want to leave the room?">
          <ArrowLeftOutlined style={{ fontSize: "20px" }} />
        </Popconfirm>
      }
      extra={[<UsersAvatars users={users} colors={colors} />]}
    />
  );
}

function UsersAvatars({ users, colors }) {
  let getPopoverContent = async function (username) {
    let data = await fetch(`/api/${username}/maxscore`);
    if (data.status !== 200) return "";
    data = await data.json();
    let maxScore = data.macScore;

    data = await fetch(`/api/${username}/gameplayed`);
    data = await data.json();
    let gamesPlayed = data.gamesPlayed;
    return (
      <div>
        <p>Max Score: {maxScore}</p>
        <p>Games played: {gamesPlayed}</p>
      </div>
    );
  };

  let [popoverContents, setPopoverContents] = useState([]);
  useEffect(() => {
    let promises = users.map((user) => getPopoverContent(user));
    Promise.all(promises).then((values) => setPopoverContents(values));
  }, [users]);

  return (
    <div>
      {users.map((user, index) => (
        <Popover
          key={user}
          title={user}
          content={() => {
            return popoverContents[index] === "" ? (
              <Spin />
            ) : (
              popoverContents[index]
            );
          }}
        >
          <Avatar
            style={{
              backgroundColor: colors[index],
            }}
            icon={<UserOutlined />}
          />
        </Popover>
      ))}
    </div>
  );
}

// TODO: Does not work.
function getOptimalPaneSize() {
  const options = {
    mobile: { width: 300, height: 300 },
    tablet: { width: 400, height: 400 },
    desktop: { width: 600, height: 600 },
  };
  // TODO: innerWidth might not be supported in some browsers;
  const deviceWidth = window.innerWidth;
  if (deviceWidth < 400) {
    return options.mobile;
  } else if (deviceWidth < 700) {
    return options.tablet;
  } else {
    return options.desktop;
  }
}

const roomEvents = {
  joinRoom: "join-room",
  createRoom: "createRoom",
  newUserJoined: "new-user-joined",
  chatroomMessage: "chatroom-message",
  mousePosition: "mouse-position",
  roomCreated: "room-created",
  allJoinedUsers: "all-joined-users",
};
