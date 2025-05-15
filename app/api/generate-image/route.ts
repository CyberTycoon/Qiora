// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Get the HuggingFace API key from environment variables
const HF_API_KEY = process.env.HF_TOKEN;

// Increase the max duration for this API route (Next.js feature)
export const maxDuration = 60; // 300 seconds (5 minutes)

// Increase the request body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!HF_API_KEY) {
      console.error("HuggingFace API key is missing");
      return NextResponse.json(
        { error: 'Server configuration error: API key not found' },
        { status: 500 }
      );
    }

    // Extract the request body
    const body = await request.json();
    const { prompt, style, complexity } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a more detailed prompt using the style and complexity info
    const enhancedPrompt = `${prompt}, style: ${style || 'natural'}, detail level: ${complexity || 50}%`;
    
    console.log(`Sending request to HuggingFace API with prompt: "${enhancedPrompt.substring(0, 50)}..."`);
    
    // Make a request to the HuggingFace API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout
    
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${HF_API_KEY}`
          },
          body: JSON.stringify({ 
            inputs: enhancedPrompt,
            parameters: {
              // Optional parameters for the model - simpler to avoid potential issues
              guidance_scale: 8,
              num_inference_steps: 80,
            }
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      // Check if the model is still loading
      if (response.status === 503) {
        const responseText = await response.text();
        if (responseText.includes("Model is currently loading")) {
          console.log("Model is loading, returning status to client");
          return NextResponse.json({ 
            error: 'Model is still loading, please try again in a moment',
            retryAfter: 10 // Suggest retry after 10 seconds
          }, { status: 503 });
        }
      }

      if (!response.ok) {
        const error = await response.text();
        console.error("HuggingFace API error:", error);
        return NextResponse.json(
          { error: `Failed to generate image: ${error}` },
          { status: response.status }
        );
      }

      // Check the content type of the response
      const contentType = response.headers.get('content-type');
      console.log(`Received response with content type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON error responses
        const jsonResponse = await response.json();
        console.error("Unexpected JSON response:", jsonResponse);
        return NextResponse.json(
          { error: 'Received JSON instead of image data' },
          { status: 500 }
        );
      }

      // Get the image data as a buffer
      const imageBuffer = await response.arrayBuffer();
      if (imageBuffer.byteLength === 0) {
        return NextResponse.json(
          { error: 'Received empty image data' },
          { status: 500 }
        );
      }
      
      // Convert buffer to base64 for sending to client
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      return NextResponse.json({ imageUrl: dataUrl });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Request timed out");
        return NextResponse.json(
          { error: 'Request timed out. Image generation took too long.' },
          { status: 504 }
        );
      }
      throw fetchError; // Re-throw to be caught by outer try/catch
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}