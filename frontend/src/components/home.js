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

    const [AudioFeatSummary, setAudioFeatSummary] = useState({});

    const [recommendations,setRecommendations] = useState([]);
    const [RecArtist, setRecArtist] = useState([]);


    useEffect(() => {
        console.log(ACCESS_TOKEN);
        // Get profile data
        const getProfile = async () => {
            const profile = await get('https://api.spotify.com/v1/me', 'GET', ACCESS_TOKEN);
            
            setProfile(profile);
            console.log(profile);
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
            
            const maxFeat = (feat) => {
                return Math.max(...TopTracksFeat.map(o => o.features[feat]));
            }
            const minFeat = (feat) => {
                return Math.min(...TopTracksFeat.map(o => o.features[feat]));
            }
            const avgFeat = (feat) => {
                return TopTracksFeat.reduce((a, b) => a + b.features[feat], 0)/TopTracksFeat.length;
            }

            const featSummary = {
                acousticness: {avg: avgFeat('acousticness'), min: minFeat('acousticness'), max: maxFeat('acousticness')},
                danceability: {avg: avgFeat('danceability'), min: minFeat('danceability'), max: maxFeat('danceability')},
                energy: {avg: avgFeat('energy'), min: minFeat('energy'), max: maxFeat('energy')},
                instrumentalness: {avg: avgFeat('instrumentalness'), min: minFeat('instrumentalness'), max: maxFeat('instrumentalness')},
                loudness: {avg: avgFeat('loudness'), min: minFeat('loudness'), max: maxFeat('loudness')},
                tempo: {avg: avgFeat('tempo'), min: minFeat('tempo'), max: maxFeat('tempo')},
                valence: {avg: avgFeat('valence'), min: minFeat('valence'), max: maxFeat('valence')}
            }
            setAudioFeatSummary(featSummary);
            console.log(AudioFeatSummary);

            setTopTracks(TopTracksFeat);
            

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

            <ol><p>Top Artists</p>
                {TopArtists.map(d => (
                    <li key={d.name}>{d.name} Genre: {d.genres[0]} Images:{d.images} Popularity:{d.popularity} </li>
                ))}
            </ol>
            <div><p>Top Tracks</p>
                {TopTracks.map(d => (
                    <tr key={d.name}>{d.name} {d.features.valence} {d.images} Popularity: {d.popularity}</tr>
                ))}
                {TopTracks.map(d => (
                    <img src={d.images} alt={d.name}></img>
                ))}
            </div>
            <ol><p>Saved Tracks</p>
                {SavedTracks.map(d => (
                    <li key={d.name}>{d.name} {d.disc}</li>
                ))}
            </ol>
            <ol><p>Recent Tracks</p>
                {RecentTrack.map(d =>
                    <li key={d.name}>{d.name}</li>)}
            </ol>
            <div>
                <li>Average Acousticness: {AudioFeatSummary.acousticness.avg}</li>
                <li>{AudioFeatSummary.acousticness.max}</li>
            </div>
            <div>
                {recommendations.map(d => (
                    <li key={d.name}>{d.name}</li>
                ))}
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
