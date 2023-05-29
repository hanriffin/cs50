import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../utils/context.js";
import { Tabs, Tab, Table } from "react-bootstrap";
import queryString from "querystring";
import { get } from "../utils/get.js";
import { Form } from "react-bootstrap";
import GetDevice from "./getdevice.jsx";

function Analysis() {
  const att = useContext(Context);
  const [currentTab, setCurrentTab] = useState("toptracks");
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
        index: index,
      };
    });

    att.settoptracksdata(data);

    const data2 = TopTracksFeat.map((d, index) => {
      return { name: d.name, tempo: d.features.tempo, index: index };
    });

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
    function round(num) {
      var sep = String(23.32).match(/\D/)[0];
      var b = String(num).split(sep);
      var c = b[1] ? b[1].length : 0;

      if (num === 0) {
        return 0;
      }
      if (
        b[0] === "0" &&
        b[1][1] === "0" &&
        b[1][2] === "0" &&
        b[1][3] === "0"
      ) {
        return num.toFixed(c - 1);
      } else {
        return num.toFixed(2);
      }
    }

    const featSummary = [
      {
        acousticness: {
          avg: round(avgFeat("acousticness")),
          min: round(minFeat("acousticness")),
          max: round(maxFeat("acousticness")),
        },
        danceability: {
          avg: round(avgFeat("danceability")),
          min: round(minFeat("danceability")),
          max: round(maxFeat("danceability")),
        },
        energy: {
          avg: round(avgFeat("energy")),
          min: round(minFeat("energy")),
          max: round(maxFeat("energy")),
        },
        instrumentalness: {
          avg: round(avgFeat("instrumentalness")),
          min: round(minFeat("instrumentalness")),
          max: round(maxFeat("instrumentalness")),
        },
        loudness: {
          avg: round(avgFeat("loudness")),
          min: round(minFeat("loudness")),
          max: round(maxFeat("loudness")),
        },
        tempo: {
          avg: round(avgFeat("tempo")),
          min: round(minFeat("tempo")),
          max: round(maxFeat("tempo")),
        },
        valence: {
          avg: round(avgFeat("valence")),
          min: round(minFeat("valence")),
          max: round(maxFeat("valence")),
        },
      },
    ];
    att.setAudioFeatSummary(featSummary);

    att.setTopTracks(TopTracksFeat);
  };

  useEffect(() => {
    getTopTracks().then((d) => getAudioFeatures(d));
  }, [att.term]);

  return (
    <>
      <h2>Analysis</h2>
      <div id="gap"></div>
      <p>
        Here are some analysis of your top 50 tracks, last 50 tracks saved and
        last 50 tracks played of yours. We've compiled the minimum, maximum and
        average of each audio feature for you to have a rough gauge of your
        music preferences. Below are the definitions that Spotify has used for
        the features.{" "}
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
          contains no vocal content. Values above 0.5 are intended to represent
          instrumental tracks, but confidence is higher as the value approaches
          1.0.
        </li>
        <li>
          Loudness: The overall loudness of a track in decibels (dB). Loudness
          values are averaged across the entire track and are useful for
          comparing relative loudness of tracks. Loudness is the quality of a
          sound that is the primary psychological correlate of physical strength
          (amplitude). Values typically range between -60 and 0 db.
        </li>
        <li>
          Tempo: The overall estimated tempo of a track in beats per minute
          (BPM). In musical terminology, tempo is the speed or pace of a given
          piece and derives directly from the average beat duration.
        </li>
        <li>
          Valence: A measure from 0.0 to 1.0 describing the musical positiveness
          conveyed by a track. Tracks with high valence sound more positive
          (e.g. happy, cheerful, euphoric), while tracks with low valence sound
          more negative (e.g. sad, depressed, angry).
        </li>
      </ul>
      <div>
        {currentTab === "toptracks" ? (
          <div id="gap2">
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
          </div>
        ) : (
          <div id="gap2"></div>
        )}
      </div>

      <div>
        <Tabs
          defaultActiveKey="toptracks"
          id="fill-tab-example"
          className="mb-3"
          onSelect={(key) => setCurrentTab(key)}
        >
          <Tab eventKey="toptracks" title="Top 50 Tracks">
            <h2>Analysis of your Top 50 Tracks</h2>

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
                      <td>Instrumentalness</td>
                      <td>{d.instrumentalness.min}</td>
                      <td>{d.instrumentalness.max}</td>
                      <td>{d.instrumentalness.avg}</td>
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
          <Tab eventKey="trackssaved" title="Last 50 Tracks Saved">
            <h2>Analysis of your Last Saved 50 Tracks</h2>

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
                {att.AudioFeatSummary.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>Instrumentalness</td>
                      <td>{d.instrumentalness.min}</td>
                      <td>{d.instrumentalness.max}</td>
                      <td>{d.instrumentalness.avg}</td>
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
          <Tab eventKey="recentplayed" title="Last 50 Tracks Played">
            <h2>Analysis of your Recently Played 50 Tracks</h2>

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
                {att.AudioFeatRecentSummary.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>Acousticness</td>
                      <td>{d.acousticness.min}</td>
                      <td>{d.acousticness.max}</td>
                      <td>{d.acousticness.avg}</td>
                    </tr>
                  );
                })}
                {att.AudioFeatRecentSummary.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>Danceability</td>
                      <td>{d.danceability.min}</td>
                      <td>{d.danceability.max}</td>
                      <td>{d.danceability.avg}</td>
                    </tr>
                  );
                })}
                {att.AudioFeatRecentSummary.map((d, i) => {
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
                      <td>Instrumentalness</td>
                      <td>{d.instrumentalness.min}</td>
                      <td>{d.instrumentalness.max}</td>
                      <td>{d.instrumentalness.avg}</td>
                    </tr>
                  );
                })}
                {att.AudioFeatRecentSummary.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>Loudness</td>
                      <td>{d.loudness.min}</td>
                      <td>{d.loudness.max}</td>
                      <td>{d.loudness.avg}</td>
                    </tr>
                  );
                })}
                {att.AudioFeatRecentSummary.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>Tempo</td>
                      <td>{d.tempo.min}</td>
                      <td>{d.tempo.max}</td>
                      <td>{d.tempo.avg}</td>
                    </tr>
                  );
                })}
                {att.AudioFeatRecentSummary.map((d, i) => {
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
      </div>
      <GetDevice />
    </>
  );
}

export default Analysis;
