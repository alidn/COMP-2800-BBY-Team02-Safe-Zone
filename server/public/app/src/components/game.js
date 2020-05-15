import React, { useCallback, useState, useEffect, useRef } from "react";
import Matter from "matter-js";
import {
  createDot,
  sizes,
  colors,
  addBorder,
  makeInfected,
  updateColorsBasedOnStatus,
  updateStatusBasedOnDistance,
  moveAllDotsRandomly,
  createNDots,
  DOTS_INIITAL_LOCATION,
} from "./dot";
import {
  PageHeader,
  Avatar,
  Popover,
  Button,
  Drawer,
  notification,
  message as notifMessage,
  Space,
  Statistic,
  Progress,
  Divider,
  Modal,
  Badge,
} from "antd";
import ProfileCard from "./profile-card";
import Chat from "./chat";
import { UsergroupAddOutlined, BarChartOutlined } from "@ant-design/icons";

const { Countdown } = Statistic;

const PANE_WIDTH = 700;
const PANE_HEIGHT = 700;
export default function Game(props) {
  const thisUsername = sessionStorage.getItem("username");
  let [isPaused, setPaused] = useState(true);
  let [users, setUsers] = useState([thisUsername]);
  let [isDrawerVisible, setDrawerVisible] = useState(false);
  let [joined, setJoined] = useState(true);
  let [scores, setScores] = useState([]);
  let [mouseGifTop, setMouseGifTop] = useState(0);
  let [mouseGifLeft, setMouseGifLeft] = useState(0);
  let [mouseGifHidden, setMouseGifHidden] = useState(true);
  let [percent, setPercent] = useState(0);
  let [remainingTime, setRemainingTime] = useState(15);
  let [roundStarted, setRoundStarted] = useState(false);
  let [isProgessBarHidden, setProgressBarHidden] = useState(true);
  let [isEndModalVisible, setEndModalVisible] = useState(false);
  let [badgesCount, setBadgesCount] = useState({});
  let [wantToPlay, setWantToPlay] = useState([]);
  let [waitingForOthers, setWaitingForOthers] = useState(false);
  let [gameStartCountdown, setGameStartCountdown] = useState(3);
  let [startCountdownModalVisible, setStartCountdownModalVisible] = useState(
    false
  );

  useEffect(() => {
    if (roundStarted) {
      setStartCountdownModalVisible(true);
      setWaitingForOthers(false);
      let gameStartCountdownInterval = setInterval(() => {
        setGameStartCountdown((v) => v - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(gameStartCountdownInterval);
        setStartCountdownModalVisible(false);
        setProgressBarHidden(false);
        setRemainingTime((v) => 15);
        setPercent((p) => 0);
        setEndModalVisible(false);
        setBadgesCount({});
        setPaused(false);
        setWantToPlay([]);
        let countdownInterval = setInterval(() => {
          setRemainingTime((v) => v - 0.2);
          setPercent((v) => v + 6.7 / 5);
        }, 200);
        setTimeout(() => {
          setProgressBarHidden(true);
          setEndModalVisible(true);

          props.socket.emit("end-round");
          props.socket.emit("position", {
            username: thisUsername,
            position: DOTS_INIITAL_LOCATION,
          });
          setPaused(true);
        }, 16000);
        return () => {
          clearInterval(countdownInterval);
        };
      }, 3000);
    }
  }, [roundStarted]);

  props.socket.off("win").on("win", (username) => {
    if (username === thisUsername) {
      notifMessage.success("You won! Keep up the good work", 3);
      props.socket.emit("inc-score", thisUsername);
      setTimeout(() => props.socket.emit("goto-start"), 500);
    }
  });

  props.socket.off("all-scores").on("all-scores", (scoresList) => {
    // let badges = badgesCount;
    // for (let i = 0; i < scoresList.length; i++) {
    //   badges[scoresList[i].username] += scores[i].value > scoresList[i].value;
    // }
    // setBadgesCount(badges);
    setScores(scoresList);
  });

  props.socket.off("start").on("start", () => {
    console.log("Game started");
    setRoundStarted(true);
  });

  props.socket.off("want-to-start").on("want-to-start", (people) => {
    console.log(`got people who want to play:`);
    setWantToPlay(people);
    console.log(`people who want to play: ${wantToPlay}`);
  });

  props.socket.off("all-users").on("all-users", (usersList, show) => {
    if (!joined && show) {
      notification["info"]({
        message: "someone just joined!",
      });
    }
    setJoined(true);
    setUsers(usersList);
    console.log(users);
  });

  const finishRound = function () {};

  const gameCanvas = useCallback(
    (node) => {
      if (node !== null) {
        var Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

        const NUMBER_OF_DOTS = 5;
        const RENDER_PAUSE = 30;

        // create engine
        let engine = Engine.create();
        let world = engine.world;
        world.gravity = { x: 0, y: 0, scale: 0 };

        // create renderer
        let render = Render.create({
          canvas: node,
          engine: engine,
          options: {
            width: PANE_WIDTH,
            height: PANE_HEIGHT,
            // wireframeBackground: "white",
            // background: "white",
            wireframes: false,
            showAngleIndicator: true,
          },
        });

        Render.run(render);

        // create runner
        var runner = Runner.create();
        Runner.run(runner, engine);

        // add walls
        World.add(world, [
          Bodies.rectangle(PANE_WIDTH / 2, 0, PANE_WIDTH, 10, {
            isStatic: true,
            render: {
              fillStyle: "#1890FF",
            },
          }),
          Bodies.rectangle(PANE_WIDTH / 2, PANE_HEIGHT, PANE_WIDTH, 10, {
            isStatic: true,
            render: {
              fillStyle: "#1890FF",
            },
          }),
          Bodies.rectangle(PANE_WIDTH, PANE_HEIGHT / 2, 10, PANE_HEIGHT, {
            isStatic: true,
            render: {
              fillStyle: "#1890FF",
            },
          }),
          Bodies.rectangle(0, PANE_HEIGHT / 2, 10, PANE_HEIGHT, {
            isStatic: true,
            render: {
              fillStyle: "#1890FF",
            },
          }),
        ]);

        let end = Bodies.rectangle(PANE_WIDTH - 30, PANE_HEIGHT - 30, 60, 60, {
          isStatic: true,
          render: {
            strokeStyle: "green",
            // opacity: 0.7,
            fillStyle: "green",
            lineWidth: 3,
          },
          label: "end",
          isSensor: true,
        });
        World.add(world, [end]);

        // the current user's dot
        let userDot;
        // all human players' dots (including this user)
        let userDots = [];
        console.log(users);
        for (let i = 0; i < users.length; i++) {
          let curUser = users[i];
          let curDot;
          if (curUser === thisUsername) {
            curDot = createDot(sizes.USER_RADIUS, colors.USER, isPaused);
            console.log("Creating own dot");
          } else {
            console.log("Creating enemy dot");
            curDot = createDot(sizes.USER_RADIUS, colors.USER, isPaused);
          }
          if (curUser === thisUsername) {
            addBorder(curDot, undefined, "#d0e3f2");
          } else {
            addBorder(curDot, undefined, "#f2edd0");
          }
          curDot.label = curUser;

          userDots.push(curDot);
          if (curDot.label === thisUsername) {
            userDot = userDots[i];
          }
          World.add(world, userDots[i]);
        }

        props.socket.off("position").on("position", ({ username, force }) => {
          console.log("Got force", username, force);
          for (let i = 0; i < userDots.length; i++) {
            if (username === userDots[i].label) {
              console.log("applying force to", username, force);

              Matter.Body.setVelocity(userDots[i], force);
            }
          }
        });

        // add mouse control
        var mouse = Mouse.create(render.canvas),
          mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2,
              render: {
                visible: false,
              },
            },
            // body: userDot,
          });

        Matter.Events.on(mouseConstraint, "mousedown", () => {
          setMouseGifHidden(false);
          setMouseGifTop(mouse.mousedownPosition.y);
          setMouseGifLeft(mouse.mousedownPosition.x);
          setTimeout(() => {
            setMouseGifHidden(true);
          }, 500);
          userDot.velocity = {
            x: 0,
            y: 0,
          };
          let velocity = {
            x: (mouse.mousedownPosition.x - userDot.position.x) / 100,
            y: (mouse.mousedownPosition.y - userDot.position.y) / 100,
          };

          props.socket.emit("pos", {
            username: thisUsername,
            force: velocity,
          });
        });

        World.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

        let dots = createNDots(NUMBER_OF_DOTS, isPaused);

        for (let i = 0; i < dots.length; i++) {
          let dot = dots[i];
          World.add(world, dot);
        }

        // fit the render viewport to the scene
        Render.lookAt(render, {
          min: { x: 0, y: 0 },
          max: { x: PANE_WIDTH, y: PANE_HEIGHT },
        });

        makeInfected(dots[0]);
        updateColorsBasedOnStatus(dots);

        if (!isPaused) {
          setTimeout(() => {
            let won = false;
            setInterval(() => {
              updateStatusBasedOnDistance(dots);
              updateColorsBasedOnStatus(dots);
              moveAllDotsRandomly(dots);
              if (Matter.Bounds.overlaps(end.bounds, userDot.bounds) && !won) {
                props.socket.emit("win", thisUsername);
                won = true;
              }
            }, RENDER_PAUSE);
          }, 2000);
        }
      }
    },
    [isPaused, users]
  );

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title={"Lobby " + sessionStorage.getItem("lobbyId")}
        extra={
          <div style={{ cursor: "pointer" }}>
            <Space>
              <Progress
                type="circle"
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                percent={percent}
                showInfo={false}
                hidden={isProgessBarHidden}
              />
              <Divider type="vertical" />

              <Countdown
                style={{ marginRight: "50px" }}
                title={<h1>Countdown</h1>}
                value={roundStarted ? Date.now() + remainingTime * 1000 : 0}
                format={"ss:S"}
                onFinish={finishRound}
              />
              <Divider type="vertical" />

              <Popover
                title={"Players who want to start"}
                content={wantToPlay.map((name) => {
                  <p key="name">{name}</p>;
                })}
                visible={waitingForOthers}
              >
                <Button
                  type="primary"
                  size={"large"}
                  loading={waitingForOthers}
                  onClick={() => {
                    props.socket.emit("start-round", thisUsername);
                    setWaitingForOthers(true);
                  }}
                >
                  {!waitingForOthers
                    ? "Start Round"
                    : "Waiting for other players"}
                </Button>
              </Popover>
              <Divider type="vertical" />

              <Button
                size={"large"}
                icon={<UsergroupAddOutlined size={"large"} />}
              >
                Invite Friends
              </Button>
              <Divider type="vertical" />

              <Button
                size={"large"}
                onClick={() => setDrawerVisible(true)}
                style={{ marginRight: "40px" }}
                icon={<BarChartOutlined />}
              >
                Scoreboard
              </Button>
              {users.map((username) => (
                <Popover
                  title={username}
                  content={<ProfileCard name={username} />}
                  placement={"bottomRight"}
                >
                  <Badge
                    count={
                      badgesCount[username] === undefined
                        ? 0
                        : badgesCount[username]
                    }
                    style={{ backgroundColor: "#52c41a" }}
                  >
                    <Avatar
                      style={{
                        backgroundColor:
                          username === thisUsername ? "#7265e6" : "#00a2ae",
                      }}
                      size={"large"}
                    >
                      {username}
                    </Avatar>
                  </Badge>
                </Popover>
              ))}
            </Space>
          </div>
        }
      />
      <Drawer
        title={<h1>Scoreboard</h1>}
        placement={"top"}
        closable={false}
        onClose={() => {
          setDrawerVisible(false);
        }}
        visible={isDrawerVisible}
      >
        {scores.map((score) => (
          <p>
            <h3>{score.username}</h3>
            {" : " + score.value}
          </p>
        ))}
      </Drawer>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <div id="game-pane">
          <canvas
            id="canvas"
            width="900"
            height="900"
            ref={gameCanvas}
          ></canvas>
        </div>
        <img
          hidden={mouseGifHidden}
          id="image"
          width="30px"
          height="30px"
          hidden
          src="https://media.giphy.com/media/kEvQXdwhbcMPS/giphy.gif"
          alt="mouse click"
          style={{ position: "fixed", top: mouseGifTop, left: mouseGifLeft }}
        />
        <Divider type={"vertical"} />
        <Chat socket={props.socket} />
      </div>
      <Modal
        visible={isEndModalVisible}
        footer={[
          <Button size={"large"} type="primary">
            Play Another Round
          </Button>,
          <Button size={"large"} onClick={() => setEndModalVisible(false)}>
            Ok
          </Button>,
        ]}
      >
        <h2>Round Ended!</h2>
        {scores.map((score) => (
          <p>
            <h3>{score.username}</h3>
            {" : " + score.value}
          </p>
        ))}
      </Modal>
      <Modal visible={startCountdownModalVisible} footer={[]} closable={false}>
        <div style={{ textAlign: "center" }}>
          <h1>Game Starts In</h1>

          <h1 style={{ fontSize: gameStartCountdown === 0 ? "60pt" : "40pt" }}>
            {gameStartCountdown === 0 ? "GO!" : gameStartCountdown}
          </h1>
        </div>
      </Modal>
    </div>
  );
}
