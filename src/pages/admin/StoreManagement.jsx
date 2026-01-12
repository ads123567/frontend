import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Store, Package } from 'lucide-react'

// Sub-components (We will create these next)
import PincodeManager from './PincodeManager'
import StoreManager from './StoreManager'
import ProductManager from './ProductManager'

const StoreManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
        <p className="text-muted-foreground">Manage your hyper-local commerce settings.</p>
      </div>

      <Tabs defaultValue="pincodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pincodes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pincodes (Areas)
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Stores
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pincodes */}
        <TabsContent value="pincodes">
          <Card>
            <CardHeader>
              <CardTitle>Area Management</CardTitle>
              <CardDescription>
                Define the service areas (pincodes) where you operate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PincodeManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Stores */}
        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Store Management</CardTitle>
              <CardDescription>
                Manage stores located within your active pincodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <StoreManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Products */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Manage global products or drill down to specific store inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <ProductManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StoreManagement