import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../utils/context.js";
import { Tabs, Tab, Table } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { getTopTracksNew, getAudioFeaturesNew } from "../utils/api_calls.js";

function Analysis() {
  const att = useContext(Context);
  const [currentTab, setCurrentTab] = useState("toptracks");

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    getTopTracksNew(att).then((d) => getAudioFeaturesNew(att, "top", d));
  }, [att.term]);

  return (
    <>
      <div id="items">
        <h2>Analysis</h2>
        <div id="gap"></div>
        <p>
          Here are some analysis of your top 50 tracks, last 50 tracks saved and
          last 50 tracks played of yours. We've compiled the minimum, maximum
          and average of each audio feature for you to have a rough gauge of
          your music preferences. Below are the definitions that Spotify has
          used for the features.{" "}
        </p>
        <ul>
          <li>
            Acousticness: A confidence measure from 0.0 to 1.0 of whether the
            track is acoustic. 1.0 represents high confidence the track is
            acoustic.
          </li>
          <li>
            Danceability: Danceability describes how suitable a track is for
            dancing based on a combination of musical elements including tempo,
            rhythm stability, beat strength, and overall regularity. A value of
            0.0 is least danceable and 1.0 is most danceable.
          </li>
          <li>
            Instrumentalness: Predicts whether a track contains no vocals. "Ooh"
            and "aah" sounds are treated as instrumental in this context. Rap or
            spoken word tracks are clearly "vocal". The closer the
            instrumentalness value is to 1.0, the greater likelihood the track
            contains no vocal content. Values above 0.5 are intended to
            represent instrumental tracks, but confidence is higher as the value
            approaches 1.0.
          </li>
          <li>
            Loudness: The overall loudness of a track in decibels (dB). Loudness
            values are averaged across the entire track and are useful for
            comparing relative loudness of tracks. Loudness is the quality of a
            sound that is the primary psychological correlate of physical
            strength (amplitude). Values typically range between -60 and 0 db.
          </li>
          <li>
            Tempo: The overall estimated tempo of a track in beats per minute
            (BPM). In musical terminology, tempo is the speed or pace of a given
            piece and derives directly from the average beat duration.
          </li>
          <li>
            Valence: A measure from 0.0 to 1.0 describing the musical
            positiveness conveyed by a track. Tracks with high valence sound
            more positive (e.g. happy, cheerful, euphoric), while tracks with
            low valence sound more negative (e.g. sad, depressed, angry).
          </li>
        </ul>
        <div>
          {currentTab === "toptracks" ? (
            <div
              id="gap2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <label
                htmlFor="analysisform"
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
                onChange={(e) => att.setTerm(e.target.value)}
                size="sm"
                className="inputbox"
                value={att.term}
                id="analysisform"
                style={{ display: "flex", float: "right" }}
              >
                <option value="short_term">Short Term</option>
                <option value="medium_term">Medium Term</option>
                <option value="long_term">Long Term</option>
              </Form.Select>
            </div>
          ) : (
            <div id="gap2"></div>
          )}
        </div>

        <div>
          <Tabs
            defaultActiveKey="toptracks"
            // id="nav-tabs"
            className="nav flex-columns mb-3 justify-content-center"
            onSelect={(key) => setCurrentTab(key)}
          >
            <Tab
              eventKey="toptracks"
              title="Top 50 Tracks"
              style={{ textAlign: "center" }}
            >
              <h2>Analysis of your Top 50 Tracks</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "15px",
                }}
              >
                <div style={{ width: "40vw", minWidth: "350px" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {att.AudioFeatSummary.map((d, i) =>
                        Object.entries(d).map(([key, value]) => (
                          <tr key={i}>
                            <td style={{ textAlign: "left" }}>
                              {titleCase(key)}
                            </td>
                            <td>{value.min}</td>
                            <td>{value.max}</td>
                            <td>{value.avg}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>
            <Tab
              eventKey="trackssaved"
              title="Last 50 Tracks Saved"
              style={{ textAlign: "center" }}
            >
              <h2>Analysis of your Last Saved 50 Tracks</h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "15px",
                }}
              >
                <div style={{ width: "40vw", minWidth: "350px" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {att.AudioFeatSavedSummary.map((d, i) =>
                        Object.entries(d).map(([key, value]) => (
                          <tr key={i}>
                            <td style={{ textAlign: "left" }}>
                              {titleCase(key)}
                            </td>
                            <td>{value.min}</td>
                            <td>{value.max}</td>
                            <td>{value.avg}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>
            <Tab
              eventKey="recentplayed"
              title="Last 50 Tracks Played"
              style={{ textAlign: "center" }}
            >
              <h2>Analysis of your Recently Played 50 Tracks</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "15px",
                }}
              >
                <div style={{ width: "40vw", minWidth: "350px" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {att.AudioFeatRecentSummary.map((d, i) =>
                        Object.entries(d).map(([key, value]) => (
                          <tr key={i}>
                            <td style={{ textAlign: "left" }}>
                              {titleCase(key)}
                            </td>
                            <td>{value.min}</td>
                            <td>{value.max}</td>
                            <td>{value.avg}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Analysis;
