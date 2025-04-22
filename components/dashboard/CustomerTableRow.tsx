"use client";

import type { User } from "@/types";
import Link from "next/link";
import { MoreHorizontal, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface CustomerTableRowProps {
  user: User;
}

export function CustomerTableRow({ user }: CustomerTableRowProps) {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        <Link href={`/user/${user.id}`} className="hover:underline">
          {user.name || "Unknown User"}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            user.status === "active"
              ? "default"
              : user.status === "overdue"
              ? "destructive"
              : "secondary"
          }
        >
          {user.status || "unknown"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {user.email || "No email"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {user.phone || "No phone"}
        </div>
      </TableCell>
      <TableCell>{user.subscriptions?.length || 0}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/user/${user.id}`}>View profile</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
