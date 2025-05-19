import { NextRequest, NextResponse } from 'next/server';

// Get the HuggingFace API key from environment variables
const HF_API_KEY = process.env.HF_TOKEN;

// Increase the max duration for this API route (Next.js feature)
export const maxDuration = 60; // 60 seconds (1 minute)

// Increase the request body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
    responseLimit: false,
  },
};

// Model configuration
const MODEL_CONFIG = {
  model: "stabilityai/stable-diffusion-xl-base-1.0",
  defaultParameters: {
    guidance_scale: 7.5,         // Controls how closely the image follows the prompt
    num_inference_steps: 50,     // Balance between quality and speed
    seed: undefined,             // Let it be random by default
    negative_prompt: "blurry, distorted, disfigured, low quality, pixelated, watermark, text, words, letters, signature, poor composition",
  }
};

// Define a type for valid style names
type StyleName = 
  | 'Product Photography' 
  | 'Flat Design' 
  | 'Corporate' 
  | 'Bold' 
  | 'Informational' 
  | 'Illustration' 
  | 'Concept Art' 
  | 'Minimalist' 
  | 'Abstract' 
  | 'Editorial' 
  | 'Conceptual' 
  | 'Metaphorical' 
  | 'Storytelling'
  | 'natural';

// Mapping of style keywords to effective prompts for application-specific styles
const STYLE_ENHANCERS: Record<StyleName, string> = {
  // Commercial/Marketing Styles
  'Product Photography': 'professional product photography, clean background, commercial quality, studio lighting, detailed product showcase, high resolution, advertisement quality',
  'Flat Design': 'flat design style, simplified shapes, bold colors, clean lines, minimal shading, vector-like appearance, modern graphic design',
  'Corporate': 'corporate design, professional aesthetic, business-appropriate, clean layout, polished look, professional presentation style',
  'Bold': 'bold design, striking colors, high contrast, eye-catching composition, dramatic lighting, impactful visuals',
  'Informational': 'clear informational graphics, educational style, data visualization aesthetic, organized layout, instructional quality',
  
  // Artistic Styles
  'Illustration': 'digital illustration, artistic rendering, hand-drawn appearance, colorful artwork, detailed illustration style',
  'Concept Art': 'concept art style, imaginative visualization, detailed environment, professional concept artwork, creative design',
  'Minimalist': 'minimalist design, simple composition, clean lines, limited color palette, elegant simplicity, refined aesthetic',
  'Abstract': 'abstract art style, non-representational, creative expression, artistic composition, modern abstract aesthetic',
  
  // Content Styles
  'Editorial': 'editorial style imagery, publication quality, magazine aesthetic, professional composition, journalistic quality',
  'Conceptual': 'conceptual artwork, idea-focused imagery, symbolic visual, metaphorical representation, thought-provoking composition',
  'Metaphorical': 'metaphorical imagery, symbolic representation, visual allegory, meaningful composition, symbolic visual storytelling',
  'Storytelling': 'narrative illustration, story-focused composition, scene with context, evocative imagery, visual storytelling',
  
  // Fallback style
  'natural': 'photo-realistic, detailed, high quality photography'
};

/**
 * Enhances a user prompt based on style and complexity settings
 */
function enhancePrompt(userPrompt: string, style: string = 'natural', complexity: number = 50) {
  // Get the style enhancer or use a default one
  const sanitizedStyle = isValidStyle(style) ? style : 'natural';
  const styleText = STYLE_ENHANCERS[sanitizedStyle as StyleName];
  
  // Adjust level of detail based on complexity
  let detailLevel = "";
  if (complexity >= 80) {
    detailLevel = "extremely detailed, intricate details, complex composition, hyper-realistic, 8k resolution";
  } else if (complexity >= 60) {
    detailLevel = "highly detailed, fine details, professional quality, 4k resolution";
  } else if (complexity >= 40) {
    detailLevel = "moderately detailed, clear composition";
  } else {
    detailLevel = "simple composition, basic details";
  }
  
  // Add style-specific prompt enhancers
  let additionalPrompt = "";
  
  // Product related enhancements
  if (sanitizedStyle === 'Product Photography') {
    additionalPrompt = ", perfect lighting, no shadows, isolated product, commercial quality";
  } 
  // Corporate/informational enhancements
  else if (['Corporate', 'Informational'].includes(sanitizedStyle)) {
    additionalPrompt = ", professional, clear, organized visual hierarchy, suitable for business context";
  }
  // Artistic enhancements
  else if (['Illustration', 'Concept Art'].includes(sanitizedStyle)) {
    additionalPrompt = ", creative composition, artistic merit, imaginative approach";
  }
  // Editorial/storytelling enhancements
  else if (['Editorial', 'Storytelling', 'Metaphorical'].includes(sanitizedStyle)) {
    additionalPrompt = ", evocative, communicates clear meaning, visually engaging narrative";
  }
  
  // Return the enhanced prompt
  return `${userPrompt}, ${styleText}, ${detailLevel}${additionalPrompt}`;
}

