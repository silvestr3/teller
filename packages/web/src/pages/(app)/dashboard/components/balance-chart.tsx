import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
  { month: "Jan", revenue: 2000, expenses: 1578 },
  { month: "Feb", revenue: 2000, expenses: 1356 },
  { month: "Mar", revenue: 2400, expenses: 1234 },
  { month: "Apr", revenue: 5000, expenses: 2309 },
  { month: "May", revenue: 5000, expenses: 3400 },
  { month: "Jun", revenue: 5000, expenses: 3680 },
  { month: "Jul", revenue: 5000, expenses: 4500 },
  { month: "Aug", revenue: 6000, expenses: 3890 },
  { month: "Sep", revenue: 6000, expenses: 4690 },
  { month: "Oct", revenue: 7000, expenses: 5490 },
  { month: "Nov", revenue: 7000, expenses: 5490 },
  { month: "Dec", revenue: 7000, expenses: 5490 },
]

export function BalanceChart({ className }: { className?: string }) {
  const chartConfig = {
    revenue: {
      label: "Entradas",
      color: "#36BC3B",
    },
    expenses: {
      label: "Saídas",
      color: "#FF4326",
    },
  } satisfies ChartConfig

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Balanço</CardTitle>
        <CardDescription>Movimentações ao longo do tempo</CardDescription>
      </CardHeader>

      <Separator />

      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expenses)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expenses)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value}
            interval={0}
            alignmentBaseline="hanging"
            fontSize={14}
            allowDataOverflow={false}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="min-w-[150px]"
                labelFormatter={(value) => value}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="expenses"
            type="linear"
            fill="url(#fillExpenses)"
            stroke="var(--color-expenses)"
            stackId="a"
          />
          <Area
            dataKey="revenue"
            type="linear"
            fill="url(#fillRevenue)"
            stroke="var(--color-revenue)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
