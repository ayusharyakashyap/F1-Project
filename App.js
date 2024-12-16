import React, { useState, useEffect } from "react";
import { fetchFastF1Data, generateVisualizations } from "./utils";
import "./App.css";

function App() {
    const [years, setYears] = useState([2023, 2022, 2021]); // Years dropdown options
    const [sessions, setSessions] = useState(["FP1", "FP2", "FP3", "Qualifying", "Race"]); // Session options
    const [gps, setGps] = useState([]); // GPs options
    const [drivers, setDrivers] = useState([]); // Drivers options

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedGP, setSelectedGP] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");

    const [visualizationData, setVisualizationData] = useState(null);

    // Fetch GPs when the year changes
    useEffect(() => {
        if (selectedYear) {
            fetchFastF1Data(`getGps/${selectedYear}`).then(setGps);
        }
    }, [selectedYear]);

    // Fetch drivers when the GP and session are selected
    useEffect(() => {
        if (selectedYear && selectedGP && selectedSession) {
            fetchFastF1Data(`getDrivers/${selectedYear}/${selectedGP}/${selectedSession}`).then(setDrivers);
        }
    }, [selectedYear, selectedGP, selectedSession]);

    // Fetch visualizations when all fields are selected
    const handleGenerate = async () => {
        const data = await fetchFastF1Data(
            `getVisualization/${selectedYear}/${selectedGP}/${selectedSession}/${selectedDriver}`
        );
        setVisualizationData(data);
    };

    return (
        <div className="f1-visualizer">
            <h1>F1 Race Visualizer</h1>

            {/* Year Dropdown */}
            <label>Year:</label>
            <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                <option value="">Select Year</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* GP Dropdown */}
            <label>Grand Prix:</label>
            <select onChange={(e) => setSelectedGP(e.target.value)} value={selectedGP} disabled={!gps.length}>
                <option value="">Select GP</option>
                {gps.map((gp) => (
                    <option key={gp} value={gp}>
                        {gp}
                    </option>
                ))}
            </select>

            {/* Session Dropdown */}
            <label>Session:</label>
            <select onChange={(e) => setSelectedSession(e.target.value)} value={selectedSession}>
                <option value="">Select Session</option>
                {sessions.map((session) => (
                    <option key={session} value={session}>
                        {session}
                    </option>
                ))}
            </select>

            {/* Driver Dropdown */}
            <label>Driver:</label>
            <select onChange={(e) => setSelectedDriver(e.target.value)} value={selectedDriver} disabled={!drivers.length}>
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                    <option key={driver} value={driver}>
                        {driver}
                    </option>
                ))}
            </select>

            {/* Generate Button */}
            <button onClick={handleGenerate} disabled={!selectedYear || !selectedGP || !selectedSession || !selectedDriver}>
                Generate Visualizations
            </button>

            {/* Render Visualization */}
            {visualizationData && (
                <div className="visualizations">
                    <h2>Visualization</h2>
                    {generateVisualizations(visualizationData)}
                </div>
            )}
        </div>
    );
}

export default App;
