import { CustomTabs } from "@/components/global/custom-tabs";
import { DataTable } from "@/components/global/data-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Income } from "@/types/income";
import type { ColumnDef } from "@tanstack/react-table";
import {
	CalendarCheck,
	MoreHorizontal,
	Pencil,
	Plus,
	Repeat,
	Trash,
} from "lucide-react";
import { useState } from "react";
import { IncomeDialog } from "./components/income-dialog";
import { useGetIncomes } from "@/api/incomes/get-incomes";
import { useDeleteIncome } from "@/api/incomes/delete-income";
import { toast } from "sonner";
import { DeleteDialog } from "./components/delete-dialog";

export function IncomePage() {
	const { data } = useGetIncomes();
	const { mutate: deleteIncome } = useDeleteIncome();
	const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

	const recurringIncomeList =
		data?.filter((income) => income.isRecurring) ?? [];
	const oneTimeIncomeList = data?.filter((income) => !income.isRecurring) ?? [];

	const columns: ColumnDef<Income>[] = [
		{
			accessorKey: "description",
			header: "Descrição",
		},
		{
			accessorKey: "amount",
			header: "Valor",
		},
		{
			accessorKey: "date",
			header: "Data",
			cell: ({ row }) => {
				const date = new Date(row.original.date);
				return Intl.DateTimeFormat("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}).format(date);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<div className="flex justify-end">
						<DropdownMenu modal open={isOpen} onOpenChange={setIsOpen}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<IncomeDialog mode="edit">
									<DropdownMenuItem className="cursor-pointer">
										<Pencil size={8} />
										Editar
									</DropdownMenuItem>
								</IncomeDialog>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									className="cursor-pointer"
									onClick={() => {
										setOpenDeleteDialog(row.original.id);
									}}
								>
									<Trash size={8} />
									Deletar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];

	function handleDeleteIncome() {
		if (!openDeleteDialog) return;

		deleteIncome(openDeleteDialog, {
			onSuccess: () => {
				toast.success("Receita deletada com sucesso");
				setOpenDeleteDialog(null);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	const tabs = [
		{
			value: "recurring",
			label: "Recorrentes",
			icon: (
				<Repeat
					className="-ms-0.5 me-1.5 opacity-60"
					size={16}
					aria-hidden="true"
				/>
			),
			content: <DataTable columns={columns} data={recurringIncomeList} />,
		},
		{
			value: "one-time",
			label: "Pontuais",
			icon: (
				<CalendarCheck
					className="-ms-0.5 me-1.5 opacity-60"
					size={16}
					aria-hidden="true"
				/>
			),
			content: <DataTable columns={columns} data={oneTimeIncomeList} />,
		},
	];

	return (
		<div className="flex-1">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl">Receitas</h2>
				<IncomeDialog mode={"add"}>
					<Button variant="outline">
						<Plus />
						Nova receita
					</Button>
				</IncomeDialog>
			</div>

			<CustomTabs tabs={tabs} />
			<DeleteDialog
				isOpen={openDeleteDialog !== null}
				onClose={() => setOpenDeleteDialog(null)}
				onConfirm={handleDeleteIncome}
			/>
		</div>
	);
}
