import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get } from "../utils/get.js"; // function to send request to API
import { getTopTracksNew, getAudioFeaturesNew } from "../utils/api_calls.js";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Image, Row, Col, Spinner } from "react-bootstrap";
import "../index.css";

function Home() {
  const att = useContext(Context); // usecontext to get shared stuff
  const [pic, setImage] = useState();

  useEffect(() => {
    // Get profile data
    const getProfile = async () => {
      const profile = await get(
        "https://api.spotify.com/v1/me",
        att.ACCESS_TOKEN
      );

      att.setProfile(profile);
      if (profile.images.length > 0) {
        setImage(true);
      } else {
        setImage(false);
      }
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

    // return recent saved tracks
    const getSaved = async () => {
      const saved = await get(
        "https://api.spotify.com/v1/me/tracks?" +
          queryString.stringify({
            limit: "50",
          }),
        att.ACCESS_TOKEN
      );
      const savedTracks = await saved.items.map(function (d) {
        return {
          name: d.track.name,
          id: d.track.id,
          artist: d.track.artists[0].name,
          uri: d.track.uri,
        };
      });
      att.setSavedTracks(savedTracks);
      console.log(savedTracks);

      return savedTracks;
    };

    // return available devices
    const getDevices = async () => {
      const devices = await get(
        "https://api.spotify.com/v1/me/player/devices",
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
      console.log(recentTrack);
      return recentTrack;
    };

    // return recommended songs based on top artists
    const getRecommendations = async (artists) => {
      const recommendations = await get(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify({
            limit: "100",
            seed_artists: artists.map((d) => d.id).join(","),
          }),
        att.ACCESS_TOKEN
      );

      const newRecs = await recommendations.tracks.map(function (d, index) {
        return {
          name: d.name,
          uri: d.uri,
          checked: false,
          index: index,
          id: d.id,
          artist: d.artists.map((_artist) => _artist.name).join(","),
          album: d.album.name,

        };
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
        att.ACCESS_TOKEN
      );

      const newRecs = await recommendations.tracks.map(function (d, index) {
        return {
          name: d.name,
          url: d.external_urls.preview_url,
          uri: d.uri,
          checked: false,
          index: index,
          id: d.id,
          artist: d.artists.map((_artist) => _artist.name).join(","),
          album: d.album.name,
        };
      });
      console.log(newRecs)
      att.setTrackRecommendations(newRecs);
    };

    // Run all async functions in parallel first. When they are done, set loading to false

    Promise.all([
      getProfile(),
      getTopArtists(),
      getSaved().then((d) => getAudioFeaturesNew(att, "saved", d)),
      getDevices(),
      getRecent().then((d) => getAudioFeaturesNew(att, "recent", d)),
      getTopTracksNew(att).then((d) => getAudioFeaturesNew(att, "top", d)),
      getRecTopArtists().then((d) => getRecommendations(d)),
      getRecTopTracks().then((d) => getTracksRecommendations(d)),
    ]).then(() => {
      att.setLoading(false);
      console.log(att);
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
      <div id="items">
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
              {pic && (
                <Image
                  src={att.profile.images[0].url}
                  onError={(event) => event.target.removeAttribute("src")}
                  alt="profile"
                  roundedCircle={true}
                ></Image>
              )}
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
      {/* <GetDevice /> */}
      </div>
    </>
  );
}

export default Home;
