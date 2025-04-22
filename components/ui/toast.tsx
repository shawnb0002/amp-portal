"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  onClose?: () => void;
}

export function Toast({
  className,
  variant = "default",
  onClose,
  children,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default" && "border-slate-200 bg-white text-slate-950",
        variant === "destructive" && "border-red-500 bg-red-500 text-white",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 cursor-pointer",
            variant === "default" && "text-slate-500 hover:text-slate-900",
            variant === "destructive" && "text-white/80 hover:text-white"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

type ToastTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function ToastTitle({
  className,
  children,
  ...props
}: ToastTitleProps) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type ToastDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function ToastDescription({
  className,
  children,
  ...props
}: ToastDescriptionProps) {
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface ToasterProps extends React.ComponentPropsWithoutRef<"div"> {
  toasts: Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    onOpenChange?: (open: boolean) => void;
  }>;
}

export function Toaster({ toasts = [], ...props }: ToasterProps) {
  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      {...props}
    >
      {toasts.map(({ id, title, description, variant, onOpenChange }) => (
        <Toast
          key={id}
          variant={variant}
          onClose={() => onOpenChange?.(false)}
          className="mb-2 mt-0 sm:mb-0 sm:mt-2"
        >
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
        </Toast>
      ))}
    </div>
  );
}
