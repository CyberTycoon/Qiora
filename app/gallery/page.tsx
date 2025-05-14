"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type SavedContent = {
  id: string
  type: "text" | "image"
  content: string
  prompt: string
  createdAt: string
}

export default function GalleryPage() {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load saved content from localStorage
    const loadSavedContent = () => {
      const saved = localStorage.getItem("ai-content")
      if (saved) {
        setSavedContent(JSON.parse(saved))
      }
    }

    loadSavedContent()
  }, [])

  const deleteItem = (id: string) => {
    const newContent = savedContent.filter((item) => item.id !== id)
    setSavedContent(newContent)
    localStorage.setItem("ai-content", JSON.stringify(newContent))

    toast({
      title: "Content deleted",
      description: "The item has been removed from your gallery.",
    })
  }

  // Update the UI to be more vibrant
  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Your Gallery
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          View and manage your saved AI-generated content. Your creations are stored locally on your device.
        </p>

        <Tabs defaultValue="all" className="max-w-6xl">
          <TabsList className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              Text
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedContent.length > 0 ? (
                savedContent.map((item) => <GalleryItem key={item.id} item={item} onDelete={deleteItem} />)
              ) : (
                <div className="col-span-full text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                  <p className="text-gray-500 mb-4">Your gallery is empty. Start creating content!</p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    asChild
                  >
                    <a href="/create">Create Content</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedContent.filter((item) => item.type === "text").length > 0 ? (
                savedContent
                  .filter((item) => item.type === "text")
                  .map((item) => <GalleryItem key={item.id} item={item} onDelete={deleteItem} />)
              ) : (
                <div className="col-span-full text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                  <p className="text-gray-500 mb-4">No text content yet. Start creating!</p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    asChild
                  >
                    <a href="/create?tab=text">Create Text</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedContent.filter((item) => item.type === "image").length > 0 ? (
                savedContent
                  .filter((item) => item.type === "image")
                  .map((item) => <GalleryItem key={item.id} item={item} onDelete={deleteItem} />)
              ) : (
                <div className="col-span-full text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                  <p className="text-gray-500 mb-4">No image content yet. Start creating!</p>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    asChild
                  >
                    <a href="/create?tab=image">Create Images</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Update the GalleryItem component
function GalleryItem({
  item,
  onDelete,
}: {
  item: SavedContent
  onDelete: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-purple-100 hover:border-purple-200 group">
      <div
        className={`h-1 ${item.type === "text" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
      />
      <CardHeader>
        <CardTitle className="truncate text-sm font-medium">{item.prompt}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.type === "text" ? (
          <div className="h-48 overflow-y-auto bg-gradient-to-r from-gray-50 to-purple-50 p-3 rounded-md text-sm border border-purple-100">
            {item.content}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-md flex items-center justify-center overflow-hidden border border-indigo-100">
            <img
              src={item.content || "/placeholder.svg"}
              alt={item.prompt}
              className="h-full w-full object-cover rounded-md transition-transform group-hover:scale-105 duration-300"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
                  <a href={item.content} download={true} className="flex items-center justify-between">
                      <Download className="h-4 w-4 mr-2" />
                      <p>Download</p>
                  </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
