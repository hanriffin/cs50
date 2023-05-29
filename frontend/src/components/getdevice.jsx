import React, { useState, useContext, useEffect } from "react";
import { Context } from "../utils/context.js";
import queryString from "querystring";
import { get } from "../utils/get.js";
import Player from "./player";

export default function GetDevice() {
  const att = useContext(Context);
  const [DeviceArr, setDeviceArr] = useState([
    {
      name: "",
      id: "",
      is_active: false,
    },
  ]);
  const [loading, setLoading] = useState(true);

  // if using function for onlick, function should be outside ueseffect()...
  const activateDevice = async (id) => {
    att.setDeviceID(id);
    get(
      "https://api.spotify.com/v1/me/player/play?" +
        queryString.stringify({
          device_id: id,
        }),
      "PUT",
      att.ACCESS_TOKEN
    );
  };

  useEffect(() => {
    const getAvailableDevices = async () => {
      const response = await get(
        "https://api.spotify.com/v1/me/player/devices",
        "GET",
        att.ACCESS_TOKEN
      );
      const devices = await response.devices.map((d) => {
        return { name: d.name, id: d.id, is_active: d.is_active };
      });

      // if at least one device is active, setDeviceID
      if (devices.some((d) => d.is_active === true)) {
        att.setDeviceID(devices.find((d) => d.is_active === true).id);
      } else {
        // provide list of devices for user to choose
        // then run activateDevice() on the selected device
        setDeviceArr(devices);
      }
    };

    getAvailableDevices().then(setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* if there's an active device (i.e. DeviceID is not empty), render <Player> component.
        Else, list all linked devices and get user to select one.*/}
      {att.DeviceID === "" ? (
        <>
          <div>Getting device</div>
          <div>
            {DeviceArr.map((d) => (
              <button onClick={() => activateDevice(d.id)} key={d.name}>
                {d.name}
              </button>
            ))}
            <p>
              Note: Once you select the device to activate, music will play.
            </p>
          </div>
        </>
      ) : (
        <Player DeviceID={att.DeviceID} />
      )}
      {/* <WebPlayback DeviceID={DeviceID} /> */}
    </>
  );
}
