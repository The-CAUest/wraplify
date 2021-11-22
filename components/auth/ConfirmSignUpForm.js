import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import WraplifyAuth from "../../classes/auth/WraplifyAuth";
import Text from "antd/lib/typography/Text";
import { AuthState } from "../../common/auth";

const ConfirmSignUpForm = ({ onConfirmSignUp, setAuthState, authData }) => {
  const { username } = authData;

  if (!username) setAuthState(AuthState.SignIn);

  const formInit = {
    confirmationCode: "",
  };

  const [form, setForm] = useState(formInit);

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const confirmSignUp = async () => {
    try {
      await WraplifyAuth.confirmSignUp(username, form.confirmationCode);
      if (onConfirmSignUp) {
        onConfirmSignUp();
      } else {
        alert("인증에 성공했습니다. 로그인 후 서비스 이용 부탁드립니다.");
      }
      setAuthState(AuthState.SignIn);
    } catch (error) {
      if (error.name === "CodeMismatchException") {
        alert("잘못된 인증코드입니다.");
      } else {
        alert("잘못된 인증코드입니다.");
      }
    }
  };

  const resendConfirmationCode = async () => {
    try {
      await WraplifyAuth.resendConfirmationCode(username);
      alert("새로운 인증코드를 이메일로 전송했습니다. 메일함을 확인해주세요.");
    } catch (error) {
      alert("인증코드 전송에 실패했습니다.");
    }
  };

  return (
    <>
      <Card
        actions={[
          <Text onClick={() => resendConfirmationCode()}>인증코드 재전송</Text>,
          <Text onClick={() => setAuthState(AuthState.SignUp)}>회원가입</Text>,
        ]}
      >
        <Form onFinish={confirmSignUp}>
          <Form.Item name="username" initialValue={username}>
            <Input name="username" onChange={(e) => onChangeForm(e)} disabled />
          </Form.Item>
          <Form.Item
            name="confirmationCode"
            rules={[{ required: true, message: "인증코드를 입력해주세요." }]}
          >
            <Input
              name="confirmationCode"
              type="number"
              placeholder="인증 코드"
              onChange={(e) => onChangeForm(e)}
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "35%" }}>
              인증하기
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default ConfirmSignUpForm;
