import { Form, Input, Button, Checkbox, PageHeader } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";

export default function (props) {
  let [username, setUsername] = useState(null);
  let [password, setPassword] = useState(null);
  let history = useHistory();

  let login = function () {
    props.socket.emit("login", {
      username: username,
      password: password,
    });
    props.socket.off("loggedin").on("loggedin", () => {
      console.log("logged in!");
      sessionStorage.setItem("username", username);
      history.replace("/main");
    });
    props.socket.off("login-failed").on("login-failed", () => {
      console.log("Logined failed");
    });
  };

  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        style={{
          maxWidth: "500px",
          margin: "auto",
          marginTop: "100px",
        }}
        size={"large"}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="" style={{ float: "right" }}>
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%" }}
            onClick={login}
          >
            Log in
          </Button>
          <Link to="/register">
            Or <a href="">register now!</a>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
