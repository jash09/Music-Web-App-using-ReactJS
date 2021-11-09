import axios from "axios";

// your api key in the env file here, see youtubeSearch.js
export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: "15",
    key: process.env.REACT_APP_YouTube_Key,
  },
});
