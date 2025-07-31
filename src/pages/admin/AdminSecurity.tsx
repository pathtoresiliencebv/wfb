import React from "react";
import SecurityDashboard from "@/components/settings/SecurityDashboard";

export default function AdminSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Beveiliging</h2>
        <p className="text-muted-foreground">
          Monitor beveiligingsincidenten en beheer beveiligingsinstellingen.
        </p>
      </div>
      
      <SecurityDashboard />
    </div>
  );
}