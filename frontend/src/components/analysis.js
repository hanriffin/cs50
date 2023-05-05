import React from 'react';
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Context} from "../utils/context.js";
import {Nav, Tabs,Tab,Table,Modal,Form,Alert} from "react-bootstrap";

function Analysis() {
  const att = useContext(Context)
    return (
        <>
            <h2>Analysis</h2>
            <div>
        <Tabs
          defaultActiveKey="savedtracks"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="savedtracks" title="Last 50 Saved Tracks">
          <h2>Analysis of your Top 50 Tracks</h2>

<Table>
  <thead>
    <tr></tr>
    <th></th>
    <th>Min</th>
    <th>Max</th>
    <th>Average</th>
  </thead>
  <tbody>
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Acousticness</td>
          <td>{d.acousticness.min}</td>
          <td>{d.acousticness.max}</td>
          <td>{d.acousticness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Danceability</td>
          <td>{d.danceability.min}</td>
          <td>{d.danceability.max}</td>
          <td>{d.danceability.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Energy</td>
          <td>{d.energy.min}</td>
          <td>{d.energy.max}</td>
          <td>{d.energy.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Loudness</td>
          <td>{d.loudness.min}</td>
          <td>{d.loudness.max}</td>
          <td>{d.loudness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Tempo</td>
          <td>{d.tempo.min}</td>
          <td>{d.tempo.max}</td>
          <td>{d.tempo.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Valence</td>
          <td>{d.valence.min}</td>
          <td>{d.valence.max}</td>
          <td>{d.valence.avg}</td>
        </tr>
      );
    })}
  </tbody>
</Table>

          </Tab>
          <Tab eventKey="tracksplayed" title="Last 50 Tracks Played">
          <h2>Analysis of your Recent Saved 50 Tracks</h2>

<Table>
  <thead>
    <tr></tr>
    <th></th>
    <th>Min</th>
    <th>Max</th>
    <th>Average</th>
  </thead>
  <tbody>
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Acousticness</td>
          <td>{d.acousticness.min}</td>
          <td>{d.acousticness.max}</td>
          <td>{d.acousticness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Danceability</td>
          <td>{d.danceability.min}</td>
          <td>{d.danceability.max}</td>
          <td>{d.danceability.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Energy</td>
          <td>{d.energy.min}</td>
          <td>{d.energy.max}</td>
          <td>{d.energy.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Loudness</td>
          <td>{d.loudness.min}</td>
          <td>{d.loudness.max}</td>
          <td>{d.loudness.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Tempo</td>
          <td>{d.tempo.min}</td>
          <td>{d.tempo.max}</td>
          <td>{d.tempo.avg}</td>
        </tr>
      );
    })}
    {att.AudioFeatSavedSummary.map((d, i) => {
      return (
        <tr key={i}>
          <td>Valence</td>
          <td>{d.valence.min}</td>
          <td>{d.valence.max}</td>
          <td>{d.valence.avg}</td>
        </tr>
      );
    })}
  </tbody>
</Table>
          </Tab>
        </Tabs>

        
      </div>
        </>
    )
};

export default Analysis;
