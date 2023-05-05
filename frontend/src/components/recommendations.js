import React from 'react';
import {Nav} from "react-bootstrap";
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Context} from "../utils/context.js";

function Recommendations() {
    const att = useContext(Context) ;
    console.log(att.ACCESS_TOKEN) 
    return (
        <>


            <h2>Recommendations</h2>
            <h1>{att.ACCESS_TOKEN}</h1>
        </>
    )
};

export default Recommendations;