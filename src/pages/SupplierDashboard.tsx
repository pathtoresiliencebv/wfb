import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { SupplierDashboard as SupplierDashboardComponent } from '@/components/supplier/SupplierDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SupplierDashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <SupplierDashboardComponent />
      </Layout>
    </ProtectedRoute>
  );
}