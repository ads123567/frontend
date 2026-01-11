import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const FilterBar = ({ searchTerm, onSearchChange, roleFilter, onRoleChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
      
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Order ID or Shop..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Role Filter Dropdown */}
      <div className="w-full md:w-[200px]">
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="mr">Medical Rep (MR)</SelectItem>
            <SelectItem value="user">Retail User</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;