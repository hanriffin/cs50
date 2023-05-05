import React from "react";
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Context} from "../utils/context.js";
import queryString from "querystring";
import {Analysis} from "./analysis.js";
import { get, post } from "../utils/get.js"; // function to send request to API
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Image,
  Button,
  Row,
  Card,
  ListGroup,
  Tab,
  Col,
  Nav,
  Tabs,
  Table,
  Alert,
  Form,
  Overlay,
  Fade,
  Tooltip,
  OverlayTrigger,
  Popover,
  Modal
} from "react-bootstrap";
import { Chart, Chart1 } from "../utils/Chart.js";
import "../index.css";


function Home() {
  

  const att = useContext(Context);
  
  console.log(att.ACCESS_TOKEN)
  


  useEffect(() => {
    console.log(att.ACCESS_TOKEN);
    console.log(att.term);

    // Get profile data
    const getProfile = async () => {
      const profile = await get(
        "https://api.spotify.com/v1/me",
        "GET",
        att.ACCESS_TOKEN
      );
      console.log(profile);
      att.setProfile(profile);
      att.setprofileid(profile.id);
      console.log(typeof profile.id);
      // console.log(profile);
    };
    const shuffle = (array) => {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    };

    // Get top artists
    const getTopArtists = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/top/artists?" +
          queryString.stringify({
            limit: att.range,
            time_range: att.term,
          }),

        "GET",
        att.ACCESS_TOKEN
      );
      const TopArtists = await response.items.map(function (d) {
        return {
          name: d.name,
          id: d.id,
          genres: d.genres,
          images: d.images[0].url,
          popularity: d.popularity,
          followers: d.followers.total,
          url: d.external_urls.spotify,
        };
      });
      att.setTopArtists(TopArtists);
      console.log(response);

      // console.log(TopArtists)
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
        };
      });
      // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
      shuffle(TopTracks);
      const TopTracks1 = TopTracks.slice(0, 5);
      console.log(TopTracks1);
      return TopTracks1;
    };
    const getRecTopArtists = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/top/artists?" +
          queryString.stringify({
            limit: "50",
            time_range: att.term,
          }),

        "GET",
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
      shuffle(recTopArtists);
      const recTopArtists1 = recTopArtists.slice(0, 5);
      console.log(recTopArtists1);
      return recTopArtists1;
    };
    // Get top tracks
    const getTopTracks = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/top/tracks?" +
          queryString.stringify({
            limit: att.range,
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
        };
      });
      // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
      return TopTracks;
      // getAudioFeatures(TopTracks);
    };

    // Get audio features of tracks
    const getAudioFeatures = async (tracks) => {
      const feat = await get(
        "https://api.spotify.com/v1/audio-features?" +
          queryString.stringify({
            ids: tracks.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      const TopTracksFeat = await tracks.map((d, index) => {
        return { ...d, features: feat.audio_features[index] };
      });
      console.log(TopTracksFeat[0].features.danceability);
      const data = TopTracksFeat.map((d, index) => {
        return {
          name: d.name,
          danceability: d.features.danceability,
          acousticness: d.features.acousticness,
          energy: d.features.energy,
          instrumentalness: d.features.instrumentalness,
          valence: d.features.valence,
          index: index
        };
      });
      console.log(data);
      att.settoptracksdata(data);

      const data1 = TopTracksFeat.slice(0, 5).map((d) => {
        return { name: d.name, danceability: d.features.danceability };
      });
      console.log(data1);
      att.setdata1(data1);

      const data2 = TopTracksFeat.map((d, index) => {
        return { name: d.name, tempo: d.features.tempo, index: index };
      });
      console.log(data);
      att.settoptrackstempodata(data2);

      const maxFeat = (feat) => {
        return Math.max(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const minFeat = (feat) => {
        return Math.min(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const avgFeat = (feat) => {
        return (
          TopTracksFeat.reduce((a, b) => a + b.features[feat], 0) /
          TopTracksFeat.length
        );
      };

      const featSummary = [
        {
          acousticness: {
            avg: avgFeat("acousticness"),
            min: minFeat("acousticness"),
            max: maxFeat("acousticness"),
          },
          danceability: {
            avg: avgFeat("danceability"),
            min: minFeat("danceability"),
            max: maxFeat("danceability"),
          },
          energy: {
            avg: avgFeat("energy"),
            min: minFeat("energy"),
            max: maxFeat("energy"),
          },
          instrumentalness: {
            avg: avgFeat("instrumentalness"),
            min: minFeat("instrumentalness"),
            max: maxFeat("instrumentalness"),
          },
          loudness: {
            avg: avgFeat("loudness"),
            min: minFeat("loudness"),
            max: maxFeat("loudness"),
          },
          tempo: {
            avg: avgFeat("tempo"),
            min: minFeat("tempo"),
            max: maxFeat("tempo"),
          },
          valence: {
            avg: avgFeat("valence"),
            min: minFeat("valence"),
            max: maxFeat("valence"),
          },
        },
      ];
      att.setAudioFeatSummary(featSummary);
      console.log(featSummary);

      att.setTopTracks(TopTracksFeat);

      // console.log(TopTracksFeat[0].features.valence);

      console.log(TopTracksFeat);
    };
    const getSaved = async () => {
      const saved = await get(
        "https://api.spotify.com/v1/me/tracks?" +
          queryString.stringify({
            limit: "50",
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      const savedTracks = await saved.items.map(function (d) {
        return {
          name: d.track.name,
          disc: d.track.disc_number,
          id: d.track.id,
          artist: d.track.artists[0].name
        };
      });
      att.setSavedTracks(savedTracks);
      // console.log(TopArtists)
      console.log(savedTracks);
      return savedTracks;
    };

    const getSavedAudioFeatures = async (tracks) => {
      const feat = await get(
        "https://api.spotify.com/v1/audio-features?" +
          queryString.stringify({
            ids: tracks.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      const TopTracksFeat = await tracks.map((d, index) => {
        return { ...d, features: feat.audio_features[index] };
      });
      console.log(TopTracksFeat[0].features.danceability);
      const data3 = TopTracksFeat.map((d,index) => {
        return {
          name: d.name,
          danceability: d.features.danceability,
          acousticness: d.features.acousticness,
          energy: d.features.energy,
          instrumentalness: d.features.instrumentalness,
          valence: d.features.valence,
          index: index
        };
      });
      console.log(data3);
      att.setsavedtracksdata(data3);

      const data4 = TopTracksFeat.slice(0, 5).map((d) => {
        return { name: d.name, danceability: d.features.danceability };
      });
      att.setdata4(data4);

      const data5 = TopTracksFeat.map((d,index) => {
        return { name: d.name, tempo: d.features.tempo, index:index };
      });

      att.setsavedtrackstempodata(data5);

      const maxFeat = (feat) => {
        return Math.max(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const minFeat = (feat) => {
        return Math.min(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const avgFeat = (feat) => {
        return (
          TopTracksFeat.reduce((a, b) => a + b.features[feat], 0) /
          TopTracksFeat.length
        );
      };

      const featSummary = [
        {
          acousticness: {
            avg: avgFeat("acousticness"),
            min: minFeat("acousticness"),
            max: maxFeat("acousticness"),
          },
          danceability: {
            avg: avgFeat("danceability"),
            min: minFeat("danceability"),
            max: maxFeat("danceability"),
          },
          energy: {
            avg: avgFeat("energy"),
            min: minFeat("energy"),
            max: maxFeat("energy"),
          },
          instrumentalness: {
            avg: avgFeat("instrumentalness"),
            min: minFeat("instrumentalness"),
            max: maxFeat("instrumentalness"),
          },
          loudness: {
            avg: avgFeat("loudness"),
            min: minFeat("loudness"),
            max: maxFeat("loudness"),
          },
          tempo: {
            avg: avgFeat("tempo"),
            min: minFeat("tempo"),
            max: maxFeat("tempo"),
          },
          valence: {
            avg: avgFeat("valence"),
            min: minFeat("valence"),
            max: maxFeat("valence"),
          },
        },
      ];
      att.setAudioFeatSavedSummary(featSummary);
      console.log(featSummary);

      // console.log(TopTracksFeat[0].features.valence);
    };

    const getDevices = async () => {
      const devices = await get(
        "https://api.spotify.com/v1/me/player/devices",
        "GET",
        att.ACCESS_TOKEN
      );
      const usedDevices = await devices.devices.map(function (d) {
        return {
          id: d.id,
          active: d.is_active,
          volume: d.volume_percent,
          name: d.name,
          type: d.type,
        };
      });
      att.setDevices(usedDevices);
      console.log(usedDevices);
    };

    const getRecent = async () => {
      const recent = await get(
        "https://api.spotify.com/v1/me/player/recently-played?" +
          queryString.stringify({
            limit: "50",
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      const recentTrack = await recent.items.map(function (d) {
        return { name: d.track.name, id: d.track.id, artist: d.track.artists[0].name };
      });
      const unique = recentTrack.filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
      );
      console.log(unique);
      console.log(recentTrack);
      att.setRecentTrack(recentTrack);
      return recentTrack;
    };

    const getRecentAudioFeatures = async (tracks) => {
      const feat = await get(
        "https://api.spotify.com/v1/audio-features?" +
          queryString.stringify({
            ids: tracks.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      const TopTracksFeat = await tracks.map((d, index) => {
        return { ...d, features: feat.audio_features[index] };
      });
      console.log(TopTracksFeat[0].features.danceability);
      const data6 = TopTracksFeat.map((d) => {
        return {
          name: d.name,
          danceability: d.features.danceability,
          acousticness: d.features.acousticness,
          energy: d.features.energy,
          instrumentalness: d.features.instrumentalness,
          valence: d.features.valence,
        };
      });
      att.setrecenttracksdata(data6);

      const data7 = TopTracksFeat.slice(0, 5).map((d) => {
        return { name: d.name, danceability: d.features.danceability };
      });
      att.setdata7(data7);

      const data8 = TopTracksFeat.map((d) => {
        return { name: d.name, tempo: d.features.tempo };
      });

      att.setrecenttrackstempodata(data8);

      const maxFeat = (feat) => {
        return Math.max(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const minFeat = (feat) => {
        return Math.min(...TopTracksFeat.map((o) => o.features[feat]));
      };
      const avgFeat = (feat) => {
        return (
          TopTracksFeat.reduce((a, b) => a + b.features[feat], 0) /
          TopTracksFeat.length
        );
      };

      const featSummary = [
        {
          acousticness: {
            avg: avgFeat("acousticness"),
            min: minFeat("acousticness"),
            max: maxFeat("acousticness"),
          },
          danceability: {
            avg: avgFeat("danceability"),
            min: minFeat("danceability"),
            max: maxFeat("danceability"),
          },
          energy: {
            avg: avgFeat("energy"),
            min: minFeat("energy"),
            max: maxFeat("energy"),
          },
          instrumentalness: {
            avg: avgFeat("instrumentalness"),
            min: minFeat("instrumentalness"),
            max: maxFeat("instrumentalness"),
          },
          loudness: {
            avg: avgFeat("loudness"),
            min: minFeat("loudness"),
            max: maxFeat("loudness"),
          },
          tempo: {
            avg: avgFeat("tempo"),
            min: minFeat("tempo"),
            max: maxFeat("tempo"),
          },
          valence: {
            avg: avgFeat("valence"),
            min: minFeat("valence"),
            max: maxFeat("valence"),
          },
        },
      ];
      att.setAudioFeatRecentSummary(featSummary);
      console.log(featSummary);

      // console.log(TopTracksFeat[0].features.valence);
    };

    const getRecommendations = async (artists) => {
      const recommendations = await get(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify({
            limit: att.recrange,
            seed_artists: artists.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      console.log(artists.map((d) => d.id).join(","));
      const newRecs = await recommendations.tracks.map(function (d) {
        return { name: d.name, uri: d.uri,checked: false};
      });
      const songs = [];
      for (let i = 0; i < att.recrange; i++) {
        songs.push(newRecs[i].uri);
      }
      att.setSongsAdded(songs);
      console.log(songs);
      console.log(att.songsAdded);
      att.setRecommendations(newRecs);
      console.log(newRecs);
    };
    const getTracksRecommendations = async (artists) => {
      const recommendations = await get(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify({
            limit: att.recrange,
            seed_tracks: artists.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );
      console.log(artists.map((d) => d.id).join(","));
      const newRecs = await recommendations.tracks.map(function (d) {
        return { name: d.name, url: d.external_urls.preview_url,uri: d.uri,checked: false };
      });
      console.log(newRecs)
      const songs1 = [];
      for (let i = 0; i < att.recrange; i++) {
        songs1.push(newRecs[i].uri);
      }
      att.setSongsAdded1(songs1);
      console.log(att.songsAdded1)
      console.log(songs1)
      att.setTrackRecommendations(newRecs);
      console.log(newRecs)
    };
    
    // Run all async functions in parallel first. When they are done, set loading to false

    Promise.all([
      getProfile(),
      getTopArtists(),
      getSaved().then((d) => getSavedAudioFeatures(d)),
      getDevices(),
      getRecent().then((d) => getRecentAudioFeatures(d)),
      getTopTracks().then((d) => getAudioFeatures(d)),
      getRecTopArtists().then((d) => getRecommendations(d)),
      getRecTopTracks().then((d) => getTracksRecommendations(d)),
    ]).then(() => {
      att.setLoading(false);
      console.log("Done!");
      console.log(att.recommendations)
    });
  }, [att.forms, att.recforms]);
  
  const createPlaylist = async (newArray) => {
    const newPlaylist = att.recCounter + 1;
    const cp = await post(
      "https://api.spotify.com/v1/users/" + att.profileid + "/playlists",

      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({
        name: att.playlistTitle,
        description: "New playlist",
      })
    );
    
    const addsongs = await post(
      "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({ uris: newArray })
    );
    att.setRecCounter(newPlaylist);
    console.log(cp.id);
    att.setcpsucc(false)
    att.setshowclose(true)
  };
  

  const createPlaylist2 = async (newArray) => {
    const newPlaylist = att.recCounter + 1;
    const cp = await post(
      "https://api.spotify.com/v1/users/" + att.profileid + "/playlists",

      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({
        name: "Recommendation Playlist #" + newPlaylist,
        description: "New playlist",
      })
    );
    
    const addsongs = await post(
      "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
      "POST",
      att.ACCESS_TOKEN,
      JSON.stringify({ uris: newArray })
    );
    att.setRecCounter(newPlaylist);
    console.log(JSON.stringify({ uris: att.recURI1 }))
    console.log(cp.id);
  };
 

  const cp = (event) => {
    event.preventDefault();
    const newArray = [];
    if (att.currentTab === "artistrecs") {
      
      
      for (let i= 0; i < att.recommendations.length; i++) {
        if (att.recommendations[i].checked === true)
        newArray.push(att.recommendations[i].uri)
      }
    } else if (att.currentTab === "trackrecs") {
      for (let i= 0; i < att.trackRecommendations.length; i++) {
        if (att.trackRecommendations[i].checked === true)
        newArray.push(att.trackRecommendations[i].uri)
      }
    }
    
    console.log(newArray)
    
    createPlaylist(newArray);
    att.setcpsucc(true);

  };


  const cp2 = (event) => {
    event.preventDefault();

      const newArray = [];
      
      
    console.log(newArray)
    att.setRecURI1(newArray);
    
    createPlaylist2(newArray);
    att.setcpsucc(true);
    att.setRecURI1([])
  };
  


  const cb = (uri) => {

    
    console.log(uri)
    const check = att.recommendations.map((id) => {
      if (id.uri === uri) {
        console.log(!id.checked)
        return {...id, checked: !id.checked}
        
      }
      return id
    })
    att.setRecommendations(check)

    console.log(check)
    //setTrackRecommendations()
  };
  const cb1 = (uri) => {

    
    console.log(uri)
    const check = att.trackRecommendations.map((id) => {
      if (id.uri === uri) {
        console.log(!id.checked)
        return {...id, checked: !id.checked}
        
      }
      return id
    })
    att.setTrackRecommendations(check)

    console.log(check)
    //setTrackRecommendations()
  };

  const submitEvent = (event) => {
    event.preventDefault();
    att.setForms({ ...att.forms, [event.target.name]: event.target.value });
  };

  const submitEvent1 = (event) => {
    event.preventDefault();
    att.setRecForms({ ...att.recforms, [event.target.name]: event.target.value });
  };

  const handleint = (event) => {
    const name = event.target.name;
    let error = "";
    if (event.target.value > 100 || event.target.value < 1) {
      error = `${name} field must be between 1 and 100`;
      att.seterrorint([error]);
      console.log(att.errorint);
      att.setshowalert(true);
    } else {
      att.setRecrange(event.target.value);
      att.seterrorint("");
      att.setshowalert(false);
    }
  };

  const checkall = (event) => {
    if (att.currentTab === "trackrecs") {
      att.setTrackRecommendations(att.trackRecommendations.map(({name,uri,url}) => ({name,url,uri, checked:true}))
      
    ) }else if (att.currentTab === "artistrecs") {
      att.setRecommendations(att.recommendations.map(({name,uri}) => ({name,uri, checked:true})))
      console.log("hi!")
      }
      console.log(att.currentTab)
    
    
  }

  const uncheckall = (event) => {
    if (att.currentTab === "trackrecs") {
      att.setTrackRecommendations(att.trackRecommendations.map(({name,uri,url}) => ({name,url,uri, checked:false}))
      
    ) }else if (att.currentTab === "artistrecs") {
      att.setRecommendations(att.recommendations.map(({name,uri}) => ({name,uri, checked:false})))
      console.log("hi!")
      }
    
  }
  
  

  function close() {
    setTimeout(() => att.setshowclose(false),3000)
  }
  if (att.loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      

      <div>
        <Container>
          <Row>
            <Col md="auto">
              <p>Profile Name: {att.profile.display_name}</p>
              <p>Country: {att.profile.country}</p>
              <p>Email: {att.profile.email}</p>
              <p>URLs: {att.profile.external_urls.spotify}</p>
              <p>Number of followers: {att.profile.followers.total}</p>
              <p>ID: {att.profile.id}</p>
            </Col>
            <Col>
              <Image src={att.profile.images[0].url} alt="profile" roundedCircle={true}></Image>
            </Col>
          </Row>
        </Container>
      </div>

      <div></div>
      <h2>Your Available Devices</h2>
      <ol>
        {att.usedDevices.map((d) => (
          <li key={d.id}>
            {d.id} Active: {String(d.active)} Name: {d.name} Type: {d.type}{" "}
            Volume: {d.volume}
          </li>
        ))}
      </ol>
      <h2>Your Top Items</h2>
      <div style={{ display: "inline-block" }}>
        <OverlayTrigger
          trigger="hover"
          placement="top"
          overlay={
            <Popover id="popover-basic">
              <Popover.Header as="h3">
                Pick the time frame for your Top Items
              </Popover.Header>
              <Popover.Body>
                <p>Short Term: Approximately last 4 weeks</p>
                <p>Medium Term: Approximately last 6 months</p>
                <p>
                  Long Term: Calculated from several years of data and including
                  all new data as it becomes available
                </p>
              </Popover.Body>
            </Popover>
          }
        >
          <div style={{ display: "inline-block", "text-align": "center" }}>
            <p>Pick your timeframe</p>
          </div>
        </OverlayTrigger>
      </div>

      <div
        style={{ display: "inline-block", border: "1px", padding: "1rem 1rem" }}
      >
        <p>Select a number between 1 and 50 for your query</p>
      </div>
      <div>
        <form onSubmit={submitEvent}>
          <div>
            <Form.Select
              onChange={(e) => att.setTerm(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
            >
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </Form.Select>
            <input
              type="number"
              value={att.range}
              onChange={(e) => att.setRange(e.target.value)}
            ></input>
            <Button variant="outline-primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
      <div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Top Artists</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Top Tracks</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Container>
                    <Row className="mx-2 row row-cols-5">
                      {att.TopArtists.map((d) => {
                        return (
                          <Card className="mb-2">
                            <Card.Img src={d.images} />
                            <Card.Body>
                              <Card.Title className="text-center">
                                {d.name}
                              </Card.Title>
                              <Card.Text>Genre: {d.genres.join(",")}</Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush text-left">
                              <ListGroup.Item>
                                Artist's URL:{" "}
                                <a
                                  href={d.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Link
                                </a>
                              </ListGroup.Item>
                            </ListGroup>
                          </Card>
                        );
                      })}
                    </Row>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Container>
                    <Row className="mx-2 row row-cols-5">
                      {att.TopTracks.map((d) => {
                        return (
                          <Card className="mb-2">
                            <Card.Img src={d.images} />
                            <Card.Body>
                              <Card.Title>{d.name}</Card.Title>
                              <Card.Text>Album: {d.album}</Card.Text>
                            </Card.Body>

                            <ListGroup className="list-group-flush text-left">
                              <ListGroup.Item>
                                Song URL:{" "}
                                <a
                                  href={d.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Link
                                </a>
                              </ListGroup.Item>
                            </ListGroup>
                          </Card>
                        );
                      })}
                    </Row>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
      <div>
        <Tabs
          defaultActiveKey="savedtracks"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="savedtracks" title="Last 50 Saved Tracks">
            <ol>
              {att.SavedTracks.map((d) => (
                <li key={d.name}>{d.name}, Artist: {d.artist}</li>
              ))}
            </ol>
            <ol>
                {att.TopTracks.map(d => (
                    <li key={d.name}>{d.name} {d.features.valence}</li>
                ))}
            </ol>
          </Tab>
        </Tabs>
      </div>
      <div>
        <Tabs
          defaultActiveKey="savedtracks"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="savedtracks" title="Last 50 Saved Tracks">
          <h2>Analysis of your Top 50 Tracks</h2>

<Table>
  <thead>
    <tr></tr>
    <th></th>
    <th>Min</th>
    <th>Max</th>
    <th>Average</th>
  </thead>
  <tbody>
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Acousticness</td>
          <td>{d.acousticness.min}</td>
          <td>{d.acousticness.max}</td>
          <td>{d.acousticness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Danceability</td>
          <td>{d.danceability.min}</td>
          <td>{d.danceability.max}</td>
          <td>{d.danceability.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Energy</td>
          <td>{d.energy.min}</td>
          <td>{d.energy.max}</td>
          <td>{d.energy.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Loudness</td>
          <td>{d.loudness.min}</td>
          <td>{d.loudness.max}</td>
          <td>{d.loudness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Tempo</td>
          <td>{d.tempo.min}</td>
          <td>{d.tempo.max}</td>
          <td>{d.tempo.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Valence</td>
          <td>{d.valence.min}</td>
          <td>{d.valence.max}</td>
          <td>{d.valence.avg}</td>
        </tr>
      );
    })}
  </tbody>
</Table>

          </Tab>
          <Tab eventKey="tracksplayed" title="Last 50 Tracks Played">
          <h2>Analysis of your Recent Saved 50 Tracks</h2>

<Table>
  <thead>
    <tr></tr>
    <th></th>
    <th>Min</th>
    <th>Max</th>
    <th>Average</th>
  </thead>
  <tbody>
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Acousticness</td>
          <td>{d.acousticness.min}</td>
          <td>{d.acousticness.max}</td>
          <td>{d.acousticness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Danceability</td>
          <td>{d.danceability.min}</td>
          <td>{d.danceability.max}</td>
          <td>{d.danceability.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Energy</td>
          <td>{d.energy.min}</td>
          <td>{d.energy.max}</td>
          <td>{d.energy.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Loudness</td>
          <td>{d.loudness.min}</td>
          <td>{d.loudness.max}</td>
          <td>{d.loudness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Tempo</td>
          <td>{d.tempo.min}</td>
          <td>{d.tempo.max}</td>
          <td>{d.tempo.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Valence</td>
          <td>{d.valence.min}</td>
          <td>{d.valence.max}</td>
          <td>{d.valence.avg}</td>
        </tr>
      );
    })}
  </tbody>
</Table>
          </Tab>
        </Tabs>

        <form onSubmit={submitEvent1} >
          <input
            type="number"
            value={att.recrange}
            max={100}
            min={1}
            name="rec"
            onChange={(e) => handleint(e)}
          ></input>

          <Button variant="primary" type="submit" >
            Submit
          </Button>
          <Alert show={att.showalert}>{att.errorint}</Alert>
        </form>
      </div>
      <div id="buttonalignright">
          <Button   variant="primary" type="submit" onClick={checkall}>
            Select All
          </Button>
          <Button  variant="primary" type="submit" onClick={uncheckall}>
            Unselect All
          </Button>
      </div>
      <div></div>
      <div>
        <Tabs
          defaultActiveKey="artistrecs"
          id="fill-tab-example"
          className="mb-3"
          fill
          activeKey={att.currentTab}
          onSelect={(key) => att.setCurrentTab(key)}
        >
          <Tab
            eventKey="artistrecs"
            title="Recommendations based on Top Artists"
          >
            <ol>
              {att.recommendations.map((d) => [
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
                      />
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => att.setcpsucc(true)}>Create Playlist</Button>
            </div>
            <Modal 
        show={att.cpsucc} 
        onHide={() => att.setcpsucc(false)}
      >
      <Modal.Header closeButton>
        <Modal.Title>Modal Form Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form.Group >
              <Form.Label>Name: </Form.Label>
              <Form.Control type="text" onChange={(e) => att.setPlaylistTitle(e.target.value)}  placeholder="name input"/>           
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="primary" type="submit" onClick={cp}>
              Submit
          </Button>
      </Modal.Footer>
    </Modal>
    <Modal 
        show={att.showclose} 
        onHide={close()}
      >
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
              {att.trackRecommendations.map((d) => [
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
                      />
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => att.setcpsucc(true)}>Create Playlist</Button>
            </div>
          </Tab>
        </Tabs>
      </div>
      
            
    </>
  );
}

export default Home;
