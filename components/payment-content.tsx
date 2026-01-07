"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

type PaymentContentProps = {
  variant?: "page" | "modal"
  redirectTo?: string
}

export function PaymentContent({ variant = "page", redirectTo }: PaymentContentProps) {
  const [method, setMethod] = useState("card")
  const [creditsToUse, setCreditsToUse] = useState(1200)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const creditsRemaining = 2450
  const orderTotal = 4200

  const appliedCredits = useMemo(() => {
    if (method === "card") return 0
    if (method === "credits") return Math.min(creditsToUse, creditsRemaining, orderTotal)
    return Math.min(creditsToUse, creditsRemaining, orderTotal * 0.5)
  }, [creditsRemaining, creditsToUse, method, orderTotal])

  const remainingDue = Math.max(orderTotal - appliedCredits, 0)

  const isModal = variant === "modal"
  const handlePayment = () => {
    if (isProcessing) return
    setIsProcessing(true)
    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(true)
      setIsProcessing(false)
    }, 2000)
  }

  useEffect(() => {
    if (!showSuccess) return
    const redirectTimer = setTimeout(() => {
      router.push(redirectTo ?? "/decarbonization-strategies")
    }, 300)
    return () => clearTimeout(redirectTimer)
  }, [router, showSuccess])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#f5fbfa] via-[#f6f4ef] to-[#f2f6f5] ${
        isModal ? "rounded-3xl" : "min-h-screen"
      }`}
    >
      <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-[#2aa39f]/20 blur-3xl" />
      <div className="pointer-events-none absolute left-8 top-32 h-32 w-32 rounded-full bg-[#f4b86a]/20 blur-2xl" />
      <div className={`relative flex flex-col gap-6 ${isModal ? "px-6 pb-8 pt-6" : "px-8 pb-10 pt-8"}`}>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#2aa39f]">Secure Checkout</p>
            <h1 className="text-3xl font-semibold text-[#0f2f2b]">Payment Gateway</h1>
            <p className="mt-2 max-w-xl text-sm text-[#46605b]">
              Choose how you want to pay for your decarbonization package. Mix credits with card payments anytime.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2aa39f]/10">
              <Sparkles className="h-5 w-5 text-[#2aa39f]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6b7f7a]">Credits Remaining</p>
              <p className="text-lg font-semibold text-[#0f2f2b]">{creditsRemaining.toLocaleString()} credits</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_30px_60px_-45px_rgba(15,47,43,0.45)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#0f2f2b]">Payment method</h2>
                <p className="mt-1 text-sm text-[#6b7f7a]">Select a payment option below.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#2aa39f]/10 px-3 py-1 text-xs font-medium text-[#1d6d66]">
                <ShieldCheck className="h-4 w-4" />
                PCI compliant
              </div>
            </div>

            <RadioGroup value={method} onValueChange={setMethod} className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                { value: "card", title: "Credit card", description: "Visa, Mastercard, American Express" },
                { value: "credits", title: "Pay with credits", description: "Use available ESG credits instantly" },
                { value: "both", title: "Split payment", description: "Combine credits and card payment" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setMethod(option.value)}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-4 py-3 transition ${
                    method === option.value
                      ? "border-[#2aa39f] bg-[#e9f7f5] shadow-sm"
                      : "border-[#e4e8e7] bg-white/60 hover:border-[#9fdad4]"
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`payment-${option.value}`} className="mt-1" />
                  <Label htmlFor={`payment-${option.value}`} className="flex-1 cursor-pointer flex-col items-start">
                    <span className="text-sm font-semibold text-[#0f2f2b]">{option.title}</span>
                    <span className="text-xs text-[#6b7f7a]">{option.description}</span>
                  </Label>
                  {option.value === "card" && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2aa39f]">2.9% fee</span>
                  )}
                </div>
              ))}
            </RadioGroup>

            {(method === "card" || method === "both") && (
              <div className="mt-6 grid gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0f2f2b]">
                  <CreditCard className="h-4 w-4 text-[#2aa39f]" />
                  Card details
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="cardholder">Cardholder name</Label>
                    <Input id="cardholder" placeholder="Jordan Lee" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-email">Email address</Label>
                    <Input id="card-email" type="email" placeholder="jordan@company.com" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="card-expiry">Expiry</Label>
                    <Input id="card-expiry" placeholder="MM / YY" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input id="card-cvc" placeholder="123" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-zip">ZIP</Label>
                    <Input id="card-zip" placeholder="94103" />
                  </div>
                </div>
              </div>
            )}

            {(method === "credits" || method === "both") && (
              <div className="mt-6 rounded-2xl border border-dashed border-[#b6d8d4] bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0f2f2b]">Apply credits</p>
                    <p className="text-xs text-[#6b7f7a]">Available balance: {creditsRemaining.toLocaleString()} credits</p>
                  </div>
                  <span className="rounded-full bg-[#f4b86a]/20 px-3 py-1 text-xs font-semibold text-[#a96a21]">
                    Smart apply
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Input
                    id="credits"
                    type="number"
                    min={0}
                    max={creditsRemaining}
                    value={creditsToUse}
                    onChange={(event) => setCreditsToUse(Number(event.target.value))}
                    className="max-w-[200px]"
                  />
                  <div className="text-xs text-[#6b7f7a]">Applied credits: {appliedCredits.toLocaleString()}</div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[#d8e5e3] pt-5">
              <p className="text-xs text-[#6b7f7a]">Your payment is protected with Stripe-level encryption.</p>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="rounded-full bg-[#2aa39f] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2aa39f]/30 transition hover:bg-[#239089]"
              >
                {isProcessing ? "Processing..." : `Pay ${formatCurrency(remainingDue)}`}
              </button>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_25px_50px_-40px_rgba(15,47,43,0.5)] backdrop-blur">
            <h3 className="text-lg font-semibold text-[#0f2f2b]">Order summary</h3>
            <div className="mt-5 space-y-4 text-sm text-[#46605b]">
              <div className="flex items-center justify-between">
                <span>Decarbonization plan</span>
                <span className="font-medium text-[#0f2f2b]">{formatCurrency(3500)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Analytics add-on</span>
                <span className="font-medium text-[#0f2f2b]">{formatCurrency(700)}</span>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8b9a97]">
                <span>Credits applied</span>
                <span>- {formatCurrency(appliedCredits)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-[#d8e5e3] pt-4 text-base font-semibold text-[#0f2f2b]">
                <span>Total due</span>
                <span>{formatCurrency(remainingDue)}</span>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-[#0f2f2b] px-4 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-[#b7d8d3]">Next renewal</p>
              <p className="mt-2 text-lg font-semibold">May 14, 2025</p>
              <p className="mt-3 text-xs text-[#b7d8d3]">
                You will receive a reminder 7 days before the next billing cycle.
              </p>
            </div>
          </aside>
        </div>
      </div>
      {showSuccess && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowSuccess(false)} />
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2aa39f]/15 text-[#2aa39f]">
              ✓
            </div>
            <h4 className="text-base font-semibold text-[#0f2f2b]">Payment successful</h4>
            <p className="mt-1 text-xs text-[#6b7f7a]">Your receipt is ready and permissions are updated.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 rounded-full border border-[#2aa39f] px-4 py-2 text-xs font-semibold text-[#2aa39f] hover:bg-[#e6f7f5]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
