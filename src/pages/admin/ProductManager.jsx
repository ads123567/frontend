import React, { useState } from 'react'
import { useProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog'
import { Loader2, Plus, Trash2, Edit2, Search } from 'lucide-react'
import { toast } from 'sonner'

const ProductManager = () => {
  const [searchTerm, setSearchTerm] = useState('')
  // Debounce could be added here for production, directly passing for now
  const { data: products, isLoading } = useProducts({ search: searchTerm })
  
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: 1, // Default or fetch categories to select
    description: '',
    mrp: '',
    selling_price_without_gst: '',
    gst_percentage: '',
    cost_price: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Ensure numeric values are sent as numbers/strings that backend accepts
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData })
        toast.success("Product updated successfully")
      } else {
        await createMutation.mutateAsync(formData)
        toast.success("Product created successfully")
      }
      setIsDialogOpen(false)
      setEditingId(null)
      // Reset Form
      setFormData({
        name: '', sku: '', category_id: 1, description: '',
        mrp: '', selling_price_without_gst: '', gst_percentage: '', cost_price: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.detail || (editingId ? "Failed to update product" : "Failed to create product"))
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category_id: product.category_id,
      description: product.description || '',
      mrp: product.mrp,
      selling_price_without_gst: product.selling_price_without_gst,
      gst_percentage: product.gst_percentage,
      cost_price: product.cost_price
    })
    setEditingId(product.id)
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setFormData({
      name: '', sku: '', category_id: 1, description: '',
      mrp: '', selling_price_without_gst: '', gst_percentage: '', cost_price: ''
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success("Product deleted")
      } catch (error) {
        toast.error("Failed to delete product")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls: Search & Add */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                Enter base prices. Tax calculations happen automatically on save.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU (Unique)</label>
                  <Input name="sku" value={formData.sku} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} />
              </div>

              {/* Pricing Section */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-4 border">
                <h4 className="font-semibold text-sm">Pricing & Tax</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MRP</label>
                    <Input type="number" step="0.01" name="mrp" value={formData.mrp} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selling Price (Excl. GST)</label>
                    <Input type="number" step="0.01" name="selling_price_without_gst" value={formData.selling_price_without_gst} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GST Percentage (%)</label>
                    <Input type="number" step="0.01" name="gst_percentage" value={formData.gst_percentage} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cost Price</label>
                    <Input type="number" step="0.01" name="cost_price" value={formData.cost_price} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={7} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" /> Loading inventory...</TableCell>
               </TableRow>
            ) : products?.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found.</TableCell>
               </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]">{product.description}</div>
                  </TableCell>
                  <TableCell>₹{product.mrp}</TableCell>
                  <TableCell>₹{product.selling_price_without_gst}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {product.gst_percentage}%
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ₹{product.selling_price_with_gst}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProductManager