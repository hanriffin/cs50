import React, { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get, toggle } from "../utils/get.js";
import { Slider } from "../utils/slider.js";
import {
  HeartIcon,
  PlayPauseIcon,
  NextIcon,
  PrevIcon,
  MuteIcon,
  RepeatSongIcon,
  ShuffleSongIcon,
  RefreshIcon,
} from "../utils/icon";

export default function Player({ DeviceID }) {
  const att = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [is_paused, setPaused] = useState();
  const [is_saved, setSaved] = useState();
  const [currPlaying, setCurrPlaying] = useState({});
  const [is_shuffle, setShuffle] = useState(); // sets shuffle
  const [is_repeat, setRepeat] = useState("off"); // set repeat, 3 states, off, repeat track, repeat all songs in context
  const [volume, setVolume] = useState();
  const [is_mute, setMute] = useState();
  const [volume1, setVolume1] = useState();
  const [timeLeft, setTimeLeft] = useState();

  const waitFor = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  // Check playback state
  const getPlaybackState = async () => {
    var response;
    do {
      response = await get(
        "https://api.spotify.com/v1/me/player?" +
          queryString.stringify({
            additional_types: "track",
          }),
        att.ACCESS_TOKEN
      );
      if (response === 204) {
        // account for loading time 
        await waitFor(2000);
      } else if (response.item === null) {
        // this part is needed for when player is active but item is null (i.e. no playback)
        
        // play list of saved songs
        const saved = await get(
          "https://api.spotify.com/v1/me/tracks?" +
            queryString.stringify({
              limit: "50",
            }),
          att.ACCESS_TOKEN
        );
        const savedTracks = await saved.items.map(function (d) {
          return {
            uri: d.track.uri,
          };
        });
  
        toggle(
          `https://api.spotify.com/v1/me/player/play?` +
            queryString.stringify({
              device_id: DeviceID,
            }),
          "PUT",
          att.ACCESS_TOKEN,
          {
            body: JSON.stringify({
              uris: savedTracks.map((d) => d.uri), // only tracks
            }),
          }
        );
        await waitFor(2000);
      }
    } while (response === 204 || response.item === null);

    if (response !== "") {
      const {
        is_playing,
        item,
        progress_ms,
        device,
        shuffle_state,
        repeat_state,
      } = await response;
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

      if (device.volume_percent !== null) {
        setVolume(device.volume_percent);
        setVolume1(device.volume_percent);
      }
      if (device.volume_percent !== null) {
        if (device.volume_percent === 0) {
          setMute(true);
        } else if (device.volume_percent > 0) {
          setMute(false);
        }
      }

      const is_saved = await get(
        "https://api.spotify.com/v1/me/tracks/contains?" +
          queryString.stringify({
            ids: item.id,
          }),
        att.ACCESS_TOKEN
      );

      const currentlyPlaying = {
        id: item.id,
        name: item.name,
        album: item.album,
        artists: item.artists.map((artist) => artist.name),
        image: item.album.images[2].url,
        duration: item.duration_ms,
        progress: progress_ms,
        device: {
          id: device.id,
          name: device.name,
          type: device.type,
          vol: device.volume_percent,
        },
        state: {
          is_playing: !is_playing,
          shuffle_state: !shuffle_state,
          repeat_state: repeat_state,
          is_saved: is_saved[0],
        },
      };

      setCurrPlaying(currentlyPlaying);
      checkSaved(currentlyPlaying.id);
      setTimeLeft(currentlyPlaying.duration - currentlyPlaying.progress);
    } else {
      console.log(response);
    }
  };
  const volcontrol = async (event) => {
    var vol;
    if (event === true) {
      vol = 0;
    } else if (event === false) {
      vol = volume1;
    } else if (event === 0) {
      setMute(true);
      vol = event;
    } else {
      setVolume1(event);
      setMute(false);
      vol = event;
    }
    setVolume(vol);
    changeVolume(vol);
  };

  const changeVolume = (vol) => {
    toggle(
      `https://api.spotify.com/v1/me/player/volume?` +
        queryString.stringify({
          volume_percent: vol,
          device_id: DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );
  };

  // Check if track is already saved
  const checkSaved = async (track_id) => {
    const response = await get(
      "https://api.spotify.com/v1/me/tracks/contains?" +
        queryString.stringify({
          ids: track_id,
        }),
      att.ACCESS_TOKEN
    );
    setSaved(...response);
  };

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
    // setPaused(false);
    setTimeout(() => {
      getPlaybackState().then(() => setLoading(false));
    }, 1000);
  };

  // const playspecificsong = async (uris) => {
  //   setLoading(true);
  //   toggle(
  //     `https://api.spotify.com/v1/me/player/play?` +
  //       queryString.stringify({
  //         device_id: DeviceID,
  //       }),
  //     "PUT",
  //     att.ACCESS_TOKEN,
  //     {
  //       body: JSON.stringify({
  //         // context_uri: "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr", // only albums/artists/playlists
  //         uris: uris, // only tracks
  //         // offset: {
  //         //   position: 5,
  //         // },
  //       }),
  //     }
  //   );
  //   setPaused(false);
  //   getPlaybackState().then(() => setLoading(false));
  // };

  
  // changes the state of repeat whenever the button is pressed based on counter
  const repeatsong = async () => {
    if (is_repeat === "off") {
      var repeat_state = "context";
    } else if (is_repeat === "context") {
      repeat_state = "track";
    } else if (is_repeat === "track") {
      repeat_state = "off";
    }

    await toggle(
      `https://api.spotify.com/v1/me/player/repeat?` +
        queryString.stringify({
          state: repeat_state,
          device_id: DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );

    // setstate only takes effect at the end hence put it at the end
    setRepeat(repeat_state);
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

  // Rerenders when refresh is called (from the recommendations.js file when playspecificsong() is called)
  useEffect(() => {
    setTimeout(() => {
      getPlaybackState().then(() => setLoading(false));
      console.log(timeLeft);
    }, 2000);
  }, [att.refresh]);

  // Rerenders when song ends
  useEffect(() => {
    console.log("start");
    console.log(timeLeft);

    setTimeout(() => {
      getPlaybackState().then(() => setLoading(false));
      console.log("reset");
    }, timeLeft + 1000);
  }, [timeLeft]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          height: 25,
        }}
      >
        <div id="playertext">
          Currently playing on: {currPlaying.device.name}
        </div>
        <RefreshIcon
          className="btn-spotify"
          onClick={() => {
            getPlaybackState();
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <img src={currPlaying.image} alt={currPlaying.album.name} />
          <div style={{ flex: "0 0 15px" }}></div>
          <div
            style={{
              alignSelf: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <div
              style={{
                color: att.colours[0][1],
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontWeight: "600",
                textOverflow: "ellipsis",
              }}
            >
              {currPlaying.name}
            </div>
            <div
              style={{
                color: att.colours[0][1],
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: "12px",
                textOverflow: "ellipsis",
              }}
            >
              {currPlaying.artists.join(", ")}
            </div>
          </div>
          <div style={{ flex: "0 0 30px" }}></div>
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
              repeatsong();
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
          <MuteIcon
            className="btn-spotify"
            onClick={() => {
              volcontrol(!is_mute);
              setMute(!is_mute);
            }}
            is_mute={is_mute}
          />
          <div style={{ flex: 0.05 }}></div>
          <Slider value={volume} onChange={(e) => volcontrol(e)} />
        </div>
      </div>
    </>
  );
}
