const axios = require('axios');

const sendSMS = async (message, mobileNumber) => {
  const apiKey = "aQFLm94GnDbCPNX3KlT61rpWt2BVkwAZMSIERq8iHOyU7gjocJsYFUj30Ro6SngcXr9DQHKihtuJTq7b"; // Replace with your actual API key
  const numbers = 9970807617; // Can be a single number or comma-separated for multiple
  const route = "quick"; // Use 'quick' for the Quick SMS route without DLT registration
  const language = "english";
  const flash = "0"; // Set to "1" for a flash message

  // The payload for the POST request
  const data = {
    authorization: apiKey,
    message: message,
    language: language,
    route: route,
    numbers: numbers,
    flash: flash
  };

  try {
    const response = await axios.post('https://www.fast2sms.com', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      }
    });
    console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
  }
};

// Example usage
sendSMS("Hello, this is a test message!", "9552598330"); // Replace with a valid 10-digit number
