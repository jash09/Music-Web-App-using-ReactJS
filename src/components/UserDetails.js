import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { GlobalContext } from "./GlobalState";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../external/saveSong";
import Dexie from "dexie";
import "dexie-observable";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
  },
}));

const UserDetails = () => {
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [songsLiked, setSongsLiked] = useState(0);
  const [songsDownloaded, setSongsDownloaded] = useState(0);
  const [songsPlaybackTime, setSongsPlaybackTime] = useState(0);

  db.songs.count().then((count) => {
    setSongsPlayed(count);
  });

  db.songs
    .where("[rating+timestamp]")
    .between(["liked", Dexie.minKey], ["liked", Dexie.maxKey])
    .count()
    .then((count) => {
      setSongsLiked(count);
    });

  db.songs
    .where("[downloadState+timestamp]")
    .between(["downloaded", Dexie.minKey], ["downloaded", Dexie.maxKey])
    .count()
    .then((count) => {
      setSongsDownloaded(count);
    });

  db.songs
    .where("playbackTimes")
    .above(0)
    .toArray()
    .then((res) => {
      let sum = 0;
      res.forEach((song) => {
        sum += song.playbackTimes;
      });
      setSongsPlaybackTime(sum);
    });

  const classes = useStyles();

  const [{ name, email, imageUrl }] = useContext(GlobalContext);

  return (
    <>
      <Avatar className={classes.avatar} src={imageUrl} alt={name} />
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        Name: {name}
      </Typography>
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        E-Mail: {email}
      </Typography>
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        Songs Played: {songsPlayed}
      </Typography>
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        Total Playback Time: {songsPlaybackTime}
      </Typography>
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        Songs Liked: {songsLiked}
      </Typography>
      <Typography component="h1" variant="h5" style={{ marginTop: "0.6em" }}>
        Songs Downloaded: {songsDownloaded}
      </Typography>
    </>
  );
};

export default UserDetails;
