import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Loader2 } from "lucide-react";
import { useConfigureApproval, useGetApprovalSettings } from '@/hooks/useAdmin';

const SettingsDialog = () => {
  const [open, setOpen] = React.useState(false);

  // 1. Fetch Current Settings
  const { data: currentSettings, isLoading: isLoadingSettings } = useGetApprovalSettings();
  
  // 2. Setup Form
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset, 
    formState: { isDirty, isValid } 
  } = useForm({
    defaultValues: {
      auto_approve_user: false,
      max_mr_ptr_percent: 0.0
    }
  });

  // 3. Sync Form with Database Data when it loads
  useEffect(() => {
    if (currentSettings) {
      reset({
        auto_approve_user: currentSettings.auto_approve_user,
        max_mr_ptr_percent: currentSettings.max_mr_ptr_percent
      });
    }
  }, [currentSettings, reset]);

  // 4. Mutation to Save
  const { mutate: saveSettings, isPending: isSaving } = useConfigureApproval();

  const onSubmit = (data) => {
    saveSettings({
      auto_approve_user: data.auto_approve_user,
      max_mr_ptr_percent: parseFloat(data.max_mr_ptr_percent)
    }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  const isAutoApprove = watch("auto_approve_user");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto gap-2">
          <Settings className="h-4 w-4" />
          Approval Rules
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approval Configurations</DialogTitle>
          <DialogDescription>
            Manage dynamic rules for order approvals.
          </DialogDescription>
        </DialogHeader>

        {isLoadingSettings ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            {/* Toggle: Auto Approve User */}
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approve" className="text-base font-medium">
                  Auto-Approve Users
                </Label>
                <p className="text-xs text-muted-foreground">
                  Normal users bypass admin approval.
                </p>
              </div>
              <Switch 
                id="auto-approve" 
                checked={isAutoApprove}
                onCheckedChange={(val) => {
                  setValue("auto_approve_user", val, { shouldDirty: true });
                }}
              />
            </div>

            {/* Input: MR Max Percentage */}
            <div className="space-y-2">
              <Label htmlFor="max-ptr">Max MR Discount Limit</Label>
              <div className="relative">
                <Input
                  id="max-ptr"
                  type="number"
                  step="0.1"
                  {...register("max_mr_ptr_percent", { required: true, min: 0, max: 100 })}
                  className="pr-8"
                />
                <span className="absolute right-3 top-2.5 text-sm text-gray-500">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Current Threshold: <strong>{currentSettings?.max_mr_ptr_percent}%</strong>. 
                Discounts higher than this require approval.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDirty ? "Save Changes" : "No Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;