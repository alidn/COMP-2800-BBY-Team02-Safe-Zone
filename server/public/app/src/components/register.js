import React, { useState } from "react";
import { Form, Input, Tooltip, Select, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";

const { Option } = Select;

const formItemLayout = {labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Register(props) {
  let [username, setUsername] = useState(null);
  let [password, setPassword] = useState(null);
  let [email, setEmail] = useState(null);
  let history = useHistory();

  let register = function () {
    props.socket.emit("register", {
      username: username,
      password: password,
      email: email,
    });
    props.socket.off("registered").on("registered", () => {
      console.log("registered");
      sessionStorage.setItem("username", username);
    });
    props.socket.off("register-failed").on("register-failed", () => {
      console.log("register failed");
      alert('failed to register'); 
    });

    history.replace("/main");
  };

  return (
    <div>
      <Form
        {...formItemLayout}
        name="register"
        scrollToFirstError
        style={{
          maxWidth: "500px",
          margin: "auto",
          marginTop: "100px",
        }}
        size={"large"}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="username"
          label={
            <span>
              Username&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true,
            },
          ]}
        >
          <Input onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" onClick={register}>
            Register
          </Button>
          <Link to="/login">
            <span style={{ marginLeft: "10px" }}>
              Or <a>Sign in</a>
            </span>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
