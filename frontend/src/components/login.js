import React from 'react';
import { Button} from "react-bootstrap";
function Login() {
    return (
        <>
            <h1 style ={{'text-align':'center'}}>Spotify Dashboard</h1>
            <h2 style ={{'text-align':'center'}}>Get insights about your Spotify Usage </h2>
            <h4 style ={{'text-align':'center'}}>Using the Spotify API, we can generate recommendations based on your top songs/artists, add them to a playlist in Spotify and show insights of your Top Tracks, Artists and many more</h4>
            <h6 style ={{'text-align':'center'}}>To start, simply click on the button below to log in.</h6>
            <div class="col-md-12 text-center"><Button variant="primary" a href="/login">
            Login
          </Button></div>
            
        </>
    )
};

export default Login;
