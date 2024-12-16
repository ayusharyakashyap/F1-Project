from flask import Flask, jsonify
import fastf1

app = Flask(__name__)

@app.route('/getGps/<year>')
def get_gps(year):
    events = fastf1.get_event_schedule(int(year))
    gps = events['EventName'].tolist()
    return jsonify(gps)

@app.route('/getDrivers/<year>/<gp>/<session>')
def get_drivers(year, gp, session):
    event = fastf1.get_event(int(year), gp)
    session_data = event.get_session(session)
    session_data.load()
    drivers = session_data.drivers
    return jsonify(drivers)

@app.route('/getVisualization/<year>/<gp>/<session>/<driver>')
def get_visualization(year, gp, session, driver):
    event = fastf1.get_event(int(year), gp)
    session_data = event.get_session(session)
    session_data.load()
    laps = session_data.laps.pick_driver(driver)
    lap_times = laps['LapTime'].dt.total_seconds().tolist()
    speeds = laps['SpeedST'].tolist()  # Example speed data
    return jsonify({"lapTimes": lap_times, "speeds": speeds})

if __name__ == '__main__':
    app.run(debug=True)
