import {
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
  BarChart,
} from "recharts";

const SimpleBarChart = ({
  data,
  xAxis,
  yAxis,
}: {
  data: any;
  xAxis: string;
  yAxis: string;
}) => {
  const xAxisValue = xAxis;
  const yAxisValue = yAxis;


  return (
    <ResponsiveContainer width="60%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisValue} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={yAxisValue}
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
