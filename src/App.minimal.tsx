import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function MinimalApp() {
  console.log('🎯 Minimal App component rendering...');
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-4">WietForum België</h1>
        <p className="text-lg">Platform wordt geladen...</p>
        
        <Routes>
          <Route path="*" element={
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-2">Test Route</h2>
              <p>Als je dit ziet, werkt de basis routing!</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default MinimalApp;