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

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [switchSelection, setSwitchSelection] = useState("");

  const handleSwitchSelection = (event) => {
    setSwitchSelection(event.target.value);
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
                  <Tab label="Item One" value="1" />
                  <Tab label="Item Two" value="2" />
                  <Tab label="Item Three" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">Item One</TabPanel>
              <TabPanel value="2">Item Two</TabPanel>
              <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
          </div>
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
                      "rgba(169, 213, 192, 1)",
                      "rgba(33, 102, 141, 1)",
                      "rgb(64, 92, 126)",
                      "rgb(64, 121, 130)",
                    ],
                    borderColor: [
                      "rgba(169, 213, 192, 1)",
                      "rgba(33, 102, 141, 1)",
                      "rgb(64, 92, 126)",
                      "rgb(64, 121, 130)",
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
                  legend: {
                    labels: {
                      color: "white", // Legend text color
                    },
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
                    backgroundColor: "#FFFFFF",
                    borderColor: "#729AB8",
                  },
                ],
              }}
              options={{
                elements: {
                  line: {
                    tension: 0.3,
                  },
                },
                plugins: {
                  title: {
                    text: "Humidity graph test",
                    color: "white",
                  },
                  legend: {
                    labels: {
                      color: "white", // Legend text color
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Time",
                      color: "white",
                    },
                    ticks: {
                      color: "lightgray",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Humidity (%)",
                      color: "white",
                    },
                    ticks: {
                      color: "lightgray", 
                    },
                  },
                },
              }}
            />
          </div>

          <div className="chartcard smoke_level">
            Smoke Level
            <Bar
              data={{
                labels: switchData.map((data) => data.timestamp),
                datasets: [
                  {
                    label: "power consumption",
                    data: switchData.map((data) => data.smoke_level),
                    backgroundColor: [
                      "rgba(169, 213, 192, 1)",
                      "rgba(33, 102, 141, 1)",
                      "rgb(64, 92, 126)",
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "smoke level",
                  },
                  legend: {
                    labels: {
                      color: "white", // Legend text color
                    },
                  },
                },

                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Time",
                      color: "white",
                    },
                    ticks: {
                      color: "lightgray",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "smoke level",
                      color: "white",
                    },
                    ticks: {
                      color: "lightgray", 
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
