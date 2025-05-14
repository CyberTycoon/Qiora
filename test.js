// test.js
// Save this code as test.js in your project directory.
// Run with: node test.js

// Load environment variables from .env file
// Make sure you have the 'dotenv' package installed (`npm install dotenv`)
require('dotenv').config();

// Import the Google Generative AI library
// Make sure you have the library installed (`npm install @google/generative-ai`)
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Note: The class name is GoogleGenerativeAI

// Get your Google API key from environment variables
// Make sure you set GOOGLE_API_KEY in your .env file in the same directory
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Check if the API key is set
if (!GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is not set.");
  console.error("Please create a .env file in the same directory with GOOGLE_API_KEY=your_gemini_key");
  // Exit the script if the key is missing
  process.exit(1);
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Async function to test the Google Gemini API connection
async function testGeminiAPI() {
  console.log("Testing Google Gemini API connection...");

  // Select the model you want to use
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Using a recent Flash model name

  // Define the prompt
  const prompt = "Create clear, informative educational content that breaks down complex topics into understandable sections. Generate a comprehensive study guide for machine learning with key concepts, definitions, examples, and practice questions.";

  console.log(`Sending prompt to Gemini API: "${prompt}"`);

  try {
    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Get the response text
    // The structure might vary slightly based on API version and response type
    const response = await result.response; // Access the Response object
    const text = response.text(); // Get the text content

    console.log("Success! API Response:");
    console.log(text);

  } catch (error) {
    // Catch any errors during the API call
    console.error("Error during the API call:", error);

    // Attempt to log more details if available (e.g., from API error response)
    if (error.response && error.response.text) {
        try {
            const errorDetails = await error.response.text();
            console.error("API Error Details:", errorDetails);
        } catch (e) {
            // Ignore if response body cannot be read
        }
    }
  }
}

// Call the async function to execute the API test when the script runs
testGeminiAPI();
