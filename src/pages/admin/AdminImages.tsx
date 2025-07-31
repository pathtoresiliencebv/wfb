import React from "react";
import { AdminImageManager } from "@/components/admin/AdminImageManager";

export default function AdminImages() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Afbeeldingen Beheer</h2>
        <p className="text-muted-foreground">
          Beheer geüploade afbeeldingen en media bestanden.
        </p>
      </div>
      
      <AdminImageManager />
    </div>
  );
}