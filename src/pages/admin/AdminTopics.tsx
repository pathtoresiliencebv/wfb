import React from "react";
import { TopicManagement } from "@/components/admin/TopicManagement";

export default function AdminTopics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Topics Beheer</h2>
        <p className="text-muted-foreground">
          Beheer forum topics, pin belangrijke discussies en modereer content.
        </p>
      </div>
      
      <TopicManagement />
    </div>
  );
}