import React from "react";
import { Tabs, Tab, Button, Modal, Form, Alert } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import { get, post, toggle } from "../utils/get.js";
import queryString from "querystring";
import "../index.css";
import GetDevice from "./getdevice.jsx";
import { PlaySongIcon } from "../utils/icon";

function Recommendations() {
  const att = useContext(Context); // usecontext to get shared stuff
  const [playlistCounter, setplaylistCounter] = useState(0); // counter for number of playlists created
  const [reco, setreco] = useState(att.recommendations); // recommendations based on top artists. initial setstate based on initial api call
  const [trackreco, settrackreco] = useState(att.trackRecommendations); // recommendations based on top tracks. initial setstate based on initial api call
  const [currentTab, setCurrentTab] = useState("artistrecs"); // toggle current tab so that it will use reco or trackreco based on tracks or artists
  const [playlistTitle, setPlaylistTitle] = useState(""); // set playlist title upon creating playlist
  const [cpsucc, setcpsucc] = useState(false); // create playlist success
  const [showclose, setshowclose] = useState(false); // for closing created playlist alert
  const [recrange, setRecrange] = useState(100); // number for recommendations list
  const [errorint, seterrorint] = useState(""); // error when inputbox is not within 1 to 100
  const [showalert, setshowalert] = useState(false); // show alert when inputbox is not within 1 to 100
  const [is_paused, setPaused] = useState();
  const [currPlaying, setCurrPlaying] = useState({});
  const [is_saved, setSaved] = useState();

  // shuffle array of top tracks/artists
  const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  // return top tracks for reco when term changes
  const getRecTopTracks = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/top/tracks?" +
        queryString.stringify({
          limit: "50",
          time_range: att.term,
        }),
      "GET",
      att.ACCESS_TOKEN
    );
    const TopTracks = await response.items.map(function (d) {
      return {
        name: d.name,
        id: d.id,
        album: d.album.name,
        images: d.album.images[0].url,
        popularity: d.popularity,
        artist: d.artists.map((_artist) => _artist.name).join(","),
      };
    });
    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)

    // shuffle top tracks, take the first 5 for recommendation fetch
    shuffle(TopTracks);
    const TopTracks1 = TopTracks.slice(0, 5);
    att.setshuffletracks(TopTracks1);
    return TopTracks1;
  };

  // return top tracks when term changes
  const getTopTracks = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/top/tracks?" +
        queryString.stringify({
          limit: "50",
          time_range: att.term,
        }),
      "GET",
      att.ACCESS_TOKEN
    );
    const TopTracks = await response.items.map(function (d) {
      return {
        name: d.name,
        id: d.id,
        album: d.album.name,
        images: d.album.images[0].url,
        popularity: d.popularity,
        url: d.external_urls.spotify,
        artist: d.artists.map((_artist) => _artist.name).join(","),
      };
    });

    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
    return TopTracks;

    // getAudioFeatures(TopTracks);
  };

  // return recommendations from top tracks when term changes
  const getTracksRecommendations = async (artists) => {
    const recommendations = await get(
      "https://api.spotify.com/v1/recommendations?" +
        queryString.stringify({
          limit: "100",
          seed_tracks: artists.map((d) => d.id).join(","),
        }),
      "GET",
      att.ACCESS_TOKEN
    );
    // index so that the player knows which song to play from the recommendations list
    const newRecs = await recommendations.tracks.map(function (d, index) {
      return {
        name: d.name,
        url: d.external_urls.preview_url,
        uri: d.uri,
        checked: false,
        index: index,
      };
    });

    att.setTrackRecommendations(newRecs);
    settrackreco(newRecs);
  };

  // create playlist using spotify api
  const createPlaylist = async (newArray) => {
    const newPlaylist = playlistCounter + 1;
    const cp = await post(
      "https://api.spotify.com/v1/users/" + att.profile.id + "/playlists",

      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({
        name: playlistTitle,
        description: "New playlist" + newPlaylist,
      })
    );

    // tracks are added here for the playlist
    const addsongs = await post(
      "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({ uris: newArray })
    );

    setplaylistCounter(newPlaylist);
    // set createplaylist false after creating playlist
    setcpsucc(false);
    setshowclose(true);
  };

  // for top artists. checkbox checker or unchecker based on whether its clicked
  const cb = (uri) => {
    const check = reco.map((id) => {
      if (id.uri === uri) {
        return { ...id, checked: !id.checked };
      }
      return id;
    });
    setreco(check);

    //setTrackRecommendations()
  };

  // for top artists. checkbox checker or unchecker based on whether its clicked
  const cb1 = (uri) => {
    const check = trackreco.map((id) => {
      if (id.uri === uri) {
        return { ...id, checked: !id.checked };
      }
      return id;
    });
    settrackreco(check);
  };

  // create playlist. check for current tab value and creates an array of the checked tracks
  const cp = (event) => {
    const newArray = [];
    if (currentTab === "artistrecs") {
      for (let i = 0; i < reco.length; i++) {
        if (reco[i].checked === true) newArray.push(reco[i].uri);
      }
    } else if (currentTab === "trackrecs") {
      for (let i = 0; i < trackreco.length; i++) {
        if (trackreco[i].checked === true) newArray.push(trackreco[i].uri);
      }
    }

    createPlaylist(newArray);
    setcpsucc(true);
  };

  // close created playlist alert after 3 seconds
  function close() {
    setTimeout(() => setshowclose(false), 3000);
  }
  // close error alert when integer more than 100
  function closeerror() {
    setTimeout(() => setshowalert(false), 3000);
  }

  // check all track checkboxes
  const checkall = (event) => {
    if (currentTab === "trackrecs") {
      settrackreco(
        trackreco.map(({ name, uri, url }) => ({
          name,
          url,
          uri,
          checked: true,
        }))
      );
    } else if (currentTab === "artistrecs") {
      setreco(reco.map(({ name, uri }) => ({ name, uri, checked: true })));
    }
  };

  //uncheck all track checkboxes
  const uncheckall = (event) => {
    if (currentTab === "trackrecs") {
      settrackreco(
        trackreco.map(({ name, uri, url }) => ({
          name,
          url,
          uri,
          checked: false,
        }))
      );
    } else if (currentTab === "artistrecs") {
      setreco(reco.map(({ name, uri }) => ({ name, uri, checked: false })));
    }
  };

  // checks whether the input value is between 1 to 100. if not an error message will show
  const handleint = (event) => {
    event.preventDefault();
    setRecrange(recrange);
    let error = "";

    if (event.target.value > 100 || event.target.value < 1) {
      error = `Integer must be between 1 and 100`;
      seterrorint([error]);

      setshowalert(true);
    } else {
      setRecrange(event.target.value);
      seterrorint("");
      setshowalert(false);
    }
  };

  // slices recos recommended based on input of user
  const submitEvent = (event) => {
    event.preventDefault();
    if (currentTab === "trackrecs") {
      settrackreco(att.trackRecommendations.slice(0, recrange));
    } else if (currentTab === "artistrecs") {
      setreco(att.recommendations.slice(0, recrange));
    }
  };

  // play specific song. so if the user clicks the play button in reco list, it'll play the specific song and when u press next it'll play the next song
  const playspecificsong = async (index) => {
    att.setLoading(true);
    if (currentTab === "artistrecs") {
      var tracks = reco.map((d) => d.uri);
    } else if (currentTab === "trackrecs") {
      tracks = trackreco.map((d) => d.uri);
    }

    toggle(
      `https://api.spotify.com/v1/me/player/play?` +
        queryString.stringify({
          device_id: att.DeviceID,
        }),
      "PUT",
      att.ACCESS_TOKEN,
      {
        body: JSON.stringify({
          uris: tracks, // uris:    // only tracks
          offset: {
            position: index, // position of song in the reco list
          },
        }),
      }
    );
    setPaused(false);
    getPlaybackState().then(() => att.setLoading(false));
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
      const { is_playing, item, device } = await response;
      // on first load (i.e. is_paused is null), set state for pause
      // subsequently, do not change state when running this function
      if (is_paused == null) {
        setPaused(!is_playing);
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

  // calls top tracks and reco top  tracks whenever term is changed
  useEffect(() => {
    getTopTracks();
    getRecTopTracks().then((d) => getTracksRecommendations(d));
  }, [att.term]);

  return (
    <>
      <h2>Recommendations</h2>
      <div id="gap"></div>
      <p>
        The following 5 tracks or artists have been randomly selected out of
        your top 50 and used to generate recommendations and matched against
        similar artists and tracks.
      </p>
      <p>
        When you select the Recommendations based on top tracks tab, you can
        select the term duration and the recommendations generated will be based
        off randomly 5 selected top tracks in that term duration
      </p>
      {currentTab === "trackrecs" ? (
        <div id="gap1">
          <Form.Select
            onChange={(e) => att.setTerm(e.target.value)}
            size="sm"
            className="inputbox"
            value={att.term}
            style={{ display: "flex", float: "right" }}
            id="term"
          >
            <option value="short_term">Short Term</option>
            <option value="medium_term">Medium Term</option>
            <option value="long_term">Long Term</option>
          </Form.Select>
          <label
            htmlFor="term"
            style={{
              display: "flex",
              float: "right",
              height: "50px",
              lineHeight: "50px",
              textAlign: "center",
              paddingRight: "10px",
            }}
          >
            Term
          </label>
        </div>
      ) : (
        <div id="gap1"></div>
      )}
      <div>
        {/* display top tracks or top artists that is used to get recos */}
        {currentTab === "artistrecs"
          ? att.shuffleartists.map((d) => <li key={d.id}>Artist: {d.name}</li>)
          : att.shuffletracks.map((d) => (
              <li key={d.id}>
                Song: {d.name}, Artist: {d.artist}
              </li>
            ))}
      </div>
      {/* term dropdown when top tracks tab is chosen so that user can toggle term */}

      <div id="gap"></div>
      <p>
        You can choose the amount of songs generated by the recommendation by
        inserting a number between 1 and 100 and clicking the submit button.
      </p>
      <p>
        By clicking on the Select all button, all the songs will be select all
        and clicking on the Unselect all button will unselect all songs.
      </p>
      <p>
        Lastly, clicking on the create playlist button will create the playlist
        in Spotify
      </p>
      <div id="gap1">
        {/* Inputbox to show number of recos */}
        <form onSubmit={submitEvent}>
          <Alert
            show={showalert}
            id="erroralert"
            close={closeerror()}
            style={{
              backgroundColor: att.colours[0][3],
              borderColor: att.colours[0][3],
              color: att.colours[0][6],
            }}
          >
            {errorint}
          </Alert>
          <label htmlFor="input">Number of items</label>
          <input
            type="number"
            value={recrange}
            defaultValue={100}
            max={100}
            min={1}
            name="rec"
            onChange={(e) => handleint(e)}
            id="input"
          ></input>
          {/*submit button for input box */}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </form>
      </div>
      <div>
        {/* check/uncheck all */}
        <div id="buttonalignright">
          <Button
            variant="primary"
            type="submit"
            onClick={checkall}
            style={{ marginRight: "10px" }}
          >
            Select All
          </Button>
          <Button variant="primary" type="submit" onClick={uncheckall}>
            Unselect All
          </Button>
        </div>
        {/* recos */}
        <Tabs
          defaultActiveKey="artistrecs"
          id="fill-tab-example"
          className="mb-3"
          activeKey={currentTab}
          onSelect={(key) => setCurrentTab(key)}
        >
          <Tab
            eventKey="artistrecs"
            title="Recommendations based on Top Artists"
          >
            <ol>
              {reco.map((d) => [
                <React.Fragment>
                  <div>
                    <li key={d.id}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onChange={() => cb(d.uri)}
                        checked={d.checked}
                      />
                      <PlaySongIcon
                        onClick={() => {
                          playspecificsong(d.index);
                        }}
                      ></PlaySongIcon>
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              {/* create playlist button */}
              <Button onClick={() => setcpsucc(true)}>Create Playlist</Button>
            </div>
            {/* create playlist modify name */}
            <Modal show={cpsucc} onHide={() => setcpsucc(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create Playlist</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Playlist name: </Form.Label>
                  {/* set playlist title */}
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    placeholder="Playlist name"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={cp}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
            {/* when playlist has been successfully created */}
            <Modal show={showclose} onHide={close()}>
              <Modal.Header closeButton>
                <Modal.Title>Create Playlist</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Playlist created successfully</p>
              </Modal.Body>
            </Modal>
          </Tab>
          {/* recos based on top tracks*/}
          <Tab eventKey="trackrecs" title="Recommendations based on Top Tracks">
            <ol>
              {trackreco.map((d) => [
                <React.Fragment>
                  <div>
                    <li key={d.id}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onChange={() => cb1(d.uri)}
                        checked={d.checked}
                      />
                      <PlaySongIcon
                        onClick={() => {
                          playspecificsong(d.index);
                        }}
                      ></PlaySongIcon>
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => setcpsucc(true)}>Create Playlist</Button>
            </div>
          </Tab>
        </Tabs>
      </div>
      <GetDevice />
    </>
  );
}

export default Recommendations;
