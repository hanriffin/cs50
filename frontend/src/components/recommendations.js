import React from 'react';
import {Nav, Tabs,Tab,Button,Modal,Form,Alert} from "react-bootstrap";
import { useState, useContext, useEffect, Route, Routes } from "react";
import {Context} from "../utils/context.js";
import { get, post } from "../utils/get.js";

function Recommendations() {
    const att = useContext(Context) ;
    console.log(att.ACCESS_TOKEN) 
    const cb = (uri) => {

    
      console.log(uri)
      const check = att.recommendations.map((id) => {
        if (id.uri === uri) {
          console.log(!id.checked)
          return {...id, checked: !id.checked}
          
        }
        return id
      })
      att.setRecommendations(check)
  
      console.log(check)
      //setTrackRecommendations()
    };
    const createPlaylist = async (newArray) => {
      const newPlaylist = att.recCounter + 1;
      const cp = await post(
        "https://api.spotify.com/v1/users/" + att.profileid + "/playlists",
  
        "POST",
        att.ACCESS_TOKEN,
        JSON.stringify({
          name: att.playlistTitle,
          description: "New playlist",
        })
      );
      
      const addsongs = await post(
        "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
        "POST",
        att.ACCESS_TOKEN,
        JSON.stringify({ uris: newArray })
      );
      att.setRecCounter(newPlaylist);
      console.log(cp.id);
      att.setcpsucc(false)
      att.setshowclose(true)
    };
    
  
    const createPlaylist2 = async (newArray) => {
      const newPlaylist = att.recCounter + 1;
      const cp = await post(
        "https://api.spotify.com/v1/users/" + att.profileid + "/playlists",
  
        "POST",
        att.ACCESS_TOKEN,
        JSON.stringify({
          name: "Recommendation Playlist #" + newPlaylist,
          description: "New playlist",
        })
      );
      
      const addsongs = await post(
        "https://api.spotify.com/v1/playlists/" + cp.id + "/tracks",
        "POST",
        att.ACCESS_TOKEN,
        JSON.stringify({ uris: newArray })
      );
      att.setRecCounter(newPlaylist);
      console.log(JSON.stringify({ uris: att.recURI1 }))
      console.log(cp.id);
    };
    const cb1 = (uri) => {
  
      
      console.log(uri)
      const check = att.trackRecommendations.map((id) => {
        if (id.uri === uri) {
          console.log(!id.checked)
          return {...id, checked: !id.checked}
          
        }
        return id
      })
      att.setTrackRecommendations(check)
  
      console.log(check)
      //setTrackRecommendations()
    };
    const cp = (event) => {
      event.preventDefault();
      const newArray = [];
      if (att.currentTab === "artistrecs") {
        
        
        for (let i= 0; i < att.recommendations.length; i++) {
          if (att.recommendations[i].checked === true)
          newArray.push(att.recommendations[i].uri)
        }
      } else if (att.currentTab === "trackrecs") {
        for (let i= 0; i < att.trackRecommendations.length; i++) {
          if (att.trackRecommendations[i].checked === true)
          newArray.push(att.trackRecommendations[i].uri)
        }
      }
      
      console.log(newArray)
      
      createPlaylist(newArray);
      att.setcpsucc(true);
  
    };
  
  
    const cp2 = (event) => {
      event.preventDefault();
  
        const newArray = [];
        
        
      console.log(newArray)
      att.setRecURI1(newArray);
      
      createPlaylist2(newArray);
      att.setcpsucc(true);
      att.setRecURI1([])
    };
    function close() {
      setTimeout(() => att.setshowclose(false),3000)
    }
    const checkall = (event) => {
      if (att.currentTab === "trackrecs") {
        att.setTrackRecommendations(att.trackRecommendations.map(({name,uri,url}) => ({name,url,uri, checked:true}))
        
      ) }else if (att.currentTab === "artistrecs") {
        att.setRecommendations(att.recommendations.map(({name,uri}) => ({name,uri, checked:true})))
        console.log("hi!")
        }
        console.log(att.currentTab)
      
      
    }
  
    const uncheckall = (event) => {
      if (att.currentTab === "trackrecs") {
        att.setTrackRecommendations(att.trackRecommendations.map(({name,uri,url}) => ({name,url,uri, checked:false}))
        
      ) }else if (att.currentTab === "artistrecs") {
        att.setRecommendations(att.recommendations.map(({name,uri}) => ({name,uri, checked:false})))
        console.log("hi!")
        }
      
    }
    const handleint = (event) => {
      const name = event.target.name;
      let error = "";
      if (event.target.value > 100 || event.target.value < 1) {
        error = `${name} field must be between 1 and 100`;
        att.seterrorint([error]);
        console.log(att.errorint);
        att.setshowalert(true);
      } else {
        att.setRecrange(event.target.value);
        att.seterrorint("");
        att.setshowalert(false);
      }
    };

  
    const submitEvent1 = (event) => {
      event.preventDefault();
      att.setRecForms({ ...att.recforms, [event.target.name]: event.target.value });
      console.log("hi")
    };
    return (
        <>


            <h2>Recommendations</h2>
            <h1>{att.ACCESS_TOKEN}</h1>
            <div>
            <form onSubmit={submitEvent1} >
          <input
            type="number"
            value={att.recrange}
            max={100}
            min={1}
            name="rec"
            onChange={(e) => handleint(e)}
          ></input>

          <Button variant="primary" type="submit" >
            Submit
          </Button>
          <Alert show={att.showalert}>{att.errorint}</Alert>
        </form>
            <div id="buttonalignright">
          <Button   variant="primary" type="submit" onClick={checkall}>
            Select All
          </Button>
          <Button  variant="primary" type="submit" onClick={uncheckall}>
            Unselect All
          </Button>
      </div>
        <Tabs
          defaultActiveKey="artistrecs"
          id="fill-tab-example"
          className="mb-3"
          fill
          activeKey={att.currentTab}
          onSelect={(key) => att.setCurrentTab(key)}
        >
          <Tab
            eventKey="artistrecs"
            title="Recommendations based on Top Artists"
          >
            <ol>
              {att.recommendations.map((d) => [
                <React.Fragment>
                  <div>
                    <li key={d.name}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onClick={() => cb(d.uri)}
                        checked={d.checked}
                      />
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => att.setcpsucc(true)}>Create Playlist</Button>
            </div>
            <Modal 
        show={att.cpsucc} 
        onHide={() => att.setcpsucc(false)}
      >
      <Modal.Header closeButton>
        <Modal.Title>Modal Form Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form.Group >
              <Form.Label>Name: </Form.Label>
              <Form.Control type="text" onChange={(e) => att.setPlaylistTitle(e.target.value)}  placeholder="name input"/>           
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="primary" type="submit" onClick={cp}>
              Submit
          </Button>
      </Modal.Footer>
    </Modal>
    <Modal 
        show={att.showclose} 
        onHide={close()}
      >
      <Modal.Header closeButton>
        <Modal.Title>Modal Form Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
              <p>Playlist created successfully</p>
      </Modal.Body>
    </Modal>
            
          </Tab>
          <Tab eventKey="trackrecs" title="Recommendations based on Top Tracks">
            <ol>
              {att.trackRecommendations.map((d) => [
                <React.Fragment>
                  <div>
                    <li key={d.name}>
                      {d.name}
                      <input
                        type="checkbox"
                        id={d.name}
                        value={d.uri}
                        onClick={() => cb1(d.uri)}
                        checked={d.checked}
                      />
                    </li>
                  </div>
                </React.Fragment>,
              ])}
            </ol>
            <div>
              <Button onClick={() => att.setcpsucc(true)}>Create Playlist</Button>
            </div>
          </Tab>
        </Tabs>
      </div>
        </>
    )
};

export default Recommendations;