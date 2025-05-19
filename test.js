// test.js
// Save this code as test.js in your project directory.
// Run with: node test.js

// Load environment variables from .env file
// Make sure you have the 'dotenv' package installed (`npm install dotenv`)
require('dotenv').config();

// You'll need the 'node-fetch' package installed if running in Node.js environment
// (`npm install node-fetch`)
// We use a dynamic import() because node-fetch is an ES Module.

// Get your Mistral AI API key from environment variables
// Make sure you set MISTRAL_API_KEY in your .env file in the same directory
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// Check if the API key is set
if (!MISTRAL_API_KEY) {
  console.error("ERROR: MISTRAL_API_KEY environment variable is not set.");
  console.error("Please create a .env file in the same directory with MISTRAL_API_KEY=your_mistral_key");
  // Exit the script if the key is missing
  process.exit(1);
}

// Async function to test the Mistral AI API connection
async function testMistralAPI() {
  console.log("Testing Mistral AI API connection...");

  // Dynamically import node-fetch
  let fetch;
  try {
      // Dynamic import returns a Promise that resolves with the module
      const nodeFetchModule = await import('node-fetch');
      // The fetch function itself is typically the default export
      fetch = nodeFetchModule.default;
  } catch (error) {
      console.error("Failed to import 'node-fetch'. Make sure it is installed (`npm install node-fetch`).", error);
      // Exit if fetch cannot be imported
      process.exit(1);
  }

  // Mistral AI API uses a chat message format for chat completions
  // Construct the payload using the parameters from your provided JSON structure
  const payload = {
    // Specify the model you want to use
    model: "mistral-large-latest", // Using the model from your JSON

    // Messages array representing the conversation history
    messages: [
      // Using the message from your JSON
      {
        "role": "user",
        "content": "teach me about the origin of christianity"
      }
    ],

    // Generation parameters from your JSON
    temperature: 1.5, // Using the temperature from your JSON (note: this is high)
    // Correcting max_tokens from 0 to a reasonable value
    max_tokens: 500, // Changed from 0 to 200 to allow generation
    top_p: 1, // Using top_p from your JSON
    stream: false, // Using stream from your JSON
    // stop: "string", // Using stop from your JSON (Note: "string" might not be a valid stop sequence)
    random_seed: 0, // Using random_seed from your JSON
    // response_format: { // Optional/Advanced: Include if you need specific JSON output format
    //   "type": "text", // Or "json_object" if you need JSON
    //   // "json_schema": { ... } // Include schema if type is json_object
    // },
    // tools: [], // Optional/Advanced: Include if using function calling
    // tool_choice: "auto", // Optional/Advanced: Include if using function calling
    presence_penalty: 0, // Using presence_penalty from your JSON
    frequency_penalty: 0, // Using frequency_penalty from your JSON
    n: 1, // Using n from your JSON
    // prediction: { ... }, // This seems like a response field, not a request parameter
    // parallel_tool_calls: true, // Optional/Advanced: Include if using function calling
    safe_prompt: false // Using safe_prompt from your JSON
  };

  // Mistral AI API chat completions endpoint URL
  const apiUrl = "https://api.mistral.ai/v1/chat/completions";

  console.log(`Sending request to Mistral AI API at: ${apiUrl}`);
  // console.log("Payload:", JSON.stringify(payload, null, 2)); // Optional: Log the full payload

  try {
    // Make the POST request to the Mistral AI API
    const response = await fetch(
      apiUrl,
      {
        method: "POST", // Use the POST method for chat completions
        headers: {
          "Content-Type": "application/json", // Specify content type
          // Use your Mistral AI API key in the Authorization header
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          // Optional: Add x-request-id header for tracing
          // 'x-request-id': `test-script-${Date.now()}`
        },
        // Send the payload as a JSON string in the request body
        body: JSON.stringify(payload),
      }
    );

    // Log the response status
    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    // Check if the response status is not OK (e.g., 401, 402, 404, 500)
    if (!response.ok) {
      // Read the response body as text first for better error reporting
      const errorBody = await response.text();
      console.error("Error response from API:", errorBody);

      // Attempt to parse the error body as JSON, as APIs often return JSON errors
      try {
        const errorJson = JSON.parse(errorBody);
        console.error("Parsed error details:", errorJson);
      } catch (e) {
        // If parsing fails, the error body was likely just plain text or empty
        console.warn("Error response body was not valid JSON.");
      }
      // Stop execution if there's an API error
      return;
    }

    // If the response is OK, parse the JSON response body
    const data = await response.json();
    console.log("Success! API Response:", JSON.stringify(data, null, 2));

    // Extract and log the generated text from the response
    // The structure is typically data.choices[0].message.content
    if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content !== undefined) {
        const generatedText = data.choices[0].message.content;
        console.log("\nGenerated Text:\n", generatedText);
    } else {
        // Handle cases where the response structure is unexpected
        console.warn("Unexpected response format or missing content from Mistral AI API:", data);
    }

  } catch (error) {
    // Catch any network errors or other exceptions during the fetch operation
    console.error("Error during the fetch operation:", error);
  }
}

// Call the async function to execute the API test when the script runs
testMistralAPI();
