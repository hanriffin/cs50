import React, { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get, toggle } from "../utils/get.js";
import Player from "./player";
import { RefreshIcon, ToggleOverlayIcon } from "../utils/icon.js";
import "../index.css";

export default function GetDevice() {
  const att = useContext(Context);
  const [DeviceID, setDeviceID] = useState(""); // device id for player
  const [DeviceArr, setDeviceArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // if using function for onlick, function should be outside ueseffect()...
  const activateDevice = async (id) => {
    setDeviceID(id);
    toggle(
      "https://api.spotify.com/v1/me/player/play?" +
        queryString.stringify({
          device_id: id,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );
    console.log("play");
    setLoading(false);
  };

  const getAvailableDevices = async () => {
    const response = await get(
      "https://api.spotify.com/v1/me/player/devices",
      att.ACCESS_TOKEN
    );
    console.log(response);
    const devices = await response.devices.map((d) => {
      return { name: d.name, id: d.id, is_active: d.is_active };
    });

    // if at least one device is active, setDeviceID
    if (devices.some((d) => d.is_active === true)) {
      setDeviceID(devices.find((d) => d.is_active === true).id);
    } else {
      // provide list of devices for user to choose
      // then run activateDevice() on the selected device
      setDeviceArr(devices);
    }
  };

  useEffect(() => {
    getAvailableDevices().then(setLoading(false));
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      {/* if there's an active device (i.e. DeviceID is not empty), render <Player> component.
        Else, list all linked devices and get user to select one.*/}
      <ToggleOverlayIcon onClick={toggleOverlay} visible={visible} />
      {visible && (
        <div
          id="container"
          style={{
            position: "fixed",
            overflow: "hidden",
            bottom: "1vw",
            left: "1vw",
            right: "1vw",
            borderRadius: "12px",
            boxShadow: "-1px 6px 13px 7px #27374d",
            backgroundColor: att.colours[0][4],
            padding: "0 10px 10px 10px",
          }}
        >
          {(() => {
            if (DeviceID !== "") return <Player DeviceID={DeviceID} />;
            else if (DeviceArr.length !== 0) return <ActivateDevice />;
            else return <NoActiveDevices />;
          })()}
        </div>
        // <WebPlayback DeviceID={DeviceID} />
      )}
    </>
  );

  function ActivateDevice() {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <div>Getting device</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {DeviceArr.map((d) => (
              <button onClick={() => activateDevice(d.id)} key={d.name}>
                {d.name}
              </button>
            ))}
          </div>
          <div>
            Note: Once you select the device to activate, music will play.
          </div>
        </div>
      </>
    );
  }

  function NoActiveDevices() {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <RefreshIcon
            onClick={() => {
              getAvailableDevices().then(setLoading(false));
            }}
          />
          <div>
            No active devices are found. Please launch an instance of Spotify.
          </div>
        </div>
      </>
    );
  }
}
