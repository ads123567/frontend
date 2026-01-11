import React, { useState } from 'react';
import { useDebounce } from 'use-debounce'; // pnpm add use-debounce
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Hooks (From previous response)
import { useAllOrders, useAdminDecision } from '@/hooks/useAdmin';

// Sub-Components

import OrdersTable from './OrdersTable';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import SettingsDialog from './SettingsDialog';

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all"); // 'all', 'mr', 'user'
  const [statusTab, setStatusTab] = useState("all");   // 'all', 'pending', 'placed'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce search to wait 500ms before API call
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // --- DATA FETCHING ---
  const { data, isLoading, isError, error } = useAllOrders({
    page,
    size: pageSize,
    role: roleFilter === "all" ? undefined : roleFilter,
    status: statusTab === "all" ? undefined : (statusTab === "pending" ? "pending_approval" : statusTab),
    search: debouncedSearch || undefined
  });

  const { mutate: decideOrder, isPending: isProcessing } = useAdminDecision();

  // --- HANDLERS ---
  const handleApprove = (id) => {
    decideOrder({ orderId: id, action: 'approve' });
  };

  const handleReject = (id) => {
    if(window.confirm("Are you sure you want to reject this order?")) {
      decideOrder({ orderId: id, action: 'reject' });
    }
  };

  const handleTabChange = (val) => {
    setStatusTab(val);
    setPage(1); // Reset to first page on tab switch
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-50/50 min-h-screen">      
      {/* Top Header */}
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and approve orders from all user roles.
          </p>
        </div>

        {/* --- SETTINGS BUTTON (Right side) --- */}
        <div className="flex items-center space-x-2">
           <SettingsDialog /> 
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={handleTabChange}>
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
            <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
                Pending Approval
                {/* Optional: Add a red dot if you fetch counts separately */}
                {/* <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" /> */}
            </TabsTrigger>
            <TabsTrigger value="placed">Confirmed</TabsTrigger>
            </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value={statusTab} className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b mb-4">
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                        Displaying {data?.items?.length || 0} orders from database.
                    </CardDescription>
                </div>
                {/* Dynamic Badge showing Total Count */}
                {data?.total > 0 && (
                    <Badge variant="secondary" className="px-3 py-1">
                        Total: {data.total}
                    </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              
              {/* Filter Bar Component */}
              <FilterBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleChange={(val) => {
                  setRoleFilter(val);
                  setPage(1);
                }}
              />

              {/* Loading & Error Handling */}
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                   <p className="text-sm">Fetching orders...</p>
                </div>
              ) : isError ? (
                 <div className="flex items-center justify-center h-40 bg-red-50 border border-red-100 rounded-md text-red-600">
                   <p>Error loading orders: {error.message}</p>
                 </div>
              ) : (
                <>
                  {/* The Orders Table Component */}
                  <OrdersTable 
                    orders={data?.items || []} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessing={isProcessing}
                  />
                  
                  {/* Pagination Component */}
                  <Pagination 
                    currentPage={page}
                    totalItems={data?.total || 0}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;