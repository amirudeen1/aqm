from flask import Flask, render_template, jsonify
import requests
import sqlite3
import os 
from dotenv import load_dotenv # to store my API token privately

load_dotenv()

app = Flask(__name__)
# Make sure api token is under the .env file which will be ignored by git
api_token = os.environ.get('WAQI_API_TOKEN')
print("API Token in Flask App:", api_token)

# Initialize SQLite database, collating all user searches into one table
conn = sqlite3.connect('search_history.db') # Establish connection to database
cursor = conn.cursor() # Allow execution of SQL commands

# Create a table to store search history
cursor.execute('''
    CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        aqi INTEGER,
        pm25 REAL,
        pm10 REAL,
        so2 REAL,
        no2 REAL,
        o3 REAL,
        co REAL,
        nh3 REAL
    )
''')
conn.commit() # Commit changes to database
conn.close() # Good practice to close connection

# Function to fetch air quality data from WAQI via the API token established
def fetch_air_quality_data(city): 
    # fstring to embed variables dynamically by user response
    api_url = f"http://api.waqi.info/feed/{city}/?token={api_token}"
    try:
        # Send API request, HTTP GET
        response = requests.get(api_url)
        if response.status_code == 200: # For successful request
            data = response.json()
            # The following is adapted to how the data will be extracted from WAQI which I have access to via Ron from WAQI
            if data['status'] == 'ok': # Ensure key of status is ok for success. 
                # Extracting AQI and specific pollutant data (AQI + 7 data)
                aqi_data = { # Dictionary of key value pairs
                    'aqi': data['data']['aqi'],
                    # Access dict values while providing default value if doesn't exist
                    'pm25': data['data'].get('iaqi', {}).get('pm25', {}).get('v', 'N/A'),
                    'pm10': data['data'].get('iaqi', {}).get('pm10', {}).get('v', 'N/A'),
                    'so2': data['data'].get('iaqi', {}).get('so2', {}).get('v', 'N/A'),
                    'no2': data['data'].get('iaqi', {}).get('no2', {}).get('v', 'N/A'),
                    'o3': data['data'].get('iaqi', {}).get('o3', {}).get('v', 'N/A'),
                    'co': data['data'].get('iaqi', {}).get('co', {}).get('v', 'N/A'),
                    'nh3': data['data'].get('iaqi', {}).get('nh3', {}).get('v', 'N/A') 
                }
                return aqi_data
            else:
                return {'error': 'Please check city name and try again!'}
        else:
            return {'error': f"API request failed with status code {response.status_code}"}
    except Exception as e:
        print(f"Error fetching air quality data: {e}")
        return {'error': str(e)}

@app.route('/')
def index():
    return render_template('index.html') # Default home page, and the only page actually rendered

# To insert these collated data into our created SQL table per session at the start
def insert_search_result(city, data):
    conn = sqlite3.connect('search_history.db')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO search_history (city, aqi, pm25, pm10, so2, no2, o3, co, nh3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (city, data['aqi'], data['pm25'], data['pm10'], data['so2'], data['no2'], data['o3'], data['co'], data['nh3']))

    conn.commit()
    conn.close()

@app.route('/fetch_data/<city>', methods=['GET']) # Only when search is made with dynamic url to pass city name
def fetch_data(city):
    data = fetch_air_quality_data(city)
    if not data.get('error'): # For all successfull fetches
        # Store the search result in the database
        insert_search_result(city, data)
        return jsonify(data) # Convert to json for easy processing in front-end and displaying
    else:
        return jsonify(data), 404 # Show error 404 not found!


if __name__ == '__main__':
    app.run(debug=True) # Flask debugging mode alw useful for development stage

