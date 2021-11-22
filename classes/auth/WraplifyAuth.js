import { Auth } from "aws-amplify";

class WraplifyAuth {
  static login = async (id, password) => {
    const user = await Auth.signIn(id, password);
    return user;
  };

  static resendConfirmationCode = async (id) => {
    await Auth.resendSignUp(id);
  };

  static logout = async () => {
    await Auth.signOut();
  };

  static signUp = async (id, password, name, email, phoneNumber) => {
    const { user } = await Auth.signUp({
      username: id,
      password,
      attributes: {
        name,
        email,
        phone_number: `+82${phoneNumber.slice(1)}`,
      },
    });
    return user;
  };

  static confirmSignUp = async (id, confirmationCode) => {
    await Auth.confirmSignUp(id, confirmationCode);
  };

  static resendConfirmationCode = async (id) => {
    await Auth.resendSignUp(id);
  };

  static forgotPassword = async (id) => {
    const {
      CodeDeliveryDetails: { Destination },
    } = await Auth.forgotPassword(id);
    return Destination;
  };

  static confirmForgotPassword = async (id, confirmationCode, newPassword) => {
    await Auth.forgotPasswordSubmit(id, confirmationCode, newPassword);
  };

  static currentUser = async () => {
    try {
      return await Auth.currentAuthenticatedUser();
    } catch {
      return null;
    }
  };
}

export default WraplifyAuth;
