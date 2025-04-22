"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalItems: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export function PaginationFooter({
  currentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  totalItems,
  goToNextPage,
  goToPrevPage,
}: PaginationFooterProps) {
  return (
    <CardFooter className="flex items-center justify-between border-t p-4">
      <div className="text-sm text-muted-foreground">
        Showing {indexOfFirstUser + 1}-
        {Math.min(indexOfLastUser, totalItems)} of{" "}
        {totalItems}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </CardFooter>
  );
}
