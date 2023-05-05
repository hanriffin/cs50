import React from 'react';
import {Nav} from "react-bootstrap";
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Context} from "../utils/context.js";

function Recommendations() {
    const [ACCESS_TOKEN, setAccessToken] = useContext(Context) ;
    console.log(ACCESS_TOKEN)  
    return (
        <>
        <Nav
      activeKey="/home"
    >
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/analysis">Analysis</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/recommendations">Recommendations</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/charts" >
          Charts
        </Nav.Link>
      </Nav.Item>
    </Nav>

            <a href="/recommendations" >Recommendations</a>
            <h2>Recommendations</h2>
            <h1>{ACCESS_TOKEN}</h1>
        </>
    )
};

export default Recommendations;