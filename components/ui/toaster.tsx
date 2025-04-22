"use client";

import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toast";
import { useEffect, useState } from "react";

export function Toaster2() {
  const { toasts } = useToast();
  const [visibleToasts, setVisibleToasts] = useState(toasts);
  
  // Update visible toasts when toasts state changes
  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  return <Toaster toasts={visibleToasts} />;
}
