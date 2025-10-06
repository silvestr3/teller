import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Pie, PieChart } from "recharts"

export function CategoriesChart({ className }: { className?: string }) {
  const chartData = [
    { browser: "moradia", visitors: 475, fill: "var(--color-moradia)" },
    { browser: "alimentacao", visitors: 200, fill: "var(--color-alimentacao)" },
    { browser: "lazer", visitors: 187, fill: "var(--color-lazer)" },
    { browser: "saude", visitors: 173, fill: "var(--color-saude)" },
    { browser: "outros", visitors: 40, fill: "var(--color-outros)" },
  ]

  const chartConfig = {
    moradia: {
      label: "Moradia",
      color: "var(--chart-1)",
    },
    alimentacao: {
      label: "Alimentacão",
      color: "var(--chart-2)",
    },
    lazer: {
      label: "Lazer",
      color: "var(--chart-3)",
    },
    saude: {
      label: "Saúde",
      color: "var(--chart-4)",
    },
    outros: {
      label: "Outros",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  return (
    <Card className={cn(className)}>
      <CardHeader className="items-center pb-0 flex justify-between">
        <CardTitle>Categorias</CardTitle>
        <Button variant={"secondary"}>
          <Plus />
          Adicionar Categoria
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <PieChart className="flex items-center">
            <Pie data={chartData} dataKey="visitors" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="min-w-[150px]"
                  hideLabel
                  nameKey="browser"
                  labelKey="browser"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
