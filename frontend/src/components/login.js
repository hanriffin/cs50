import React from "react";
import { Button } from "react-bootstrap";
function Login() {
  return (
    <>
      <div id="items">
        <h1 style={{ textAlign: "center" }}>Spotify Dashboard</h1>
        <h2 style={{ textAlign: "center" }}>
          Get insights about your Spotify Usage
        </h2>
        <h4 style={{ textAlign: "center" }}>
          Using the Spotify API, we can generate recommendations based on your
          top tracks/artists, add them to a playlist in Spotify and show
          insights of your Top Tracks, Artists and many more
        </h4>
        <h6 style={{ textAlign: "center" }}>
          To start, simply click on the button below to log in.
        </h6>
        <div className="col-md-12 text-center">
          <Button variant="primary" href="/login">
            Login
          </Button>
        </div>
      </div>
    </>
  );
}

export default Login;
