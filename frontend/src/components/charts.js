import React from 'react';
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Nav,Tabs,Tab,Fade,Form} from "react-bootstrap";
import {Home} from './home.js'
import { Chart, Chart1 } from "../utils/Chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import {Context} from "../utils/context.js";

function Charts() {
    const att = useContext(Context)
    console.log(att.ACCESS_TOKEN)
  const charting = (event) => {
    if (att.chartCurrentTab === "toptracks") {
      return <Form.Select
      onChange={(e) => att.setSortatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {att.sortatt}
      activeKey={att.sortatt}
      onSelect={(key) => att.setChartCurrentTab(key)}
    >
      <option value="all">All</option>
      <option value="danceability">Danceability</option>
      <option value="acousticness">Acousticness</option>
      <option value="energy">Energy</option>
      <option value="instrumentalness">Instrumentalness</option>
      <option value="valence">Valence</option>
    </Form.Select>
    } else if (att.chartCurrentTab === "toptrackstempo") {
      return <Form.Select
              onChange={(e) => att.setSorttempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {att.sorttempoatt}
              activeKey={att.sorttempoatt}
              onSelect={(key) => att.setChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const chartingrs = (event) => {
    if (att.chartrsCurrentTab === "savedtracks") {
      return <Form.Select
      onChange={(e) => att.setSortrsatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {att.sortrsatt}
      activeKey={att.sortrsatt}
      onSelect={(key) => att.setrsChartCurrentTab(key)}
    >
      <option value="all">All</option>
      <option value="danceability">Danceability</option>
      <option value="acousticness">Acousticness</option>
      <option value="energy">Energy</option>
      <option value="instrumentalness">Instrumentalness</option>
      <option value="valence">Valence</option>
    </Form.Select>
    } else if (att.chartrsCurrentTab === "savedtrackstempo") {
      return <Form.Select
              onChange={(e) => att.setSortrstempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {att.sortrstempoatt}
              activeKey={att.sortrstempoatt}
              onSelect={(key) => att.setChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const chartingrp = (event) => {
    if (att.chartrpCurrentTab === "recenttracks") {
      return <Form.Select
      onChange={(e) => att.setSortrpatt(e.target.value)}
      size="sm"
      className="inputbox"
      style={{ display: "inline-block" }}
      value = {att.sortrpatt}
      activeKey={att.sortrpatt}
      onSelect={(key) => att.setrpChartCurrentTab(key)}
    >
      <option value="all">All</option>
      <option value="danceability">Danceability</option>
      <option value="acousticness">Acousticness</option>
      <option value="energy">Energy</option>
      <option value="instrumentalness">Instrumentalness</option>
      <option value="valence">Valence</option>
    </Form.Select>
    } else if (att.chartrpCurrentTab === "recenttrackstempo") {
      return <Form.Select
              onChange={(e) => att.setSortrptempoatt(e.target.value)}
              size="sm"
              className="inputbox"
              style={{ display: "inline-block" }}
              value = {att.sortrptempoatt}
              activeKey={att.sortrptempoatt}
              onSelect={(key) => att.setrpChartCurrentTab(key)}
            >
              <option value="alltempo">All</option>
              <option value="tempo">Tempo</option>
            
            </Form.Select>
    }
  } 
  const sorttop = (event) => {
    const data = [...att.toptracksdata]
    const tempodata = [...att.toptrackstempodata]
      if (att.chartCurrentTab === "toptracks") {
        if (att.sortatt === "all") {
          data.sort((a,b) => a.index - b.index)
          att.settoptracksdata(data)
      } else if (att.sortatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        att.settoptracksdata(data)
          
      } else if (att.sortatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        att.settoptracksdata(data)
      } else if (att.sortatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        att.settoptracksdata(data)
      } else if (att.sortatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        att.settoptracksdata(data)
      } else if (att.sortatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        att.settoptracksdata(data)
      }
      } else if (att.chartCurrentTab === "toptrackstempo") {
        if (att.sorttempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          att.settoptrackstempodata(tempodata)
        } else if (att.sorttempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          att.settoptrackstempodata(tempodata)
        }
        
      }
    
  }
   
  useEffect(() => {
    sorttop()
  },[att.sortatt,att.sorttempoatt])

  const sortrstop = (event) => {
    const data = [...att.savedtracksdata]
    const tempodata = [...att.savedtrackstempodata]
      if (att.chartrsCurrentTab === "savedtracks") {
        if (att.sortrsatt === "all") {
          data.sort((a,b) => a.index - b.index)
          att.setsavedtracksdata(data)
      } else if (att.sortrsatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        att.setsavedtracksdata(data)
          
      } else if (att.sortrsatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        att.setsavedtracksdata(data)
      } else if (att.sortrsatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        att.setsavedtracksdata(data)
      } else if (att.sortrsatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        att.setsavedtracksdata(data)
      } else if (att.sortrsatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        att.setsavedtracksdata(data)
      }
      } else if (att.chartrsCurrentTab === "savedtrackstempo") {
        if (att.sortrstempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          att.setsavedtrackstempodata(tempodata)
        } else if (att.sortrstempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          att.setsavedtrackstempodata(tempodata)
        }
        
      }
    
  }
  
  useEffect(() => {
    sortrstop()

  },[att.sortrsatt,att.sortrstempoatt])
  console.log(att.sortrsatt)
  console.log(att.savedtracksdata)

  const sortrptop = (event) => {
    const data = [...att.recenttracksdata]
    const tempodata = [...att.recenttrackstempodata]
      if (att.chartrpCurrentTab === "recenttracks") {
        if (att.sortrpatt === "all") {
          data.sort((a,b) => a.index - b.index)
          att.setrecenttracksdata(data)
      } else if (att.sortrpatt === "acousticness") {
        data.sort((a,b) => a.acousticness - b.acousticness)
        att.setrecenttracksdata(data)
          
      } else if (att.sortrpatt === "energy") {
        data.sort((a,b) => a.energy - b.energy)
        att.setrecenttracksdata(data)
      } else if (att.sortrpatt === "danceability") {
        data.sort((a,b) => a.danceability - b.danceability)
        att.setrecenttracksdata(data)
      } else if (att.sortrpatt === "instrumentalness") {
        data.sort((a,b) => a.instrumentalness - b.instrumentalness)
        att.setrecenttracksdata(data)
      } else if (att.sortrpatt === "valence") {
        data.sort((a,b) => a.valence - b.valence)
        att.setrecenttracksdata(data)
      }
      } else if (att.chartrpCurrentTab === "recenttrackstempo") {
        if (att.sortrptempoatt === "tempo") {
          tempodata.sort((a,b) => a.tempo - b.tempo)
          att.setrecenttrackstempodata(tempodata)
        } else if (att.sortrptempoatt === "alltempo") {
          tempodata.sort((a,b) => a.index - b.index)
          att.setrecenttrackstempodata(tempodata)
        }
        
      }
    
  }
  
  useEffect(() => {
    sortrptop()

  },[att.sortrpatt,att.sortrptempoatt])
    return (
        <>


            
            <h2>Charts</h2>
            <h1>{att.ACCESS_TOKEN}</h1>
            <div id="buttonalignright">{charting()}</div>
      <div>
            
        <Tabs
          defaultActiveKey="toptracks"
          id="uncontrolled-tab-example"
          className="mb-3"
          transition={Fade}
          activeKey={att.chartCurrentTab}
          onSelect={(key) => att.setChartCurrentTab(key)}
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
          activeKey={att.chartrsCurrentTab}
          onSelect={(key) => att.setrsChartCurrentTab(key)}
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
          activeKey={att.chartrpCurrentTab}
          onSelect={(key) => att.setrpChartCurrentTab(key)}
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
    )
};

export default Charts;
