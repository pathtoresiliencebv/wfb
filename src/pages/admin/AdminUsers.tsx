import React from "react";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gebruikersbeheer</h2>
        <p className="text-muted-foreground">
          Beheer gebruikersaccounts, rollen en permissies.
        </p>
      </div>
      
      <AdminUserManagement />
    </div>
  );
}