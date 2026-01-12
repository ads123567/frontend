import React, { useState } from 'react'
import { usePincodes, useCreatePincode, useUpdatePincode } from '@/hooks/usePincodes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog'
import { Loader2, Plus, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

const PincodeManager = () => {
  const { data: pincodes, isLoading } = usePincodes()
  const createMutation = useCreatePincode()
  const updateMutation = useUpdatePincode()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    code: '', area_name: '', city: '', state: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData })
        toast.success("Pincode updated successfully")
      } else {
        await createMutation.mutateAsync(formData)
        toast.success("Pincode added successfully")
      }
      setIsDialogOpen(false)
      setEditingId(null)
      setFormData({ code: '', area_name: '', city: '', state: '' }) // Reset
    } catch (error) {
      toast.error(editingId ? "Failed to update pincode" : "Failed to add pincode")
    }
  }

  const handleEdit = (pincode) => {
    setFormData({
      code: pincode.code,
      area_name: pincode.area_name,
      city: pincode.city,
      state: pincode.state
    })
    setEditingId(pincode.id)
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setFormData({ code: '', area_name: '', city: '', state: '' })
  }

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Areas ({pincodes?.length || 0})</h3>
        
        {/* Create Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add New Area</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Pincode' : 'Add New Pincode'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="Pincode (e.g 400001)" 
                  value={formData.code}
                  maxLength={6}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Area Name" 
                  value={formData.area_name}
                  onChange={(e) => setFormData({...formData, area_name: e.target.value})}
                  required
                />
                <Input 
                  placeholder="City" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
                <Input 
                  placeholder="State" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Area' : 'Save Area'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Area Name</TableHead>
              <TableHead>City/State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pincodes?.map((pin) => (
              <TableRow key={pin.id}>
                <TableCell className="font-medium">{pin.code}</TableCell>
                <TableCell>{pin.area_name}</TableCell>
                <TableCell>{pin.city}, {pin.state}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${pin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {pin.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(pin)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PincodeManager