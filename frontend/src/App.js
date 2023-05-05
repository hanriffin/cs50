import './App.css';
import Home from './components/home';
import Login from './components/login';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Context } from './utils/context.js';
import Analysis from './components/analysis';
import Charts from './components/charts';
import Recommendations from './components/recommendations';
// import { get } from './utils/extractdata.js';


function App() {
  const [ACCESS_TOKEN, setAccessToken] = useState("");
  const [REFRESH_TOKEN, setRefreshToken] = useState("");
  const [chartCurrentTab,setChartCurrentTab] = useState("toptracks")
    const [chartrsCurrentTab,setrsChartCurrentTab] = useState("savedtracks")
    const [chartrpCurrentTab,setrpChartCurrentTab] = useState("recenttracks")
    const [sortatt, setSortatt] = useState("")
    const [sorttempoatt, setSorttempoatt] = useState("")
    const [sortrsatt, setSortrsatt] = useState("")
    const [sortrstempoatt, setSortrstempoatt] = useState("")
    const [sortrpatt, setSortrpatt] = useState("")
    const [sortrptempoatt, setSortrptempoatt] = useState("")
    const [profile, setProfile] = useState({}); // profile is an obj hence {}
  const [TopArtists, setTopArtists] = useState([]); // array
  const [TopTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SavedTracks, setSavedTracks] = useState([]);
  const [usedDevices, setDevices] = useState([]);
  const [RecentTrack, setRecentTrack] = useState([]);
  const [AudioFeatSummary, setAudioFeatSummary] = useState([]);
  const [AudioFeatSavedSummary, setAudioFeatSavedSummary] = useState([]);
  const [AudioFeatRecentSummary, setAudioFeatRecentSummary] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trackRecommendations, setTrackRecommendations] = useState([]);
  const [profileid, setprofileid] = useState("");
  const [recplaylistid, setrecplaylistid] = useState("");
  const [songsAdded, setSongsAdded] = useState([]);
  const [songsAdded1, setSongsAdded1] = useState([]);
  const [toptracksdata, settoptracksdata] = useState([]);
  const [data1, setdata1] = useState([]);
  const [toptrackstempodata, settoptrackstempodata] = useState([]);
  const [savedtracksdata, setsavedtracksdata] = useState([]);
  const [data4, setdata4] = useState([]);
  const [savedtrackstempodata, setsavedtrackstempodata] = useState([]);
  const [recenttracksdata, setrecenttracksdata] = useState([]);
  const [data7, setdata7] = useState([]);
  const [recenttrackstempodata, setrecenttrackstempodata] = useState([]);
  const [recURI, setRecURI] = useState([]);
  const [recURI1, setRecURI1] = useState([]);
  const [recCounter, setRecCounter] = useState(0);
  const [term, setTerm] = useState("long_term");
  const [range, setRange] = useState(50);
  const [forms, setForms] = useState({});
  const [recrange, setRecrange] = useState(100);
  const [recforms, setRecForms] = useState({});
  const [cpsucc, setcpsucc] = useState(false);
  const [cpsucc1, setcpsucc1] = useState(false);
  const [showclose, setshowclose] = useState(false);
  const [errorint, seterrorint] = useState("");
  const [showalert, setshowalert] = useState(false);
  const [currentTab,setCurrentTab] = useState("artistrecs")
  const [playlistTitle,setPlaylistTitle] = useState("")

  useEffect(() => {
    getToken();
  }, []);
  
  // Retrieve token and save it
  const getToken = async () => {
    function getHashparams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      e = r.exec(q)
      while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
      }
      return hashParams;
    }
    const data = getHashparams();
    console.log(ACCESS_TOKEN);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  }


  return (
    // Context.provider allows ACCESS_TOKEN to be used in all components inside it
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/analysis">Analysis</Link>
                </li>
              <li>
                <Link to="/charts">Charts</Link>
                </li>
              <li>
                <Link to="/recommendations">Recommendations</Link>
              </li>
            </ul>
          </nav>
        
      <Context.Provider value={{ACCESS_TOKEN,chartCurrentTab,setChartCurrentTab,chartrsCurrentTab,setrsChartCurrentTab,chartrpCurrentTab,setrpChartCurrentTab,sortatt, setSortatt,sorttempoatt, setSorttempoatt,sortrsatt, setSortrsatt,sortrstempoatt, setSortrstempoatt,sortrpatt, setSortrpatt,sortrptempoatt, setSortrptempoatt,profile, setProfile,TopArtists, setTopArtists,TopTracks, setTopTracks,loading, setLoading,SavedTracks, setSavedTracks,usedDevices, setDevices,RecentTrack, setRecentTrack,AudioFeatSummary, setAudioFeatSummary,AudioFeatSavedSummary, setAudioFeatSavedSummary,AudioFeatRecentSummary, setAudioFeatRecentSummary,recommendations, setRecommendations,trackRecommendations, setTrackRecommendations,profileid, setprofileid,recplaylistid, setrecplaylistid,songsAdded, setSongsAdded,songsAdded1, setSongsAdded1,toptracksdata, settoptracksdata,data1, setdata1,toptrackstempodata, settoptrackstempodata,savedtracksdata, setsavedtracksdata,data4, setdata4,savedtrackstempodata, setsavedtrackstempodata,recenttracksdata, setrecenttracksdata,data7, setdata7,recenttrackstempodata, setrecenttrackstempodata,recURI, setRecURI,recURI1, setRecURI1,recCounter, setRecCounter,term, setTerm,range, setRange,forms, setForms,recrange, setRecrange,recforms, setRecForms,cpsucc, setcpsucc,cpsucc1, setcpsucc1,showclose, setshowclose,errorint, seterrorint,showalert, setshowalert,currentTab,setCurrentTab,playlistTitle,setPlaylistTitle
    }}> 
      <Routes>
      <Route path="/"  element={ACCESS_TOKEN ? <Home /> : <Login />} />
          <Route path="/analysis" element={ACCESS_TOKEN ? <Analysis /> : <Login />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/recommendations" element={<Recommendations />} />
      </Routes>

          

      
    </Context.Provider>
    </div>
    </Router>
    

  )
};

export default App;
