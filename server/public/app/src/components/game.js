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
} from "./dot";
import {
  PageHeader,
  Avatar,
  Popover,
  Button,
  Drawer,
  notification,
  message as notifMessage,
} from "antd";
import ProfileCard from "./profile-card";
import Chat from "./chat";

const PANE_WIDTH = 700;
const PANE_HEIGHT = 700;
export default function Game(props) {
  const thisUsername = sessionStorage.getItem("username");
  let [isPaused, setPaused] = useState(true);
  let [users, setUsers] = useState([thisUsername]);
  let [isDrawerVisible, setDrawerVisible] = useState(false);
  let [joined, setJoined] = useState(true);
  let [scores, setScores] = useState([]);
  let mouseGif = useRef(null);

  props.socket.off("end").on("end", (username) => {
    if (username === thisUsername) {
      notifMessage.success("You won!");
      props.socket.emit("inc-score", thisUsername);
      setTimeout(() => props.socket.emit("restart-c"), 500);
    } else {
      notifMessage.error("You lost!");
    }
  });

  console.log("20");

  props.socket.off("all-scores").on("all-scores", (scoresList) => {
    setScores(scoresList);
  });

  props.socket.off("start").on("start", () => setPaused(false));
  props.socket.off("restart").on("restart", () => setPaused(true));

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

        const NUMBER_OF_DOTS = 10;
        const RENDER_PAUSE = 10;

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
            // showAngleIndicator: true,
            wireframeBackground: "#fff",
            background: "transparent",
            wireframes: false,
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
              fillStyle: "red",
            },
          }),
          Bodies.rectangle(PANE_WIDTH / 2, PANE_HEIGHT, PANE_WIDTH, 10, {
            isStatic: true,
            render: {
              fillStyle: "blue",
            },
          }),
          Bodies.rectangle(PANE_WIDTH, PANE_HEIGHT / 2, 10, PANE_HEIGHT, {
            isStatic: true,
            render: {
              fillStyle: "green",
            },
          }),
          Bodies.rectangle(0, PANE_HEIGHT / 2, 10, PANE_HEIGHT, {
            isStatic: true,
            render: {
              fillStyle: "black",
            },
          }),
        ]);

        let end = Bodies.rectangle(PANE_WIDTH - 30, PANE_HEIGHT - 30, 60, 60, {
          isStatis: true,
          render: { fillStyle: "green", opacity: 0.7 },
          label: "end",
          isSensor: true,
        });
        World.add(world, [end]);

        let userDot;
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
            addBorder(curDot, undefined, "blue");
          } else {
            addBorder(curDot, undefined, "orange");
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
          mouseGif.current.hidden = false;
          mouseGif.current.style.top = mouse.mousedownPosition.y;
          mouseGif.current.style.left = mouse.mousedownPosition.x;
          setTimeout(() => {
            mouseGif.current.hidden = true;
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
          }, 3000);
        }

        let showMessage = true;
        function showLoseMessage() {
          if (showMessage) {
          }
          showMessage = false;
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
            <Button
              style={{ marginRight: "5px" }}
              type="primary"
              onClick={() => {
                if (isPaused) {
                  props.socket.emit("start-c");
                } else {
                  props.socket.emit("restart-c");
                }
                // setPaused((p) => !p);
              }}
            >
              {isPaused ? "Start" : "Restart"}
            </Button>
            <Button
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: "40px" }}
            >
              Scoreboard
            </Button>
            {users.map((username) => (
              <Popover
                title={username}
                content={<ProfileCard name={username} />}
                placement={"bottomRight"}
              >
                <Avatar
                  style={{
                    backgroundColor:
                      username === thisUsername ? "#7265e6" : "#00a2ae",
                  }}
                >
                  {username}
                </Avatar>
              </Popover>
            ))}
          </div>
        }
      />
      <Drawer
        title="Scoreboard"
        placement={"top"}
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        {scores.map((score) => (
          <p>{score.username + " : " + score.value}</p>
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
          ref={mouseGif}
          id="image"
          width="30px"
          height="30px"
          hidden
          src="https://media.giphy.com/media/kEvQXdwhbcMPS/giphy.gif"
          alt="mouse click"
          style={{ position: "fixed" }}
        />
        <Chat socket={props.socket} />
      </div>
    </div>
  );
}
