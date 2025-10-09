import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function DeleteDialog({
	isOpen,
	onClose,
	onConfirm,
}: DeleteDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Deletar receita</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja deletar esta receita? Esta ação não pode ser
						desfeita.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancelar</Button>
					</DialogClose>
					<Button variant="destructive" onClick={onConfirm}>
						Deletar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
