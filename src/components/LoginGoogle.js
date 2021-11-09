import React, { useContext } from "react";

import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router";
// refresh token
import { refreshTokenSetup } from "../utils/refreshToken";
import { GlobalContext } from "./GlobalState";

const clientId = process.env.REACT_APP_OAUTH_KEY;

function LoginGoogle({ successLogin }) {
  const [{}, dispatch] = useContext(GlobalContext);
  const onSuccess = (res) => {
    const { profileObj, accessToken } = res;

    const data = {
      isAuthenticated: true,
      name: profileObj.name,
      email: profileObj.email,
      imageUrl: profileObj.imageUrl,
      token: accessToken,
    };

    dispatch({ type: "authenticateUser", snippet: data });
    successLogin();

    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginGoogle;
