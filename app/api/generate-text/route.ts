// app/api/generate-text/route.ts
import { NextResponse } from 'next/server';
// Import the Google Generative AI library
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define your Google API key in your .env file
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Initialize the Google Generative AI client
// Ensure GOOGLE_API_KEY environment variable is set
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || ""); // Provide a default empty string if not set

// Response interface for typing our successful response
interface GenerationResponse {
  text: string;
  // error?: string; // Errors are handled by returning a NextResponse with a status
}

// Function to prepare the prompt for Gemini
// Gemini uses a 'contents' array with roles ('user', 'model')
function preparePromptForGemini(prompt: string, template: string): Array<{ role: string; parts: Array<{ text: string }> }> {
  // Make sure the prompt isn't empty
  if (!prompt.trim()) {
    // Return a default or empty message if the prompt is empty
    return [{ role: "user", parts: [{ text: "Please provide a brief response." }] }];
  }

  // Craft a system message based on the template
  let systemMessage = "You are a professional writer and content creator. ";

  // Add context based on the template
  switch (template) {
    case "content-creator":
      systemMessage += "Create high-quality, engaging content that resonates with readers and follows best content creation practices.";
      break;
    case "marketing":
      systemMessage += "Create persuasive, benefit-focused marketing copy that drives action and highlights the unique selling points.";
      break;
    case "education":
      systemMessage += "Create clear, informative educational content that breaks down complex topics into understandable sections.";
      break;
    case "developer":
      systemMessage += "Create well-commented, efficient code and technical documentation with clear explanations.";
      break;
    default:
      // Fallback system message if template is not recognized
      systemMessage += "Create high-quality content that is engaging, clear, and valuable to the reader.";
  }

  // Gemini models typically handle system instructions implicitly or as part of the first user turn.
  // For simplicity and common usage with chat models, we'll structure as user messages.
  // A more advanced approach might use the system instruction feature if available and suitable.

  // Construct the 'contents' array for the Gemini API
  const contents = [
    { role: "user", parts: [{ text: systemMessage + "\n\nPlease respond to the following request:\n" + prompt }] }
    // You could potentially add a 'model' turn here if you were continuing a conversation
    // { role: "model", parts: [{ text: "Okay, I understand. Here is the content:" }] }
  ];

  return contents;
}


// Next.js API Route Handler for POST requests
// This handler is expected to be located at /api/generate-text
export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!GOOGLE_API_KEY) {
      console.error("Missing Google API key in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 } // Internal Server Error
      );
    }

    // Parse the request body
    let promptData: { prompt: string; template?: string };
    try {
      promptData = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body: Could not parse JSON" },
        { status: 400 } // Bad Request
      );
    }

    const { prompt, template = "content-creator" } = promptData;

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Valid prompt (string) is required in the request body" },
        { status: 400 } // Bad Request
      );
    }

    // Prepare the prompt for Gemini
    const contents = preparePromptForGemini(prompt, template);

    console.log("Sending prompt to Gemini API:", {
      templateUsed: template,
      originalPromptLength: prompt.length,
      // Log the structure being sent to Gemini
      contents: contents
    });

    // Select the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use the Flash model

    // Define generation configuration
    const generationConfig = {
      maxOutputTokens: 500, // Maximum number of tokens to generate
      temperature: 0.7, // Controls randomness (0.0 to 1.0)
      topP: 0.95, // Controls diversity via nucleus sampling
      // topK: 40, // Optional: Controls diversity via top-k sampling
    };

    // Call the Google Gemini API
    let result;
    try {
      result = await model.generateContent({
        contents: contents, // Pass the prepared contents array
        generationConfig: generationConfig, // Pass the configuration
      });
    } catch (e: any) { // Catch errors during the API call
      console.error("Error calling Google Gemini API:", e);

      // Attempt to extract error details from the API response if available
       let errorMessage = "Failed to connect to AI service";
       if (e.response && e.response.text) {
           try {
               const errorDetails = await e.response.text();
               console.error("API Error Details:", errorDetails);
               // You might parse errorDetails if it's JSON to get a more specific message
               // errorMessage = parsedError.message || errorMessage;
           } catch (parseError) {
               console.error("Failed to parse API error response body:", parseError);
           }
       } else if (e.message) {
           errorMessage = e.message; // Use the error message if no response body
       }


      return NextResponse.json(
        { error: errorMessage },
        { status: e.status || 500 } // Use error status if available, otherwise 500
      );
    }

    // Get the response object from the result
    const response = await result.response;

    // Extract the generated text
    let generatedText = "";
    if (response && response.text) {
       generatedText = response.text(); // Gemini response provides a text() method
    } else {
       console.warn("Unexpected response format or missing text from Gemini API:", response);
       // Handle cases where the response structure is unexpected
       return NextResponse.json(
           { error: "Unexpected AI service response format" },
           { status: 500 } // Internal Server Error
       );
    }

    // No need to clean up instruction markers like [/INST] as we are using Gemini's format

    // Return the generated text to the client
    return NextResponse.json({ text: generatedText } as GenerationResponse);

  } catch (error: any) { // Catch any unhandled errors during the process
    console.error("Unhandled error in generate route:", error);
    return NextResponse.json(
      { error: `An unexpected server error occurred: ${error.message || 'Unknown error'}` },
      { status: 500 } // Internal Server Error
    );
  }
}
