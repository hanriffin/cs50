import React from "react";
import { useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get } from "../utils/get.js"; // function to send request to API
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Image, Row, Col, Spinner } from "react-bootstrap";
import "../index.css";
import GetDevice from "./getdevice.jsx";

function Home() {
  const att = useContext(Context); // usecontext to get shared stuff

  useEffect(() => {
    // Get profile data
    const getProfile = async () => {
      const profile = await get(
        "https://api.spotify.com/v1/me",
        "GET",
        att.ACCESS_TOKEN
      );

      att.setProfile(profile);
    };

    // shuffle function used for top tracks and artists for spotify call for reco
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
            limit: "50",
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
    };

    // Get Top Tracks for recos
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

      // shuffle top tracks, take the first 5 for recommendation fetch
      shuffle(TopTracks);
      const TopTracks1 = TopTracks.slice(0, 5);
      att.setshuffletracks(TopTracks1);
      return TopTracks1;
    };

    // Get Top Artists for reco
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
      // shuffle top tracks, take the first 5 for recommendation fetch
      shuffle(recTopArtists);
      const recTopArtists1 = recTopArtists.slice(0, 5);
      att.setshuffleartists(recTopArtists1);
      return recTopArtists1;
    };

    // Get top tracks
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
    };

    // round audio features to 2 dp. and its 0.00 it will round to last 2 digits
    function round(num) {
      var sep = String(23.32).match(/\D/)[0];
      var b = String(num).split(sep);
      var c = b[1] ? b[1].length : 0;

      if (num === 0) {
        return 0;
      } else if (
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

    // return recent saved tracks
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
          id: d.track.id,
          artist: d.track.artists[0].name,
        };
      });
      att.setSavedTracks(savedTracks);

      return savedTracks;
    };

    // get audio features for saved tracks
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

      const data3 = TopTracksFeat.map((d, index) => {
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

      att.setsavedtracksdata(data3);

      const data5 = TopTracksFeat.map((d, index) => {
        return { name: d.name, tempo: d.features.tempo, index: index };
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
      att.setAudioFeatSavedSummary(featSummary);
    };

    // return available devices
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
    };

    // return recently played tracks
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
        return {
          name: d.track.name,
          id: d.track.id,
          artist: d.track.artists[0].name,
        };
      });
      const unique = recentTrack.filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
      );

      att.setRecentTrack(recentTrack);
      return recentTrack;
    };

    // return audio features of recently played tracks
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
      att.setAudioFeatRecentSummary(featSummary);
    };

    // return recommended songs based on top artists
    const getRecommendations = async (artists) => {
      const recommendations = await get(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify({
            limit: "100",
            seed_artists: artists.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );

      const newRecs = await recommendations.tracks.map(function (d, index) {
        return { name: d.name, uri: d.uri, checked: false, index: index };
      });

      att.setRecommendations(newRecs);
    };

    // return recommended songs based on top tracks
    const getTracksRecommendations = async (artists) => {
      const recommendations = await get(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify({
            limit: "100",
            seed_tracks: artists.map((d) => d.id).join(","),
          }),
        "GET",
        att.ACCESS_TOKEN
      );

      const newRecs = await recommendations.tracks.map(function (d, index) {
        return {
          name: d.name,
          url: d.external_urls.preview_url,
          uri: d.uri,
          checked: false,
          index: index,
        };
      });

      att.setTrackRecommendations(newRecs);
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
    });
  }, []);

  if (att.loading) {
    return (
      <Spinner
        animation="border"
        role="status"
        id="spinner"
        style={{ color: att.colours[0][4] }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <div id="gap"></div>
      <div>
        <Container>
          <Row>
            <Col md="auto">
              <p>Profile Name: {att.profile.display_name}</p>
              <p>Country: {att.profile.country}</p>
              <p>Email: {att.profile.email}</p>
              <p>
                URL:{" "}
                <a
                  href={att.profile.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  id="homelink"
                >
                  {att.profile.external_urls.spotify}
                </a>{" "}
              </p>
              <p>Number of followers: {att.profile.followers.total}</p>
              <p>ID: {att.profile.id}</p>
            </Col>
            <Col>
              <Image
                src={att.profile.images[0].url}
                onError={(event) => event.target.removeAttribute("src")}
                alt="profile"
                roundedCircle={true}
              ></Image>
            </Col>
          </Row>
        </Container>
      </div>

      <div id="gap"></div>
      <h2>Your Available Devices</h2>
      <ol>
        {att.usedDevices.map((d) => (
          <li key={d.id}>
            Active: {String(d.active)} Name: {d.name} Type: {d.type} Volume:{" "}
            {d.volume}
          </li>
        ))}
      </ol>
      <GetDevice />
    </>
  );
}

export default Home;
