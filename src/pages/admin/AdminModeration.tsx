import React from "react";
import { ContentModerationPanel } from "@/components/admin/ContentModerationPanel";

export default function AdminModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Content Moderatie</h2>
        <p className="text-muted-foreground">
          Beheer en modereer content, bekijk reports en neem actie tegen overtredingen.
        </p>
      </div>
      
      <ContentModerationPanel />
    </div>
  );
}