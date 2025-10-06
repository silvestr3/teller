import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SummaryCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Entradas</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl text-emerald-500">
          10,000.00
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saídas</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl text-rose-600">5,000.00</CardContent>
      </Card>
    </div>
  )
}
