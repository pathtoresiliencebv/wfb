import React from "react";
import { TagManagement } from "@/components/admin/TagManagement";

export default function AdminTags() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tags Beheer</h2>
        <p className="text-muted-foreground">
          Organiseer en beheer forum tags voor betere content categorisatie.
        </p>
      </div>
      
      <TagManagement />
    </div>
  );
}