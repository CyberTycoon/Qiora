import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedTextGenerationForm } from "@/components/unified-text-generation-form"
import { UnifiedImageGenerationForm } from "@/components/unified-image-generation-form"

export default function CreatePage() {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Create Content
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Use our AI tools to generate text or images. Enter a prompt describing what you want to create, and our AI
            will do the rest. Save your favorite creations to your gallery.
          </p>
        </div>

        <Tabs defaultValue="text" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-1">
            <TabsTrigger
              value="text"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              Text Generation
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Image Generation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <UnifiedTextGenerationForm />
          </TabsContent>
          <TabsContent value="image">
            <UnifiedImageGenerationForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
