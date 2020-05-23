import React, { useState } from "react";
import { Input, Button, Rate, Result } from "antd";
import { ArrowLeftOutlined, SmileOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// React component for the feedback page.
export default function Feedback() {
  let [sent, setSent] = useState(false);
  let [feedback, setFeedback] = useState("");

  let send = async function () {
    setSent(true);
    console.log(feedback);
    await fetch("/api/feedback", {
      method: "POST",
      "Content-Type": "application/json",
      body: {
        feedback: feedback,
      },
    });
  };

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <a href="/HTML-shell/main.html">
          <ArrowLeftOutlined style={{ fontSize: "20px" }} />
        </a>
        <Button
          href="/HTML-shell/aboutus.html"
          type="link"
          style={{ float: "right" }}
        >
          About us
        </Button>
      </div>
      {sent ? (
        <Result
          icon={<SmileOutlined />}
          title="Thank you for your feedback!"
          subTitle="your feedback was send to the developers"
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Tell us what you think!</h1>
          <TextArea
            onChange={(e) => setFeedback(e.target.value)}
            style={{ margin: "auto", width: "50%" }}
            rows={4}
          />
          <div style={{ margin: "auto", width: "50%", marginTop: "20px" }}>
            <label>Our Rating </label>
            <Rate
              style={{ margin: "5px" }}
              defaultValue={5}
              character={<SmileOutlined />}
              allowHalf
            />

            <Button
              onClick={send}
              style={{ margin: "5px" }}
              size={"large"}
              type="primary"
            >
              Send Feedback
            </Button>
            <h4 style={{ marginTop: "50px" }}>
              Or email us at:
              <a
                style={{ marginLeft: "5px" }}
                href="mailto:safezonemanagment@gmail.com"
              >
                safezonemanagment@gmail.com
              </a>
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}
