import "./App.css";
import Chart, { Chart as ChartJS } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
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
  //current
  const [currentTemp, setCurrentTemp] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentSmokeLevel, setCurrentSmokeLevel] = useState(0);
  const [currentVoltage1, setCurrentVoltage1] = useState(0);
  const [currentVoltage2, setCurrentVoltage2] = useState(0);
  const [currentVoltage3, setCurrentVoltage3] = useState(0);
  const [currentCurrent1, setCurrentCurrent1] = useState(0);
  const [currentCurrent2, setCurrentCurrent2] = useState(0);
  const [currentCurrent3, setCurrentCurrent3] = useState(0);
  const [currentPower1, setCurrentPower1] = useState(0);
  const [currentPower2, setCurrentPower2] = useState(0);
  const [currentPower3, setCurrentPower3] = useState(0);
  const [currentTotalPower, setCurrentTotalPower] = useState(0);
  //chart
  const [chartTempData, setChartTempData] = useState({});
  const [chartHumidityData, setChartHumidityData] = useState({});
  const [chartSmokeData, setChartSmokeData] = useState({});
  const [chartVoltageData, setChartVoltageData] = useState({});
  const [chartCurrentData, setChartCurrentData] = useState({});
  const [chartPowerData, setChartPowerData] = useState({});
  //yearly
  const [chartYearlyTempData, setChartYearlyTempData] = useState({});
  const [chartYearlyHumidityData, setChartYearlyHumidityData] = useState({});
  const [chartYearlySmokeData, setChartYearlySmokeData] = useState({});

  useEffect(() => {
    axios
      .get("https://app-lf6etr3jqa-uc.a.run.app/api/read")
      .then((response) => {
        const data = response.data;

        // Get the most current entry
        // this function returns the item with the maximum id
        const findMaxFunction = (max, item) => {
          // condition ? return 1 : return 2
          //parseInt(item.id, 10) > parseInt(max.id, 10) ? item : max
          if (parseInt(item.id, 10) > parseInt(max.id, 10)) {
            return item;
          } else {
            return max;
          }
        };
        const latestEntry = data.reduce(findMaxFunction);

        setAxiosData(data);
        setCurrentTemp(latestEntry?.temp || 0); // optional chaining to check null
        setCurrentHumidity(latestEntry?.humidity || 0);
        setCurrentSmokeLevel(latestEntry?.smoke_level || 0);

        setCurrentVoltage1(latestEntry?.voltage_phase_1 || 0);
        setCurrentVoltage2(latestEntry?.voltage_phase_2 || 0);
        setCurrentVoltage3(latestEntry?.voltage_phase_3 || 0);

        setCurrentCurrent1(latestEntry?.current_phase_1 || 0);
        setCurrentCurrent2(latestEntry?.current_phase_2 || 0);
        setCurrentCurrent3(latestEntry?.current_phase_3 || 0);

        setCurrentPower1(latestEntry?.power_phase_1 || 0);
        setCurrentPower2(latestEntry?.power_phase_2 || 0);
        setCurrentPower3(latestEntry?.power_phase_3 || 0);
        setCurrentTotalPower(latestEntry?.total_power || 0);
  

        // Filter data for the last 30 days
        // creating two objects from the Date class - default getDate is today
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Date filtering for the current year
        const currentYear = today.getFullYear();
        const startOfYear = new Date(currentYear, 0, 1); // 1st Jan of the current year - so (year, monthIndex, date)

        const filteredData = data.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= thirtyDaysAgo;
        });

        const yearlyData = data.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= startOfYear; // Entries only from this year
        });

        // Data grouped by date
        const tempData = {};
        const humidityData = {};
        const smokeData = {};
        //??
        const voltageData = {currentVoltage1, currentVoltage2,currentVoltage3};
        const currentData = {currentCurrent1, currentCurrent2, currentCurrent3};
        const powerData = {currentPower1, currentPower2, currentPower3};


        const yearlyTempData = {}; // Group data by month for yearly chart
        const yearlyHumidityData = {};

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

        // Group yearly data by month
        yearlyData.forEach((item) => {
          const monthKey = new Date(item.timestamp).toISOString().split("-")[1]; // Extract month (MM format)

          if (!yearlyTempData[monthKey]) yearlyTempData[monthKey] = [];
          yearlyTempData[monthKey].push(item.temp);
        });

        // Group humidity data by month
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyHumidityData[monthIndex])
            yearlyHumidityData[monthIndex] = [];
          yearlyHumidityData[monthIndex].push(item.humidity);
        });

        // Group smoke level data by month
        const yearlySmokeData = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlySmokeData[monthIndex]) yearlySmokeData[monthIndex] = [];
          yearlySmokeData[monthIndex].push(item.smoke_level);
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

        // Format data for yearly temperature trend (average per month)
        const monthLabels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]; // Labels for x-axis

        const yearlyTempPoints = monthLabels.map((_, index) => {
          const monthKey = (index + 1).toString().padStart(2, "0"); // Convert 1 -> "01"
          const temps = yearlyTempData[monthKey] || [];
          return temps.length > 0
            ? temps.reduce((sum, temp) => sum + temp, 0) / temps.length
            : null; // Avg temp per month (null for missing data)
        });

        const yearlyHumidityPoints = monthLabels.map((_, index) => {
          const hums = yearlyHumidityData[index] || [];
          return hums.length > 0
            ? hums.reduce((sum, hum) => sum + hum, 0) / hums.length
            : null; // Avg humidity per month (null for missing months)
        });

        const yearlySmokePoints = monthLabels.map((_, index) => {
          const smokes = yearlySmokeData[index] || [];
          return smokes.length > 0
            ? smokes.reduce((sum, smoke) => sum + smoke, 0) / smokes.length
            : null; // Avg smoke level per month (null for missing months)
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
              borderColor: "#A9D5C0",
              backgroundColor: "rgba(169, 213, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        setChartVoltageData({
          labels: timestamp,
          datasets: [
            {
              label: "Voltage",
              data: voltageData,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
            },
          ],
        });

        setChartCurrentData({
          labels: timestamp,
          datasets: [
            {
              label: "Current",
              data: currentData,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
            },
          ],
        });

        setChartPowerData({
          labels: timestamp,
          datasets: [
            {
              label: "Power",
              data: powerData,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
            },
          ],
        });

        setChartYearlyTempData({
          labels: monthLabels,
          datasets: [
            {
              label: "Temperature (°C) - Current Year",
              data: yearlyTempPoints,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update state with chart data
        setChartYearlyHumidityData({
          labels: monthLabels,
          datasets: [
            {
              label: "Humidity (%) - Yearly",
              data: yearlyHumidityPoints,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update state with chart data
        setChartYearlySmokeData({
          labels: monthLabels,
          datasets: [
            {
              label: "Smoke Level - Yearly",
              data: yearlySmokePoints,
              borderColor: "#ECDBE9",
              backgroundColor: "rgba(236, 219, 233, 1)",
              tension: 0.4,
            },
          ],
        });

        




      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const createGradient = (ctx, chartArea) => {
    let gradient = ctx.createLinearGradient(
      chartArea.right,
      0,
      chartArea.left,
      0
    );
    gradient.addColorStop(0, "#A9D5C0"); // Start Color (Blue)
    gradient.addColorStop(0.7, "#21668D"); // Keep Dark Blue for 70%
    gradient.addColorStop(1, "#21668D"); // End Color (Green)
    return gradient;
  };

  // temperature gauge chart
  const gaugeTempData = {
    labels: ["Temperature"],
    datasets: [
      {
        data: [currentTemp, 100 - currentTemp], // out of 100
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

          return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
        },
        borderWidth: 8, // Outer border thickness
        borderColor: "#3E5B74", // Outer ring color
        cutout: "70%", // Makes the circle thin from inside
        hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
        hoverBorderWidth: 2, // Inner border thickness
      },
    ],
  };

  // humidity gauge chart
  const gaugeHumidityData = {
    labels: ["Humidity"],
    datasets: [
      {
        data: [currentHumidity, 100 - currentHumidity], // out of 100
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

          return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
        },
        borderWidth: 8, // Outer border thickness
        borderColor: "#3E5B74", // Outer ring color
        cutout: "70%", // Makes the circle thin from inside
        hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
        hoverBorderWidth: 2, // Inner border thickness
      },
    ],
  };

  // smoke level gauge chart
  const gaugeSmokeLevelData = {
    labels: ["Smoke Level"],
    datasets: [
      {
        data: [currentSmokeLevel, 1000 - currentSmokeLevel], // out of 1000
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

          return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
        },
        borderWidth: 8, // Outer border thickness
        borderColor: "#3E5B74", // Outer ring color
        cutout: "70%", // Makes the circle thin from inside
        hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
        hoverBorderWidth: 2, // Inner border thickness
      },
    ],
  };

  // Options for any gauge chart
  const gaugeOptions = {
    aspectRatio: 1.5,
    circumference: 360,
    rotation: -90,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderJoinStyle: "round", // Smooth edges
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
        display: false,
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
        display: false,
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
        display: false,
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

  // Chart current voltage options

  const chartVoltageOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Voltage level phases 1-3",
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
          text: "Voltage",
        },
      },
    },
  };

  // Chart current Current options
  const chartCurrentOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Current level phases 1-3",
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
          text: "Current",
        },
      },
    },
  };

  // Chart current Power options
  const chartPowerOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Power level phases 1-3",
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
          text: "Power",
        },
      },
    },
  };


  return (
    <>
      <div className="main">
        <div className="panel">
          <div className="katkologo">
            <img src={`./smartko_logo_2.svg`} alt="KatkoLogo" className="logo-img" />
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
              <Box
                sx={{
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      color: "#ffffff", // Default text color
                    },
                    "& .Mui-selected": {
                      color: "#0F141E", // Selected tab text color
                      fontWeight: "bold",
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#0F141E", // underline indicator color
                    },
                  }}
                >
                  <Tab label="Current" value="1" />
                  <Tab label="Month" value="2" />
                  <Tab label="Year" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </div>
        </div>
        <div className="tabs-panel">
          <TabContext value={value}>
            <TabPanel value="1">
              <div className="graph">
                <div className="chartcard">
                  <h4 className="chartcard-h4">Temperature</h4>
                  <div className="chartcard temperature">
                    <Doughnut data={gaugeTempData} options={gaugeOptions} />
                    <div className="temp-text">{currentTemp}°C</div>
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Humidity</h4>
                  <div className="chartcard humidity">
                    <Doughnut data={gaugeHumidityData} options={gaugeOptions} />
                    <div className="humidity-text">{currentHumidity}</div>
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Smoke Level</h4>
                  <div className="chartcard smoke_level">
                    <Doughnut
                      data={gaugeSmokeLevelData}
                      options={gaugeOptions}
                    />
                    <div className="smoke-level-text">{currentSmokeLevel}</div>
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Voltage Level</h4>
                  <div className="chartcard voltage_level">

                    {chartVoltageData.labels ? (
                      <Line data={voltageData} options={chartVoltageOptions} />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                    <div className="voltage-level-text">{currentVoltage1}</div>
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Current Level</h4>
                  <div className="chartcard current_level">

                    {chartCurrentData.labels ? (
                      <Line data={currentData} options={chartCurrentOptions} />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                    <div className="current-level-text">{currentCurrent1}</div>
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Power Level</h4>
                  <div className="chartcard power_level">

                    {chartPowerData.labels ? (
                      <Line data={powerData} options={chartPowerOptions} />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                    <div className="power-level-text">{currentTotalPower}</div>
                  </div>
                </div>




              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="graph">
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Last 30 Days Temperature Chart
                  </h4>
                  <div className="chartcard temperature">
                    {chartTempData.labels ? (
                      <Line data={chartTempData} options={chartTempOptions} />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Last 30 Days Humidity Chart</h4>
                  <div className="chartcard humidity">
                    {chartHumidityData.labels ? (
                      <Line
                        data={chartHumidityData}
                        options={chartHumidityOptions}
                      />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Last 30 Days Smoke Level Chart
                  </h4>
                  <div className="chartcard smoke_level">
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
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="graph">
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Temperature Trend (Current Year)
                  </h4>
                  <div className="chartcard temperature">
                    <Line data={chartYearlyTempData} />
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Humidity Trend (Yearly)</h4>
                  <div className="chartcard humidity">
                    <Line data={chartYearlyHumidityData} />
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Smoke Level Trend (Yearly)</h4>
                  <div className="chartcard smoke_level">
                    <Line data={chartYearlySmokeData} />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </>
  );
}

export default App;