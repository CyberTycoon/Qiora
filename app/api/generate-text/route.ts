// app/api/generate-text/route.ts
import { NextResponse } from 'next/server';

// Define your Hugging Face API key in your .env file
const HF_API_KEY = process.env.HF_TOKEN;

// Response interface for typing our response
interface GenerationResponse {
  text: string;
  error?: string;
}

// Function to enhance the prompt for better results
function enhancePrompt(prompt: string, template: string): string {
  // Make sure the prompt isn't empty
  if (!prompt.trim()) {
    return prompt;
  }

  // Craft a system message that helps model produce better content
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
      systemMessage += "Create high-quality content that is engaging, clear, and valuable to the reader.";
  }

  // Construct the enhanced prompt in Mistral's chat format
  const enhancedPrompt = `<s>[INST]${systemMessage}

Please respond to the following request:
${prompt}[/INST]</s>`;

  return enhancedPrompt;
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!HF_API_KEY) {
      console.error("Missing Hugging Face API key");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Parse the request body
    let promptData;
    try {
      promptData = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body: Could not parse JSON" },
        { status: 400 }
      );
    }

    const { prompt, template = "content-creator" } = promptData;

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    // Enhance the prompt based on template
    const enhancedPrompt = enhancePrompt(prompt, template);

    console.log("Sending enhanced prompt to Hugging Face:", {
      templateUsed: template,
      originalPromptLength: prompt.length,
      enhancedPromptLength: enhancedPrompt.length
    });

    // Create the payload for Hugging Face API
    const payload = {
      inputs: enhancedPrompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false,
      },
    };

    // Call the Hugging Face Inference API
    let response;
    try {
      response = await fetch(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HF_API_KEY}`,
          },
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    } catch (e) {
      console.error("Network error calling Hugging Face API:", e);
      return NextResponse.json(
        { error: "Failed to connect to AI service" },
        { status: 503 }
      );
    }

    if (!response.ok) {
      let errorMessage = `Hugging Face API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error(errorMessage, errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error(errorMessage);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Parse the API response
    let data;
    try { 
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse Hugging Face API response:", e);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }
    
    // Extract the generated text from the response
    // HF returns an array of generated sequences, we take the first one
    let generatedText = "";
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || "";
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else {
      console.warn("Unexpected response format from Hugging Face:", data);
      return NextResponse.json(
        { error: "Unexpected response format from AI service" },
        { status: 500 }
      );
    }

    // Clean up the response by removing any instruction markers if present
    generatedText = generatedText.replace(/\[\/INST\]/g, "").trim();

    // Return the generated text
    return NextResponse.json({ text: generatedText } as GenerationResponse);
  } catch (error) {
    console.error("Unhandled error in generate route:", error);
    return NextResponse.json(
      { error: "An error occurred while generating text" },
      { status: 500 }
    );
  }
}