"use client";

import React from "react";
import { ShoppingCart, User, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  date: string;
  time: string;
  description: string;
  type: string;
  amount: number;
  status: "completed" | "failed" | "pending";
}

interface Note {
  author: string;
  date: string;
  content: string;
}

interface UserActivityProps {
  transactions: Transaction[];
  notes?: Note[];
}

export function UserActivity({ transactions, notes = [] }: UserActivityProps) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Recent billing and payment activities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transaction.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transaction.description}</span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.status === "completed" && (
                          <div className="flex items-center">
                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                            <span className="capitalize">Completed</span>
                          </div>
                        )}
                        {transaction.status === "failed" && (
                          <div className="flex items-center">
                            <XCircle className="mr-1 h-4 w-4 text-destructive" />
                            <span className="capitalize">Failed</span>
                          </div>
                        )}
                        {transaction.status === "pending" && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-amber-500" />
                            <span className="capitalize">Pending</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className="text-muted-foreground">
                        No transaction history available
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Customer Notes</CardTitle>
            <CardDescription>
              View and add notes for this customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notes && notes.length > 0 ? (
                notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-muted/50"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{note.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {note.date}
                      </div>
                    </div>
                    <p>{note.content}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No customer notes available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-0">
            <Separator />
            <div className="w-full">
              <Label htmlFor="new-note" className="mb-2 block">
                Add a new note
              </Label>
              <div className="flex gap-2">
                <Input
                  id="new-note"
                  placeholder="Type your note here..."
                  className="flex-1"
                />
                <Button>Add Note</Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
