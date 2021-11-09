import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

import SongCard from "./SongCard";

import youtubeSearch from "../../apis/youtubeSearch";

// make a permanent playlist object with few songs catergory
const playlistsIds = {
  latestSongs: "PLFgquLnL59akA2PflFpeQG9L01VFg90wS",
};

let slowConnectionTimeout;
const HomePage = () => {
  // for home playlist
  const [songObj, setSongObj] = useState({});

  const fetchFromApi = () => {
    slowConnectionTimeout = setTimeout(() => {}, 5000);

    // Fetch trending music as per country code
    const getTrendingMusic = async () => {
      const res = await youtubeSearch.get("videos", {
        params: {
          chart: "mostPopular",
          videoCategoryId: "10",
          regionCode: localStorage.getItem("country_code"),
        },
      });

      return res.data.items;
    };
    // Setting trending music data
    getTrendingMusic().then((data) => {
      setSongObj((prevState) => {
        return { ...prevState, ...{ trending: data } };
      });
    });

    // Function to fetch playlists
    const getPlayListItems = async (data) => {
      const res = await youtubeSearch.get("playlistItems", {
        params: {
          playlistId: data,
        },
      });
      return res.data.items;
    };

    // Getting and setting latest songs
    getPlayListItems(playlistsIds.latestSongs).then((data) => {
      setSongObj((prevState) => {
        return { ...prevState, ...{ latestSongs: data } };
      });
    });
  };

  useEffect(() => {
    const startingTime = new Date();
    const storedTime = localStorage.getItem("trackTime");
    const savedSongs = JSON.parse(localStorage.getItem("homePageSongObj"));

    if (!window.navigator.onLine) {
      alert("You don't have internet!");
    }

    const checkTimeAndFetch = () => {
      const timeElapsed = new Date() - Date.parse(storedTime); //parse the date

      const timeElapsedInHr = timeElapsed / (1000 * 60 * 60); //convert ms into hr

      // if time is more than 12 hr we will fetch from the api

      // console.log("Saved song", savedSongs);
      if (timeElapsedInHr > 12 || !savedSongs.latestSongs) {
        fetchFromApi();
        localStorage.setItem("trackTime", startingTime); //dont forgot to update the time
      } else {
        setSongObj(savedSongs);
      }
    };

    if (!storedTime) {
      // if no time stored we will store it
      localStorage.setItem("trackTime", startingTime);
      fetchFromApi();
    } else {
      checkTimeAndFetch();
    }
  }, []);

  // if song object changes we will push it to localstoarge
  useEffect(() => {
    localStorage.setItem("homePageSongObj", JSON.stringify(songObj));
  }, [songObj]);

  return (
    <>
      <br />
      <SongCard songs={songObj.trending} categotyTitle={"Trending Now"} />

      <SongCard songs={songObj.latestSongs} categotyTitle={"Latest Music"} />
    </>
  );
};

export default HomePage;
