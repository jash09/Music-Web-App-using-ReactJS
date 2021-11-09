import React, { useContext, useCallback } from "react";

import { GlobalContext } from "../GlobalState";

export const useCheckDarkmode = () => {
  const [, dispatch] = useContext(GlobalContext);
  const setThemeSelectValue = useCallback(
    (data) => {
      dispatch({ type: "setThemeSelectValue", snippet: data });
    },
    [dispatch]
  );
  const checkDarkMode = () => {
    const selectedTheme = localStorage.getItem("selectedTheme");

    // we will check if system dark mode is enabled or not

    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    colorScheme.addEventListener("change", (e) => {
      if (e.matches) {
        // if it matches we will set it to dark else default
        setThemeSelectValue("Dark");
      } else {
        setThemeSelectValue("Default");
      }
    });
    if (selectedTheme) {
      // console.log(selectedTheme);
      setThemeSelectValue(selectedTheme);

      const date = new Date();
      const hrs = date.getHours();

      // if the theme is auto then only do it
      if (selectedTheme === "Auto") {
        if (hrs >= 18 || hrs <= 6) {
          setThemeSelectValue("Dark");
        } else {
          setThemeSelectValue("Default");
        }
      }
    }
  };

  return { checkDarkMode };
};
