import queryString from "querystring";
import { get } from "./get.js"; // function to send request to API
import { useState, useContext, useEffect } from "react";

export const getTopTracksNew = async (att) => {
//   const att = useContext(Context);
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
      url: d.external_urls.spotify,
      artist: d.artists.map((_artist) => _artist.name).join(","),
    };
  });
  // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
  return TopTracks;
};

export const getAudioFeaturesNew = async (att, type, tracks) => {
  const res = await get(
    "https://api.spotify.com/v1/audio-features?" +
      queryString.stringify({
        ids: tracks.map((d) => d.id).join(","),
      }),
    att.ACCESS_TOKEN
  );
  const trackFeat = await tracks.map((d, index) => {
    return { ...d, features: res.audio_features[index] };
  });
  // console.log(trackFeat)
  const trackFeatAll = await trackFeat.map((d, index) => {
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
  // console.log(trackFeatAll)

  const trackFeatTempo = await trackFeat.map((d, index) => {
    return { name: d.name, tempo: d.features.tempo, index: index };
  });

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

  // Calculate summary statistics
  const calculateFeat = (data, feat) => {
    const max = round(Math.max(...data.map((o) => o.features[feat])));
    const min = round(Math.min(...data.map((o) => o.features[feat])));
    const avg = round(
      data.reduce((a, b) => a + b.features[feat], 0) / data.length
    );
    return { max, min, avg };
  };
  const features = [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "loudness",
    "tempo",
    "valence",
  ];

  const featSummary = [
    {
      // create properties for each feature dynamically
      ...features.reduce(
        (acc, feat) => ({ ...acc, [feat]: calculateFeat(trackFeat, feat) }),
        {}
      ),
    },
  ];

  // console.log(trackFeatAll);
  if (type === "top") {
    att.settoptracksdata(trackFeatAll);
    att.settoptrackstempodata(trackFeatTempo);
    att.setAudioFeatSummary(featSummary);
    att.setTopTracks(trackFeat);
  } else if (type === "recent") {
    att.setrecenttracksdata(trackFeatAll);
    att.setrecenttrackstempodata(trackFeatTempo);
    att.setAudioFeatRecentSummary(featSummary);
  } else if (type === "saved") {
    att.setsavedtracksdata(trackFeatAll);
    att.setsavedtrackstempodata(trackFeatTempo);
    att.setAudioFeatSavedSummary(featSummary);
  }
};
