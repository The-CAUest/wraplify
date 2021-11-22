import React, { useState } from "react";

import { Card, Form, Input, Button } from "antd";
import Text from "antd/lib/typography/Text";
import "antd/dist/antd.css";
import WraplifyAuth from "../../classes/auth/WraplifyAuth";
import { AuthState } from "../../common/auth";

const LoginForm = ({ onLogin, setAuthState, setAuthData }) => {
  const formInit = {
    username: "",
    password: "",
  };

  const [form, setForm] = useState(formInit);

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signIn = async () => {
    const { username, password } = form;

    try {
      await WraplifyAuth.login(username, password);
      if (onLogin) {
        onLogin();
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        alert("아이디 혹은 비밀번호가 잘못되었습니다.");
      } else if (error.name === "UserNotConfirmedException") {
        setAuthData({ username });
        setAuthState(AuthState.ConfirmSignUp);
      } else {
        alert("로그인에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <Card
        actions={[
          <Text onClick={() => setAuthState(AuthState.ForgotPassword)}>
            비밀번호 찾기
          </Text>,
          <Text onClick={() => setAuthState(AuthState.SignUp)}>회원가입</Text>,
        ]}
      >
        <Form name="login-form" onFinish={signIn}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "아이디를 입력해주세요." }]}
          >
            <Input
              name="username"
              placeholder="아이디"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
          >
            <Input.Password
              name="password"
              placeholder="비밀번호"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "35%" }}>
              로그인
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default LoginForm;
