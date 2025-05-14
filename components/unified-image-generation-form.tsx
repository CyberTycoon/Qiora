"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, Sparkles, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type ImageTemplate = {
  name: string
  description: string
  placeholder: string
  presets: {
    [key: string]: string
  }
  styles: string[]
}

const imageTemplates: { [key: string]: ImageTemplate } = {
  "social-media": {
    name: "Social Media",
    description: "Create images for Instagram, Facebook, Twitter, and other social platforms.",
    placeholder: "A lifestyle photo of someone using a sustainable water bottle in a cafe...",
    presets: {
      "instagram-post":
        "A lifestyle photo of [subject] with [description], perfect for Instagram, vibrant colors, professional lighting",
      "facebook-ad": "A promotional image for [product/service] showing [benefit/feature], optimized for Facebook ads",
      "twitter-header": "A banner image for a Twitter profile about [topic/brand] with [description]",
      "pinterest-pin": "A vertical image showing [subject] with text overlay for [topic], designed for Pinterest",
    },
    styles: ["Photorealistic", "Lifestyle", "Minimalist", "Vibrant", "Branded"],
  },
  marketing: {
    name: "Marketing",
    description: "Generate images for ads, product photos, and marketing materials.",
    placeholder: "A product photo of an eco-friendly water bottle on a wooden table...",
    presets: {
      "product-photo": "A professional product photo of [product] on a [background] with [lighting style]",
      "ad-banner": "A web banner ad for [product/service] highlighting [feature/benefit] with [call to action]",
      promotional: "A promotional image for [event/product] featuring [description]",
      infographic: "A simple infographic showing [data/process] related to [topic]",
    },
    styles: ["Product Photography", "Flat Design", "Corporate", "Bold", "Informational"],
  },
  design: {
    name: "Design",
    description: "Create concept art, illustrations, and design elements.",
    placeholder: "A minimalist logo concept for an eco-friendly brand...",
    presets: {
      "concept-art": "Concept art for [subject/character/environment] in a [style] style with [mood/lighting]",
      illustration: "An illustration of [subject] in [style] style with [color scheme]",
      pattern: "A seamless pattern with [elements] in [color scheme] for [purpose]",
      "icon-set": "A set of minimalist icons representing [concepts/objects] in a consistent style",
    },
    styles: ["Illustration", "Concept Art", "Minimalist", "Abstract", "Flat Design"],
  },
  content: {
    name: "Content",
    description: "Generate images for blog posts, articles, and other content.",
    placeholder: "A header image for a blog post about sustainable living...",
    presets: {
      "blog-header": "A header image for a blog post about [topic] with [mood/style]",
      "article-illustration": "An illustration to accompany an article about [topic] showing [concept/idea]",
      "ebook-cover": "A cover image for an ebook about [topic] with [style] design",
      "featured-image": "A featured image for content about [topic] that conveys [mood/concept]",
    },
    styles: ["Editorial", "Informational", "Conceptual", "Metaphorical", "Storytelling"],
  },
}

export function UnifiedImageGenerationForm() {
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template") || "social-media"

  const [selectedTemplate, setSelectedTemplate] = useState(templateParam)
  const [selectedPreset, setSelectedPreset] = useState("")
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [complexity, setComplexity] = useState([50])
  const [generatedImage, setGeneratedImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (imageTemplates[selectedTemplate]) {
      setStyle(imageTemplates[selectedTemplate].styles[0])

      if (selectedPreset && imageTemplates[selectedTemplate].presets[selectedPreset]) {
        setPrompt(imageTemplates[selectedTemplate].presets[selectedPreset])
      }
    }
  }, [selectedTemplate, selectedPreset])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedImage("")

    try {
      // In a real app, you would use the AI SDK with your API key
      // This is a mock implementation for demonstration purposes
      const mockGeneration = async () => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Return a placeholder image URL
        return "/placeholder.svg?height=512&width=512"
      }

      // In a real implementation, you would use an image generation API
      const imageUrl = await mockGeneration()
      setGeneratedImage(imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveToGallery = () => {
    if (!generatedImage) return

    // Get existing content from localStorage
    const existingContent = localStorage.getItem("ai-content")
    const contentArray = existingContent ? JSON.parse(existingContent) : []

    // Add new content
    const newContent = {
      id: Date.now().toString(),
      type: "image",
      content: generatedImage,
      prompt: prompt,
      template: selectedTemplate,
      style: style,
      complexity: complexity[0],
      createdAt: new Date().toISOString(),
    }

    contentArray.push(newContent)
    localStorage.setItem("ai-content", JSON.stringify(contentArray))

    toast({
      title: "Saved to gallery",
      description: "Your generated image has been saved to your gallery.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mt-1">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Image Generation
            </h2>
            <p className="text-gray-600 mb-4">
              Create stunning visuals with AI assistance. Choose a template or write your own prompt.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(imageTemplates).map(([key, template]) => (
                <Badge
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === key
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      : "hover:bg-indigo-50"
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  {template.name}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Choose a template</Label>
                <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                  <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom prompt</SelectItem>
                    {Object.entries(imageTemplates[selectedTemplate]?.presets || {}).map(([presetKey, presetValue]) => (
                      <SelectItem key={presetKey} value={presetKey}>
                        {presetKey
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Your prompt</Label>
                <Textarea
                  placeholder={imageTemplates[selectedTemplate]?.placeholder || "Enter your prompt here..."}
                  className="min-h-32 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageTemplates[selectedTemplate]?.styles.map((styleOption) => (
                        <SelectItem key={styleOption} value={styleOption}>
                          {styleOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-700">Complexity</Label>
                    <span className="text-sm text-gray-500">{complexity[0]}%</span>
                  </div>
                  <Slider
                    value={complexity}
                    onValueChange={setComplexity}
                    max={100}
                    step={1}
                    className="[&>span]:bg-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {generatedImage && (
        <Card className="border-indigo-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2" />
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4 bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-md border border-indigo-100">
              <img
                src={generatedImage || "/placeholder.svg"}
                alt={prompt}
                className="rounded-md max-h-96 object-contain shadow-md transition-all hover:shadow-lg"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={saveToGallery}
                className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
