import axios from "axios";

// Fetch data from FastF1 or your backend API
export const fetchFastF1Data = async (endpoint) => {
    try {
        const response = await axios.get(`http://localhost:5000/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

// Generate visualizations dynamically
export const generateVisualizations = (data) => {
    // Example visualization (extend as needed)
    return (
        <div>
            <h3>Lap Times</h3>
            <ul>
                {data.lapTimes.map((lap, index) => (
                    <li key={index}>
                        Lap {index + 1}: {lap} seconds
                    </li>
                ))}
            </ul>

            <h3>Speed Data</h3>
            <ul>
                {data.speeds.map((speed, index) => (
                    <li key={index}>
                        Speed at {index * 10}m: {speed} km/h
                    </li>
                ))}
            </ul>
        </div>
    );
};
