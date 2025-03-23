import "./App.css";
import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import switchData from "./data/test.json";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function App() {
  const [axiosData, setAxiosData] = useState([]);
  const [currentTemp, setCurrentTemp] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentSmokeLevel, setCurrentSmokeLevel] = useState(0);
  const [chartTempData, setChartTempData] = useState({});
  const [chartHumidityData, setChartHumidityData] = useState({});
  const [chartSmokeData, setChartSmokeData] = useState({});

  useEffect(() => {
    axios
      .get("https://app-lf6etr3jqa-uc.a.run.app/api/read")
      .then((response) => {
        const data = response.data;

        // Get the most current entry
        const latestEntry = data.reduce((max, item) =>
          parseInt(item.id, 10) > parseInt(max.id, 10) ? item : max
        );

        setAxiosData(data);
        setCurrentTemp(latestEntry?.temp || 0);
        setCurrentHumidity(latestEntry?.humidity || 0);
        setCurrentSmokeLevel(latestEntry?.smoke_level || 0);

        // Filter data for the last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const filteredData = data.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= thirtyDaysAgo;
        });

        // Data grouped by date
        const tempData = {};
        const humidityData = {};
        const smokeData = {};

        filteredData.forEach((item) => {
          const dateKey = new Date(item.timestamp).toISOString().split("T")[0]; // Format YYYY-MM-DD

          // Store temperature data
          if (!tempData[dateKey]) tempData[dateKey] = [];
          tempData[dateKey].push(item.temp);

          // Store humidity data
          if (!humidityData[dateKey]) humidityData[dateKey] = [];
          humidityData[dateKey].push(item.humidity);

          // Store smoke level data
          if (!smokeData[dateKey]) smokeData[dateKey] = [];
          smokeData[dateKey].push(item.smoke_level);
        });

        const labels = Object.keys(tempData).sort(); // Dates for x-axis
        const tempPoints = labels.map((date) => {
          const temps = tempData[date];
          return temps.reduce((sum, temp) => sum + temp, 0) / temps.length; // Avg temp
        });

        const humidityPoints = labels.map((date) => {
          const hums = humidityData[date];
          return hums.reduce((sum, hum) => sum + hum, 0) / hums.length; // Avg humidity
        });

        const smokePoints = labels.map((date) => {
          const smokes = smokeData[date];
          return smokes.reduce((sum, smoke) => sum + smoke, 0) / smokes.length; // Avg smoke level
        });

        // Update temp
        setChartTempData({
          labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: tempPoints,
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update humidity
        setChartHumidityData({
          labels,
          datasets: [
            {
              label: "Humidity (%)",
              data: humidityPoints,
              borderColor: "#FF6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update smoke level
        setChartSmokeData({
          labels,
          datasets: [
            {
              label: "Smoke Level",
              data: smokePoints,
              borderColor: "#FFA500",
              backgroundColor: "rgba(255, 165, 0, 0.2)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // temperature gauge chart
  const gaugeTempData = {
    labels: ["Temperature"],
    datasets: [
      {
        data: [currentTemp, 100 - currentTemp], // out of 100
        backgroundColor: ["#36A2EB", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  // humidity gauge chart
  const gaugeHumidityData = {
    labels: ["Humidity"],
    datasets: [
      {
        data: [currentHumidity, 100 - currentHumidity], // out of 100
        backgroundColor: ["#36A2EB", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  // smoke level gauge chart
  const gaugeSmokeLevelData = {
    labels: ["Smoke Level"],
    datasets: [
      {
        data: [currentSmokeLevel, 1000 - currentSmokeLevel], // out of 1000
        backgroundColor: ["#36A2EB", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  // Options for any gauge chart
  const gaugeOptions = {
    aspectRatio: 2,
    circumference: 180,
    rotation: -90,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [switchSelection, setSwitchSelection] = useState("");

  const handleSwitchSelection = (event) => {
    setSwitchSelection(event.target.value);
  };

  // Chart month temp options
  const chartTempOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Temperature Entries (Last 30 Days)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  // Chart month humidity options
  const chartHumidityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Humidity Entries (Last 30 Days)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Humidity",
        },
      },
    },
  };

  // Chart month smoke level options
  const chartSmokeLevelOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Smoke Level Entries (Last 30 Days)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Smoke Level",
        },
      },
    },
  };
  return (
    <>
      <div className="main">
        <div className="panel">
          <div className="katkologo">
            <img src={`./whiteLogo.svg`} alt="KatkoLogo" className="logo-img" />
          </div>
          <div className="control-panel">
            <img src={`./controlPanel.svg`} alt="control panel" /> Control panel
          </div>
          <div className="account">
            <img src={`./account.svg`} alt="control panel" /> Account
          </div>
        </div>
        <div className="sub-panel">
          <div className="current-page">
            <h1>Control Panel</h1>
          </div>
          <div className="select-switch">
            <FormControl variant="filled" className="form-control-select">
              <InputLabel id="switch-selection-label">
                Switch Selection
              </InputLabel>
              <Select
                labelId="switch-selection-label"
                value={switchSelection}
                onChange={handleSwitchSelection}
                sx={{
                  ":before": { borderBottomColor: "#21668D" },
                  ":after": { borderBottomColor: "#21668D" },
                }}
              >
                <MenuItem value={1}>Katko - KEA 225 A2</MenuItem>
                <MenuItem value={2}>Katko - KEA 225 A2</MenuItem>
                <MenuItem value={3}>Katko - KEA 225 A2</MenuItem>
                <MenuItem value={4}>Katko - KEA 225 A2</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="tabs">
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Current" value="1" />
                  <Tab label="Month" value="2" />
                  <Tab label="Year" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </div>
        </div>
        <div className="tabs">
          <TabContext value={value}>
            <TabPanel value="1">
              <div className="graph">
                <div className="chartcard temperature">
                  <h3>Current Temperature: {currentTemp}°C</h3>
                  <Doughnut data={gaugeTempData} options={gaugeOptions} />
                </div>
                <div className="chartcard humidity">
                  <h3>Current Humiidty: {currentHumidity}°C</h3>
                  <Doughnut data={gaugeHumidityData} options={gaugeOptions} />
                </div>
                <div className="chartcard smoke_level">
                  <h3>Current Smoke Level: {currentSmokeLevel}°C</h3>
                  <Doughnut data={gaugeSmokeLevelData} options={gaugeOptions} />
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="graph">
                <div className="chartcard temperature">
                  <h2>Last 30 Days Temperature Chart</h2>
                  {chartTempData.labels ? (
                    <Line data={chartTempData} options={chartTempOptions} />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
                <div className="chartcard humidity">
                  <h2>Last 30 Days Humidity Chart</h2>
                  {chartHumidityData.labels ? (
                    <Line
                      data={chartHumidityData}
                      options={chartHumidityOptions}
                    />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>

                <div className="chartcard smoke_level">
                  <h2>Last 30 Days Smoke Level Chart</h2>
                  {chartHumidityData.labels ? (
                    <Line
                      data={chartSmokeData}
                      options={chartSmokeLevelOptions}
                    />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </div>
      </div>
    </>
  );
}

export default App;
