import React, { useCallback, useRef, useState, useEffect } from "react";
import GamePane from "./GamePane";
import {
  Alert,
  Progress,
  PageHeader,
  Popconfirm,
  Modal,
  Statistic,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Countdown } = Statistic;

/*
The list of possible dots.
 */
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
/*
The React component for the single player page.
 */
export default function SinglePlayerPane({ username }) {
  let gamePaneRef = useRef(null);
  let [infectionChance, setInfectionChance] = useState(100);
  let [gameLogs, setGameLogs] = useState([]);
  let [score, setScore] = useState(0);
  let [endModalVisible, setEndModalVisible] = useState(false);
  let shouldReportInfection = true;
  let [remTime, setRemTime] = useState(32);
  let sentScore = false;

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

  let canvasNode = useCallback((node) => {
    if (node != null) {
      let gamePane = new GamePane()
        .setCanvasElement(node)
        .setWidthAndHeight(
          getOptimalPaneSize().width,
          getOptimalPaneSize().height
        )
        .addBots(window.innerWidth < 700 ? 10 : 20)
        .createUser()
        .startParticlesMovementsAndTransmission(60)
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
        onBack={() => {}}
        title={username}
        backIcon={
          <Popconfirm
            title="Are you sure you want to exit?"
            onConfirm={() => (window.location.href = "/HTML-shell/main.html")}
          >
            <ArrowLeftOutlined style={{ fontSize: "20px" }} />
          </Popconfirm>
        }
        extra={[
          <Progress
            type="circle"
            percent={((30 - remTime) / 30) * 100}
            format={(percent) => `${remTime} seconds`}
          />,
        ]}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginRight: "50px",
        }}
      >
        <div style={{ textAlign: "center", flexGrow: 3 }}>
          <canvas
            style={{ display: "inline" }}
            width="900"
            height="900"
            ref={canvasNode}
          />
        </div>
        <div style={{ textAlign: "center", margin: "50px", marginTop: "0px" }}>
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

/*
Returns an optimal pane size based on the size of the screen.
 */
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
