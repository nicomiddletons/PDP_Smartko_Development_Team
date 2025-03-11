import "./App.css";
import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

import switchData from "./data/test.json";
import { useEffect, useState } from "react";

import Account from "./pages/Account"

function App() {
  const [axiosData, setAxiosData] = useState(null);

  // getting the data from the API using axios 
  useEffect(() => {
    axios
      .get("https://app-lf6etr3jqa-uc.a.run.app/api/read")
      .then((response) => {
        setAxiosData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // temperature range to display in the pie chart
  const tempRangeData = [
    { range: "0-10°C", count: 0 },
    { range: "11-20°C", count: 0 },
    { range: "21-30°C", count: 0 },
    { range: "31-40°C", count: 0 },
  ];

  // get switch data
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
    
    <BrowserRouter>
      <Routes>
        <Route path="account" element={<Account />} />
        <Route path="app" element={<App />} />
      </Routes>
    </BrowserRouter>


      <div className="main">
        <div className="panel">
        <div className="katkologo">
        <img src={`./katko_logo.svg`} alt="Katko Logo" />
      </div>
          <div className="head"><img src={`./control_panel_icon.svg`} alt="control panel" /> Control panel</div>
          <div className="tab"></div>
        </div>
        <div className="graph">
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
      </div>
    </>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

