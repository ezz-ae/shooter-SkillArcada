
"use client"

import { useNotificationStore } from "@/lib/notification-store"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { notifications, dismiss } = useNotificationStore()

  return (
    <ToastProvider>
      {notifications.map(function ({ id, title, description, ...props }) {
        return (
          <Toast key={id} {...props} onOpenChange={(open) => !open && dismiss(id)}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
