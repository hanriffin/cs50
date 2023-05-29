import React, { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get, toggle } from "../utils/get.js";
import {
  HeartIcon,
  PlayPauseIcon,
  NextIcon,
  PrevIcon,
  ToggleOverlayIcon,
  RepeatSongIcon,
  ShuffleSongIcon,
} from "../utils/icon";

export default function Player({ DeviceID }) {
  const att = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [is_paused, setPaused] = useState();
  const [is_saved, setSaved] = useState();
  const [currPlaying, setCurrPlaying] = useState({});
  const [scrollbar, setScrollbar] = useState(0); // checks to see whether theres a scroll bar to make the player fit with the scrollbar
  const [is_shuffle, setShuffle] = useState(); // sets shuffle
  const [is_repeat, setRepeat] = useState(""); // set repeat, 3 states, off, repeat track, repeat all songs in context
  const [counter, setCounter] = useState(0); // counts number of times the repeat button is pressed to define which state its in

  const toggleOverlay = () => {
    att.setVisible(!att.visible);
  };

  // Check playback state
  const getPlaybackState = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/player?" +
        queryString.stringify({
          additional_types: "track",
        }),
      "GET",
      att.ACCESS_TOKEN
    );

    if (response !== "") {
      const { is_playing, item, device, shuffle_state, repeat_state } =
        await response;
      // on first load (i.e. is_paused is null), set state for pause
      // subsequently, do not change state when running this function
      // get shuffle state and repeat state
      if (is_paused == null) {
        setPaused(!is_playing);
      }
      if (is_shuffle == null) {
        setShuffle(!shuffle_state);
      }
      if (is_repeat !== null) {
        setRepeat(repeat_state);
      }

      const currentlyPlaying = {
        id: item.id,
        name: item.name,
        album: item.album,
        artists: item.artists.map((artist) => artist.name),
        image: item.album.images[2].url,
        device: {
          id: device.id,
          name: device.name,
          type: device.type,
          vol: device.volume_percent,
        },
      };

      setCurrPlaying(currentlyPlaying);
      checkSaved(currentlyPlaying.id);
    } else {
      console.log(response);
    }
  };

  // Check if track is already saved
  const checkSaved = async (track_id) => {
    const response = await get(
      "https://api.spotify.com/v1/me/tracks/contains?" +
        queryString.stringify({
          ids: track_id,
        }),
      "GET",
      att.ACCESS_TOKEN
    );
    setSaved(...response);
  };

  // check if theres a scroll bar, then minus from the player width
  useEffect(() => {
    if (document.body.clientHeight > window.innerHeight) {
      setScrollbar(18);
    } else {
      setScrollbar(0);
    }
  }, []);

  // Save or Delete track
  const addOrRemoveTrack = async (track_id, save = true) => {
    const method = save ? "PUT" : "DELETE";
    await toggle(
      "https://api.spotify.com/v1/me/tracks?" +
        queryString.stringify({
          ids: track_id,
        }),
      method,
      att.ACCESS_TOKEN
    );
    setSaved(save ? true : false);
    // add a check if fetch is successful, then toggle save/unsave
  };

  // Play or Pause track
  const playPause = async () => {
    const playpause = is_paused ? "play" : "pause";
    toggle(
      `https://api.spotify.com/v1/me/player/${playpause}?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );
    setPaused(!is_paused);
    getPlaybackState();
  };

  // Skip to next/previous track
  const changeTrack = async (direction) => {
    await toggle(
      `https://api.spotify.com/v1/me/player/${direction}?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "POST",
      att.ACCESS_TOKEN
    );
    setTimeout(() => {
      getPlaybackState().then(() => setLoading(false));
    }, 1000);
  };

  // Play track given uri !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! i changed this in the reco tab
  const playspecificsong = async () => {
    setLoading(true);
    toggle(
      `https://api.spotify.com/v1/me/player/play?` +
        queryString.stringify({
          device_id: DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN,
      {
        body: JSON.stringify({
          context_uri: "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr", // only albums/artists/playlists
          // uris:    // only tracks
          offset: {
            position: 5,
          },
        }),
      }
    );
    setPaused(false);
    getPlaybackState().then(() => setLoading(false));
  };

  // counter + 1 when button of repeat is pressed
  const addcounter = () => {
    setCounter(counter + 1);
  };

  // changes the state of repeat whenever the button is pressed based on counter
  const repeatsong = (event) => {
    if (is_repeat) {
      if (is_repeat === "off") {
        var var1 = "context";
      } else if (is_repeat === "context") {
        var1 = "track";
      } else if (is_repeat === "track") {
        var1 = "off";
      }
      toggle(
        `https://api.spotify.com/v1/me/player/repeat?` +
          queryString.stringify({
            state: var1,
            device_id: att.DeviceID,
          }),
        "PUT",
        att.ACCESS_TOKEN
      );
      setRepeat(var1);
    }
  };

  // shuffle songs
  const shufflesongs = async () => {
    const shuffle = is_shuffle ? "true" : "false";
    toggle(
      `https://api.spotify.com/v1/me/player/shuffle?` +
        queryString.stringify({
          state: shuffle,
          device_id: DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );
    setShuffle(!is_shuffle);
  };

  useEffect(() => {
    getPlaybackState().then(() => setLoading(false));
  }, []);

  // when counter changes, repeat song will trigger to change repeat state
  useEffect(() => {
    repeatsong();
  }, [counter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: window.innerWidth - scrollbar,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              backgroundColor: att.colours[0][4],
              height: 25,
            }}
          >
            <p id="playertext">
              Currently playing on: {currPlaying.device.name}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              backgroundColor: att.colours[0][4],
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <img
                src={currPlaying.image}
                alt={currPlaying.album.name}
                album
                art
              />
              <div style={{ flex: 0.05 }}></div>
              <div style={{ alignSelf: "center" }}>
                <div style={{ color: att.colours[0][1] }}>
                  {currPlaying.name}
                </div>
                <div style={{ color: att.colours[0][1] }}>
                  Album: {currPlaying.album.name}
                </div>
                <div style={{ color: att.colours[0][1] }}>
                  Artist: {currPlaying.artists.join(", ")}
                </div>
              </div>
              <div style={{ flex: 0.1 }}></div>
              <HeartIcon
                onClick={() => {
                  addOrRemoveTrack(currPlaying.id, is_saved ? false : true);
                }}
                is_saved={is_saved}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <p></p>
              <div style={{ flex: 0.1 }}></div>
              <ShuffleSongIcon
                className="btn-spotify"
                onClick={() => {
                  shufflesongs();
                }}
                is_shuffle={is_shuffle}
              />
              <div style={{ flex: 0.1 }}></div>
              <PrevIcon
                className="btn-spotify"
                onClick={() => {
                  changeTrack("previous");
                }}
              />

              <PlayPauseIcon
                className="btn-spotify"
                onClick={() => {
                  playPause();
                }}
                is_paused={is_paused}
              />

              <NextIcon
                className="btn-spotify"
                onClick={() => {
                  changeTrack("next");
                }}
              />
              <div style={{ flex: 0.1 }}></div>
              <RepeatSongIcon
                className="btn-spotify"
                onClick={() => {
                  addcounter();
                }}
                is_repeat={is_repeat}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
                color: att.colours[0][1],
              }}
            >
              Volume
            </div>
          </div>
        </div>
      }
    </>
  );
}
