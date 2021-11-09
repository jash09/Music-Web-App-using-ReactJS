import React, { useState, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { FavoriteTwoTone } from "@material-ui/icons";
import circleSvg from "../../images/dottedCircle.svg";
import { rateSong } from "../../external/saveSong";

const dblTouchTapMaxDelay = 300;
let latestTouchTap = {
  time: 0,
  target: null,
};

function isDblTouchTap(event) {
  const touchTap = {
    time: new Date().getTime(),
    target: event.currentTarget,
  };
  const isFastDblTouchTap =
    touchTap.target === latestTouchTap.target &&
    touchTap.time - latestTouchTap.time < dblTouchTapMaxDelay;
  latestTouchTap = touchTap;
  return isFastDblTouchTap;
}

const MusicArt = ({ data, rating, audioEl }) => {
  const swipeUpHandler = useSwipeable({
    onSwipedUp: (e) => {
      dislikeSong();
    },
  });

  const [heartStyle, setHeartStyle] = useState({
    transform: "scale(0)",
  });

  const artContainerStyle = {
    background: `url(${circleSvg}) no-repeat`,
    padding: "18px",
    position: "relative",
    zIndex: "1",
  };

  // if its less than 400 width we will use default hq thumbnail
  const checkImg = (e) => {
    if (e.target.naturalWidth < 400) {
      e.target.src = data.sdThumbnail;
    }
  };

  // double tap to like the song
  const likeSong = useCallback(() => {
    // run the like function to like provided with song id and rating
    setHeartStyle({ transform: "scale(0)" });
    setTimeout(() => {
      setHeartStyle({ transform: "scale(1)" });
    }, 300);
  }, [setHeartStyle]);

  const dislikeSong = useCallback(() => {
    setHeartStyle({ transform: "scale(0)" });
  }, [setHeartStyle]);

  React.useEffect(() => {
    if (rating === "liked") {
      likeSong();
    } else if (rating === "disliked") {
      dislikeSong();
    } else {
      setHeartStyle({ transform: "scale(0)" });
    }
  }, [rating, likeSong, dislikeSong, setHeartStyle]);

  // if we find the channel name is before the song title we will remove it
  //using the regex
  const shortTitle = (data) => {
    // this regex is to remove channel name from song title
    const re = new RegExp(data.channelTitle + " - | : ", "g");

    return data.title.replace(re, "");
  };

  const getThumbnail = () => {
    // if the thumbnail is downloaded then get it from database or else use the url to fetch
    if (data.thumbnail) {
      return window.URL.createObjectURL(data.thumbnail);
    } else {
      return data.maxThumbnail;
    }
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ marginTop: "40px" }}
      onClick={(e) => {
        if (isDblTouchTap(e)) {
          if (rating === "liked") {
            dislikeSong();
            rateSong(data.id, "disliked", audioEl);
          }
          likeSong();
          rateSong(data.id, "liked", audioEl);
        }

        // call the like song function on double tap
      }}
    >
      <motion.div
        className="box"
        drag
        dragElastic={true}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        style={artContainerStyle}
        {...swipeUpHandler}
      >
        <FavoriteTwoTone className={"songHeart left"} style={heartStyle} />
        <FavoriteTwoTone className={"songHeart right"} style={heartStyle} />

        <Avatar
          className="searchThumb"
          style={{
            width: "215px",
            height: "215px",
            boxShadow: "#0000008c 1px 3px 8px",
          }}
          alt="video thumbnail"
          src={getThumbnail()}
          imgProps={{ onLoad: (e) => checkImg(e) }}
        />
      </motion.div>
      <br />
      <Typography
        color="primary"
        variant="h5"
        className="musicArtTitle"
        align="center"
      >
        {shortTitle(data)}
      </Typography>
      <Typography color="primary" variant="subtitle1">
        {data.channelTitle}
      </Typography>
      <br />
    </Grid>
  );
};

export default MusicArt;