/**
 * Type guard to check if a style is valid
 */
function isValidStyle(style: string): style is StyleName {
  return style in STYLE_ENHANCERS;
}

/**
 * Calculates optimal model parameters based on user preferences
 */
function calculateParameters(baseParams: any, style: string, complexity: number = 50) {
  const params = { ...baseParams };
  
  // Adjust steps based on complexity
  params.num_inference_steps = Math.min(Math.max(Math.floor(complexity * 0.7) + 30, 30), 100);
  
  // Ensure style is valid
  const sanitizedStyle = isValidStyle(style) ? style : 'natural';
  
  // Adjust guidance scale based on style category
  if (['Abstract', 'Metaphorical', 'Conceptual'].includes(sanitizedStyle)) {
    params.guidance_scale = 5.0; // Lower guidance for more creative freedom
  } else if (['Product Photography', 'Corporate', 'Editorial'].includes(sanitizedStyle)) {
    params.guidance_scale = 8.5; // Higher guidance for more prompt adherence
  } else if (['Minimalist', 'Flat Design'].includes(sanitizedStyle)) {
    params.guidance_scale = 7.0; // Balanced guidance for clean designs
  } else if (['Bold', 'Concept Art', 'Storytelling'].includes(sanitizedStyle)) {
    params.guidance_scale = 7.8; // Slightly higher guidance for impact
  }
  
  return params;
}

/**
 * Validates and normalizes image dimensions
 */
function validateDimensions(width: number, height: number) {
  // Valid values for SDXL (must be multiples of 8)
  const validDimensions = [512, 576, 640, 704, 768, 832, 896, 960, 1024];
  
  // Find the closest valid dimensions
  const findClosest = (value: number) => {
    return validDimensions.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };
  
  const normalizedWidth = findClosest(width || 1024);
  const normalizedHeight = findClosest(height || 1024);
  
  return {
    width: normalizedWidth,
    height: normalizedHeight
  };
}

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
    const { 
      prompt, 
      style = 'natural', 
      complexity = 50, 
      seed, 
      width = 1024, 
      height = 1024
    } = body;
    
    console.log(`Received image generation request with dimensions: ${width}x${height}`);

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedStyle = isValidStyle(style) ? style as StyleName : 'natural';
    const sanitizedComplexity = Math.min(Math.max(parseInt(String(complexity)) || 50, 10), 100);
    const aspectRatio = validateDimensions(width, height);
    
    // Create an enhanced prompt
    const enhancedPrompt = enhancePrompt(prompt, sanitizedStyle, sanitizedComplexity);
    
    // Calculate optimized parameters
    const parameters = calculateParameters(MODEL_CONFIG.defaultParameters, sanitizedStyle, sanitizedComplexity);
    
    // Apply any user-provided seed
    if (seed && !isNaN(parseInt(String(seed)))) {
      parameters.seed = parseInt(String(seed));
    }
    
    // For specific styles, let's add style-specific negative prompts
    if (['Product Photography', 'Corporate', 'Informational'].includes(sanitizedStyle)) {
      parameters.negative_prompt += ", childish, amateur, unprofessional";
    } else if (['Minimalist', 'Flat Design'].includes(sanitizedStyle)) {
      parameters.negative_prompt += ", busy, cluttered, complex, detailed, noisy background";
    }
    
    console.log(`Generating image with prompt: "${enhancedPrompt.substring(0, 50)}..."`);
    console.log(`Using parameters:`, parameters);
    
    // Make a request to the HuggingFace API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout to match client
    
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${MODEL_CONFIG.model}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${HF_API_KEY}`
          },
          body: JSON.stringify({ 
            inputs: enhancedPrompt,
            parameters: {
              ...parameters,
              width: aspectRatio.width,
              height: aspectRatio.height,
            }
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      // Handle model loading states - matches client-side handling
      if (response.status === 503) {
        const responseText = await response.text();
        if (responseText.includes("Model is currently loading")) {
          console.log("Model is loading, returning status to client");
          return NextResponse.json({ 
            error: 'Model is still loading',
            status: 'loading',
            retryAfter: 10 // Suggest retry after 10 seconds
          }, { status: 503 }); // Return 503 to match client expectations
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
          { error: 'Received JSON instead of image data', details: jsonResponse },
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

      // Return the image along with the parameters used (for potential reuse)
      return NextResponse.json({ 
        imageUrl: dataUrl,
        generationInfo: {
          prompt: enhancedPrompt,
          parameters: {
            style: sanitizedStyle,
            complexity: sanitizedComplexity,
            seed: parameters.seed,
            steps: parameters.num_inference_steps,
            guidance: parameters.guidance_scale,
            dimensions: `${aspectRatio.width}x${aspectRatio.height}`
          }
        }
      });
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