import React from "react";
import { useState, useContext, useEffect } from "react";
import { Tabs, Tab, Fade, Form } from "react-bootstrap";
import { Chart, Chart1 } from "../utils/Chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import queryString from "querystring";
import { Context } from "../utils/context.js";
import { get } from "../utils/get.js";

function Charts() {
  const att = useContext(Context);
  const [chartCurrentTab, setChartCurrentTab] = useState("toptracks");
  const [chartrsCurrentTab, setrsChartCurrentTab] = useState("savedtracks");
  const [chartrpCurrentTab, setrpChartCurrentTab] = useState("recenttracks");
  const [sortatt, setSortatt] = useState("all");
  const [sorttempoatt, setSorttempoatt] = useState("");
  const [sortrsatt, setSortrsatt] = useState("");
  const [sortrstempoatt, setSortrstempoatt] = useState("");
  const [sortrpatt, setSortrpatt] = useState("");
  const [sortrptempoatt, setSortrptempoatt] = useState("");

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

    setSortatt("all")
    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
    return TopTracks;
    
    // getAudioFeatures(TopTracks);
  };
  function round(num) {
    var sep = String(23.32).match(/\D/)[0];
    var b = String(num).split(sep);
  var c= b[1]? b[1].length : 0;

  if (num === 0) {
    return 0
  } else if (b[0] === "0" && b[1][1] === "0" && b[1][2] === "0" && b[1][3] === "0") {
    return num.toFixed(c-1)
  } else {
    return num.toFixed(2)
  }
}
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
    att.settoptracksdata(data);

    const data2 = TopTracksFeat.map((d, index) => {
      return { name: d.name, tempo: d.features.tempo, index: index };
    });
    
    setSorttempoatt("all")
    att.settoptrackstempodata(data2);
  }

  useEffect(() => {
    getTopTracks().then((d) => getAudioFeatures(d))
  },[att.term])

  const charting = (event) => {
    if (chartCurrentTab === "toptracks") {
      return (
        <div>
          <Form.Select
          onChange={(e) => setSortatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{display:'flex',float: 'right'}}
          value={sortatt}
          activeKey={sortatt}
          onSelect={(key) => setChartCurrentTab(key)}
        >
          <option value="all">All</option>
          <option value="danceability">Danceability</option>
          <option value="acousticness">Acousticness</option>
          <option value="energy">Energy</option>
          <option value="instrumentalness">Instrumentalness</option>
          <option value="valence">Valence</option>
        </Form.Select>
        <label for="sort" style={{display:'flex',float: 'right'}} >Sort By</label>
        </div>
        
      );
    } else if (chartCurrentTab === "toptrackstempo") {
      return (
        <div>
          <Form.Select
          onChange={(e) => setSorttempoatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{display:'flex',float: 'right'}}
          value={sorttempoatt}
          activeKey={sorttempoatt}
          onSelect={(key) => setChartCurrentTab(key)}
        >
          <option value="alltempo">All</option>
          <option value="tempo">Tempo</option>
        </Form.Select>
        <label for="sort" style={{display:'flex',float: 'right'}} >Sort By</label>
        </div>
        
      );
    }
  };
  const chartingrs = (event) => {
    if (chartrsCurrentTab === "savedtracks") {
      return (
        <div>
          <Form.Select
          onChange={(e) => setSortrsatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{display:'flex',float: 'right'}}
          value={sortrsatt}
          activeKey={sortrsatt}
          onSelect={(key) => setrsChartCurrentTab(key)}
        >
          <option value="all">All</option>
          <option value="danceability">Danceability</option>
          <option value="acousticness">Acousticness</option>
          <option value="energy">Energy</option>
          <option value="instrumentalness">Instrumentalness</option>
          <option value="valence">Valence</option>
        </Form.Select>
        <label for="sort" style={{display:'flex',float: 'right'}} >Sort By</label>
        </div>
        
      );
    } else if (chartrsCurrentTab === "savedtrackstempo") {
      return (
        <div>
        <Form.Select
          onChange={(e) => setSortrstempoatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{display:'flex',float: 'right'}}
          value={sortrstempoatt}
          activeKey={sortrstempoatt}
          onSelect={(key) => setChartCurrentTab(key)}
        >
          <option value="alltempo">All</option>
          <option value="tempo">Tempo</option>
        </Form.Select>
        <label for="sort" style={{display:'flex',float: 'right'}} >Sort By</label>
        </div>
      );
    }
  };
  const chartingrp = (event) => {
    if (chartrpCurrentTab === "recenttracks") {
      return (
        <div>
          
          <Form.Select
          onChange={(e) => setSortrpatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{display:'flex',float: 'right'}}
          value={sortrpatt}
          activeKey={sortrpatt}
          onSelect={(key) => setrpChartCurrentTab(key)}
          id="sort"
        >
          <option value="all">All</option>
          <option value="danceability">Danceability</option>
          <option value="acousticness">Acousticness</option>
          <option value="energy">Energy</option>
          <option value="instrumentalness">Instrumentalness</option>
          <option value="valence">Valence</option>
        </Form.Select>
        <label for="sort" style={{display:'flex',float: 'right'}} >Sort By</label>
        </div>
        
      );
    } else if (chartrpCurrentTab === "recenttrackstempo") {
      return (
        <Form.Select
          onChange={(e) => setSortrptempoatt(e.target.value)}
          size="sm"
          className="inputbox"
          style={{ display: "inline-block" }}
          value={sortrptempoatt}
          activeKey={sortrptempoatt}
          onSelect={(key) => setrpChartCurrentTab(key)}
        >
          <option value="alltempo">All</option>
          <option value="tempo">Tempo</option>
        </Form.Select>
      );
    }
  };
  const sorttop = (event) => {
    const data = [...att.toptracksdata];
    const tempodata = [...att.toptrackstempodata];
    if (chartCurrentTab === "toptracks") {
      if (sortatt === "all") {
        data.sort((a, b) => a.index - b.index);
        att.settoptracksdata(data);
      } else if (sortatt === "acousticness") {
        data.sort((a, b) => a.acousticness - b.acousticness);
        att.settoptracksdata(data);
      } else if (sortatt === "energy") {
        data.sort((a, b) => a.energy - b.energy);
        att.settoptracksdata(data);
      } else if (sortatt === "danceability") {
        data.sort((a, b) => a.danceability - b.danceability);
        att.settoptracksdata(data);
      } else if (sortatt === "instrumentalness") {
        data.sort((a, b) => a.instrumentalness - b.instrumentalness);
        att.settoptracksdata(data);
      } else if (sortatt === "valence") {
        data.sort((a, b) => a.valence - b.valence);
        att.settoptracksdata(data);
      }
    } else if (chartCurrentTab === "toptrackstempo") {
      if (sorttempoatt === "tempo") {
        tempodata.sort((a, b) => a.tempo - b.tempo);
        att.settoptrackstempodata(tempodata);
      } else if (sorttempoatt === "alltempo") {
        tempodata.sort((a, b) => a.index - b.index);
        att.settoptrackstempodata(tempodata);
      }
    }
  };
  const reset = (event) => {
    
    if (chartCurrentTab === "toptracks") {
      att.setTerm(event)
      
      
    } else if (chartCurrentTab === "toptrackstempo") {
      att.setTerm(event)
      
    }
    
  }
  useEffect(() => {
    sorttop();
    
  }, [sortatt, sorttempoatt]);

  const sortrstop = (event) => {
    const data = [...att.savedtracksdata];
    const tempodata = [...att.savedtrackstempodata];
    if (chartrsCurrentTab === "savedtracks") {
      if (sortrsatt === "all") {
        data.sort((a, b) => a.index - b.index);
        att.setsavedtracksdata(data);
      } else if (sortrsatt === "acousticness") {
        data.sort((a, b) => a.acousticness - b.acousticness);
        att.setsavedtracksdata(data);
      } else if (sortrsatt === "energy") {
        data.sort((a, b) => a.energy - b.energy);
        att.setsavedtracksdata(data);
      } else if (sortrsatt === "danceability") {
        data.sort((a, b) => a.danceability - b.danceability);
        att.setsavedtracksdata(data);
      } else if (sortrsatt === "instrumentalness") {
        data.sort((a, b) => a.instrumentalness - b.instrumentalness);
        att.setsavedtracksdata(data);
      } else if (sortrsatt === "valence") {
        data.sort((a, b) => a.valence - b.valence);
        att.setsavedtracksdata(data);
      }
    } else if (chartrsCurrentTab === "savedtrackstempo") {
      if (sortrstempoatt === "tempo") {
        tempodata.sort((a, b) => a.tempo - b.tempo);
        att.setsavedtrackstempodata(tempodata);
      } else if (sortrstempoatt === "alltempo") {
        tempodata.sort((a, b) => a.index - b.index);
        att.setsavedtrackstempodata(tempodata);
      }
    }
  };

  useEffect(() => {
    sortrstop();
  }, [sortrsatt, sortrstempoatt]);

  const sortrptop = (event) => {
    const data = [...att.recenttracksdata];
    const tempodata = [...att.recenttrackstempodata];
    if (chartrpCurrentTab === "recenttracks") {
      if (sortrpatt === "all") {
        data.sort((a, b) => a.index - b.index);
        att.setrecenttracksdata(data);
      } else if (sortrpatt === "acousticness") {
        data.sort((a, b) => a.acousticness - b.acousticness);
        att.setrecenttracksdata(data);
      } else if (sortrpatt === "energy") {
        data.sort((a, b) => a.energy - b.energy);
        att.setrecenttracksdata(data);
      } else if (sortrpatt === "danceability") {
        data.sort((a, b) => a.danceability - b.danceability);
        att.setrecenttracksdata(data);
      } else if (sortrpatt === "instrumentalness") {
        data.sort((a, b) => a.instrumentalness - b.instrumentalness);
        att.setrecenttracksdata(data);
      } else if (sortrpatt === "valence") {
        data.sort((a, b) => a.valence - b.valence);
        att.setrecenttracksdata(data);
      }
    } else if (chartrpCurrentTab === "recenttrackstempo") {
      if (sortrptempoatt === "tempo") {
        tempodata.sort((a, b) => a.tempo - b.tempo);
        att.setrecenttrackstempodata(tempodata);
      } else if (sortrptempoatt === "alltempo") {
        tempodata.sort((a, b) => a.index - b.index);
        att.setrecenttrackstempodata(tempodata);
      }
    }
  };

  useEffect(() => {
    sortrptop();
  }, [sortrpatt, sortrptempoatt]);

  return (
    <>
      <h2>Charts</h2>
      <div id="gap"></div>
      <div>
        <p>You can view your top 50 tracks, last 50 saved tracks and last 50 recently played tracks. There is a dropdown where you can toggle to sort the tracks in ascending order of the chosen feature. </p>
        <p>Below are the definitions that Spotify has used for the features.</p>
      <ul>
        <li>Acousticness: A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.</li>
        <li>Danceability: Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.</li>
        <li>Instrumentalness: Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.</li>
        <li>Loudness: The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.</li>
        <li>Tempo: The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.</li>
        <li>Valence: A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).</li>



      </ul>
      </div>
      <div style={{height:'50px'}}>
        <Form.Select
              onChange={(e) => reset(e.target.value)}
              size="sm"
              className="inputbox"
              style={{display:'flex',float: 'right'}} 
              value={att.term}
              id = "form"
            >
              
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </Form.Select>
            <label for="form" style={{display:'flex',float: 'right'}} >Term</label></div>
      <div id="buttonalignright">{charting()}</div>
      <div id="gap"></div>

      <div>
            
        <Tabs
          defaultActiveKey="toptracks"
          id="uncontrolled-tab-example"
          className="mb-3"
          transition={Fade}
          activeKey={chartCurrentTab}
          onSelect={(key) => setChartCurrentTab(key)}
        >
          <Tab eventKey="toptracks" title="Top Tracks Chart" def>
            <Chart data={att.toptracksdata}></Chart>
          </Tab>
          <Tab eventKey="toptrackstempo" title="Top Tracks Tempo Chart">
            <Chart1 data={att.toptrackstempodata}></Chart1>
          </Tab>
        </Tabs>
      </div>
      <div id="buttonalignright">{chartingrs()}</div>
      <div>
        <Tabs
          defaultActiveKey="savedtracks"
          id="uncontrolled-tab-example"
          className="mb-3"
          transition={Fade}
          activeKey={chartrsCurrentTab}
          onSelect={(key) => setrsChartCurrentTab(key)}
        >
          <Tab eventKey="savedtracks" title="Recently Saved Chart" def>
            <Chart data={att.savedtracksdata}></Chart>
          </Tab>
          <Tab eventKey="savedtrackstempo" title="Recently Saved Tempo Chart">
            <Chart1 data={att.savedtrackstempodata}></Chart1>
          </Tab>
        </Tabs>
      </div>
      <div id="buttonalignright">{chartingrp()}</div>
      <div>
        <Tabs
          defaultActiveKey="recenttracks"
          id="uncontrolled-tab-example"
          className="mb-3"
          transition={Fade}
          activeKey={chartrpCurrentTab}
          onSelect={(key) => setrpChartCurrentTab(key)}
        >
          <Tab eventKey="recenttracks" title="Recently Played Chart" def>
            <Chart data={att.recenttracksdata}></Chart>
          </Tab>
          <Tab eventKey="recenttrackstempo" title="Recently Played Tempo Chart">
            <Chart1 data={att.recenttrackstempodata}></Chart1>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Charts;
