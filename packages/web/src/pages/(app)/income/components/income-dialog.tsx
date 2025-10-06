import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/global/form-error";
import { cn } from "@/lib/utils";

interface IncomeDialogProps {
  children: React.ReactNode;
  mode: "add" | "edit";
}

export function IncomeDialog({ children, mode }: IncomeDialogProps) {
  const incomeSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.number().min(0.01, "Valor deve ser maior que zero"),
    date: z.string().min(1, "Data é obrigatória"),
    recurring: z.boolean().optional(),
  });

  type IncomeType = z.infer<typeof incomeSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IncomeType>({
    resolver: zodResolver(incomeSchema),
  });

  function onSubmit(data: IncomeType) {
    console.log(data);
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      reset();
    }
  }

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Cadastrar nova receita" : "Editar receita"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-8">
            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input
                className={cn(errors.description ? "border-destructive" : "")}
                id="description"
                {...register("description")}
              />
              {errors.description && (
                <FormError message={errors.description.message} />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="amount">Valor</Label>
              <Input
                className={cn(errors.description ? "border-destructive" : "")}
                id="amount"
                type="number"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && <FormError message={errors.amount.message} />}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="date">Data</Label>
              <Input
                className={cn(errors.description ? "border-destructive" : "")}
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && <FormError message={errors.date.message} />}
            </div>
            <div className="flex gap-3">
              <Label htmlFor="recurring">Recorrente</Label>
              <Controller
                name="recurring"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="recurring"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              {errors.recurring && (
                <FormError message={errors.recurring.message} />
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
