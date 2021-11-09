import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SimpleAppBar from "./header/SimpleAppBar";
import CurrentSection from "./CurrentSection";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";
import { useCheckDarkmode } from "./sections/useCheckDarkMode";
import { GlobalContext } from "./GlobalState";
import Profile from "./Profile";

const body = document.querySelector("body");

const defaultTheme = {
  palette: {
    primary: pink,
    secondary: {
      main: "#fafafa",
    },
  },
  typography: {
    useNextVariants: true,
  },
};

const darkTheme = {
  palette: {
    type: "dark",
    primary: pink,
    secondary: {
      main: "#fafafa",
    },
  },
  typography: {
    useNextVariants: true,
  },
};

const muiDarkTheme = createMuiTheme(darkTheme);
const muiDefaultTheme = createMuiTheme(defaultTheme);

const AppContainer = () => {
  const [{ themeSelectValue }, dispatch] = useContext(GlobalContext);

  const { checkDarkMode } = useCheckDarkmode();

  useEffect(() => {
    checkDarkMode();

    if (navigator.userAgent.match(/Android/i)) {
      body.style.overscrollBehavior = "none";
      // this is to disable pull refresh on android
    }
  }, []);

  useEffect(() => {
    if (themeSelectValue === "Dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [themeSelectValue]);

  return (
    <MuiThemeProvider
      theme={themeSelectValue === "Dark" ? muiDarkTheme : muiDefaultTheme}
    >
      <Router>
        <SimpleAppBar />
        <Route component={CurrentSection} />
      </Router>
    </MuiThemeProvider>
  );
};
export default AppContainer;
