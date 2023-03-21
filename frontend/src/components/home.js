import React from 'react';
import { useState, useContext, useEffect } from "react";
import { Context } from '../utils/context.js';
// import { get } from '../utils/extractdata.js';

function Home() {

    const ACCESS_TOKEN = useContext(Context);
    const [profile, setProfile] = useState({});
    const [TopArtists, setTopArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Get profile data
        const getProfile = async () => {
            const response = await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            })
            const profile = await response.json();
            console.log(profile);
            setProfile(profile);
            setLoading(false);
        };

        // Get top artists
        const getTopArtists = async () => {
            const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            })
            const arr = await response.json()
            const TopArtists = await arr.items.map(function (d) { return { name: d.name, id: d.id, genres: d.genres } });
            setTopArtists(TopArtists);
            setLoading(false);

            console.log(arr);
            console.log(TopArtists)
        };
        getProfile();
        getTopArtists();
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
            <div>Top Artists {JSON.stringify(TopArtists.name)}</div>
            <ol>
                {TopArtists.map(d => (
                    <li key={d.name}>{d.name} Genre: {d.genres[0]} </li>
                ))}
            </ol>
        </>
    )
};

export default Home;
