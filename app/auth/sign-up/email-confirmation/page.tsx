"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function EmailConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent you a confirmation email. Please check your inbox and click on the
            link to verify your account.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p>
              If you don't see the email in your inbox, please check your spam folder.
              The email should arrive within a few minutes.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Return to
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}