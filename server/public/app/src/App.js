import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginForm from "./components/login";
import Register from "./components/register";
import Game from "./components/game";
import Main from "./components/main";
import EmptyLobby from "./components/NoLobby";
import { Button } from "antd";
import io from "socket.io-client";

function App() {
  const socket = io.connect();
  const reload = () => window.location.reload();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/test.html" onEnter={reload} />
          <Route exact path="/">
            <div
              style={{
                height: "100%",
              }}
            >
              <LoginForm socket={socket} />
            </div>
          </Route>
          <Route path="/login">
            <div
              style={{
                height: "100%",
              }}
            >
              <LoginForm socket={socket} />
            </div>
          </Route>
          <Route path="/register">
            <div
              style={{
                height: "100%",
              }}
            >
              <Register socket={socket} />
            </div>
          </Route>
          <Route path="/game">
            <Game socket={socket} />
          </Route>
          <Route
            path="/main"
            render={() => <Main username={"Zas"} socket={socket} />}
          ></Route>
          <Route path="/no-lobby">
            <EmptyLobby />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
