"use client";

import React, { useState } from "react";
import {
  useUpdateCustomerProfile,
  UpdateUserProfileData,
} from "@/hooks/useUpdateCustomerProfile";
import { useGetUser } from "@/hooks/useGetUser";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { User, UserProfileInfoProps } from "@/types/User";
import { EditProfileDialog } from "./EditProfileDialog";
import { UserInfoCard } from "./UserInfoCard";

export function UserProfileInfo({
  user: initialUser,
  userId,
}: UserProfileInfoProps) {
  const {
    data: fetchedUser,
    isLoading,
    isError,
    error,
  } = useGetUser(userId || initialUser.id);
  const user = fetchedUser || initialUser;

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const updateProfile = useUpdateCustomerProfile();

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!editedUser) return;

    const updateData: UpdateUserProfileData = {
      id: editedUser.id,
      name: editedUser.name,
      email: editedUser.email,
      phone: editedUser.phone,
    };

    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setIsEditingProfile(false);
        setEditedUser(null);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedUser(null);
  };

  const handleChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  return (
    <>
      {isLoading && (
        <Card className="p-6">
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Card>
      )}

      {isError && (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Error loading user data: {error?.message}
            </p>
          </div>
        </Card>
      )}

      {!isLoading && !isError && (
        <UserInfoCard user={user} onEdit={handleEditProfile} />
      )}

      <EditProfileDialog
        isOpen={isEditingProfile}
        editedUser={editedUser}
        isSaving={updateProfile.isPending}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        onChange={handleChange}
      />
    </>
  );
}
