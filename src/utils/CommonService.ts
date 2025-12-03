import { toast } from "react-toastify"
import { BehaviorSubject } from "rx"

// for global loader service
export const isLoading = new BehaviorSubject<boolean>(false)

export interface DialogState {
  open: boolean
  data: {
    message?: string
    title?: string
  }
  cancelText: string
  confirmText: string
  onConfirm?: () => void
  onCancel?: () => void
}

const defaultDialogState: DialogState = {
  open: false,
  data: { message: "Are you sure?", title: "" },
  cancelText: "Cancel",
  confirmText: "Okay",
  onConfirm: undefined,
  onCancel: undefined,
}

export const isDialogOpen = new BehaviorSubject<DialogState>(defaultDialogState)

const emitDialogState = (value: DialogState) => {
  const subject = isDialogOpen as BehaviorSubject<DialogState> & {
    onNext?: (val: DialogState) => void
    next?: (val: DialogState) => void
  }

  if (typeof subject.onNext === "function") {
    subject.onNext(value)
  } else if (typeof subject.next === "function") {
    subject.next(value)
  }
}

export const openConfirmDialog = (config: Partial<DialogState>) => {
  emitDialogState({
    ...defaultDialogState,
    ...config,
    open: true,
    data: {
      ...defaultDialogState.data,
      ...(config.data ?? {}),
    },
  })
}

export const closeDialog = () => {
  emitDialogState(defaultDialogState)
}

export const forSuccess = (message: string, id?: string) =>
  toast.success(message, { autoClose: 6000, toastId: id ? id : 1 })

export const forError = (message: string, id?: string) =>
  toast.error(message, { autoClose: 6000, toastId: id ? id : 1 })

export const forWarning = (message: string, id?: string) =>
  toast.warning(message, { autoClose: 6000, toastId: id ? id : 1 })