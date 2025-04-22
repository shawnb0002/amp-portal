"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function DashboardSearch({ searchTerm, setSearchTerm }: DashboardSearchProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Customer Search</CardTitle>
        <CardDescription>
          Search for customers by name, email, or phone number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
