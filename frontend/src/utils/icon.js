import {
  MdFavorite,
  MdFavoriteBorder,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdArrowDropDownCircle,
  MdPlayCircleFilled,
  MdRepeat,
  MdRepeatOne,
  MdShuffle,
} from "react-icons/md";
// import React, { useState, useContext, useEffect } from "react";

const iconSize = 24;

// universal list of colours so that its easier to change
const colours = [
  {
    1: "#27374D",
    2: "#526D82",
    3: "#9DB2BF",
    4: "#DDE6ED",
    5: "white",
    6: "black",
    7: "red",
    8: "grey",
  },
];

export const HeartIcon = ({ is_saved, onClick }) => {
  const Icon = is_saved ? MdFavorite : MdFavoriteBorder;
  const iconColor = is_saved ? colours[0][7] : colours[0][6];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize - 5,
          width: iconSize - 5,
        }}
      />
    </div>
  );
};

export const PlayPauseIcon = ({ is_paused, onClick }) => {
  const Icon = is_paused ? MdPlayArrow : MdPause;
  const iconColor = colours[0][6];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize + 7,
          width: iconSize + 7,
        }}
      />
    </div>
  );
};

export const NextIcon = ({ onClick }) => {
  const Icon = MdSkipNext;
  const iconColor = colours[0][6];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize,
          width: iconSize,
        }}
      />
    </div>
  );
};

export const PrevIcon = ({ onClick }) => {
  const Icon = MdSkipPrevious;
  const iconColor = colours[0][6];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize,
          width: iconSize,
        }}
      />
    </div>
  );
};

export const ToggleOverlayIcon = ({ visible, onClick }) => {
  const Icon = MdArrowDropDownCircle;
  const rotation = visible ? "rotate(180deg)" : "";
  const iconColor = colours[0][8];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize,
          width: iconSize,
          transform: rotation,
        }}
      />
    </div>
  );
};

export const PlaySongIcon = ({ onClick }) => {
  const Icon = MdPlayCircleFilled;
  const iconColor = colours[0][7];

  return (
    <Icon
      onClick={onClick}
      style={{
        fill: iconColor,
        cursor: "pointer",
        height: iconSize,
        width: iconSize,
      }}
    />
  );
};

export const RepeatSongIcon = ({ is_repeat, onClick }) => {
  if (is_repeat === "context") {
    const Icon = MdRepeat;
    const iconColor = colours[0][1];
    return (
      <div>
        <Icon
          onClick={onClick}
          style={{
            fill: iconColor,
            cursor: "pointer",
            height: iconSize,
            width: iconSize,
          }}
        />
      </div>
    );
  } else if (is_repeat === "track") {
    const Icon = MdRepeatOne;
    const iconColor = colours[0][1];

    return (
      <div>
        <Icon
          onClick={onClick}
          style={{
            fill: iconColor,
            cursor: "pointer",
            height: iconSize,
            width: iconSize,
          }}
        />
      </div>
    );
  } else if (is_repeat === "off") {
    const Icon = MdRepeat;
    const iconColor = colours[0][2];
    return (
      <div>
        <Icon
          onClick={onClick}
          style={{
            fill: iconColor,
            cursor: "pointer",
            height: iconSize,
            width: iconSize,
          }}
        />
      </div>
    );
  }
};

export const ShuffleSongIcon = ({ is_shuffle, onClick }) => {
  const Icon = MdShuffle;
  const iconColor = is_shuffle ? colours[0][2] : colours[0][1];
  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize,
          width: iconSize,
        }}
      />
    </div>
  );
};
