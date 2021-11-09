import React, { useContext } from "react";
import { GlobalContext } from "./GlobalState";
import { GoogleLogout } from "react-google-login";
import { Redirect } from "react-router";

const clientId = process.env.REACT_APP_OAUTH_KEY;

function Logout({ successLogout }) {
  const [{}, dispatch] = useContext(GlobalContext);

  const onSuccess = () => {
    const data = {
      isAuthenticated: false,
      name: null,
      email: null,
      imageUrl: null,
      token: null,
    };

    dispatch({ type: "authenticateUser", snippet: data });
    successLogout();
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
