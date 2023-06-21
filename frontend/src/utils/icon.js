import {
  MdFavorite,
  MdFavoriteBorder,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdOutlineArrowDropDownCircle,
  MdPlayCircleFilled,
  MdRepeat,
  MdRepeatOne,
  MdShuffle,
  MdVolumeUp,
  MdVolumeOff,
  MdOutlineRefresh,
} from "react-icons/md";
import "../index.css";

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

export const MuteIcon = ({ is_mute, onClick }) => {
  if (is_mute === false) {
    const Icon = MdVolumeUp;
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
  } else if (is_mute === true) {
    const Icon = MdVolumeOff;
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
  }
};

export const RefreshRecoIcon = ({  onClick }) => {
  const Icon = MdOutlineRefresh;
  // const iconColor = colours[0][4];

  return (
    <span>
      <Icon
        className="refreshreco"
        onClick={onClick}
        style={{
          cursor: "pointer",
          height: iconSize - 4,
          width: iconSize - 4,
          margin: "0 0 4px 4px",
        }}
      />
    </span>
  );
};

export const RefreshIcon = ({ onClick }) => {
  const Icon = MdOutlineRefresh;
  const iconColor = colours[0][6];

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
  const Icon = MdOutlineArrowDropDownCircle;
  const rotation = visible ? "" : "rotate(180deg)";
  // const iconColor = colours[0][4];
  const bottom = visible ? "120px" : "1vw";   // 120px because the player height is fixed!
  
  return (
    <div
      className= "toggleoverlay"
      style={{
        position: "fixed",
        overflow: "hidden",
        bottom: bottom,
        // left: "1vw",
        right: "1vw",
        borderRadius: "12px",
        // boxShadow: "-1px 6px 13px 7px #27374d",
        // backgroundColor: colours[0][1],
        // padding: "0 10px 10px 10px",
      }}
    >
      <Icon
        onClick={onClick}
        style={{
          // fill: iconColor,
          cursor: "pointer",
          height: iconSize + 1,
          width: iconSize + 1,
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
  const repeat_state = {
    context: {
      Icon: MdRepeat,
      iconColor: colours[0][1],
    },
    track: {
      Icon: MdRepeatOne,
      iconColor: colours[0][1],
    },
    off: {
      Icon: MdRepeat,
      iconColor: colours[0][2],
    },
  };

  const { Icon, iconColor } = repeat_state[is_repeat];

  return (
    <div>
      <Icon
        onClick={onClick}
        style={{
          fill: iconColor,
          cursor: "pointer",
          height: iconSize - 3,
          width: iconSize - 3,
        }}
      />
    </div>
  );
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
          height: iconSize - 3,
          width: iconSize - 3,
        }}
      />
    </div>
  );
};
