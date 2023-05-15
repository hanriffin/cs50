import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Context } from "./utils/context.js";
import Analysis from "./components/analysis";
import Charts from "./components/charts";
import Top from "./components/top";
import Recommendations from "./components/recommendations";
import { Navbar, Container, Nav } from "react-bootstrap";
// import { get } from './utils/extractdata.js';

function App() {
  const [ACCESS_TOKEN, setAccessToken] = useState("");
  const [REFRESH_TOKEN, setRefreshToken] = useState("");
  const [profile, setProfile] = useState({}); // profile is an obj hence {}
  const [TopArtists, setTopArtists] = useState([]); // array
  const [TopTracks, setTopTracks] = useState([]); // top tracks
  const [loading, setLoading] = useState(true); // loading
  const [SavedTracks, setSavedTracks] = useState([]); // last saved tracks
  const [usedDevices, setDevices] = useState([]); // used devices
  const [RecentTrack, setRecentTrack] = useState([]); // recently played tracks
  const [AudioFeatSummary, setAudioFeatSummary] = useState([]); //audio features summary of top tracks
  const [AudioFeatSavedSummary, setAudioFeatSavedSummary] = useState([]); //audio features summary of saved tracks
  const [AudioFeatRecentSummary, setAudioFeatRecentSummary] = useState([]); //audio features summary of recently played tracks
  const [recommendations, setRecommendations] = useState([]); // recommendations based on top artists
  const [trackRecommendations, setTrackRecommendations] = useState([]); // recommendations based on top tracks
  const [toptracksdata, settoptracksdata] = useState([]); // data for charts of top tracks
  const [toptrackstempodata, settoptrackstempodata] = useState([]); // data for charts of top tracks
  const [savedtracksdata, setsavedtracksdata] = useState([]); // data for charts of saved tracks
  const [savedtrackstempodata, setsavedtrackstempodata] = useState([]); // data for charts of top tracks
  const [recenttracksdata, setrecenttracksdata] = useState([]);
  const [recenttrackstempodata, setrecenttrackstempodata] = useState([]);
  const [term, setTerm] = useState("long_term");
  const [shuffletracks, setshuffletracks] = useState([]);
  const [shuffleartists, setshuffleartists] = useState([]);
  const [la, setla] = useState([]);
    const [la1, setla1] = useState([]);
    const [la2, setla2] = useState([]);
    const [la3, setla3] = useState([]);

  useEffect(() => {
    getToken();
  }, []);

  // Retrieve token and save it
  const getToken = async () => {
    function getHashparams() {
      var hashParams = {};
      var e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      e = r.exec(q);
      while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
      }
      return hashParams;
    }
    const data = getHashparams();

    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };

  return (
    // Context.provider allows ACCESS_TOKEN to be used in all components inside it
    <Router>
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/"></Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/top">
                  Top
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/analysis">
                  Analysis
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/charts">
                  Charts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/recommendations">
                  Recommendations
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>

        <Context.Provider
          value={{
            ACCESS_TOKEN,
            profile,
            setProfile,
            TopArtists,
            setTopArtists,
            TopTracks,
            setTopTracks,
            loading,
            setLoading,
            SavedTracks,
            setSavedTracks,
            usedDevices,
            setDevices,
            RecentTrack,
            setRecentTrack,
            AudioFeatSummary,
            setAudioFeatSummary,
            AudioFeatSavedSummary,
            setAudioFeatSavedSummary,
            AudioFeatRecentSummary,
            setAudioFeatRecentSummary,
            recommendations,
            setRecommendations,
            trackRecommendations,
            setTrackRecommendations,
            toptracksdata,
            settoptracksdata,
            toptrackstempodata,
            settoptrackstempodata,
            savedtracksdata,
            setsavedtracksdata,
            savedtrackstempodata,
            setsavedtrackstempodata,
            recenttracksdata,
            setrecenttracksdata,
            recenttrackstempodata,
            setrecenttrackstempodata,
            term,
            setTerm,
            shuffletracks,
            setshuffletracks,
            shuffleartists,
            setshuffleartists,
            la,
            setla,
            la1,
            setla1,
            la2,
            setla2,
            la3,
            setla3
          }}
        >
          <Routes>
            <Route path="/" element={ACCESS_TOKEN ? <Home /> : <Login />} />
            <Route
              path="/top"
              element={ACCESS_TOKEN ? <Top /> : <Login />}
            />
            <Route
              path="/analysis"
              element={ACCESS_TOKEN ? <Analysis /> : <Login />}
            />
            <Route path="/charts" element={ACCESS_TOKEN ? <Charts /> : <Login />} />
            <Route path="/recommendations" element={ACCESS_TOKEN ? <Recommendations /> : <Login />} />
          </Routes>
        </Context.Provider>
      </div>
    </Router>
  );
}

export default App;
