import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

 export function Chart({ data }) {
  return (
    <>
            <h1 className="text-heading">
                Line Chart Using Rechart
            </h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={data} margin={{ right: 300, bottom: 100}}>
                    <CartesianGrid />
                    <XAxis dataKey="name" 
                        interval={'preserveStartEnd'}/>
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line dataKey="danceability"
                        stroke="black" activeDot={{ r: 8 }} />
                    <Line dataKey="acousticness"
                        stroke="red" activeDot={{ r: 8 }} />
                    <Line dataKey="energy"
                        stroke="blue" activeDot={{ r: 8 }} />
                    <Line dataKey="instrumentalness"
                        stroke="green" activeDot={{ r: 8 }} />
                    <Line dataKey="valence"
                        stroke="purple" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
  );
}

export function Chart1({ data }) {
    return (
      <>
              <h1 className="text-heading">
                  Line Chart Using Rechart
              </h1>
              <ResponsiveContainer width="100%" aspect={3}>
                  <LineChart data={data} margin={{ right: 300, bottom: 100}}>
                      <CartesianGrid />
                      <XAxis dataKey="name" 
                          interval={'preserveStartEnd'}/>
                      <YAxis></YAxis>
                      <Legend />
                      <Tooltip />
                      <Line dataKey="tempo"
                          stroke="black" activeDot={{ r: 8 }} />
                  </LineChart>
              </ResponsiveContainer>
          </>
    );
  } 
