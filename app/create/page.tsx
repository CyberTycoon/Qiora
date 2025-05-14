"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedTextGenerationForm } from "@/components/unified-text-generation-form";
import { UnifiedImageGenerationForm } from "@/components/unified-image-generation-form";
import ProtectedRoute from "@/components/ProtectedRoute";

// Create a component to handle the search params
function CreatePageContent() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Create Content</h1>
          <p className="text-muted-foreground">
            Use our AI tools to generate text or images. Enter a prompt describing what you want to create, and our AI
            will do the rest. Save your favorite creations to your gallery.
          </p>
        </div>
        <Tabs defaultValue="text" className="mt-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="text">Text Generation</TabsTrigger>
            <TabsTrigger value="image">Image Generation</TabsTrigger>
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
  );
}

// Main component with Suspense boundary
export default function CreatePage() {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
        <ProtectedRoute>
            <CreatePageContent />
        </ProtectedRoute>
    </Suspense>
  );
}