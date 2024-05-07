import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MonthlyAverageChart = ({ monthlyAverages, monthlyAveragesByYear }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthName, setSelectedMonthName] = useState(null);

  const prepareChartData = () => {
    return Object.keys(monthlyAverages).map((month) => ({
      month: getMonthName(month), // Formatting month name
      average: monthlyAverages[month].average.toFixed(2),
    }));
  };

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[parseInt(month, 10) - 1];
  };

  const handleBarClick = (data) => {
    const monthName = data.month;
    const month = parseInt(data.month, 10);

    setSelectedMonth(month);
    setSelectedMonthName(monthName);
  };
  const renderTooltipContent = (props) => {
    const { payload } = props;

    if (!payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "#acd038",
          border: "solid",
          borderColor: "#005e7d",
          borderStyle: "ridge",
          borderRadius: "25px",
          padding: "10px",
        }}
      >
        <p>{data.month}</p>
        <p>Average: {data.average} kWh</p>
      </div>
    );
  };

  return (
    <div>
      <BarChart width={800} height={400} data={prepareChartData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={renderTooltipContent} /> <Legend />
        <Bar
          dataKey="average"
          fill="#005e7d"
          name="Monthly Averages"
          onClick={(data) => handleBarClick(data)}
        />
      </BarChart>
    </div>
  );
};

export default MonthlyAverageChart;
