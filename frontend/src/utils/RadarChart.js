import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';


export default function ChartRadar({ data }) {


    return (

        <RadarChart outerRadius={150} width={500} height={350} style={{ margin: "0 auto" }}
         data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name"  />
          <PolarRadiusAxis angle={18} domain={[0, 1]}/>
          <Radar name="Danceability" dataKey="danceability" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend/>
        </RadarChart>

    );
  }