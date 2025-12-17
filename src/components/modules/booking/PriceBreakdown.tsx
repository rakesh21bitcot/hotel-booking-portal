"use client"

interface PriceBreakdownProps {
  roomPrice: number
  nights: number
  tax: number
  fees: number
  discount?: number
}

export default function PriceBreakdown({ roomPrice, nights, tax, fees, discount = 0 }: PriceBreakdownProps) {
  const subtotal = roomPrice * nights
  const total = subtotal + tax + fees - discount

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-serif text-lg font-semibold text-foreground">Price Breakdown</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            ${roomPrice} × {nights} nights
          </span>
          <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes</span>
          <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Service Fees</span>
          <span className="text-foreground font-medium">${fees?.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="text-foreground font-semibold">Total Price</span>
          <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
