import React from 'react';
import {Nav} from "react-bootstrap";

function Analysis() {
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
            <a href="/analysis" >Analysis</a>
            <h2>Analysis</h2>
        </>
    )
};

export default Analysis;
