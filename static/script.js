// Function of fetch-data from index.html where button associated with getting data from API
document.getElementById('fetch-data').addEventListener('click', function() {
    var city = document.getElementById('place').value;
    if (city) {
        fetch('/fetch_data/' + city)
            .then(response => response.json())
            .then(data => {
                // Display AQI calculation diagram with the fetched data
                displayMainData(data);
                // Add the search result to the search history table
                insertTable(city, data);
            })
            .catch(error => {
                console.error('Error fetching data:', error); // For debugging 
                displayError('Failed to fetch data. Please try again.'); // For users visual
            });
    } else {
        displayError('Please enter a city name!');
    }
});

function displayMainData(data) {
    var diagramContainer = document.querySelector('.diagram-container');
    var displayDiv = document.getElementById('data-display');

    // Clear existing content, including any error messages previously searched and displayed
    diagramContainer.innerHTML = '';
    displayDiv.innerHTML = '';
    displayDiv.style.display = 'none'; // Hide the display div until needed

    // Create a mapping for pollutant display names, for tidy presentation on front-end
    const pollutantLabels = {
        'pm25': 'PM2.5',
        'pm10': 'PM10',
        'so2': 'SO2',
        'no2': 'NO2',
        'o3': 'O3',
        'co': 'CO',
        'nh3': 'NH3'
    };

    // Create and append the AQI box if available
    if (data && !data.error && data.aqi) {
        var aqiBox = document.createElement('div');
        aqiBox.className = 'diagram-box aqi-box';
        aqiBox.textContent = `AQI: ${data.aqi}`;
        diagramContainer.appendChild(aqiBox);
    }

    // Loop through each pollutant and create a box as well
    Object.entries(pollutantLabels).forEach(([key, label]) => {
        var value = data[key] || 'N/A'; // Use 'N/A' if the pollutant value is missing
        var box = document.createElement('div');
        box.className = 'diagram-box';
        box.textContent = `${label}: ${value}`; // Using label for better presentation on front-end
        diagramContainer.appendChild(box);});

    // Color code the AQI box based on the AQI level
    var aqiValue = data.aqi;
    var aqiColor = '';
    if (aqiValue <= 50) {
        aqiColor = 'green';
    } else if (aqiValue <= 100) {
        aqiColor = 'light-green';
    } else if (aqiValue <= 200) {
        aqiColor = 'yellow';
    } else if (aqiValue <= 300) {
        aqiColor = 'dark-yellow';
    } else if (aqiValue <= 400) {
        aqiColor = 'red';
    } else {
        aqiColor = 'dark-red';
    }
    aqiBox.classList.add(aqiColor); 
    // orignially, diagram-box aqi-box, upon adding of aqiColor, eg., green, would add to the classes
    
    // Add AQI levels legend to the diagram
    aqiLegend(diagramContainer);
}

// Legends table to display the different range of AQIO levels and short descriptions
function aqiLegend(container) {
    const legendData = [
        { range: '0-50', description: 'Good - Little to no impact', color: 'green' },
        { range: '51-100', description: 'Satisfactory - Breathing difficulties to sensitive people', color: 'light-green' },
        { range: '101-200', description: 'Moderate - Breathing problems to people with lung or heart disease, children or elderly', color: 'yellow' },
        { range: '201-300', description: 'Poor - Long exposure will cause breathing difficulties to people', color: 'dark-yellow' },
        { range: '301-400', description: 'Very Poor - Respiratory illness induced on long exposures', color: 'red' },
        { range: '>401', description: 'Severe - Even healthy people will suffer from respiratory effects', color: 'dark-red' }
    ];

    const legend = document.createElement('div');
    legend.className = 'aqi-legend'; // assign class via css style sheet
    legendData.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item ' + item.color;
        legendItem.innerHTML = `<strong>${item.range}</strong>: ${item.description}`;
        legend.appendChild(legendItem);
    });
    container.appendChild(legend);
}

// Since error is displayed in a few different places, create a function to display it
function displayError(message) {
    var displayDiv = document.getElementById('data-display');
    displayDiv.innerHTML = ''; // Clear existing content before showing error
    displayDiv.style.display = 'block'; // Ensure it's visible
    var errorMessage = document.createElement('p'); 
    errorMessage.className = 'text-danger'; // Red text as styled in css
    errorMessage.textContent = message;
    displayDiv.appendChild(errorMessage); // Append to make it visible on the page 
}


function insertTable(city, data) {
    var cTable = document.getElementById('compareTable');
    var newRow = cTable.insertRow(0); // Insert at the top of the table
    var cells = [];

    // Create and populate cells for the new row according to labels established in data
    for (var i = 0; i < 9; i++) { // 
        cells.push(newRow.insertCell(i));
    }

    cells[0].textContent = city.toUpperCase(); // So if user types in any variation of capitalization, capitalization is standardized in "search" table
    cells[1].textContent = data.aqi;
    cells[2].textContent = data.pm25;
    cells[3].textContent = data.pm10;
    cells[4].textContent = data.so2;
    cells[5].textContent = data.no2;
    cells[6].textContent = data.o3;
    cells[7].textContent = data.co;
    cells[8].textContent = data.nh3;

}