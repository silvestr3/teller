import { DataTable } from "@/components/global/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types/payment";
import { type ColumnDef } from "@tanstack/react-table";

export const payments: Payment[] = [
	{
		id: "728ed52f",
		amount: 100,
		status: "pending",
		description: "Payment for invoice #123",
		category: "Services",
	},
	{
		id: "489e1d42",
		amount: 125,
		status: "completed",
		description: "Payment for invoice #124",
		category: "Services",
	},
	{
		id: "489e1456",
		amount: 409,
		status: "overdue",
		description: "Payment for invoice #125",
		category: "Products",
	},
];

export function RecentTransactions() {
	const columns: ColumnDef<Payment>[] = [
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const badgeMap = {
					pending: {
						color: "bg-amber-500",
						label: "Pendente",
					},
					completed: {
						color: "bg-emerald-500",
						label: "Concluído",
					},
					overdue: {
						color: "bg-red-500",
						label: "Atrasado",
					},
				} as const;

				return (
					<Badge variant="outline" className="gap-1.5 capitalize">
						<span
							className={cn(
								"size-1.5 rounded-full",
								badgeMap[row.original.status].color,
							)}
							aria-hidden="true"
						></span>
						{badgeMap[row.original.status].label}
					</Badge>
				);
			},
		},
		{
			accessorKey: "description",
			header: "Descrição",
		},
		{
			accessorKey: "category",
			header: "Categoria",
		},
		{
			accessorKey: "amount",
			header: "Valor",
		},
	];

	return (
		<div>
			<h2 className="mb-2">Transações recentes</h2>
			<DataTable columns={columns} data={payments} />
		</div>
	);
}
