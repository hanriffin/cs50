import React from "react";
import { Tabs, Tab, Button, Modal, Form, Alert } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import { get, post } from "../utils/get.js";
import queryString from "querystring";
import "../index.css";

function Recommendations() {
  const att = useContext(Context);
  const [recCounter, setRecCounter] = useState(0);
  const [reco, setreco] = useState(att.recommendations);
  const [trackreco, settrackreco] = useState(att.trackRecommendations);
  const [currentTab, setCurrentTab] = useState("artistrecs");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [cpsucc, setcpsucc] = useState(false);
  const [showclose, setshowclose] = useState(false);
  const [recrange, setRecrange] = useState(100);
  const [errorint, seterrorint] = useState("");
  const [showalert, setshowalert] = useState(false);

  const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };



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
        artist: d.artists.map((_artist) => _artist.name).join(",")
      };
    });
    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)

    // shuffle top tracks, take the first 5 for recommendation fetch
    shuffle(TopTracks);
    const TopTracks1 = TopTracks.slice(0, 5);
    att.setshuffletracks(TopTracks1)
    return TopTracks1;
  };
  
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

    const newRecs = await recommendations.tracks.map(function (d) {
      return {
        name: d.name,
        url: d.external_urls.preview_url,
        uri: d.uri,
        checked: false,
      };
    });

    att.setTrackRecommendations(newRecs);
    settrackreco(newRecs)
  };


  const createPlaylist = async (newArray) => {
    const newPlaylist = recCounter + 1;
    const cp = await post(
      "https://api.spotify.com/v1/users/" + att.profile.id + "/playlists",

      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({
        name: playlistTitle,
        description: "New playlist" + newPlaylist,
      })
    );

    const addsongs = await post(
      "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({ uris: newArray })
    );
    setRecCounter(newPlaylist);

    setcpsucc(false);
    setshowclose(true);
  };

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
  const cb1 = (uri) => {
    const check = trackreco.map((id) => {
      if (id.uri === uri) {
        return { ...id, checked: !id.checked };
      }
      return id;
    });
    settrackreco(check);
  };
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

  function close() {
    setTimeout(() => setshowclose(false), 3000);
  }
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
  const handleint = (event) => {
    event.preventDefault();
    setRecrange(recrange);
    const name = event.target.name;
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

  const submitEvent1 = (event) => {
    event.preventDefault();
    if (currentTab === "trackrecs") {
      settrackreco(att.trackRecommendations.slice(0, recrange));
    } else if (currentTab === "artistrecs") {
      setreco(att.recommendations.slice(0, recrange));
    }
  };

  console.log(att.shuffletracks)
  useEffect(() => {
   getTopTracks()
  getRecTopTracks().then((d) => getTracksRecommendations(d))
  },[att.term])
  
  return (
    <>
      <h2>Recommendations</h2>
      <div id="gap"></div>
      <p>The following 5 tracks or artists have been randomly selected out of your top 50 and used to generate recommendations and matched against similar artists and tracks.</p>
      <p>When you select the Recommendations based on top tracks tab, you can select the term duration and the recommendations generated will be based off randomly 5 selected top tracks in that term duration</p>
      <div>
        
      { currentTab === 'artistrecs' ? att.shuffleartists.map((d) => <li key={d.id}>Artist: {d.name}</li>) : att.shuffletracks.map((d) => <li key={d.name}>Song: {d.name}, Artist: {d.artist}</li>)}
      </div>
        
        {currentTab === 'trackrecs' ? <div style={{ height: "50px"}} ><Form.Select
          onChange={(e) => att.setTerm(e.target.value)}
          size="sm"
          value ={att.term}
          style={{float: 'right'}}
          id="form"
        >
          <option value="short_term">Short Term</option>
          <option value="medium_term">Medium Term</option>
          <option value="long_term">Long Term</option>
        </Form.Select><label for="form" style={{float: 'right'}}>Term</label></div>:<div style={{ height: "50px"}}></div>}
      <div id="gap"></div>
      <p>You can choose the amount of songs generated by the recommendation by inserting a number between 1 and 100 and clicking the submit button.</p>
      <p>By clicking on the Select all button, all the songs will be select all and clicking on the Unselect all button will unselect all songs.</p>
      <p>Lastly, clicking on the create playlist button will create the playlist in Spotify</p>
      <div>
      
      
        <form onSubmit={submitEvent1}>
        <Alert style={{width:"300px",'margin-right':'50px'}}show={showalert}>{errorint}</Alert>
        <label for="input">Number of items</label>
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
          
          <Button variant="primary" type="submit">
            Submit
          </Button>
          
        </form>
       
        </div>
        <div>
        <div id="buttonalignright">
          <Button variant="primary" type="submit" onClick={checkall}>
            Select All
          </Button>
          <Button variant="primary" type="submit" onClick={uncheckall}>
            Unselect All
          </Button>
          
        </div>
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
                    <li key={d.name}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onClick={() => cb(d.uri)}
                        checked={d.checked}
                        style={{"margin-left":'5px'}}
                      />
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => setcpsucc(true)}>Create Playlist</Button>
            </div>
            <Modal show={cpsucc} onHide={() => setcpsucc(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Modal Form Title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    placeholder="name input"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={cp}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showclose} onHide={close()}>
              <Modal.Header closeButton>
                <Modal.Title>Modal Form Title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Playlist created successfully</p>
              </Modal.Body>
            </Modal>
          </Tab>
          <Tab eventKey="trackrecs" title="Recommendations based on Top Tracks">
            <ol>
              {trackreco.map((d) => [
                <React.Fragment>
                  <div>
                    <li key={d.name}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onClick={() => cb1(d.uri)}
                        checked={d.checked}
                        style={{"margin-left":'5px'}}
                      />
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
    </>
  );
}

export default Recommendations;
