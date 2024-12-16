import React, { useState } from 'react'; // Manage states
import axios from 'axios'; // Fetch data from backend
import { Line } from 'react-chartjs-2'; // Chart.js for visualizations

function App() {
  const [year, setYear] = useState(''); // User input: Year
  const [gpName, setGpName] = useState(''); // User input: GP Name
  const [session, setSession] = useState(''); // User input: Session (FP1/Qualifying)
  const [driver, setDriver] = useState(''); // User input: Driver
  const [data, setData] = useState(null); // API response data

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/get_data/", {
        year: parseInt(year),
        gp_name: gpName,
        session: session,
        driver: driver,
      });
      setData(response.data); // Store response in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>F1 Data Visualizations</h1>
      <div>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Grand Prix Name"
          value={gpName}
          onChange={(e) => setGpName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Session (FP1/FP2/Qualifying)"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        />
        <input
          type="text"
          placeholder="Driver Code (e.g., VER)"
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
        />
        <button onClick={fetchData} style={{ marginLeft: '10px' }}>
          Fetch Data
        </button>
      </div>

      {data && (
        <div>
          <h2>Lap Times</h2>
          <Line
            data={{
              labels: Array.from({ length: data.lap_times.length }, (_, i) => `Lap ${i + 1}`),
              datasets: [
                {
                  label: 'Lap Times (s)',
                  data: data.lap_times,
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
          />

          <h2>Telemetry - Speed vs Distance</h2>
          <Line
            data={{
              labels: data.telemetry.distance,
              datasets: [
                {
                  label: 'Speed (km/h)',
                  data: data.telemetry.speed,
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
          />

          <h2>Throttle and Brake</h2>
          <Line
            data={{
              labels: data.telemetry.distance,
              datasets: [
                {
                  label: 'Throttle (%)',
                  data: data.telemetry.throttle,
                  borderColor: 'rgba(54,162,235,1)',
                  borderWidth: 2,
                  fill: false,
                },
                {
                  label: 'Brake (%)',
                  data: data.telemetry.brake,
                  borderColor: 'rgba(255,159,64,1)',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
