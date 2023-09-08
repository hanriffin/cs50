import React from "react";
import { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Button,
  Row,
  Card,
  ListGroup,
  Tab,
  Col,
  Nav,
  Tabs,
  Form,
  Alert,
} from "react-bootstrap";
import "../index.css";
import { get } from "../utils/get.js";

function Top() {
  const [tab, settab] = useState("topartists");
  const att = useContext(Context);
  const [range, setRange] = useState();
  const [showalert, setshowalert] = useState(false); // show alert when inputbox is not within 1 to 50
  const [errorint, seterrorint] = useState(""); // error when inputbox is not within 1 to 50

  const handleint = (event) => {
    event.preventDefault();
    setRange(range);
    let error = "";

    if (event.target.value > 50 || event.target.value < 1) {
      error = `Integer must be between 1 and 50`;
      seterrorint([error]);

      setshowalert(true);
    } else {
      setRange(event.target.value);
      seterrorint("");
      setshowalert(false);
    }
  };

  function closeerror() {
    setTimeout(() => setshowalert(false), 3000);
  }

  const getTopArtists = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/top/artists?" +
        queryString.stringify({
          limit: "50",
          time_range: att.term,
        }),
      att.ACCESS_TOKEN
    );

    const TopArtists = await response.items.map(function (d) {
      return {
        name: d.name,
        id: d.id,
        genres: d.genres,
        images: d.images[0].url,
        popularity: d.popularity,
        followers: d.followers.total,
        url: d.external_urls.spotify,
      };
    });
    att.settopartistsog(TopArtists);
    att.settopartistsslice(TopArtists);
    att.setTopArtists(TopArtists);
  };

  const getTopTracks = async () => {
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
        artist: d.artists.map((_artist) => _artist.name).join(", "),
      };
    });
    att.settoptracksog(TopTracks);
    att.settoptracksslice(TopTracks);

    // Note: Do not run setState twice (i.e. once here and once in getAudioFeatures)
    return TopTracks;

    // getAudioFeatures(TopTracks);
  };

  const submitEvent = (event) => {
    let checked = event;

    if (checked) {
      if (tab === "topartists") {
        att.settopartistsslice(att.topartistsog.slice(0, range));
      } else if (tab === "toptracks") {
        att.settoptracksslice(att.toptracksog.slice(0, range));
      }
    }
    event.preventDefault();
  };
  useEffect(() => {
    getTopTracks();
    getTopArtists();
    console.log(att.SavedTracks);
  }, [att.term]);

  return (
    <>
      <div id="items">
        {/* <div id="gap"></div> */}
        <h2>Your Top Items</h2>
        <div>
          <p>
            Your top tracks and artists in the specified term duration are shown below. 
            You can select whether to shown your top artists or top tracks by
            selecting on the tabs
          </p>
          <p>
            You can also specify the duration term and input the number of items
            (1-50) that you want to show.
          </p>
          <ul >
            <li >Short Term: Approximately last 4 weeks</li>
            <li>Medium Term: Approximately last 6 months</li>
            <li>
              Long Term: Calculated from several years of data and including all
              new data as it becomes available
            </li>
          </ul>
        </div>
        <div id="gap"></div>
        <div>
          <form onSubmit={submitEvent} className="d-flex align-items-end">
            <Alert
              show={showalert}
              id="erroralert1"
              close={closeerror()}
              style={{
                backgroundColor: att.colours[0][3],
                borderColor: att.colours[0][3],
                color: att.colours[0][6],
              }}
            >
              {errorint}
            </Alert>
            <div id="topform">
              <label htmlFor="form">Term</label>

              <Form.Select
                onChange={(e) => att.setTerm(e.target.value)}
                size="sm"
                className="inputbox"
                value={att.term}
                id="form"
              >
                <option value="short_term">Short Term</option>
                <option value="medium_term">Medium Term</option>
                <option value="long_term">Long Term</option>
              </Form.Select>
            </div>

            <div id="topform">
              <label htmlFor="form">Number of items</label>
              <input
                id="boxform"
                type="number"
                value={range}
                defaultValue={"50"}
                onChange={(e) => handleint(e)}
              ></input>
            </div>
            <div id="topform">
              <Button               className = "button"
variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
        {/* <div>
        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey="topartists"
          onSelect={(key) => settab(key)}
        >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="topartists">Top Artists</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="toptracks">Top Tracks</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="topartists" title="Top Artists">
              <Container>
                <Row className="mx-2 row row-cols-5">
                  {att.topartistsslice.map((d) => {
                    return (
                      <Card className="mb-2" key={d.id}>
                        <Card.Img src={d.images} />
                        <Card.Body>
                          <Card.Title className="text-center">
                            {d.name}
                          </Card.Title>
                          <Card.Text style={{ color: att.colours[0][6] }}>
                            Genre: {d.genres.join(",")}
                          </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush text-left">
                          <ListGroup.Item>
                            Artist's URL:{" "}
                            <a href={d.url} target="_blank" rel="noreferrer">
                              Link
                            </a>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    );
                  })}
                </Row>
              </Container>
            </Tab.Pane>
            <Tab.Pane eventKey="toptracks" title="Top Tracks">
              <Container>
                <Row className="mx-2 row row-cols-5">
                  {att.toptracksslice.map((d) => {
                    return (
                      <Card className="mb-2" key={d.id}>
                        <Card.Img src={d.images} />
                        <Card.Body>
                          <Card.Title>{d.name}</Card.Title>
                          <Card.Text style={{ color: att.colours[0][6] }}>
                            Album: {d.album}
                          </Card.Text>
                        </Card.Body>

                        <ListGroup className="list-group-flush text-left">
                          <ListGroup.Item>
                            Song URL:{" "}
                            <a href={d.url} target="_blank" rel="noreferrer">
                              Link
                            </a>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    );
                  })}
                </Row>
              </Container>
            </Tab.Pane>
          </Tab.Content>
          </Col>
          </Row>
        </Tab.Container>
      </div> */}
        <div id="gap"></div>
        {/* {att.topartistsslice.map((d) => { return (
        <><img src={d.images} alt={d.id} style={{ borderRadius: "50%"}}/></>);})} */}
        <div>
          <Tabs
            defaultActiveKey="topartists"
            id="lasttop50tracks"
            className="mb-2 justify-content-center"
          >
            <Tab eventKey="topartists" title="Top Artists">
              <Container>
                <Row className="mx-2 row row-cols-5">
                  {att.topartistsslice.map((d) => {
                    return (
                      <Card
                        className="mb-2 mx-auto"
                        key={d.id}
                        style={{
                          background: "transparent",
                          border: "transparent",
                          paddingTop: "20px",
                        }}
                      >
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ margin: "auto" }}
                        >
                          <Card.Img
                            id="imglink"
                            src={d.images}
                            style={{
                              borderRadius: "50%",
                              width: "12vw",
                              height: "12vw",
                              objectFit: "cover",
                            }}
                          />
                        </a>
                        <Card.Body>
                          <Card.Title
                            style={{ color: att.colours[0][4] }}
                            className="text-center"
                          >
                            <a
                              href={d.url}
                              className="top"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {d.name}
                            </a>
                          </Card.Title>
                          <Card.Text
                            style={{
                              color: att.colours[0][2],
                              textAlign: "center",
                              fontVariant: "small-caps",
                            }}
                          >
                            {d.genres.join(" | ")}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="top50tracks" title="Top Tracks">
              <Container>
                <Row className="mx-2 row row-cols-5">
                  {att.toptracksslice.map((d) => {
                    return (
                      <Card
                        className="mb-2 mx-auto"
                        key={d.id}
                        style={{
                          width: "15vw",
                          background: "transparent",
                          border: "transparent",
                          paddingTop: "20px",
                        }}
                      >
                        <Card.Img src={d.images} />
                        <Card.Body>
                          <Card.Title style={{ color: att.colours[0][4] }}>
                            <a
                              href={d.url}
                              className="top"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {d.name}
                            </a>
                          </Card.Title>
                          <Card.Text style={{ color: att.colours[0][2] }}>
                            Album: {d.album}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </Row>
              </Container>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Top;
