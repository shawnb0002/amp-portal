"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSearch } from "./DashboardSearch";
import { DashboardCustomerList } from "./DashboardCustomerList";
import { useGetUsers } from "@/hooks/useGetUsers";

interface DashboardProps {
  initialUsers: User[];
}

export function Dashboard({ initialUsers }: DashboardProps) {
  const { data: users = initialUsers } = useGetUsers(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const itemsPerPage = 10;

  // Filter users based on search term and update when users change
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        user.phone?.includes(searchTerm) ||
        false
    );

    setFilteredUsers(filtered);
    // Reset to first page when users or search changes
    setCurrentPage(1);
  }, [users, searchTerm]);

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle pagination
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6 w-full">
      <DashboardHeader />
      <DashboardSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <DashboardCustomerList
        currentUsers={currentUsers}
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        indexOfFirstUser={indexOfFirstUser}
        indexOfLastUser={indexOfLastUser}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />
    </div>
  );
}
