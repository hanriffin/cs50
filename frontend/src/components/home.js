import React from 'react';
import { useState, useContext, useEffect } from "react";
import { Context } from '../utils/context.js';
import queryString from 'querystring';
import { get } from '../utils/get.js';  // function to send request to API 

function Home() {

    const ACCESS_TOKEN = useContext(Context);
    const [profile, setProfile] = useState({});         // profile is an obj hence {}
    const [TopArtists, setTopArtists] = useState([]);   // array
    const [TopTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [SavedTracks, setSavedTracks] = useState([]);
    const [usedDevices, setDevices] = useState([]);
    const [RecentTrack, setRecentTrack] = useState([]);
    const [avgAcoustic,setAvgAcoustic] = useState([]);
    const [avgAcousticness, setAvgAcousticness] = useState([]);
    const [avgDanceability, setAvgDanceability] = useState([]);
    const [avgEnergy, setAvgEnergy] = useState([]);
    const [avgInstrumental, setAvgInstrumental] = useState([]);
    const [avgLoudness, setAvgLoudness] = useState([]);
    const [avgTempo, setAvgTempo] = useState([]);
    const [avgValence, setAvgValence] = useState([]);
    const [maxAcousticness, setMaxAcousticness] = useState([]);
    const [maxDanceability, setMaxDanceability] = useState([]);
    const [maxEnergy, setMaxEnergy] = useState([]);
    const [maxInstrumental, setMaxInstrumental] = useState([]);
    const [maxLoudness, setMaxLoudness] = useState([]);
    const [maxTempo, setMaxTempo] = useState([]);
    const [maxValence, setMaxValence] = useState([]);
    const [minAcousticness, setMinAcousticness] = useState([]);
    const [minDanceability, setMinDanceability] = useState([]);
    const [minEnergy, setMinEnergy] = useState([]);
    const [minInstrumental, setMinInstrumental] = useState([]);
    const [minLoudness, setMinLoudness] = useState([]);
    const [minTempo, setMinTempo] = useState([]);
    const [minValence, setMinValence] = useState([]);
    const [recommendations,setRecommendations] = useState([]);
    const [RecArtist,setRecArtist] = useState([]);


    useEffect(() => {
        console.log(ACCESS_TOKEN);
        // Get profile data
        const getProfile = async () => {
            const profile = await get('https://api.spotify.com/v1/me', 'GET', ACCESS_TOKEN);
            
            setProfile(profile);
            // console.log(profile);
        };

        // Get top artists
        const getTopArtists = async () => {
            const response = await get('https://api.spotify.com/v1/me/top/artists?'

                , 'GET', ACCESS_TOKEN);
            const TopArtists = await response.items.map(function (d) { return { name: d.name, id: d.id, genres: d.genres, images: d.images[0].url, popularity: d.popularity} });
            setTopArtists(TopArtists);
            
            // console.log(TopArtists)
        };
        const getRecTopArtists = async() => {
            const response = await get('https://api.spotify.com/v1/me/top/artists?'

                , 'GET', ACCESS_TOKEN);
            const recTopArtists = await response.items.map(function (d) { return { name: d.name, id: d.id, genres: d.genres, images: d.images[0].url, popularity: d.popularity} }).slice(0,5);
            console.log(recTopArtists)

            return recTopArtists;
        }
        // Get top tracks
        const getTopTracks = async () => {
            const response = await get('https://api.spotify.com/v1/me/top/tracks?' +
                queryString.stringify({
                    limit: '50',
                    time_range: 'long_term'
                }), 'GET', ACCESS_TOKEN);
            const TopTracks = await response.items.map(function (d) { return { name: d.name, id: d.id, album: d.album.name, images: d.album.images[0].url, popularity: d.popularity } });
            // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
            return TopTracks;
            // getAudioFeatures(TopTracks);
        };
        
        // Get audio features of tracks
        const getAudioFeatures = async (tracks) => {
            const feat = await get('https://api.spotify.com/v1/audio-features?' +
                queryString.stringify({
                    ids: tracks.map(d => d.id).join(',')
                }), 'GET', ACCESS_TOKEN);
            const TopTracksFeat = await tracks.map((d, index) => {
                return { ...d, features: feat.audio_features[index] }
            })
            const avg_acousticness = TopTracksFeat.reduce((a,b) => a + b.features.acousticness,0)/TopTracksFeat.length 
            const avg_danceability = TopTracksFeat.reduce((a,b) => a + b.features.danceability,0)/TopTracksFeat.length
            const avg_energy = TopTracksFeat.reduce((a,b) => a + b.features.energy,0)/TopTracksFeat.length
            const avg_instrumentalness = TopTracksFeat.reduce((a,b) => a + b.features.instrumentalness,0)/TopTracksFeat.length
            const avg_loudness = TopTracksFeat.reduce((a,b) => a + b.features.loudness,0)/TopTracksFeat.length
            const avg_tempo = TopTracksFeat.reduce((a,b) => a + b.features.tempo,0)/TopTracksFeat.length
            const avg_valence = TopTracksFeat.reduce((a,b) => a + b.features.valence,0)/TopTracksFeat.length
            const max_acousticness = TopTracksFeat.reduce((prev, current) => (prev.features.acousticness > current.features.acousticness) ? prev : current).features.acousticness
            const max_danceability = TopTracksFeat.reduce((prev, current) => (prev.features.danceability > current.features.danceability) ? prev : current).features.danceability
            const max_energy = TopTracksFeat.reduce((prev, current) => (prev.features.energy > current.features.energy) ? prev : current).features.energy
            const max_instrumentalness = TopTracksFeat.reduce((prev, current) => (prev.features.instrumentalness > current.features.instrumentalness) ? prev : current).features.instrumentalness
            const max_loudness = TopTracksFeat.reduce((prev, current) => (prev.features.loudness > current.features.loudness) ? prev : current).features.loudness
            const max_tempo = TopTracksFeat.reduce((prev, current) => (prev.features.tempo > current.features.tempo) ? prev : current).features.tempo
            const max_valence = TopTracksFeat.reduce((prev, current) => (prev.features.valence > current.features.valence) ? prev : current).features.valence
            const min_acousticness = TopTracksFeat.reduce((prev, current) => (prev.features.acousticness < current.features.acousticness) ? prev : current).features.acousticness
            const min_danceability = TopTracksFeat.reduce((prev, current) => (prev.features.danceability < current.features.danceability) ? prev : current).features.danceability
            const min_energy = TopTracksFeat.reduce((prev, current) => (prev.features.energy < current.features.energy) ? prev : current).features.energy
            const min_instrumentalness = TopTracksFeat.reduce((prev, current) => (prev.features.instrumentalness < current.features.instrumentalness) ? prev : current).features.instrumentalness
            const min_loudness = TopTracksFeat.reduce((prev, current) => (prev.features.loudness < current.features.loudness) ? prev : current).features.loudness
            const min_tempo = TopTracksFeat.reduce((prev, current) => (prev.features.tempo < current.features.tempo) ? prev : current).features.tempo
            const min_valence = TopTracksFeat.reduce((prev, current) => (prev.features.valence < current.features.valence) ? prev : current).features.valence
            setTopTracks(TopTracksFeat);
            
            // console.log(TopTracksFeat[0].features.valence);

            console.log(TopTracksFeat);
            setAvgAcousticness(avg_acousticness);
            setAvgDanceability(avg_danceability);
            setAvgEnergy(avg_energy);
            setAvgInstrumental(avg_instrumentalness);
            setAvgLoudness(avg_loudness);
            setAvgTempo(avg_tempo);
            setAvgValence(avg_valence);
            setMaxAcousticness(max_acousticness);
            setMaxDanceability(max_danceability);
            setMaxEnergy(max_energy);
            setMaxInstrumental(max_instrumentalness);
            setMaxLoudness(max_loudness);
            setMaxTempo(max_tempo);
            setMaxValence(max_valence);
            setMinAcousticness(min_acousticness);
            setMinDanceability(min_danceability);
            setMinEnergy(min_energy);
            setMinInstrumental(min_instrumentalness);
            setMinLoudness(min_loudness);
            setMinTempo(min_tempo);
            setMinValence(min_valence);


        };
        const getSaved = async () => {
            const saved = await get('https://api.spotify.com/v1/me/tracks?'  +
            queryString.stringify({
                limit: '50'}), 'GET', ACCESS_TOKEN);
            const savedTracks = await saved.items.map(function (d) { return { name: d.track.name, disc: d.track.disc_number} });
            setSavedTracks(savedTracks);
            // console.log(TopArtists)
            console.log(savedTracks)
        }
        
        const getDevices = async () => {
            const devices = await get('https://api.spotify.com/v1/me/player/devices','GET',ACCESS_TOKEN)
            const usedDevices = await devices.devices.map(function(d) {return { id: d.id, active: d.is_active, volume: d.volume_percent, name: d.name, type: d.type}})
            setDevices(usedDevices)
            console.log(usedDevices)
        }
        
        const getRecent = async () => {
            const recent = await get('https://api.spotify.com/v1/me/player/recently-played?' +
            queryString.stringify({
                limit: '50'
            }),'GET',ACCESS_TOKEN)
            const recentTrack = await recent.items.map(function(d) {return {name: d.track.name}} )
            setRecentTrack(recentTrack)
        }
        const getRecommendations = async (artists) => {
            const recommendations = await get('https://api.spotify.com/v1/recommendations?' +
            queryString.stringify({
                limit:'100',
                seed_artists: artists.map(d => d.id).join(',')
            }),'GET',ACCESS_TOKEN)
            
            const newRecs = await recommendations.tracks.map(function(d) {return {name: d.name}})
            
            setRecommendations(newRecs)
            console.log(newRecs)
            
        }
        

        // Run all async functions in parallel first. When they are done, set loading to false
        Promise.all(
            [getProfile(),
            getTopArtists(),
            getSaved(),
            getDevices(),
            getRecent(),
            getRecommendations(),
            getTopTracks().then(d => getAudioFeatures(d)),
            getRecTopArtists().then(d => getRecommendations(d))
            ])
            .then(() => {
                setLoading(false);
                console.log('Done!');
            });

    }, []);
    
    
    

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            <div>Home</div>
            <div>{ACCESS_TOKEN}</div>
            <div>{ACCESS_TOKEN ? <div>Profile: {profile.display_name}</div> : 'null'}</div>
            <div>Your available devices</div>
            <ul>
                <li>Email: {profile.email}</li>
                <li>URLs: {profile.external_urls.spotify}</li>
                <li>Number of followers: {profile.followers.total}</li>
                <li>ID: {profile.id}</li>
                <li>Profile Picture: </li>
                
            </ul>
            <div>
            <img src ={profile.images.url} alt='profile'></img>
            </div>
            <ol>
                {usedDevices.map(d => (
                    <li key={d.id}>{d.id} Active: {String(d.active)} Name: {d.name} Type: {d.type} Volume: {d.volume}</li>
                ))}
            </ol>
            <div>Top Artists {JSON.stringify(TopArtists.name)}</div>

            <ol>
                {TopArtists.map(d => (
                    <li key={d.name}>{d.name} Genre: {d.genres[0]} Images:{d.images} Popularity:{d.popularity} </li>
                ))}
            </ol>
            <div>
                {TopTracks.map(d => (
                    <tr key={d.name}>{d.name} {d.features.valence} {d.images} Popularity: {d.popularity}</tr>
                ))}
                {TopTracks.map(d => (
                    <img src={d.images} alt={d.name}></img>
                ))}
            </div>
            <ol>
                {SavedTracks.map(d => (
                    <li key={d.name}>{d.name} {d.disc}</li>
                ))}
            </ol>
            <ol>
                {RecentTrack.map(d =>
                    <li key={d.name}>{d.name}</li>)}
            </ol>
            <div>
                <li>Average Acousticness: {avgAcousticness}</li>
                <li>{maxAcousticness}</li>
            </div>
            <div>
                {recommendations.map(d => (
                    <li key={d.name}>{d.name}</li>
                ))}
            </div>
           
        </>
    )
};

export default Home;
