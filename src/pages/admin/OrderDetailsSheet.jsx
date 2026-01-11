import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Phone, Store, User, MapPin, Package } from "lucide-react";

const OrderDetailsSheet = ({ order, open, onOpenChange }) => {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Order #{order.id}</SheetTitle>
            <Badge variant={order.status === 'placed' ? 'success' : 'secondary'}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <SheetDescription>
            Placed on {format(new Date(order.created_at), "PPP p")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* 1. Customer Details Section */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Customer Information
            </h3>
            <div className="rounded-lg border p-3 space-y-2 text-sm bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Store className="h-3 w-3" /> Shop Name
                </span>
                <span className="font-medium">{order.user?.shop_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" /> Contact Person
                </span>
                <span>{order.user?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3 w-3" /> Phone
                </span>
                <a href={`tel:${order.user?.phone}`} className="text-blue-600 hover:underline">
                  {order.user?.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" className="text-xs uppercase">{order.user?.role}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* 2. Order Items Section */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" /> Order Items ({order.items?.length || 0})
            </h3>
            <div className="rounded-lg border divide-y">
              {order.items?.map((item, index) => (
                <div key={index} className="p-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Product ID: {item.product_id}</p>
                    {/* In a real app, you'd want the Product Name here. 
                        If your API doesn't send it, you might need to fetch it or include it in the backend response. */}
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × ${item.unit_price}
                    </p>
                  </div>
                  <div className="font-medium text-sm">
                    ${item.total_price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* 3. Payment Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment Summary</h3>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
            
            {order.extra_ptr_discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Extra PTR Discount ({order.extra_ptr_discount}%)</span>
                <span>- Applied</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold pt-2 border-t mt-2">
              <span>Total Amount</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;