"use client"

import { useEffect, useState } from "react"
import { closeDialog, isDialogOpen, type DialogState } from "@/utils/CommonService"

const initialState: DialogState = {
  open: false,
  data: { message: "Are you sure?", title: "" },
  cancelText: "Cancel",
  confirmText: "Okay",
}

export default function DialogProvider() {
  const [dialogState, setDialogState] = useState<DialogState>(initialState)

  useEffect(() => {
    const subscription = isDialogOpen.subscribe((value) => {
      setDialogState(value)
    })
    return () => subscription?.dispose?.()
  }, [])

  if (!dialogState.open) {
    return null
  }

  const handleClose = () => {
    dialogState.onCancel?.()
    closeDialog()
  }

  const handleConfirm = () => {
    dialogState.onConfirm?.()
    closeDialog()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-6">
        {dialogState.data.title && (
          <h3 className="text-xl font-semibold text-foreground mb-2">{dialogState.data.title}</h3>
        )}
        <p className="text-muted-foreground mb-6">{dialogState.data.message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-border hover:border-primary transition"
          >
            {dialogState.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            {dialogState.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
