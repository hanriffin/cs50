import { Navbar, Container, Nav } from "react-bootstrap";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../utils/context.js";
import {
  Outlet,
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import Toggle from "react-toggle";
import "../slider_toggle.css";

function NavbarHeader() {
  const att = useContext(Context); // usecontext to get shared stuff

  // const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // set initial value of color preference. if its light then it'll return false
  // const [isDark, setIsDark] = useState(colorMode);
  // toggles between dark mode and light mode
  const DarkModeToggle = () => {
    // sets mode to dark or light depending on your preference
    if (att.isDark === true) {
      att.setIsDark(true);
    } else {
      att.setIsDark(false);
    }
    // to change colour palette just change these values, top is light mode
    if (att.isDark === false) {
      document.documentElement.style.setProperty("--1", "#F6F1F1"); // background
      document.documentElement.style.setProperty("--2", "#AFD3E2"); // button
      document.documentElement.style.setProperty("--3", "#19A7CE"); // tabs
      document.documentElement.style.setProperty("--4", "#146C94"); // text
      document.documentElement.style.setProperty("--5", "white");
      document.documentElement.style.setProperty("--6", "black");
      document.documentElement.style.setProperty("--7", "red"); // play button
    } else {
      document.documentElement.style.setProperty("--1", "#27374D"); // background
      document.documentElement.style.setProperty("--2", "#526D82"); // button
      document.documentElement.style.setProperty("--3", "#9DB2BF"); // tabs
      document.documentElement.style.setProperty("--4", "#DDE6ED");
      document.documentElement.style.setProperty("--5", "white");
      document.documentElement.style.setProperty("--6", "black");
      document.documentElement.style.setProperty("--7", "red"); // play button
    }

    // 🔆
    return (
      <Toggle
        checked={att.isDark}
        onChange={({ target }) => att.setIsDark(target.checked)}
        icons={{ checked: "🌙", unchecked: "☀️" }}
        aria-label="Dark mode toggle"
      />
    );
  };

  return (
    <div id="nav-bar">
      <Navbar className="color-nav">
        <Container>
          <Navbar.Brand href="/"></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/home">
                {" "}
                {/* need to have as={Link} or it doesnt work */}
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/top">
                Top
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/analysis">
                Analysis
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/charts">
                Charts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/recommendations">
                Recommendations
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <DarkModeToggle />
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default NavbarHeader;
