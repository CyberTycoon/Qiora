"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, Sparkles, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Template = {
  name: string
  description: string
  placeholder: string
  presets: {
    [key: string]: string
  }
}

const templates: { [key: string]: Template } = {
  "content-creator": {
    name: "Content Creator",
    description: "Generate blog posts, social media captions, video scripts, and podcast outlines.",
    placeholder: "Write a blog post about sustainable fashion trends...",
    presets: {
      "blog-post":
        "Write a comprehensive blog post about [topic] with an engaging introduction, 3-5 main points with subheadings, and a conclusion with a call to action.",
      "social-media":
        "Create 5 engaging social media captions about [topic] that are optimized for Instagram, each with relevant hashtags.",
      "video-script":
        "Write a YouTube video script about [topic] with an attention-grabbing intro, 3 main talking points, and an outro with a call to subscribe.",
      "podcast-outline":
        "Create a detailed podcast episode outline about [topic] with an introduction, 3-4 segments, interview questions, and closing remarks.",
    },
  },
  marketing: {
    name: "Marketing & Business",
    description: "Create marketing copy, product descriptions, ad variations, and business content.",
    placeholder: "Write a product description for an eco-friendly water bottle...",
    presets: {
      "product-description":
        "Write a compelling product description for [product] that highlights its key features, benefits, and unique selling points.",
      "ad-copy":
        "Create 3 variations of ad copy for [product/service] optimized for Facebook ads, each with a compelling headline and call to action.",
      "email-campaign":
        "Write a marketing email for [product/service] with an attention-grabbing subject line, engaging body content, and a clear call to action.",
      "business-plan":
        "Create an executive summary for a business plan for [business type] that outlines the concept, target market, competitive advantage, and financial projections.",
    },
  },
  education: {
    name: "Education",
    description: "Generate study materials, lesson plans, and educational content.",
    placeholder: "Create a lesson plan about photosynthesis for high school students...",
    presets: {
      "lesson-plan":
        "Create a detailed lesson plan about [topic] for [grade level] students with learning objectives, activities, assessment methods, and resources needed.",
      "study-guide":
        "Generate a comprehensive study guide for [subject/topic] with key concepts, definitions, examples, and practice questions.",
      summary: "Summarize the key points of [text/article/book] in a concise and easy-to-understand format.",
      "quiz-questions":
        "Create 10 quiz questions about [topic] with multiple-choice answers and explanations for the correct answers.",
    },
  },
  developer: {
    name: "Developer",
    description: "Generate code snippets, documentation, and technical content.",
    placeholder: "Write a function that sorts an array of objects by a specific property...",
    presets: {
      "code-snippet":
        "Write a [programming language] function that [functionality description] with comments explaining the code.",
      documentation:
        "Create documentation for a [programming language] function/API that [functionality description] with parameters, return values, and usage examples.",
      tutorial:
        "Write a step-by-step tutorial on how to implement [feature/functionality] in [programming language/framework].",
      "code-review":
        "Review the following code and suggest improvements for readability, performance, and best practices: [paste code here]",
    },
  },
}

export function UnifiedTextGenerationForm() {
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template") || "content-creator"

  const [selectedTemplate, setSelectedTemplate] = useState(templateParam)
  const [selectedPreset, setSelectedPreset] = useState("")
  const [prompt, setPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (templates[selectedTemplate] && selectedPreset && templates[selectedTemplate].presets[selectedPreset]) {
      setPrompt(templates[selectedTemplate].presets[selectedPreset])
    }
  }, [selectedTemplate, selectedPreset])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate text.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedText("")

    try {
      // In a real app, you would use the AI SDK with your API key
      // This is a mock implementation for demonstration purposes
      const mockGeneration = async () => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Return mock generated text based on the prompt
        return `Generated text based on: "${prompt}"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.\n\nNullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`
      }

      // In a real implementation, you would use:
      // const { text } = await generateText({
      //   model: openai('gpt-4o'),
      //   prompt: prompt,
      // });

      const text = await mockGeneration()
      setGeneratedText(text)
    } catch (error) {
      console.error("Error generating text:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveToGallery = () => {
    if (!generatedText) return

    // Get existing content from localStorage
    const existingContent = localStorage.getItem("ai-content")
    const contentArray = existingContent ? JSON.parse(existingContent) : []

    // Add new content
    const newContent = {
      id: Date.now().toString(),
      type: "text",
      content: generatedText,
      prompt: prompt,
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
    }

    contentArray.push(newContent)
    localStorage.setItem("ai-content", JSON.stringify(contentArray))

    toast({
      title: "Saved to gallery",
      description: "Your generated text has been saved to your gallery.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mt-1">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Text Generation
            </h2>
            <p className="text-gray-600 mb-4">
              Create professional content with AI assistance. Choose a template or write your own prompt.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(templates).map(([key, template]) => (
                <Badge
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === key
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      : "hover:bg-purple-50"
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
                  <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom prompt</SelectItem>
                    {Object.entries(templates[selectedTemplate]?.presets || {}).map(([presetKey, presetValue]) => (
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
                  placeholder={templates[selectedTemplate]?.placeholder || "Enter your prompt here..."}
                  className="min-h-32 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Text
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {generatedText && (
        <Card className="border-purple-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2" />
          <CardContent className="pt-6">
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-md whitespace-pre-wrap mb-4 border border-purple-100">
              {generatedText}
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={saveToGallery}
                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
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
