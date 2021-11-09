import React, { useState, useContext, useEffect } from "react";
import {
  IconButton,
  Grid,
  Slider,
  LinearProgress,
  makeStyles,
  withStyles,
  Button,
} from "@material-ui/core/";

import {
  ExpandMore,
  GetApp,
  Reply,
  DoneOutline,
  Done,
  AlarmOff,
} from "@material-ui/icons/";
import VolumeController from "./VolumeController";
import { useSongMethods } from "../RenderDatabase";
import { downloadSong } from "../../external/saveSong";
import SleepTimer from "./SleepTimer";
import { GlobalContext } from "../GlobalState";
import LoginPromptDialog from "../LoginPromptDialog";

const DownloadLoader = withStyles({
  root: {
    height: 2,
    width: "70%",
    margin: "0 auto",
    transform: "translateY(-10px)",
  },
})(LinearProgress);

const TopBar = ({ song, player, setPlayerState, history }) => {
  const [isSongDownloaded, setSongDownloaded] = useState(false);
  const [isSongDownloading, setSongDownloading] = useState(false);
  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const [{ isAuthenticated }] = useContext(GlobalContext);

  const {
    handleDownload,
    handleRemoveSong,
    deleteDialogComponent,
  } = useSongMethods();

  useEffect(() => {
    if (song.audio) {
      setSongDownloaded(true);
      setSongDownloading(false);
    }
  }, []);
  // if the song is downloaded we will change

  const loginRedirectPrompt = !isAuthenticated ? (
    <LoginPromptDialog
      isOpen={openLoginPrompt}
      handleCancel={() => setOpenLoginPrompt(false)} // we will just hide the dialog on cancel
    />
  ) : null;

  // share prompt using chrome web api
  const shareSong = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Share This Song",
          text: `Hey Listen to ${song.title} on Music App`,
          url: window.location.href, //get the current window url
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const minimizePlayer = () => {
    history.goBack();
    setPlayerState("minimized");
  };

  return (
    <Grid
      container
      justify="space-between"
      direction="row"
      style={{
        padding: " 0 10px",
        marginTop: "10px",
        position: "absolute",
        top: "0",
      }}
    >
      <VolumeController player={player} />
      {deleteDialogComponent}
      {loginRedirectPrompt}
      <Reply
        style={{ transform: " scaleX(-1) translateY(-2px)" }}
        onClick={shareSong}
        color="primary"
      />

      <SleepTimer player={player} />

      <div>
        {isSongDownloaded ? (
          <DoneOutline
            color="primary"
            onClick={() => handleRemoveSong(song.id)}
          /> //song will be removed
        ) : (
          <>
            <GetApp
              color="primary"
              onClick={() => {
                if (isAuthenticated) {
                  handleDownload(song.id);
                  setSongDownloading(true);
                } else {
                  setOpenLoginPrompt(true);
                }
              }}
            />
          </>
        )}
        {isSongDownloading ? <DownloadLoader color="primary" /> : null}
        {/* if the song is downloading we will show loading */}
      </div>

      <Button
        onClick={minimizePlayer}
        color="secondary"
        fontSize="large"
        style={{ transform: "translateY(-7px)", color: "#ec008c" }}
      >
        Back
      </Button>
    </Grid>
  );
};

export default TopBar;
