import React from "react";
import {
  Tabs,
  Tab,
  Button,
  Modal,
  Form,
  Alert,
  Card,
  Table,
} from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import { get, post, toggle } from "../utils/get.js";
import { getTopTracksNew } from "../utils/api_calls.js";
import queryString from "querystring";
import "../index.css";
import { PlaySongIcon, RefreshRecoIcon } from "../utils/icon";

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

  // shuffle array of top tracks/artists
  const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  // Get Top Artists for reco purposes
  const getRecTopArtists = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/top/artists?" +
        queryString.stringify({
          limit: "50",
          time_range: att.term,
        }),
      att.ACCESS_TOKEN
    );
    const recTopArtists = await response.items.map(function (d) {
      return {
        name: d.name,
        id: d.id,
        genres: d.genres,
        images: d.images[0].url,
        popularity: d.popularity,
      };
    });
    // shuffle top tracks, take the first 5 for recommendation fetch
    shuffle(recTopArtists);
    const recTopArtists1 = recTopArtists.slice(0, 5);
    att.setshuffleartists(recTopArtists1);
    return recTopArtists1;
  };

  // return recommended songs based on top artists
  const getRecommendations = async (artists) => {
    const recommendations = await get(
      "https://api.spotify.com/v1/recommendations?" +
        queryString.stringify({
          limit: "100",
          seed_artists: artists.map((d) => d.id).join(","),
        }),
      att.ACCESS_TOKEN
    );

    const newRecs = await recommendations.tracks.map(function (d, index) {
      return {
        name: d.name,
        uri: d.uri,
        checked: false,
        index: index,
        id: d.id,
        artist: d.artists.map((_artist) => _artist.name).join(", "),
        album: d.album.name,
      };
    });

    att.setRecommendations(newRecs);
    setreco(newRecs);
  };
  
  // Get Top tracks for reco purposes when term changes
  const getRecTopTracks = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/top/tracks?" +
        queryString.stringify({
          limit: "50",
          time_range: att.term,
        }),
      att.ACCESS_TOKEN
    );
    const TopTracks = await response.items.map(function (d) {
      return {
        name: d.name,
        id: d.id,
        album: d.album.name,
        images: d.album.images[0].url,
        popularity: d.popularity,
        artist: d.artists.map((_artist) => _artist.name).join(", "),
      };
    });
    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)

    // shuffle top tracks, take the first 5 for recommendation fetch
    shuffle(TopTracks);
    const TopTracks1 = TopTracks.slice(0, 5);
    att.setshuffletracks(TopTracks1);
    return TopTracks1;
  };

  // return recommendations based on top tracks when term changes
  const getTracksRecommendations = async (artists) => {
    const recommendations = await get(
      "https://api.spotify.com/v1/recommendations?" +
        queryString.stringify({
          limit: "100",
          seed_tracks: artists.map((d) => d.id).join(","),
        }),
      att.ACCESS_TOKEN
    );
    // index so that the player knows which song to play from the recommendations list
    const newRecs = await recommendations.tracks.map(function (d, index) {
      return {
        name: d.name,
        url: d.external_urls.preview_url,
        uri: d.uri,
        id: d.id,
        checked: false,
        index: index,
        artist: d.artists.map((_artist) => _artist.name).join(", "),
        album: d.album.name,
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
      att.ACCESS_TOKEN,
      JSON.stringify({
        name: playlistTitle,
        description: "New playlist" + newPlaylist,
      })
    );

    // tracks are added here for the playlist
    const addsongs = await post(
      "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
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
        trackreco.map((d) => ({
          ...d,
          checked: true,
        }))
      );
    } else if (currentTab === "artistrecs") {
      setreco(reco.map((d) => ({ ...d, checked: true })));
    }
  };

  //uncheck all track checkboxes
  const uncheckall = (event) => {
    if (currentTab === "trackrecs") {
      settrackreco(
        trackreco.map((d) => ({
          ...d,
          checked: false,
        }))
      );
    } else if (currentTab === "artistrecs") {
      setreco(
        reco.map((d) => ({
          ...d,
          checked: false,
        }))
      );
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

    // automatically plays on active device
    toggle(
      `https://api.spotify.com/v1/me/player/play?` +
        queryString.stringify({
          // device_id: att.DeviceID,
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

    att.setRefresh(!att.refresh);
  };

  // calls top tracks and reco top  tracks whenever term is changed
  useEffect(() => {
    // getTopTracksNew(att);
    // getRecTopArtists().then((d) => getRecommendations(d));
    getRecTopTracks().then((d) => getTracksRecommendations(d));
  }, [att.term]);

  return (
    <>
      <div id="items">
        <h2>Recommendations</h2>
        <div id="gap"></div>
        <p>
          The following 5 tracks/artists have been randomly selected out of your
          top 50 tracks/artists and used to generate recommendations. Refreshing
          the selected tracks/artists will also refresh the song
          recommendations. You may also refresh the song recommendations based
          on the existing 5 tracks/artists.
        </p>
        <p>
          When you select the "Recommendations based on top tracks" tab, you can
          select the term duration and the recommendations generated will be
          based on 5 randomly selected tracks out of your top tracks in that
          term duration.
        </p>
        <div>
          {/* display top tracks or top artists that is used to get recos */}
          {currentTab === "artistrecs" ? (
            <>
              <div style={{ height: "35px" }}>
                <h4
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ flex: 0.1 }}></div>
                  <span style={{ textAlign: "center" }}>Artists </span>
                  <div style={{ flex: 0.1 }}>
                    <RefreshRecoIcon
                      iconColor={att.colours[0][4]}
                      onClick={() => {
                        getRecTopArtists().then((d) => getRecommendations(d));
                      }}
                    />
                  </div>
                </h4>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px 20px 0 20px",
                }}
              >
                {att.shuffleartists.map((d) => {
                  return (
                    <Card
                      key={d.id}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "transparent",
                        paddingTop: "10px",
                      }}
                    >
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ margin: "auto" }}
                      >
                        <Card.Img
                          id="imglink"
                          src={d.images}
                          style={{
                            borderRadius: "50%",
                            width: "12vw",
                            height: "12vw",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <Card.Body>
                        <Card.Title
                          style={{ color: att.colours[0][4] }}
                          className="text-center"
                        >
                          {" "}
                          <a
                            href={d.url}
                            className="top"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {d.name}
                          </a>
                        </Card.Title>
                        <Card.Text
                          style={{
                            color: att.colours[0][3],
                            textAlign: "center",
                            fontVariant: "small-caps",
                          }}
                        >
                          {d.genres.join(" | ")}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div style={{ height: "35px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1.1 }}></div>
                  <h4 style={{ textAlign: "center" }}>Tracks </h4>
                  <div style={{ flex: 0.1 }}>
                    <RefreshRecoIcon
                      iconColor={att.colours[0][4]}
                      onClick={() => {
                        getRecTopTracks().then((d) =>
                          getTracksRecommendations(d)
                        );
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flex: 1,
                      paddingRight: "10px",
                      alignItems: "center",
                    }}
                  >
                    <label
                      htmlFor="term"
                      style={{
                        paddingRight: "10px",
                      }}
                    >
                      Term
                    </label>
                    <Form.Select
                      onChange={(e) => att.setTerm(e.target.value)}
                      size="sm"
                      className="inputbox"
                      value={att.term}
                      id="term"
                    >
                      <option value="short_term">Short Term</option>
                      <option value="medium_term">Medium Term</option>
                      <option value="long_term">Long Term</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px 20px 0 20px",
                }}
              >
                {att.shuffletracks.map((d) => {
                  return (
                    <Card
                      className="mb-2 mx-auto"
                      key={d.id}
                      style={{
                        width: "12vw",
                        background: "transparent",
                        border: "transparent",
                        paddingTop: "10px",
                      }}
                    >
                      <Card.Img src={d.images} />
                      <Card.Body>
                        <Card.Title
                          style={{
                            color: att.colours[0][4],
                            textAlign: "center",
                          }}
                        >
                          <a
                            href={d.url}
                            className="top"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {d.name}
                          </a>
                        </Card.Title>{" "}
                        <Card.Text
                          style={{
                            color: att.colours[0][3],
                            textAlign: "center",
                          }}
                        >
                          {d.artist} <br />
                          Album: {d.album}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {/* term dropdown when top tracks tab is chosen so that user can toggle term */}

        <div id="gap"></div>
        <p>
          You can choose the number of songs recommendations by inserting a
          number between 1 and 100 and clicking the submit button.
        </p>
        <p>
          Clicking on the create playlist button will create a Spotify playlist
          from the songs you have selected from the list of recommendations. The
          Select all and Unselect all buttons will help in creating a playlist
          from the song recommendations.
          {/* By clicking on the Select all button, all the songs will be select all
        and clicking on the Unselect all button will unselect all songs. */}
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
              // defaultValue={100}
              max={100}
              min={1}
              name="rec"
              onChange={(e) => handleint(e)}
              id="input"
            ></input>
            {/*submit button for input box */}
            <Button className="button" variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </div>
        <div>
          {/* check/uncheck all */}
          <Tabs
            defaultActiveKey="artistrecs"
            id="fill-tab-example"
            className="mb-3"
            activeKey={currentTab}
            onSelect={(key) => setCurrentTab(key)}
          >
            {/* recos */}
            <Tab
              eventKey="artistrecs"
              title="Recommendations based on Top Artists"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <RefreshRecoIcon
                  iconColor={att.colours[0][4]}
                  onClick={() => {
                    getRecommendations(att.shuffleartists);
                  }}
                />
                <div id="buttonalignright">
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    onClick={checkall}
                    style={{ marginRight: "10px" }}
                  >
                    Select All
                  </Button>
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    onClick={uncheckall}
                  >
                    Unselect All
                  </Button>
                </div>
              </div>
              <Table style={{ tableLayout: "fixed", width: "89vw" }}>
                <thead>
                  <tr>
                    <th className="fixed-width-small"></th>
                    <th className="fixed-width-small"></th>
                    <th className="fixed-width-large">Title</th>
                    <th className="fixed-width">Artist</th>
                    <th className="fixed-width">Album</th>
                  </tr>
                </thead>
                <tbody>
                  {reco.map((d) => [
                    <tr key={d.id}>
                      <td>
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                            height: "15px",
                            verticalAlign: "middle",
                          }}
                          id={d.name}
                          value={d.uri}
                          onChange={() => cb(d.uri)}
                          checked={d.checked}
                        />
                      </td>
                      <td>
                        <PlaySongIcon
                          onClick={() => {
                            playspecificsong(d.index);
                          }}
                        />
                      </td>
                      <td className="fixed-width-large">{d.name}</td>
                      <td className="fixed-width">{d.artist}</td>
                      <td className="fixed-width">{d.album}</td>
                    </tr>,
                  ])}
                </tbody>
              </Table>
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
                    <Form.Label style={{ color: "black" }}>
                      Playlist name
                    </Form.Label>
                    {/* set playlist title */}
                    <Form.Control
                      type="text"
                      onChange={(e) => setPlaylistTitle(e.target.value)}
                      placeholder="Playlist name"
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    onClick={cp}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* when playlist has been successfully createdd */}
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
            <Tab
              eventKey="trackrecs"
              title="Recommendations based on Top Tracks"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <RefreshRecoIcon
                  iconColor={att.colours[0][4]}
                  onClick={() => {
                    getTracksRecommendations(att.shuffletracks);
                  }}
                />
                <div id="buttonalignright">
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    onClick={checkall}
                    style={{ marginRight: "10px" }}
                  >
                    Select All
                  </Button>
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    onClick={uncheckall}
                  >
                    Unselect All
                  </Button>
                </div>
              </div>
              <Table style={{ tableLayout: "fixed", width: "89vw" }}>
                <thead>
                  <tr>
                    <th className="fixed-width-small"></th>
                    <th className="fixed-width-small"></th>
                    <th className="fixed-width-large">Title</th>
                    <th className="fixed-width">Artist</th>
                    <th className="fixed-width">Album</th>
                  </tr>
                </thead>
                <tbody>
                  {trackreco.map((d) => [
                    <tr key={d.id}>
                      <td>
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                            height: "15px",
                            verticalAlign: "middle",
                          }}
                          id={d.name}
                          value={d.uri}
                          onChange={() => cb1(d.uri)}
                          checked={d.checked}
                        />
                      </td>
                      <td>
                        <PlaySongIcon
                          onClick={() => {
                            playspecificsong(d.index);
                          }}
                        />
                      </td>
                      <td className="fixed-width-large">{d.name}</td>
                      <td className="fixed-width">{d.artist}</td>
                      <td className="fixed-width">{d.album}</td>
                    </tr>,
                  ])}
                </tbody>
              </Table>
              <div>
                <Button className="button" onClick={() => setcpsucc(true)}>
                  Create Playlist
                </Button>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      {/* <GetDevice key={currsPlaying} /> */}
    </>
  );
}

export default Recommendations;
