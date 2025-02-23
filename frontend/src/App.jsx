import "./App.css";
import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import switchData from "./data/test.json";

function App() {
  // temperature range to display in the pie chart
  const tempRangeData = [
    { range: "0-10°C", count: 0 },
    { range: "11-20°C", count: 0 },
    { range: "21-30°C", count: 0 },
    { range: "31-40°C", count: 0 },
  ];

  switchData.forEach((data) => {
    const temp = data.temp;
    if (temp <= 10) {
      tempRangeData[0].count += 1;
    } else if (temp <= 20) {
      tempRangeData[1].count += 1;
    } else if (temp <= 30) {
      tempRangeData[2].count += 1;
    } else if (temp <= 40) {
      tempRangeData[3].count += 1;
    }
  });

  const tempLabels = tempRangeData.map((data) => data.range);
  const tempCounts = tempRangeData.map((data) => data.count);

  return (
    <>
      <div className="Main">
        <div className="chartcard temperature">
          Temperature
          <Doughnut
            data={{
              labels: tempLabels,
              datasets: [
                {
                  label: "Temperature Ranges",
                  data: tempCounts,
                  backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                    "rgba(63, 229, 43, 0.8)",
                  ],
                  borderColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                    "rgba(63, 229, 43, 0.8)",
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Ranges",
                  display: false,
                },
              },
            }}
          />
        </div>
        <div className="chartcard humidity">
          Humidity
          <Line
            data={{
              labels: switchData.map((data) => data.timestamp),
              datasets: [
                {
                  label: "humidity",
                  data: switchData.map((data) => data.humidity),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              plugins: {
                title: {
                  text: "Humidity graph test",
                },
              },
            }}
          />
        </div>

        <div className="chartcard power_consumption">
          Power Consumption
          <Bar
            data={{
              labels: switchData.map((data) => data.timestamp),
              datasets: [
                {
                  label: "power consumption",
                  data: switchData.map((data) => data.power_consumption),
                  backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "power consumption",
                },
              },
            }}
          />
        </div>
        <div className="chartcard gas_detection">Gas Detection</div>
      </div>
    </>
  );
}

export default App;
