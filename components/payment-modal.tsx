"use client"

import { X } from "lucide-react"
import { PaymentContent } from "@/components/payment-content"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function PaymentModal({ isOpen, onClose, redirectTo }: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-4 max-h-[85vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 shadow-sm hover:text-gray-700"
          aria-label="Close payment modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <PaymentContent variant="modal" redirectTo={redirectTo} />
      </div>
    </div>
  )
}
