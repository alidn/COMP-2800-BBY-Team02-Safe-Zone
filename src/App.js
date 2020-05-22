import React, { useState, useEffect } from "react";
import SinglePlayerPane from "./components/single-player";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyAccount from "./components/myaccount";
import "./App.css";
import Feedback from "./components/Feedback";
import Multiplayer from "./components/multiplayer";
import ChooseRoom from "./components/chooseroom";
import io from "socket.io-client";

function App() {
  let socket = io.connect();
  let username = localStorage.getItem("username");
  let [roomID, setRoomID] = useState(null);
  let something;

  let changeRoomID = function (newRoomID) {
    setRoomID(newRoomID);
    localStorage.setItem("room-id", newRoomID);
  };

  return (
    <Router>
      <Switch>
        <Route path="/react/single">
          <SinglePlayerPane username={username} />
        </Route>
        <Route path="/react/myAccount">
          <MyAccount username={username} /> socket={socket}
        </Route>
        <Route path="/react/feedback">
          <Feedback />
        </Route>
        <Route path="/react/multiplayer">
          <Multiplayer socket={socket} username={username} roomID={something} />
        </Route>
        <Route path="/react/chooseroom">
          <ChooseRoom
            socket={socket}
            username={username}
            changeRoomID={changeRoomID}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
