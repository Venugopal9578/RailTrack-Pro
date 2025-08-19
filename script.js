// Get references to all the new HTML elements
const trainNumberInput = document.getElementById('train-number-input');
const searchBtn = document.getElementById('search-btn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const statusWrapper = document.getElementById('status-wrapper');
const statusCard = document.getElementById('train-status-card');
const geminiCard = document.getElementById('gemini-summary-card');
const geminiBtn = document.getElementById('gemini-btn');
const geminiLoader = document.getElementById('gemini-loader');
const geminiSummaryContent = document.getElementById('gemini-summary-content');

let currentTrainData = null;

searchBtn.addEventListener('click', getTrainStatus);
geminiBtn.addEventListener('click', getGeminiSummary);
trainNumberInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') getTrainStatus();
});

function getMockTrainStatus(trainNumber) {
    console.log(`Fetching mock data for train: ${trainNumber}`);
    const mockTrainDatabase = [
        { train_name: "MUMBAI RAJDHANI", current_station_name: "Borivali", status: "Departed from Borivali. On time.", delay: "0 minutes", next_station_name: "Mumbai Central", expected_arrival_time_at_next_station: "08:15 AM" },
        { train_name: "SHATABDI EXPRESS", current_station_name: "Ghaziabad Jn", status: "Approaching Ghaziabad. Running 15 mins late.", delay: "15 minutes", next_station_name: "New Delhi", expected_arrival_time_at_next_station: "10:45 AM" },
        { train_name: "VANDE BHARAT", current_station_name: "Ambala Cantt Jn", status: "Arrived at Ambala. On time.", delay: "0 minutes", next_station_name: "New Delhi", expected_arrival_time_at_next_station: "12:30 PM" },
        { train_name: "TEJAS EXPRESS", current_station_name: "Kanpur Central", status: "Departed from Kanpur. Running 5 mins early.", delay: "-5 minutes", next_station_name: "Lucknow", expected_arrival_time_at_next_station: "01:20 PM" },
        { train_name: "DURONTO EXPRESS", current_station_name: "Nagpur Jn", status: "Technical halt at Nagpur.", delay: "25 minutes", next_station_name: "Itarsi Jn", expected_arrival_time_at_next_station: "04:50 PM" },
        { train_name: "GARIB RATH", current_station_name: "Patna Jn", status: "Departed from Patna. On time.", delay: "2 minutes", next_station_name: "Mughal Sarai", expected_arrival_time_at_next_station: "07:00 PM" },
        { train_name: "CHENNAI EXPRESS", current_station_name: "Vijayawada Jn", status: "Approaching Vijayawada. 30 mins late.", delay: "30 minutes", next_station_name: "Chennai Central", expected_arrival_time_at_next_station: "11:00 PM" },
        { train_name: "HOWRAH MAIL", current_station_name: "Asansol Jn", status: "Arrived at Asansol. On time.", delay: "0 minutes", next_station_name: "Howrah Jn", expected_arrival_time_at_next_station: "03:30 AM" },
        { train_name: "PUNE DURONTO", current_station_name: "Lonavala", status: "Departed Lonavala. On time.", delay: "1 minute", next_station_name: "Pune Jn", expected_arrival_time_at_next_station: "09:45 AM" },
        { train_name: "BENGALURU RAJDHANI", current_station_name: "Secunderabad Jn", status: "Departed Secunderabad. 10 mins late.", delay: "10 minutes", next_station_name: "Bengaluru City", expected_arrival_time_at_next_station: "06:00 AM" }
    ];
    const lastDigit = parseInt(trainNumber.slice(-1), 10);
    const selectedTrain = mockTrainDatabase[lastDigit % mockTrainDatabase.length];
    return new Promise(resolve => setTimeout(() => resolve({ status: true, data: selectedTrain }), 800));
}

async function getTrainStatus() {
    const trainNumber = trainNumberInput.value.trim();
    if (!/^\d{5}$/.test(trainNumber)) {
        showError('Please enter a valid 5-digit train number.');
        return;
    }
    clearResults();
    showLoader(true);
    try {
        const result = await getMockTrainStatus(trainNumber);
        if (result.status && result.data) {
            currentTrainData = result.data;
            displayTrainStatus(currentTrainData);
        } else {
            showError('Could not retrieve train data.');
        }
    } catch (error) {
        showError('An unexpected error occurred.');
    } finally {
        showLoader(false);
    }
}

function displayTrainStatus(data) {
    statusCard.innerHTML = `
        <div class="card-header">
            <h2>${data.train_name}</h2>
            <p>Last Updated: ${new Date().toLocaleTimeString('en-IN')}</p>
        </div>
        <div class="status-grid">
            <div class="status-item">
                <div class="label">Current Status</div>
                <div class="value">${data.status}</div>
            </div>
            <div class="status-item">
                <div class="label">Delay</div>
                <div class="value ${parseInt(data.delay) >= 5 ? 'delayed' : 'on-time'}">${data.delay}</div>
            </div>
            <div class="status-item">
                <div class="label">Next Station</div>
                <div class="value">${data.next_station_name}</div>
            </div>
            <div class="status-item">
                <div class="label">Expected Arrival</div>
                <div class="value">${data.expected_arrival_time_at_next_station}</div>
            </div>
        </div>
    `;
    statusWrapper.style.display = 'flex';
}

// --- FINAL, MOCK GEMINI FUNCTION ---
// This function simulates a successful Gemini API call.
async function getGeminiSummary() {
    if (!currentTrainData) return;
    geminiLoader.style.display = 'block';
    geminiSummaryContent.textContent = '';
    geminiBtn.style.display = 'none';

    // Simulate a network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockSummary = `Looks like the ${currentTrainData.train_name} is making good time! It's currently ${currentTrainData.status.toLowerCase()}. The delay is only about ${currentTrainData.delay}, so you're pretty much on schedule. Have a safe and pleasant journey!`;

    geminiSummaryContent.textContent = mockSummary;
    geminiLoader.style.display = 'none';
}

function showLoader(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function clearResults() {
    errorMessage.style.display = 'none';
    statusWrapper.style.display = 'none';
    geminiBtn.style.display = 'block';
    geminiSummaryContent.textContent = 'Click below to generate a travel summary.';
    currentTrainData = null;
}
