import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";

import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Link,
  Switch,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import {
  Tabs,
  Tab,
  withStyles,
  Grid,
  CircularProgress,
  Avatar,
  Typography,
} from "@material-ui/core";

import {
  Home,
  Favorite,
  VideoLibrary,
  History,
  GetApp,
} from "@material-ui/icons/";

import { GlobalContext } from "./GlobalState";
import {
  getHistory,
  getLikedSongs,
  getDownloadedSongs,
  removeDownloadingState,
  db,
} from "../external/saveSong";

// import the db from save song
import MainPlayer from "../components/player/MainPlayer";
// pages
const LoginPage = lazy(() => import("./LoginPage"));
const RenderDatabase = lazy(() => import("./RenderDatabase"));
const SearchResult = lazy(() => import("./SearchResult"));
const HomePage = lazy(() => import("./sections/HomePage"));
const Profile = lazy(() => import("./Profile"));

// custom styling the tab menus
const CustomTab = withStyles({
  root: {
    background: "#e91e63",
    position: "fixed",
    bottom: "0",
    padding: 0,
    width: "100%",
    zIndex: 1300,
  },
  indicator: {
    display: "none",
  },
})(Tabs);

const CustomTabs = withStyles({
  root: {
    color: "#FFB2C1",
    fontSize: ".75rem",
    margin: 0,

    "&:hover": {
      color: "#ffffffed",
      opacity: 1,
    },
    "&$selected": {
      color: "#fff",
    },
    "&:focus": {
      color: "#FFFFFF",
    },
  },

  selected: {},
})(Tab);

let previousLocation;

const CurrentSection = ({ history, location }) => {
  const [
    { currentVideoSnippet, searchResult, isAuthenticated, name, imageUrl },
  ] = useContext(GlobalContext);
  // console.log(currentVideoSnippet);

  const [songsHistoryState, setSongsHistory] = useState([]);
  const [songsLikedState, setSongsLiked] = useState([]);
  const [songsDownloadedState, setSongsDownloaded] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [redirectState, setRedirectState] = useState(null);

  const circularLoader = (
    <Grid
      style={{ height: "100vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  const fetchSongs = useCallback(async () => {
    //it's same as the orders of our tabs
    switch (tabValue) {
      case 1:
        setSongsLiked(await getLikedSongs());
        break;

      case 2:
        setSongsDownloaded(await getDownloadedSongs());
        break;

      case 3:
        setSongsHistory(await getHistory());
        break;

      default:
        break;
    }
  }, [tabValue]);
  //
  useEffect(() => {
    fetchSongs();
  }, [tabValue, fetchSongs]);

  useEffect(() => {
    fetchSongs();
    // console.log("fetching the songs");
  }, [updateCount, fetchSongs]);

  useEffect(() => {
    db.on("changes", () => {
      setUpdateCount((c) => c + 1);
    });
    // will remove all the songs which are downloading in the first place
    removeDownloadingState();

    const isThisNewUser = localStorage.getItem("isThisNew");
    if (isThisNewUser === "no") {
      setRedirectState(true);
    }
    // if this is not a new user redirect it to home
    previousLocation = location;
    history.listen((location) => {
      if (location.pathname !== "/play") {
        previousLocation = location;
        // console.log(previousLocation);
      }
    });
  }, []);

  useEffect(() => {
    // we will redirect everytime user comes to root page
    if (redirectState && history.location.pathname === "/") {
      history.replace("/home");
    }

    // if the location is not play then we will push new location
  }, [setRedirectState, history, redirectState]);

  const checkPrevLocation = () => {
    if (location.pathname === "/play") {
      return previousLocation;
    } else {
      return location;
    }
  };

  // we will load the homepage with all the playlists
  const continueToHome = () => {
    localStorage.setItem("isThisNew", "yes");
    history.replace("/home");
  };

  const successLogin = () => {
    localStorage.setItem("isThisNew", "no");
    history.replace("/home");
  };

  const successLogout = () => {
    localStorage.setItem("isThisNew", "yes");
    history.replace("/");
  };

  const returnMainPlayer = (props) => {
    // we will return the main player if the path is not the "/"

    if (window.location.pathname !== "/") {
      return <MainPlayer {...props} />;
    } else {
      return null;
    }
  };

  // the set tab value will keep the tab active on their route
  // there are 4 tabs so there will be 3 indexes
  return (
    <div>
      <Suspense fallback={circularLoader}>
        <Switch location={checkPrevLocation()}>
          <Route
            exact
            path="/"
            render={(props) => {
              return (
                <LoginPage
                  continueToHome={continueToHome}
                  successLogin={successLogin}
                />
              );
            }}
          />
          <Route
            path="/search"
            render={(props) => <SearchResult videos={searchResult} />}
          />
          <Route
            path="/home"
            render={(props) => {
              // setTabValue(0);
              return <HomePage key={location.pathname} />;
            }}
          />
          <Route
            path="/liked"
            render={(props) => {
              // setTabValue(1);
              return (
                <RenderDatabase
                  songs={songsLikedState}
                  {...props}
                  key={location.pathname}
                />
              );
            }}
          />
          <Route
            path="/downloads"
            render={(props) => {
              // setTabValue(2);
              return (
                <>
                  {isAuthenticated ? (
                    <RenderDatabase
                      songs={songsDownloadedState}
                      key={location.pathname}
                    />
                  ) : (
                    <Grid
                      container
                      component="main"
                      alignItems="center"
                      justify="center"
                    >
                      {!isAuthenticated ? (
                        <>
                          <Typography component="h1" variant="h5">
                            You need to <Link to="/">Log In</Link> to download
                            new songs
                          </Typography>
                          <RenderDatabase
                            songs={songsDownloadedState}
                            key={location.pathname}
                          />
                        </>
                      ) : null}
                    </Grid>
                  )}
                </>
              );
            }}
          />
          <Route
            path="/history"
            render={(props) => {
              // setTabValue(3);
              return (
                <RenderDatabase
                  songs={songsHistoryState}
                  key={location.pathname}
                />
              );
            }}
          />
          <Route
            path="/profile"
            render={(props) => {
              // setTabValue(4);
              return (
                <Profile
                  key={location.pathname}
                  successLogout={successLogout}
                />
              );
            }}
          />
        </Switch>
        <Route path="/" render={(props) => returnMainPlayer(props)} />

        <div style={{ height: currentVideoSnippet.id ? "100px" : "50px" }} />
      </Suspense>
      {/* if the player is on then return 100px else 50px*/}
      <CustomTab
        value={tabValue}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <CustomTabs
          icon={<Home />}
          aria-label="Home"
          component={Link}
          to="/home"
          label="Home"
        />

        <CustomTabs
          icon={<Favorite />}
          aria-label="Liked"
          component={Link}
          to="/liked"
          label="Liked"
        />

        <CustomTabs
          icon={<GetApp />}
          aria-label="Downloads"
          component={Link}
          to="/downloads"
          label="Downloads"
        />
        <CustomTabs
          icon={<History />}
          aria-label="History"
          component={Link}
          to="/history"
          label="History"
        />

        <CustomTabs
          icon={
            isAuthenticated ? (
              <Avatar
                alt={name}
                src={imageUrl}
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <Avatar style={{ width: "25px", height: "25px" }} />
            )
          }
          aria-label="Profile"
          component={Link}
          to="/profile"
          label="Profile"
        />
      </CustomTab>
    </div>
  );
};

export default withRouter(CurrentSection);
