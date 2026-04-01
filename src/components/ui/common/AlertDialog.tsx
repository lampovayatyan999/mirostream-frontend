"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { cn } from "@/src/utils/tw-merge"
import { Button } from "./Button"


export function AlertDialog(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Root>
) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}


export function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  )
}


export function AlertDialogPortal(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>
) {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  )
}


export function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 backdrop-blur-xs",
        "data-open:animate-in data-open:fade-in-0",
        "data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}


export function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
          "grid gap-4 rounded-xl border bg-(--background) p-4 shadow-lg outline-none",
          "data-open:animate-in data-open:zoom-in-95 data-open:fade-in-0",
          "data-closed:animate-out data-closed:zoom-out-95 data-closed:fade-out-0",
          "data-[size=default]:max-w-xs sm:data-[size=default]:max-w-sm",
          "data-[size=sm]:max-w-xs",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}


export function AlertDialogHeader(
  props: React.ComponentProps<"div">
) {
  return (
    <div
      data-slot="alert-dialog-header"
      className="grid gap-1.5 text-center sm:text-left"
      {...props}
    />
  )
}



export function AlertDialogFooter(
  props: React.ComponentProps<"div">
) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className="flex flex-col-reverse gap-2 border-t bg-(--muted)/50 p-4 sm:flex-row sm:justify-end"
      {...props}
    />
  )
}


export function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}



export function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-(--muted-foreground)", className)}
      {...props}
    />
  )
}


export function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        {...props}
      />
    </AlertDialogPrimitive.Action>
  )
}


export function AlertDialogCancel({
  className,
  variant = "secondary",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        {...props}
      />
    </AlertDialogPrimitive.Cancel>
  )
}
