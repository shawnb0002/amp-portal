import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";

interface UserInfoCardProps {
  user: User;
  onEdit: () => void;
}

export function UserInfoCard({ user, onEdit }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Customer Info</CardTitle>
          <CardDescription>Customer personal details</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Full Name</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium flex items-center gap-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {user.email}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="font-medium flex items-center gap-1">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {user.phone}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {user.joinDate}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Account Status
            </span>
            <div>
              <Badge
                variant={
                  user.status === "active"
                    ? "default"
                    : user.status === "overdue"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
