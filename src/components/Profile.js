import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Logout from "./LogoutGoogle";
import { GlobalContext } from "./GlobalState";
import UserDetails from "./UserDetails";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(4, 2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Profile({ successLogout }) {
  const classes = useStyles();

  const [{ isAuthenticated }] = useContext(GlobalContext);

  return (
    <>
      {isAuthenticated ? (
        <Grid container component="main" alignItems="center" justify="center">
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <Typography
                component="h1"
                variant="h5"
                style={{ marginBottom: "0.5em" }}
              >
                User Profile
              </Typography>
              <UserDetails />
            </div>
            <Typography component="h1" variant="h5" className={classes.paper}>
              <Logout successLogout={successLogout} />
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}
