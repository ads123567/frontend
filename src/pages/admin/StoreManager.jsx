import React, { useState } from 'react'
import { usePincodes } from '@/hooks/usePincodes'
import { useStores, useCreateStore, useUpdateStore } from '@/hooks/useStores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Plus, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

const StoreManager = () => {
  const [selectedPincode, setSelectedPincode] = useState("")
  
  // Fetch lists
  const { data: pincodes } = usePincodes()
  const { data: stores, isLoading: storesLoading } = useStores({ 
    pincodeId: selectedPincode || undefined 
  })
  
  const createMutation = useCreateStore()
  const updateMutation = useUpdateStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newStore, setNewStore] = useState({ name: '', address_line: '', pincode_id: '' })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...newStore })
        toast.success("Store updated successfully")
      } else {
        await createMutation.mutateAsync(newStore)
        toast.success("Store created successfully")
      }
      setIsDialogOpen(false)
      setEditingId(null)
      setNewStore({ name: '', address_line: '', pincode_id: '' })
    } catch (err) {
      toast.error(editingId ? "Failed to update store" : "Failed to create store")
    }
  }

  const handleEdit = (store) => {
    setNewStore({
      name: store.name,
      address_line: store.address_line,
      pincode_id: store.pincode_id.toString()
    })
    setEditingId(store.id)
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setNewStore({ name: '', address_line: '', pincode_id: '' })
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
        <span className="text-sm font-medium">Filter by Area:</span>
        <Select value={selectedPincode} onValueChange={setSelectedPincode}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a Pincode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {pincodes?.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.code} - {p.area_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Stores List</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Store' : 'Add New Store'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input 
                placeholder="Store Name" 
                value={newStore.name}
                onChange={e => setNewStore({...newStore, name: e.target.value})}
                required
              />
              <Input 
                placeholder="Address Line" 
                value={newStore.address_line}
                onChange={e => setNewStore({...newStore, address_line: e.target.value})}
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Pincode</label>
                <Select 
                  value={newStore.pincode_id} 
                  onValueChange={val => setNewStore({...newStore, pincode_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Pincode" />
                  </SelectTrigger>
                  <SelectContent>
                    {pincodes?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Store' : 'Create Store'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stores Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Pincode ID</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storesLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4"><Loader2 className="animate-spin inline" /></TableCell>
              </TableRow>
            ) : stores?.length === 0 ? (
               <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No stores found</TableCell>
              </TableRow>
            ) : (
              stores?.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.address_line}</TableCell>
                  <TableCell>{store.pincode_id}</TableCell>
                  <TableCell>{store.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(store)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
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

export default StoreManager