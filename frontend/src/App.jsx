import "./App.css";
import { Line } from "react-chartjs-2";
import Chart, { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

//import switchData from "./data/test.json";
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
  const [chartVoltage1Data, setChartVoltage1Data] = useState({});
  const [chartVoltage2Data, setChartVoltage2Data] = useState({});
  const [chartVoltage3Data, setChartVoltage3Data] = useState({});
  const [chartCurrent1Data, setChartCurrent1Data] = useState({});
  const [chartCurrent2Data, setChartCurrent2Data] = useState({});
  const [chartCurrent3Data, setChartCurrent3Data] = useState({});
  const [chartTotalPowerData, setChartTotalPowerData] = useState({});
  // const [chartCurrentData, setCurrentSmokeData] = useState({});
  // const [chartPowerData, setChartPowerData] = useState({});

  //yearly
  const [chartYearlyTempData, setChartYearlyTempData] = useState({});
  const [chartYearlyHumidityData, setChartYearlyHumidityData] = useState({});
  const [chartYearlySmokeData, setChartYearlySmokeData] = useState({});
  const [chartYearlyVoltage1Data, setChartYearlyVoltage1Data] = useState({});
  const [chartYearlyCurrent1Data, setChartYearlyCurrent1Data] = useState({});
  const [chartYearlyTotalPowerData, setChartYearlyTotalPowerData] = useState({});

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
        const voltageData1 = {};
        const voltageData2 = {};
        const voltageData3 = {};
        const currentData1 = {};
        const currentData2 = {};
        const currentData3 = {};
        const totalPowerData = {};

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

          // Store Voltage one
          if (!voltageData1[dateKey]) voltageData1[dateKey] = [];
          voltageData1[dateKey].push(item.voltage_phase_1);

          // Store Voltage two
          if (!voltageData2[dateKey]) voltageData2[dateKey] = [];
          voltageData2[dateKey].push(item.voltage_phase_2);

          // Store Voltage three
          if (!voltageData3[dateKey]) voltageData3[dateKey] = [];
          voltageData3[dateKey].push(item.voltage_phase_3);

          // Store Current one
          if (!currentData1[dateKey]) currentData1[dateKey] = [];
          currentData1[dateKey].push(item.current_phase_1);

          // Store Current two
          if (!currentData2[dateKey]) currentData2[dateKey] = [];
          currentData2[dateKey].push(item.current_phase_2);

          // Store Current three
          if (!currentData3[dateKey]) currentData3[dateKey] = [];
          currentData3[dateKey].push(item.current_phase_3);

          // Store Total Power three
          if (!totalPowerData[dateKey]) totalPowerData[dateKey] = [];
          totalPowerData[dateKey].push(item.total_power);
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

        // Group smoke level yearly data
        const yearlySmokeData = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlySmokeData[monthIndex]) yearlySmokeData[monthIndex] = [];
          yearlySmokeData[monthIndex].push(item.smoke_level);
        });

        // Group voltage phase 1 yearly data
        const yearlyVoltage1Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyVoltage1Data[monthIndex]) yearlyVoltage1Data[monthIndex] = [];
          yearlyVoltage1Data[monthIndex].push(item.voltage_phase_1);
        });

        // Group voltage phase 2 yearly data
        const yearlyVoltage2Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyVoltage2Data[monthIndex]) yearlyVoltage2Data[monthIndex] = [];
          yearlyVoltage2Data[monthIndex].push(item.voltage_phase_2);
        });

        // Group voltage phase 3 yearly data
        const yearlyVoltage3Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyVoltage3Data[monthIndex]) yearlyVoltage3Data[monthIndex] = [];
          yearlyVoltage3Data[monthIndex].push(item.voltage_phase_3);
        });

        // Group current phase 1 yearly data
        const yearlyCurrent1Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyCurrent1Data[monthIndex]) yearlyCurrent1Data[monthIndex] = [];
          yearlyCurrent1Data[monthIndex].push(item.current_phase_1);
        });

        // Group current phase 2 yearly data
        const yearlyCurrent2Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyCurrent2Data[monthIndex]) yearlyCurrent2Data[monthIndex] = [];
          yearlyCurrent2Data[monthIndex].push(item.current_phase_2);
        });

        // Group current phase 3 yearly data
        const yearlyCurrent3Data = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyCurrent3Data[monthIndex]) yearlyCurrent3Data[monthIndex] = [];
          yearlyCurrent3Data[monthIndex].push(item.current_phase_3);
        });

        // Group Total Power yearly data
        const yearlyTotalPowerData = {};
        yearlyData.forEach((item) => {
          const monthIndex = new Date(item.timestamp).getMonth(); // Get month index (0-11)

          if (!yearlyTotalPowerData[monthIndex]) yearlyTotalPowerData[monthIndex] = [];
          yearlyTotalPowerData[monthIndex].push(item.total_power);
        });

        // Monthly
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

        const voltagePoints1 = labels.map((date) => {
          const voltages1 = voltageData1[date];
          return (
            voltages1.reduce((sum, voltage1) => sum + voltage1, 0) /
            voltages1.length
          ); // Avg voltage phase 1 level
        });

        const voltagePoints2 = labels.map((date) => {
          const voltages2 = voltageData2[date];
          return (
            voltages2.reduce((sum, voltage2) => sum + voltage2, 0) /
            voltages2.length
          ); // Avg voltage phase 2 level
        });

        const voltagePoints3 = labels.map((date) => {
          const voltages3 = voltageData3[date];
          return (
            voltages3.reduce((sum, voltage3) => sum + voltage3, 0) /
            voltages3.length
          ); // Avg voltage phase 3 level
        });

        const currentPoints1 = labels.map((date) => {
          const currents1 = currentData1[date];
          return (
            currents1.reduce((sum, current1) => sum + current1, 0) /
            currents1.length
          ); // Avg voltage phase 1 level
        });

        const currentPoints2 = labels.map((date) => {
          const currents2 = currentData2[date];
          return (
            currents2.reduce((sum, current2) => sum + current2, 0) /
            currents2.length
          ); // Avg voltage phase 2 level
        });

        const currentPoints3 = labels.map((date) => {
          const currents3 = currentData3[date];
          return (
            currents3.reduce((sum, current3) => sum + current3, 0) /
            currents3.length
          ); // Avg voltage phase 3 level
        });

        const totalPowerPoints = labels.map((date) => {
          const totalpowers = totalPowerData[date];
          return (
            totalpowers.reduce((sum, totalpower) => sum + totalpower, 0) /
            totalpowers.length
          ); // Avg voltage phase 3 level
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

        const yearlyVoltage1Points = monthLabels.map((_, index) => {
          const voltages1 = yearlyVoltage1Data[index] || [];
          return voltages1.length > 0
            ? voltages1.reduce((sum, voltage1) => sum + voltage1, 0) / voltages1.length
            : null; // Avg voltage 1 per month (null for missing months)
        });

        const yearlyVoltage2Points = monthLabels.map((_, index) => {
          const voltages2 = yearlyVoltage2Data[index] || [];
          return voltages2.length > 0
            ? voltages2.reduce((sum, voltage2) => sum + voltage2, 0) / voltages2.length
            : null; // Avg voltage 2 per month (null for missing months)
        });

        const yearlyVoltage3Points = monthLabels.map((_, index) => {
          const voltages3 = yearlyVoltage3Data[index] || [];
          return voltages3.length > 0
            ? voltages3.reduce((sum, voltage3) => sum + voltage3, 0) / voltages3.length
            : null; // Avg voltage 3 per month (null for missing months)
        });

        const yearlyCurrent1Points = monthLabels.map((_, index) => {
          const currents1 = yearlyCurrent1Data[index] || [];
          return currents1.length > 0
            ? currents1.reduce((sum, current1) => sum + current1, 0) / currents1.length
            : null; // Avg current 1 per month (null for missing months)
        });

        const yearlyCurrent2Points = monthLabels.map((_, index) => {
          const currents2 = yearlyCurrent2Data[index] || [];
          return currents2.length > 0
            ? currents2.reduce((sum, current2) => sum + current2, 0) / currents2.length
            : null; // Avg current 1 per month (null for missing months)
        });

        const yearlyCurrent3Points = monthLabels.map((_, index) => {
          const currents3 = yearlyCurrent3Data[index] || [];
          return currents3.length > 0
            ? currents3.reduce((sum, current3) => sum + current3, 0) / currents3.length
            : null; // Avg current 1 per month (null for missing months)
        });

        const yearlyTotalPowerPoints = monthLabels.map((_, index) => {
          const totalpowers = yearlyTotalPowerData[index] || [];
          return totalpowers.length > 0
            ? totalpowers.reduce((sum, totalpower) => sum + totalpower, 0) / totalpowers.length
            : null; // Avg current 1 per month (null for missing months)
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

        // Update voltage phase 1 level
        setChartVoltage1Data({
          labels,
          datasets: [
            {
              label: "Voltage Phase 1",
              data: voltagePoints1,
              borderColor: "#e2ea10e3",
              backgroundColor: "rgba(226, 234, 16, 0.89)",
              tension: 0.4,
            },
            {
              label: "Voltage Phase 2",
              data: voltagePoints2,
              borderColor: "#0f70f8f2",
              backgroundColor: "rgba(15, 112, 248, 0.95)",
              tension: 0.4,
            },
            {
              label: "Voltage Phase 3",
              data: voltagePoints3,
              borderColor: "#8202f9",
              backgroundColor: "rgb(130, 2, 249)",
              tension: 0.4,
            },
          ],
        });

        // Update voltage phase 2 level
        setChartVoltage2Data({
          labels,
          datasets: [
            {
              label: "Voltage Phase 2",
              data: voltagePoints2,
              borderColor: "#A9D5C0",
              backgroundColor: "rgb(247, 85, 4)",
              tension: 0.4,
            },
          ],
        });

        // Update voltage phase 3 level
        setChartVoltage3Data({
          labels,
          datasets: [
            {
              label: "Voltage Phase 3",
              data: voltagePoints3,
              borderColor: "#A9D5C0",
              backgroundColor: "rgba(169, 213, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update current phase 1 level
        setChartCurrent1Data({
          labels,
          datasets: [
            {
              label: "Current Phase 1",
              data: currentPoints1,
              borderColor: "#f755",
              backgroundColor: "rgb(247, 85, 4)",
              tension: 0.4,
            },
            {
              label: "Current Phase 2",
              data: currentPoints2,
              borderColor: "#02d7fc",
              backgroundColor: "rgb(2, 215, 252)",
              tension: 0.4,
            },
            {
              label: "Current Phase 3",
              data: currentPoints3,
              borderColor: "#fb12b1f0",
              backgroundColor: "rgba(251, 18, 177, 0.94)",
              tension: 0.4,
            },
          ],
        });

        // Update current phase 2 level
        setChartCurrent2Data({
          labels,
          datasets: [
            {
              label: "Current Phase 2",
              data: currentPoints2,
              borderColor: "#A9D5C0",
              backgroundColor: "rgba(169, 213, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update current phase 3 level
        setChartCurrent3Data({
          labels,
          datasets: [
            {
              label: "Current Phase 3",
              data: currentPoints3,
              borderColor: "#A9D5C0",
              backgroundColor: "rgba(169, 213, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update total power level
        setChartTotalPowerData({
          labels,
          datasets: [
            {
              label: "Total Power",
              data: totalPowerPoints,
              borderColor: "#f5cd3c",
              backgroundColor: "rgb(245, 205, 60)",
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

        // Update state with chart data
        setChartYearlyVoltage1Data({
          labels: monthLabels,
          datasets: [
            {
              label: "Voltage Phase 1 - Yearly",
              data: yearlyVoltage1Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
            {
              label: "Voltage Phase 2 - Yearly",
              data: yearlyVoltage2Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
            {
              label: "Voltage Phase 3 - Yearly",
              data: yearlyVoltage3Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Update state with chart data
        setChartYearlyCurrent1Data({
          labels: monthLabels,
          datasets: [
            {
              label: "Current Phase 1 - Yearly",
              data: yearlyCurrent1Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
            {
              label: "Current Phase 2 - Yearly",
              data: yearlyCurrent2Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
            {
              label: "Current Phase 3 - Yearly",
              data: yearlyCurrent3Points,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.4,
            },
          ],
        });

        setChartYearlyTotalPowerData({
          labels: monthLabels,
          datasets: [
            {
              label: "Total Power Current Year",
              data: yearlyTotalPowerPoints,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // const createGradient = (ctx, chartArea) => {
  //   let gradient = ctx.createLinearGradient(
  //     chartArea.right,
  //     0,
  //     chartArea.left,
  //     0
  //   );
  //   gradient.addColorStop(0, "#A9D5C0"); // Start Color (Blue)
  //   gradient.addColorStop(0.7, "#21668D"); // Keep Dark Blue for 70%
  //   gradient.addColorStop(1, "#21668D"); // End Color (Green)
  //   return gradient;
  // };

  // temperature gauge chart
  // const gaugeTempData = {
  //   labels: ["Temperature"],
  //   datasets: [
  //     {
  //       data: [currentTemp, 100 - currentTemp], // out of 100
  //       backgroundColor: (ctx) => {
  //         const chart = ctx.chart;
  //         if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

  //         return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
  //       },
  //       borderWidth: 8, // Outer border thickness
  //       borderColor: "#3E5B74", // Outer ring color
  //       cutout: "70%", // Makes the circle thin from inside
  //       hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
  //       hoverBorderWidth: 2, // Inner border thickness
  //     },
  //   ],
  // };

  // humidity gauge chart
  // const gaugeHumidityData = {
  //   labels: ["Humidity"],
  //   datasets: [
  //     {
  //       data: [currentHumidity, 100 - currentHumidity], // out of 100
  //       backgroundColor: (ctx) => {
  //         const chart = ctx.chart;
  //         if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

  //         return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
  //       },
  //       borderWidth: 8, // Outer border thickness
  //       borderColor: "#3E5B74", // Outer ring color
  //       cutout: "70%", // Makes the circle thin from inside
  //       hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
  //       hoverBorderWidth: 2, // Inner border thickness
  //     },
  //   ],
  // };

  // smoke level gauge chart
  // const gaugeSmokeLevelData = {
  //   labels: ["Smoke Level"],
  //   datasets: [
  //     {
  //       data: [currentSmokeLevel, 1000 - currentSmokeLevel], // out of 1000
  //       backgroundColor: (ctx) => {
  //         const chart = ctx.chart;
  //         if (!chart.chartArea) return ["#36A2EB", "#E0E0E0"]; // Fallback colors

  //         return [createGradient(ctx.chart.ctx, chart.chartArea), "#272E44"];
  //       },
  //       borderWidth: 8, // Outer border thickness
  //       borderColor: "#3E5B74", // Outer ring color
  //       cutout: "70%", // Makes the circle thin from inside
  //       hoverBorderColor: ["#272E44", "#272E44"], // Inner border color (when hovered)
  //       hoverBorderWidth: 2, // Inner border thickness
  //     },
  //   ],
  // };

  // Options for any gauge chart
  // const gaugeOptions = {
  //   aspectRatio: 1.5,
  //   circumference: 360,
  //   rotation: -90,
  //   plugins: {
  //     tooltip: {
  //       enabled: false,
  //     },
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   elements: {
  //     arc: {
  //       borderJoinStyle: "round", // Smooth edges
  //     },
  //   },
  // };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const [switchSelection, setSwitchSelection] = useState("");

  // const handleSwitchSelection = (event) => {
  //   setSwitchSelection(event.target.value);
  // };

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

  // Chart month voltage phase 1 level options
  const chartVoltageOneLevelOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Voltage Phase 1 2 3 Level Entries (Last 30 Days)",
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
          text: "Voltage Phase 1 2 3",
        },
      },
    },
  };
  
  // Chart month current phase 1 level options
  const chartCurrent1LevelOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Current Phase 1, 2, 3 Level Entries (Last 30 Days)",
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
          text: "Current Phase 1 2 3",
        },
      },
    },
  };

  // Chart month current phase 3 level options
  const chartTotalPowerLevelOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Current Total Power Level Entries (Last 30 Days)",
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
          text: "Total Power",
        },
      },
    },
  };

  return (
    <>
      <div className="main">
        <div className="panel">
          <div className="katkologo">
            <img
              src={`./smartko_logo_2.svg`}
              alt="KatkoLogo"
              className="logo-img"
            />
          </div>
          <div className="control-panel">
            <img src={`./ControlPanelIcon.svg`} alt="control panel" /> Control
            panel
          </div>
          <div className="floor-plan">
            <img src={`./FloorPlanIcon.svg`} alt="floor plan" /> Floor Plan
          </div>
          <div className="account">
            <img src={`./account.svg`} alt="control panel" /> Account
          </div>
        </div>
        <div className="sub-panel">
          <div className="current-page">
            <h1>Control Panel</h1>
          </div>
          <div className="empty"></div>
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
              <div className="graph numbers-grid">
                {/*Temp */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Temperature</h4>
                  <div className="number-display" style={{ marginTop: "1rem" }}>
                    {currentTemp}°C
                  </div>
                </div>
                {/* Humidity */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Humidity</h4>
                  <div className="number-display" style={{ marginTop: "1rem" }}>
                    {currentHumidity}%RH
                  </div>
                </div>
                {/* Smoke Level */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Smoke Level</h4>
                  <div className="number-display" style={{ marginTop: "1rem" }}>
                    {currentSmokeLevel} ppm
                  </div>
                </div>
                {/* Voltage Phases */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Voltage (V)</h4>
                  <div className="phase-grid">
                    <div className="number-display">
                      Phase 1: {currentVoltage1}V
                    </div>
                    <div className="number-display">
                      Phase 2: {currentVoltage2}V
                    </div>
                    <div className="number-display">
                      Phase 3: {currentVoltage3}V
                    </div>
                  </div>
                </div>
                {/* Current Phases */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Current (A)</h4>
                  <div className="phase-grid">
                    <div className="number-display">
                      Phase 1: {currentCurrent1}A
                    </div>
                    <div className="number-display">
                      Phase 2: {currentCurrent2}A
                    </div>
                    <div className="number-display">
                      Phase 3: {currentCurrent3}A
                    </div>
                  </div>
                </div>
                {/* Power Phases & Total Power */}
                <div className="chartcard">
                  <h4 className="chartcard-h4">Power (W)</h4>
                  <div className="phase-grid">
                    <div className="number-display">
                      Phase 1: {currentPower1}W
                    </div>
                    <div className="number-display">
                      Phase 2: {currentPower2}W
                    </div>
                    <div className="number-display">
                      Phase 3: {currentPower3}W
                    </div>
                    <div className="number-display">
                      <strong>Total Power:</strong> {currentTotalPower}W
                    </div>
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
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Last 30 Days Voltage Phase 1, 2, 3 Level Chart
                  </h4>
                  <div className="chartcard voltagePhase">
                    {chartVoltage1Data.labels ? (
                      <Line
                        data={chartVoltage1Data}
                        options={chartVoltageOneLevelOptions}
                      />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Last 30 Days Current Phase 1, 2, 3 Level Chart
                  </h4>
                  <div className="chartcard currentPhase">
                    {chartCurrent1Data.labels ? (
                      <Line
                        data={chartCurrent1Data}
                        options={chartCurrent1LevelOptions}
                      />
                    ) : (
                      <p>Loading chart...</p>
                    )}
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">
                    Last 30 Days Total Power Level Chart
                  </h4>
                  <div className="chartcard totalPowerPhase">
                    {chartTotalPowerData.labels ? (
                      <Line
                        data={chartTotalPowerData}
                        options={chartTotalPowerLevelOptions}
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
                <div className="chartcard">
                  <h4 className="chartcard-h4">Voltage Phase 1, 2, 3 Trend (Yearly)</h4>
                  <div className="chartcard voltageYearlyPhase">
                    <Line data={chartYearlyVoltage1Data} />
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Current Phase 1, 2, 3 Trend (Yearly)</h4>
                  <div className="chartcard currentYearlyPhase">
                    <Line data={chartYearlyCurrent1Data} />
                  </div>
                </div>
                <div className="chartcard">
                  <h4 className="chartcard-h4">Total Power Trend (Yearly)</h4>
                  <div className="chartcard totalPowerPhase">
                    <Line data={chartYearlyTotalPowerData} />
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
