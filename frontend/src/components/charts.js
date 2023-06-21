import React from "react";
import { useState, useContext, useEffect } from "react";
import { Tabs, Tab, Fade, Form, TabContainer } from "react-bootstrap";
import { Chart, Chart1 } from "../utils/Chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import queryString from "querystring";
import { Context } from "../utils/context.js";
import { get } from "../utils/get.js";
import GetDevice from "./getdevice.jsx";

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

  const charting = (event) => {
    if (chartCurrentTab === "toptracks") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSortatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right", marginRight: "20px" }}
            value={sortatt}
            activekey={sortatt}
            onSelect={(key) => setChartCurrentTab(key)}
            id="sort"
          >
            <option value="all">All</option>
            <option value="danceability">Danceability</option>
            <option value="acousticness">Acousticness</option>
            <option value="energy">Energy</option>
            <option value="instrumentalness">Instrumentalness</option>
            <option value="valence">Valence</option>
          </Form.Select>
        </div>
      );
    } else if (chartCurrentTab === "toptrackstempo") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSorttempoatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right", "margin-right": "20px" }}
            value={sorttempoatt}
            activekey={sorttempoatt}
            onSelect={(key) => setChartCurrentTab(key)}
            id="sort"
          >
            <option value="alltempo">All</option>
            <option value="tempo">Tempo</option>
          </Form.Select>
        </div>
      );
    }
  };
  const chartingrs = (event) => {
    if (chartrsCurrentTab === "savedtracks") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSortrsatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right" }}
            value={sortrsatt}
            activekey={sortrsatt}
            onSelect={(key) => setrsChartCurrentTab(key)}
            id="sort"
          >
            <option value="all">All</option>
            <option value="danceability">Danceability</option>
            <option value="acousticness">Acousticness</option>
            <option value="energy">Energy</option>
            <option value="instrumentalness">Instrumentalness</option>
            <option value="valence">Valence</option>
          </Form.Select>
        </div>
      );
    } else if (chartrsCurrentTab === "savedtrackstempo") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSortrstempoatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right" }}
            value={sortrstempoatt}
            activekey={sortrstempoatt}
            onSelect={(key) => setChartCurrentTab(key)}
            id="sort"
          >
            <option value="alltempo">All</option>
            <option value="tempo">Tempo</option>
          </Form.Select>
        </div>
      );
    }
  };
  const chartingrp = (event) => {
    if (chartrpCurrentTab === "recenttracks") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSortrpatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right" }}
            value={sortrpatt}
            activekey={sortrpatt}
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
        </div>
      );
    } else if (chartrpCurrentTab === "recenttrackstempo") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="sort" id="labels">
            Sort By
          </label>
          <Form.Select
            onChange={(e) => setSortrptempoatt(e.target.value)}
            size="sm"
            className="inputbox"
            style={{ display: "flex", float: "right" }}
            value={sortrptempoatt}
            activekey={sortrptempoatt}
            onSelect={(key) => setrpChartCurrentTab(key)}
            id="sort"
          >
            <option value="alltempo">All</option>
            <option value="tempo">Tempo</option>
          </Form.Select>
        </div>
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
      att.setTerm(event);
    } else if (chartCurrentTab === "toptrackstempo") {
      att.setTerm(event);
    }
  };
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
  console.log(att.isDark);
  useEffect(() => {
    sortrptop();
  }, [sortrpatt, sortrptempoatt]);

  return (
    <>
      <div id="items">
        <h2>Charts</h2>
        <div id="gap"></div>
        <div>
          <p>
            You can view your top 50 tracks, last 50 saved tracks and last 50
            recently played tracks. There is a dropdown where you can toggle to
            sort the tracks in ascending order of the chosen feature.{" "}
          </p>
          <p>
            Below are the definitions that Spotify has used for the features.
          </p>
          <ul>
            <li>
              Acousticness: A confidence measure from 0.0 to 1.0 of whether the
              track is acoustic. 1.0 represents high confidence the track is
              acoustic.
            </li>
            <li>
              Danceability: Danceability describes how suitable a track is for
              dancing based on a combination of musical elements including
              tempo, rhythm stability, beat strength, and overall regularity. A
              value of 0.0 is least danceable and 1.0 is most danceable.
            </li>
            <li>
              Instrumentalness: Predicts whether a track contains no vocals.
              "Ooh" and "aah" sounds are treated as instrumental in this
              context. Rap or spoken word tracks are clearly "vocal". The closer
              the instrumentalness value is to 1.0, the greater likelihood the
              track contains no vocal content. Values above 0.5 are intended to
              represent instrumental tracks, but confidence is higher as the
              value approaches 1.0.
            </li>
            <li>
              Loudness: The overall loudness of a track in decibels (dB).
              Loudness values are averaged across the entire track and are
              useful for comparing relative loudness of tracks. Loudness is the
              quality of a sound that is the primary psychological correlate of
              physical strength (amplitude). Values typically range between -60
              and 0 db.
            </li>
            <li>
              Tempo: The overall estimated tempo of a track in beats per minute
              (BPM). In musical terminology, tempo is the speed or pace of a
              given piece and derives directly from the average beat duration.
            </li>
            <li>
              Valence: A measure from 0.0 to 1.0 describing the musical
              positiveness conveyed by a track. Tracks with high valence sound
              more positive (e.g. happy, cheerful, euphoric), while tracks with
              low valence sound more negative (e.g. sad, depressed, angry).
            </li>
          </ul>
        </div>
        <div id="gap"></div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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
          <Form.Select
            onChange={(e) => reset(e.target.value)}
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
          <div style = {{flex: "0 0 20px"}}></div>
          <div id="buttonalignright">{charting()}</div>
        </div>
        <div id="gap"></div>

        <div>
          <Tabs
            defaultActiveKey="toptracks"
            id="uncontrolled-tab-example"
            className="mb-3 "
            transition={Fade}
            activekey={chartCurrentTab}
            onSelect={(key) => setChartCurrentTab(key)}
          >
            {/* <div style={{ display: "flex", justifyContent: "center" }}></div> */}
            <Tab
              className="text-center"
              eventKey="toptracks"
              title="Top Tracks Chart"
              def="true"
            >
              <div style={{ width: "8vw" }}></div>
              <Chart data={att.toptracksdata}></Chart>
            </Tab>
            <Tab
              className="justify-content-center"
              eventKey="toptrackstempo"
              title="Top Tracks Tempo Chart"
            >
              <div style={{ width: "8vw" }}></div>
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
            activekey={chartrsCurrentTab}
            onSelect={(key) => setrsChartCurrentTab(key)}
          >
            <Tab eventKey="savedtracks" title="Recently Saved Chart" def="true">
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
            activekey={chartrpCurrentTab}
            onSelect={(key) => setrpChartCurrentTab(key)}
          >
            <Tab
              eventKey="recenttracks"
              title="Recently Played Chart"
              def="true"
            >
              <Chart data={att.recenttracksdata}></Chart>
            </Tab>
            <Tab
              eventKey="recenttrackstempo"
              title="Recently Played Tempo Chart"
            >
              <Chart1 data={att.recenttrackstempodata}></Chart1>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Charts;
