import React, { useState } from 'react'; // Import useState
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns"; 
import OrderDetailsSheet from './OrderDetailsSheet'; // <--- IMPORT THE NEW COMPONENT

// Helper for Status Badge Styling (Keep existing code)
const getStatusStyles = (status) => {
  switch (status) {
    case 'confirmed': return "bg-green-100 text-green-800 border-green-200";
    case 'pending_approval': return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case 'cancelled': return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const OrdersTable = ({ orders, onApprove, onReject, isProcessing }) => {
  // 1. State for controlling the Sheet
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 2. Handler to open sheet
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  if (!orders || orders.length === 0) {
    return <div className="p-12 text-center text-gray-500">No orders found.</div>;
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order ID</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50">
                <TableCell className="font-medium">#{order.id}</TableCell>
                
                <TableCell onClick={() => handleViewDetails(order)}>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{order.user?.shop_name || "Unknown Shop"}</span>
                    <span className="text-xs text-muted-foreground">{order.user?.name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {order.user?.role}
                  </Badge>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </TableCell>

                <TableCell className="font-bold text-sm">
                  ${order.total_amount.toFixed(2)}
                </TableCell>

                <TableCell>
                  <Badge className={`uppercase text-[10px] shadow-none ${getStatusStyles(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  {/* Action Buttons Logic */}
                  <div className="flex justify-end gap-2 items-center">
                    {order.status === 'pending_approval' && (
                      <>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 text-green-600 hover:bg-green-50"
                          onClick={(e) => { e.stopPropagation(); onApprove(order.id); }}
                          disabled={isProcessing}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={(e) => { e.stopPropagation(); onReject(order.id); }}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* View Details Button (Always Visible or in Menu) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" /> View Full Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 3. The Details Sheet Component */}
      <OrderDetailsSheet 
        order={selectedOrder} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </>
  );
};

export default OrdersTable;