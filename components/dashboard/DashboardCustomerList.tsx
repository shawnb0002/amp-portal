"use client";

import type { User } from "@/types";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerTableRow } from "./CustomerTableRow";
import { CustomerTableHeader } from "./CustomerTableHeader";
import { PaginationFooter } from "./PaginationFooter";

interface DashboardCustomerListProps {
  currentUsers: User[];
  filteredUsers: User[];
  currentPage: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export function DashboardCustomerList({
  currentUsers,
  filteredUsers,
  currentPage,
  indexOfFirstUser,
  indexOfLastUser,
  totalPages,
  goToNextPage,
  goToPrevPage,
}: DashboardCustomerListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Total: {filteredUsers.length} customers
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <CustomerTableHeader />
          <TableBody>
            {currentUsers.map((user) => (
              <CustomerTableRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstUser={indexOfFirstUser}
        indexOfLastUser={indexOfLastUser}
        totalItems={filteredUsers.length}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />
    </Card>
  );
}
