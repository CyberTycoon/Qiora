// test-huggingface.js
// Save as a separate script and run with Node.js to test HF API directly
// Run with: node test-huggingface.js

// Load environment variables from .env file
require('dotenv').config();

// You'll need to install node-fetch if running in Node.js environment
// npm install node-fetch

// Use a dynamic import() to load node-fetch (which is an ES Module)
// This returns a Promise, so we need to await it inside an async function.
// The fetch function itself is available as the .default export of the module.


// Get your actual token from environment variables (now loaded by dotenv)
const HF_API_KEY = process.env.HF_TOKEN;

if (!HF_API_KEY) {
  console.error("ERROR: HF_TOKEN environment variable is not set.");
  console.error("Please create a .env file in the same directory with HF_TOKEN=your_token");
  process.exit(1);
}

async function testHuggingFaceAPI() {
  console.log("Testing Hugging Face API connection...");

  // Dynamically import node-fetch
  let fetch;
  try {
      const nodeFetchModule = await import('node-fetch');
      fetch = nodeFetchModule.default; // Get the default export which is the fetch function
  } catch (error) {
      console.error("Failed to import 'node-fetch'. Make sure it is installed (npm install node-fetch).", error);
      process.exit(1); // Exit if fetch cannot be imported
  }

  const payload = {
    inputs: "<s>[INST]You are a helpful assistant. tell me about OOP in python'[/INST]</s>",
    parameters: {
      max_new_tokens: 1000,
      temperature: 0.7,
      do_sample: true,
      return_full_text: false,
    },
  };

  const modelApiUrl = "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-llm-7b-chat";

  console.log(`Sending request to Hugging Face API at: ${modelApiUrl}`);

  try {
    const response = await fetch(
      modelApiUrl,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      // Try to read the response body as text first, then attempt JSON parsing
      const errorBody = await response.text();
      console.error("Error response from API:", errorBody);

      try {
        const errorJson = JSON.parse(errorBody);
        console.error("Parsed error details:", errorJson);
      } catch (e) {
        // If parsing fails, the error body was likely just text or empty
        console.warn("Error response body was not valid JSON.");
      }
      return; // Stop execution if there's an API error
    }

    const data = await response.json();
    console.log("Success! API Response:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Error during the fetch operation:", error);
  }
}

// Call the async function to execute the API test
testHuggingFaceAPI();
