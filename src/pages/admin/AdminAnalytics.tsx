import React from "react";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Statistieken</h2>
        <p className="text-muted-foreground">
          Bekijk gedetailleerde statistieken over gebruikersactiviteit en forum prestaties.
        </p>
      </div>
      
      <AdminAnalytics />
    </div>
  );
}