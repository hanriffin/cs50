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
  
  
 

  
  


  

  const submitEvent = (event) => {
    event.preventDefault();
    att.setForms({ ...att.forms, [event.target.name]: event.target.value });
  };

  const submitEvent1 = (event) => {
    event.preventDefault();
    att.setRecForms({ ...att.recforms, [event.target.name]: event.target.value });
  };

  

  
  

  
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
            </Tab>
            <Tab eventKey="toptracks" title="Top 50 Saved Tracks">
            <ol>
                {att.TopTracks.map(d => (
                    <li key={d.name}>{d.name} {d.features.valence}</li>
                ))}
            </ol>
          </Tab>
        </Tabs>
      </div>

      

      
      
            
    </>
  );
}

export default Home;
