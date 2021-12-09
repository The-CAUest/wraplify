import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import Text from "antd/lib/typography/Text";
import WraplifyAuth from "../../classes/auth/WraplifyAuth";
import { AuthState, ForgotPasswordStep } from "../../common/auth";

const ForgotPasswordForm = ({ onForgotPassword, setAuthState }) => {
  const formInit = {
    username: "",
    confirmationCode: "",
    newPassword: "",
  };

  const [form, setForm] = useState(formInit);
  const [step, setStep] = useState(ForgotPasswordStep.IDCheck);
  /**
   * @param {step} 현재 스탭을 나타내는 변수
   * IDCheck : 어떤 아이디의 비밀번호를 찾을건지 확인하는 단계
   * SetNewPassword : 위에서 찾은 새 아이디의 새로운 비밀번호를 설정하는 단계
   */

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendForgotPasswordCode = async () => {
    const { username } = form;

    try {
      const destination = await WraplifyAuth.forgotPassword(username);
      alert(
        `비밀번호 재설정을 위한 인증코드가 ${destination} 으로 전송되었습니다.`
      );
      setStep(ForgotPasswordStep.SetNewPassword);
    } catch (error) {
      if (error.name === "LimitExceededException") {
        alert("너무 자주 시도했습니다. 잠시후 다시 시도해주세요.");
      } else if (error.name === "InvalidParameterException") {
        alert("비밀번호 찾기는 이메일 인증을 진행한 후에 사용가능합니다.");
      } else {
        alert("비밀번호 재설정을 위한 인증코드 전송에 실패했습니다.");
      }
    }
  };

  const setNewPassword = async () => {
    const { username, confirmationCode, newPassword } = form;

    try {
      await WraplifyAuth.confirmForgotPassword(
        username,
        confirmationCode,
        newPassword
      );
      if (onForgotPassword) {
        onForgotPassword();
      } else {
        alert(
          "비밀번호 재설정에 성공했습니다. 해당 비밀번호로 로그인하시면 서비스를 이용하실 수 있습니다."
        );
      }
      setAuthState(AuthState.SignIn);
    } catch (error) {
      if (error.name === "CodeMismatchException") {
        alert("인증코드가 잘못되었습니다.");
      } else if (error.name === "InvalidPasswordException") {
        alert("비밀번호가 조건에 부합하지 않습니다.");
      } else {
        alert("비밀번호 재설정에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <Card
        actions={[
          <Text onClick={() => setAuthState(AuthState.SignIn)}>로그인</Text>,
          <Text onClick={() => setAuthState(AuthState.SignUp)}>회원가입</Text>,
        ]}
      >
        <Form
          onFinish={
            step === ForgotPasswordStep.IDCheck
              ? () => sendForgotPasswordCode()
              : () => setNewPassword()
          }
        >
          {step === ForgotPasswordStep.IDCheck ? (
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
          ) : (
            <>
              <Form.Item
                name="confirmationCode"
                rules={[
                  { required: true, message: "인증코드를 입력해주세요." },
                ]}
              >
                <Input
                  name="confirmationCode"
                  type="number"
                  placeholder="인증 코드"
                  onChange={(e) => onChangeForm(e)}
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "새 비밀번호를 입력해주세요." },
                  { min: 8, message: "비밀번호는 8자 이상이어야합니다." },
                ]}
              >
                <Input.Password
                  name="newPassword"
                  placeholder="새 비밀번호"
                  onChange={(e) => onChangeForm(e)}
                />
              </Form.Item>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "35%" }}>
              {step === ForgotPasswordStep.IDCheck
                ? "비밀번호 찾기"
                : "비밀번호 변경"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default ForgotPasswordForm;
