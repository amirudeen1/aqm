# Air Quality Monitor Web App
#### Video Demo:  <https://youtu.be/pmJ12uHT0Vs>

### Introduction:
This is my 2nd project, another one as a final project for a cs50 course, this time it is for cs50x. This one, although the idea was initially huge, but felt that it would take too much time learning ML and the tools associated with it on my own, as I intend to take it as the next course, however using the skills gained from cs50x, this web app is a useful tool that I myself would use as a research engineer in air quality sciences, monitoring important data to myself especially the AQI and PM2.5 levels at the click of a button. Basically, this is a full stack project where the back-end works to fetch real-time data via an API token to WAQI which displays results dynamically on the frontend where user and learn about different AQI levels and search on any country/city that has official results under WAQI.

Formally, The Air Quality Monitor Web App is a Flask-based application designed to provide real-time air quality and (in future) temperature data. It leverages the World Air Quality Index (WAQI) API for data retrieval. This project, an extension of the skills developed in CS50x, showcases the practical application of Flask, SQLite, JavaScript, and API integration.

### Project Overview:
The application's primary function is to offer users the ability to check current air quality indicators for a specified city. It fetches data from the WAQI and stores user search history in a SQLite database. The goal is to evolve this project into a more sophisticated tool capable of predictive analytics using machine learning.

#### Key Features:
1) Real-time Air Quality and Temperature Data: Fetches and displays live data from WAQI.
2) Search History Tracking: Maintains a record of users searches in a SQLite database.
3) User-Friendly Interface: Designed with Bootstrap for a responsive layout.
4) Secure API Token Management: Utilizes environment variables for API token storage.

#### Future Enhancements/Goals:
1) Integration of large-scale datasets and machine learning algorithms for predictive analysis.
2) Expansion of the web app's functionalities and user interface improvements.

### Technical Details:

#### app.py
This file is the core of the Flask application. It includes:

- Initialization of the Flask app and database connection.
- Function fetch_air_quality_data() to retrieve data from WAQI using the API token.
- Route / rendering the main page (index.html).
- Route /fetch_data/<city> to fetch and return air quality data for a specified city.
- Function insert_search_result() to store search results in the SQLite database.

#### api.env
Stores the WAQI API token securely. It is not tracked by Git due to the inclusion in .gitignore.

#### templates/
##### index.html
The main HTML file, located in the templates directory. It includes:

- Bootstrap for styling.
- Input field for city search and a display area for air quality data.
- A JavaScript section to handle API data fetching and display.

#### static/
##### script.js
Also in the static folder, it contains JavaScript functions for:

- Sending requests to the Flask backend.
- Displaying fetched data and search history on the frontend.
- Handling errors and data presentation.

##### styles.css
Located in the static folder, this file contains custom CSS styles for the application, including responsiveness and layout design.

#### requirements.txt

### Technical Stack
- Flask: Python web framework used for backend operations.
- SQLite: Database for storing user search history.
- JavaScript: For handling frontend logic and API data display.
- Bootstrap & jQuery: For responsive design and dynamic content manipulation.
- dotenv: Python package for managing environment variables.

### Design choices and Best Practices
- API Integration: Starting with a simple API request was a strategic choice to manage complexity, considering the initial intent to handle large datasets.

- Modular JavaScript: Separating JavaScript from HTML aids in maintainability and scalability, especially for future expansions.

- Environmental Variables for API Token: Ensures security and privacy, preventing sensitive data from being exposed in the codebase.

- Bootstrap and jQuery Reuse: Leveraging familiar tools from CS50x allowed for a more efficient development process while ensuring a polished user interface.

- API tokens are stored in api.env and are not tracked by Git, adhering to best security practices.

- The application is structured to be scalable and maintainable, with clear separation of concerns (front end, back end, and data handling).

### Conclusion:
This project marks the beginning of a journey into more complex web applications involving data analysis and machine learning. It currently serves as a practical application of skills learned in CS50x, with a roadmap for incorporating more advanced technologies and methodologies in the future as I pick them up, including the potential integration of predictive analytics using machine learning.