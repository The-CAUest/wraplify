import React, { useEffect, useState } from "react";

import { Card, Form, Input, Button } from "antd";
import Text from "antd/lib/typography/Text";
import "antd/dist/antd.css";
import { AuthState } from "../../common/auth";
import WraplifyAuth from "../../classes/auth/WraplifyAuth";

const SignUpForm = ({ onSignUp, setAuthState, setAuthData }) => {
  const formInit = {
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    phoneNumber: "",
  };

  const [form, setForm] = useState(formInit);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(form.password === form.passwordConfirm);
  }, [form.password, form.passwordConfirm]);

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signUp = async () => {
    const { username, password, name, email, phoneNumber } = form;

    try {
      const user = await WraplifyAuth.signUp(
        username,
        password,
        name,
        email,
        phoneNumber
      );
      if (onSignUp) {
        onSignUp();
      }
      setAuthData({ username: user.username });
      setAuthState(AuthState.ConfirmSignUp);
    } catch (error) {
      if (error.name === "UsernameExistsException") {
        alert("이미 존재하는 아이디입니다.");
      } else {
        alert("회원가입에 실패했습니다.");
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
          <Text onClick={() => setAuthState(AuthState.SignIn)}>로그인</Text>,
        ]}
      >
        <Form name="signup-form" onFinish={signUp}>
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
            rules={[
              { required: true, message: "비밀번호를 입력해주세요." },
              { min: 8, message: "비밀번호는 8자 이상이어야합니다." },
            ]}
          >
            <Input.Password
              name="password"
              placeholder="비밀번호"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            rules={[
              {
                required: true,
                message: "비밀번호 확인을 위해 비밀번호를 입력해주세요.",
              },
            ]}
          >
            <Input.Password
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "이름을 입력해주세요." }]}
          >
            <Input
              name="name"
              placeholder="이름"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "전화번호를 입력해주세요." },
              {
                pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                message: "전화번호를 제대로 입력해주세요.",
              },
            ]}
          >
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="전화번호"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "이메일을 입력해주세요." },
              {
                type: "email",
                message: "이메일을 제대로 입력해주세요.",
              },
            ]}
          >
            <Input
              name="email"
              type="email"
              placeholder="이메일"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          {form.password !== "" && !passwordMatch ? (
            <Text type="danger">비밀번호가 일치하지 않습니다.</Text>
          ) : null}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "35%" }}>
              회원가입
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default SignUpForm;
