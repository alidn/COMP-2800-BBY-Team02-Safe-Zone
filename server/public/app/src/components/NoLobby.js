import { Empty, Button } from "antd";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function EmptyLobby() {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={<span>Ain't No Lobby!</span>}
    >
      <Link to="/main">
        <Button type="primary">Create Now</Button>
      </Link>
    </Empty>
  );
}
