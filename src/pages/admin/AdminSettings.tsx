import React from "react";
import { ForumSettings } from "@/components/admin/ForumSettings";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Forum Instellingen</h2>
        <p className="text-muted-foreground">
          Configureer forum instellingen, regels en algemene configuratie.
        </p>
      </div>
      
      <ForumSettings />
    </div>
  );
}