import { useEffect, useState } from "react";
import { AuthState } from "../../common/auth";
import ConfirmSignUpForm from "./ConfirmSignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const WraplifyAuthenticator = ({
  onSignUp,
  onConfirmSignUp,
  onLogin,
  onForgotPassword,
  style = {},
  initialState = AuthState.SignIn,
}) => {
  const [authData, setAuthData] = useState({ username: "" });
  const [authState, setAuthState] = useState(initialState);
  const [authComponent, setAuthComponent] = useState();

  useEffect(() => {
    const handleAuthStateChange = () => {
      const getAuthComponent = () => {
        switch (authState) {
          case AuthState.SignUp:
            return (
              <SignUpForm
                onSignUp={onSignUp}
                setAuthState={setAuthState}
                setAuthData={setAuthData}
              />
            );
          case AuthState.ConfirmSignUp:
            return (
              <ConfirmSignUpForm
                onConfirmSignUp={onConfirmSignUp}
                setAuthState={setAuthState}
                authData={authData}
              />
            );
          case AuthState.SignIn:
            return (
              <LoginForm
                onLogin={onLogin}
                setAuthState={setAuthState}
                setAuthData={setAuthData}
              />
            );
          case AuthState.ForgotPassword:
            return (
              <ForgotPasswordForm
                onForgotPassword={onForgotPassword}
                setAuthState={setAuthState}
              />
            );
          default:
            <LoginForm
              onLogin={onLogin}
              setAuthState={setAuthState}
              setAuthData={setAuthData}
            />;
        }
      };

      setAuthComponent(getAuthComponent());
    };

    handleAuthStateChange();
  }, [onLogin, authState, authData]);

  return <div style={{ width: 350, ...style }}>{authComponent}</div>;
};

export default WraplifyAuthenticator;
