import React from "react";
import { CategoryManagement } from "@/components/admin/CategoryManagement";

export default function AdminCategories() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categorieën Beheer</h2>
        <p className="text-muted-foreground">
          Maak, bewerk en organiseer forum categorieën.
        </p>
      </div>
      
      <CategoryManagement />
    </div>
  );
}