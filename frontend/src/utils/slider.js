import ReactSlider from "react-slider";
import "../index.css";
export const Slider = ({ value, onChange }) => {
  return (
    <ReactSlider
      className="horizontal-slider"
      thumbClassName="example-thumb"
      trackClassName="example-track"
      value={value}
      onChange={onChange}
    />
  );
};