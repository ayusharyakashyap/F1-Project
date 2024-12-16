from fastapi import FastAPI, HTTPException  # FastAPI for building the backend
import fastf1  # Library for fetching F1 data
from pydantic import BaseModel  # For data validation of user input

# Enable FastF1 cache to avoid re-fetching the same data repeatedly
fastf1.Cache.enable_cache("cache_directory")

# Initialize FastAPI app
app = FastAPI()

# Define a data model for user input (year, GP name, session, driver)
class SessionRequest(BaseModel):
    year: int
    gp_name: str
    session: str
    driver: str

@app.get("/")  # Default route to check if the server is running
async def home():
    return {"message": "Welcome to the F1 Data API"}

@app.post("/get_data/")  # Endpoint to fetch F1 data
async def get_session_data(request: SessionRequest):
    try:
        # Load the session based on user inputs
        session = fastf1.get_session(request.year, request.gp_name, request.session)
        session.load()  # Fetch session data
        
        # Filter laps by the selected driver
        laps = session.laps.pick_driver(request.driver)
        telemetry = laps.get_car_data().add_distance()  # Add telemetry with distance

        # Prepare structured data for the response
        data = {
            "lap_times": laps["LapTime"].dt.total_seconds().tolist(),
            "sector_times": {
                "Sector1": laps["Sector1Time"].dt.total_seconds().tolist(),
                "Sector2": laps["Sector2Time"].dt.total_seconds().tolist(),
                "Sector3": laps["Sector3Time"].dt.total_seconds().tolist(),
            },
            "telemetry": {
                "speed": telemetry["Speed"].tolist(),
                "distance": telemetry["Distance"].tolist(),
                "throttle": telemetry["Throttle"].tolist(),
                "brake": telemetry["Brake"].tolist(),
            },
        }
        return data  # Return the prepared data to the frontend

    except Exception as e:
        # Handle errors such as incorrect inputs
        raise HTTPException(status_code=500, detail=str(e))
