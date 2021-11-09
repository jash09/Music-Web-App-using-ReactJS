import React, { useState, useContext, useEffect, useCallback } from "react";

import { motion } from "framer-motion";

import { GlobalContext } from "./GlobalState";
import "./darkMode.css";
import moon from "../images/moon-solid.svg";
import sun from "../images/sun-solid.svg";

const ToggleTheme = () => {
  const [{ themeSelectValue }, dispatch] = useContext(GlobalContext);

  const setThemeSelectValue = useCallback(
    (data) => {
      dispatch({ type: "setThemeSelectValue", snippet: data });
    },
    [dispatch]
  );

  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (themeSelectValue === "Dark") {
      setIsNight(true);
    } else {
      setIsNight(false);
    }
  }, [themeSelectValue]);

  const changeTheme = (theme) => {
    setThemeSelectValue(theme);
    localStorage.setItem("selectedTheme", theme);
  };

  const handleThemeToggle = () => {
    if (!isNight) {
      changeTheme("Dark");
      setIsNight(false);
    } else {
      changeTheme("Default");
      setIsNight(true);
    }
  };

  return (
    <>
      <img
        src={isNight ? sun : moon}
        onClick={handleThemeToggle}
        className="dayNightToggleBtn"
        alt="sun moon icon"
      />
    </>
  );
};

export default ToggleTheme;
