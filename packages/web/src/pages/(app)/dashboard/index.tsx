import { Separator } from "@/components/ui/separator"
import { BalanceChart } from "./components/balance-chart"
import { CategoriesChart } from "./components/categories-chart"
import { SummaryCards } from "./components/summary-cards"
import { RecentTransactions } from "./components/recent-transactions"

export function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-4 gap-4 h-full lg:h-[60vh]">
        <BalanceChart className="col-span-12 lg:col-span-7 row-span-4" />
        <SummaryCards className="col-span-12 lg:col-span-5 row-span-1" />
        <CategoriesChart className="col-span-12 lg:col-span-5 row-span-3" />
      </div>

      <Separator className="my-8" />

      <RecentTransactions />
    </>
  )
}
