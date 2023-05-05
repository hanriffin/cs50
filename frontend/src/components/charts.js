import React from 'react';
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Nav,Tabs,Tab,Fade,Form} from "react-bootstrap";
import {Home} from './home.js'
import { Chart, Chart1 } from "../utils/Chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import {Context} from "../utils/context.js";

function Charts() {
    const {ACCESS_TOKEN,chartCurrentTab,setChartCurrentTab,chartrsCurrentTab,setrsChartCurrentTab,chartrpCurrentTab,setrpChartCurrentTab,sortatt, setSortatt,sorttempoatt, setSorttempoatt,sortrsatt, setSortrsatt,sortrstempoatt, setSortrstempoatt,sortrpatt, setSortrpatt,sortrptempoatt, setSortrptempoatt,profile, setProfile,TopArtists, setTopArtists,TopTracks, setTopTracks,loading, setLoading,SavedTracks, setSavedTracks,usedDevices, setDevices,RecentTrack, setRecentTrack,AudioFeatSummary, setAudioFeatSummary,AudioFeatSavedSummary, setAudioFeatSavedSummary,AudioFeatRecentSummary, setAudioFeatRecentSummary,recommendations, setRecommendations,trackRecommendations, setTrackRecommendations,profileid, setprofileid,recplaylistid, setrecplaylistid,songsAdded, setSongsAdded,songsAdded1, setSongsAdded1,toptracksdata, settoptracksdata,data1, setdata1,toptrackstempodata, settoptrackstempodata,savedtracksdata, setsavedtracksdata,data4, setdata4,savedtrackstempodata, setsavedtrackstempodata,recenttracksdata, setrecenttracksdata,data7, setdata7,recenttrackstempodata, setrecenttrackstempodata,recURI, setRecURI,recURI1, setRecURI1,recCounter, setRecCounter,term, setTerm,range, setRange,forms, setForms,recrange, setRecrange,recforms, setRecForms,cpsucc, setcpsucc,cpsucc1, setcpsucc1,showclose, setshowclose,errorint, seterrorint,showalert, setshowalert,currentTab,setCurrentTab,playlistTitle,setPlaylistTitle
    } = useContext(Context)
    console.log(ACCESS_TOKEN)
  const charting = (event) => {
    if (chartCurrentTab === "toptracks") {
      return <Form.Select
      onChange={(e) => setSortatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {sortatt}
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
    } else if (chartCurrentTab === "toptrackstempo") {
      return <Form.Select
              onChange={(e) => setSorttempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {sorttempoatt}
              activeKey={sorttempoatt}
              onSelect={(key) => setChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const chartingrs = (event) => {
    if (chartrsCurrentTab === "savedtracks") {
      return <Form.Select
      onChange={(e) => setSortrsatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {sortrsatt}
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
    } else if (chartrsCurrentTab === "savedtrackstempo") {
      return <Form.Select
              onChange={(e) => setSortrstempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {sortrstempoatt}
              activeKey={sortrstempoatt}
              onSelect={(key) => setChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const chartingrp = (event) => {
    if (chartrpCurrentTab === "recenttracks") {
      return <Form.Select
      onChange={(e) => setSortrpatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {sortrpatt}
      activeKey={sortrpatt}
      onSelect={(key) => setrpChartCurrentTab(key)}
    >
      <option value="all">All</option>
      <option value="danceability">Danceability</option>
      <option value="acousticness">Acousticness</option>
      <option value="energy">Energy</option>
      <option value="instrumentalness">Instrumentalness</option>
      <option value="valence">Valence</option>
    </Form.Select>
    } else if (chartrpCurrentTab === "recenttrackstempo") {
      return <Form.Select
              onChange={(e) => setSortrptempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {sortrptempoatt}
              activeKey={sortrptempoatt}
              onSelect={(key) => setrpChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const sorttop = (event) => {
    const data = [...toptracksdata]
    const tempodata = [...toptrackstempodata]
      if (chartCurrentTab === "toptracks") {
        if (sortatt === "all") {
          data.sort((a,b) => a.index - b.index)
          settoptracksdata(data)
      } else if (sortatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        settoptracksdata(data)
          
      } else if (sortatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        settoptracksdata(data)
      } else if (sortatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        settoptracksdata(data)
      } else if (sortatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        settoptracksdata(data)
      } else if (sortatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        settoptracksdata(data)
      }
      } else if (chartCurrentTab === "toptrackstempo") {
        if (sorttempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          settoptrackstempodata(tempodata)
        } else if (sorttempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          settoptrackstempodata(tempodata)
        }
        
      }
    
  }
   
  useEffect(() => {
    sorttop()
  },[sortatt,sorttempoatt])

  const sortrstop = (event) => {
    const data = [...savedtracksdata]
    const tempodata = [...savedtrackstempodata]
      if (chartrsCurrentTab === "savedtracks") {
        if (sortrsatt === "all") {
          data.sort((a,b) => a.index - b.index)
          setsavedtracksdata(data)
      } else if (sortrsatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        setsavedtracksdata(data)
          
      } else if (sortrsatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        setsavedtracksdata(data)
      } else if (sortrsatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        setsavedtracksdata(data)
      } else if (sortrsatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        setsavedtracksdata(data)
      } else if (sortrsatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        setsavedtracksdata(data)
      }
      } else if (chartrsCurrentTab === "savedtrackstempo") {
        if (sortrstempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          setsavedtrackstempodata(tempodata)
        } else if (sortrstempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          setsavedtrackstempodata(tempodata)
        }
        
      }
    
  }
  
  useEffect(() => {
    sortrstop()

  },[sortrsatt,sortrstempoatt])
  console.log(sortrsatt)
  console.log(savedtracksdata)

  const sortrptop = (event) => {
    const data = [...recenttracksdata]
    const tempodata = [...recenttrackstempodata]
      if (chartrpCurrentTab === "recenttracks") {
        if (sortrpatt === "all") {
          data.sort((a,b) => a.index - b.index)
          setrecenttracksdata(data)
      } else if (sortrpatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        setrecenttracksdata(data)
          
      } else if (sortrpatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        setrecenttracksdata(data)
      } else if (sortrpatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        setrecenttracksdata(data)
      } else if (sortrpatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        setrecenttracksdata(data)
      } else if (sortrpatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        setrecenttracksdata(data)
      }
      } else if (chartrpCurrentTab === "recenttrackstempo") {
        if (sortrptempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          setrecenttrackstempodata(tempodata)
        } else if (sortrptempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          setrecenttrackstempodata(tempodata)
        }
        
      }
    
  }
  
  useEffect(() => {
    sortrptop()

  },[sortrpatt,sortrptempoatt])
    return (
        <>
        <Context.Provider value={{ACCESS_TOKEN,chartCurrentTab,setChartCurrentTab,chartrsCurrentTab,setrsChartCurrentTab,    chartrpCurrentTab,setrpChartCurrentTab,    sortatt, setSortatt,    sorttempoatt, setSorttempoatt,    sortrsatt, setSortrsatt,    sortrstempoatt, setSortrstempoatt,    sortrpatt, setSortrpatt,    sortrptempoatt, setSortrptempoatt,    profile, setProfile,  TopArtists, setTopArtists,  TopTracks, setTopTracks,  loading, setLoading,  SavedTracks, setSavedTracks,  usedDevices, setDevices,  RecentTrack, setRecentTrack,  AudioFeatSummary, setAudioFeatSummary,  AudioFeatSavedSummary, setAudioFeatSavedSummary,  AudioFeatRecentSummary, setAudioFeatRecentSummary,  recommendations, setRecommendations,  trackRecommendations, setTrackRecommendations,  profileid, setprofileid,  recplaylistid, setrecplaylistid,  songsAdded, setSongsAdded,  songsAdded1, setSongsAdded1,  toptracksdata, settoptracksdata,  data1, setdata1,  toptrackstempodata, settoptrackstempodata,  savedtracksdata, setsavedtracksdata,  data4, setdata4,  savedtrackstempodata, setsavedtrackstempodata,  recenttracksdata, setrecenttracksdata,  data7, setdata7,  recenttrackstempodata, setrecenttrackstempodata,  recURI, setRecURI,  recURI1, setRecURI1,  recCounter, setRecCounter,  term, setTerm,  range, setRange,  forms, setForms,  recrange, setRecrange,  recforms, setRecForms,  cpsucc, setcpsucc,  cpsucc1, setcpsucc1,  showclose, setshowclose,  errorint, seterrorint,  showalert, setshowalert,  currentTab,setCurrentTab,playlistTitle,setPlaylistTitle
      }}>   
      
            <Nav
      activeKey="/home"
    >
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/analysis">Analysis</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/recommendations">Recommendations</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/charts" >
          Charts
        </Nav.Link>
      </Nav.Item>
    </Nav>
            <a href="/charts" >Charts</a>
            <h2>Charts</h2>
            <h1>{ACCESS_TOKEN}</h1>
            <div id="buttonalignright">{charting()}</div>
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
            <Chart data={toptracksdata}></Chart>
          </Tab>
          <Tab eventKey="toptrackstempo" title="Top Tracks Tempo Chart">
            <Chart1 data={toptrackstempodata}></Chart1>
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
            <Chart data={savedtracksdata}></Chart>
          </Tab>
          <Tab eventKey="savedtrackstempo" title="Recently Saved Tempo Chart">
            <Chart1 data={savedtrackstempodata}></Chart1>
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
            <Chart data={recenttracksdata}></Chart>
          </Tab>
          <Tab eventKey="recenttrackstempo" title="Recently Played Tempo Chart">
            <Chart1 data={recenttrackstempodata}></Chart1>
          </Tab>
        </Tabs>
      </div>
      </Context.Provider>
        </>
    )
};

export default Charts;
