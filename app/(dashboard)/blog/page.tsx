import React from "react";

export default function DocsComingSoon() {
  return (
    <div className="container mx-auto py-12 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
      <div className="flex justify-center">
          <img src="/panda-peeking.png" className="-mb-22 h-30 w-20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Blogs
        </h1>

        <div className="space-y-4">
          <p className="text-xl text-muted-foreground">Coming Soon :)</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working on comprehensive blogs to help you keep updated with the latest trends and insights in database management and visualization.
          </p>
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
