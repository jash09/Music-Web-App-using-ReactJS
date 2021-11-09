import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./GlobalState";

import { Button, Grid, Typography } from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";
import LoginGoogle from "./LoginGoogle";
import LogoutGoogle from "./LogoutGoogle";
import bgImg from "../images/music-bg.svg";

const bgStyle = {
  background: `url(${bgImg}) no-repeat`,
  backgroundPositionX: "50%",
  width: "100vw",
  height: "46vh",
};

const LoginPage = ({ continueToHome, successLogin }) => {
  const [{ isAuthenticated }] = useContext(GlobalContext);

  return (
    <Grid
      style={{ height: "80vh" }}
      container
      direction="column"
      justify="space-around"
      alignItems="center"
    >
      <div style={bgStyle} />

      <Typography
        variant="h6"
        color="primary"
        align="center"
        style={{ padding: "10px" }}
      >
        Listen to unlimited songs without any ads for free
      </Typography>

      <Button variant="outlined" color="primary" onClick={continueToHome}>
        Continue without Sign-In
        <NavigateNext />
      </Button>
      {!isAuthenticated && <LoginGoogle successLogin={successLogin} />}
    </Grid>
  );
};

export default LoginPage;
