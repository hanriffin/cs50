import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../index.css";

// universal list of colours to change colour pallette easily
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
    9: "blue",
    10: "green",
    11: "purple",
  },
];

// chart for every audio feature except tempo
export function Chart({ data }) {
  return (
    <>
      <div style={{ height: "400px", width: "90vw" }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ right: 100, bottom: 100 }}
            width="100%"
            height={300}
          >
            <CartesianGrid fill={colours[0][5]} />
            <XAxis
              dataKey="name"
              interval={"preserveStartEnd"}
              tick={{ fill: colours[0][5] }}
            />
            <YAxis tick={{ fill: colours[0][5] }}></YAxis>
            <Legend
              layout="vertical"
              verticalAlign="top"
              align="right"
              height={120}
              width="10vw"
              wrapperStyle={{
                backgroundColor: colours[0][5],
                top: 0,
                right: 90,
              }}
            />
            <Tooltip labelStyle={{ color: colours[0][6] }} />
            <Line
              dataKey="danceability"
              stroke={colours[0][6]}
              activeDot={{ r: 8 }}
            />
            <Line
              dataKey="acousticness"
              stroke={colours[0][7]}
              activeDot={{ r: 8 }}
            />
            <Line
              dataKey="energy"
              stroke={colours[0][9]}
              activeDot={{ r: 8 }}
            />
            <Line
              dataKey="instrumentalness"
              stroke={colours[0][10]}
              activeDot={{ r: 8 }}
            />
            <Line
              dataKey="valence"
              stroke={colours[0][11]}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

// tempo chart
export function Chart1({ data }) {
  return (
    <>
      <div style={{ height: "400px", width: "90vw" }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ right: 100, bottom: 100 }}
            width="100%"
            padding={{ right: 100 }}
          >
            <CartesianGrid fill={colours[0][5]} />
            <XAxis
              dataKey="name"
              interval={"preserveStartEnd"}
              tick={{ fill: colours[0][5] }}
            />
            <YAxis tick={{ fill: colours[0][5] }}></YAxis>
            <Legend
              layout="vertical"
              verticalAlign="top"
              align="right"
              height={30}
              width="10vw"
              wrapperStyle={{
                backgroundColor: colours[0][5],
                top: 0,
                right: 90,
              }}
            />
            <Tooltip labelStyle={{ color: colours[0][6] }} />
            <Line dataKey="tempo" stroke={colours[0][6]} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
