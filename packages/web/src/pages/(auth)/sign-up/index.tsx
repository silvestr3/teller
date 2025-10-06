import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/global/form-error";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router";

const signUpSchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
	name: z.string().min(2, "Nome muito curto"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	});

	const navigate = useNavigate();

	function onSubmit(data: SignUpFormData) {
		auth.signUp.email(
			{
				email: data.email,
				password: data.password,
				name: data.name,
			},
			{
				onError: (error) => {
					toast.error(error.error.message);
				},
				onSuccess: ({ data }) => {
					toast.success(`Seja bem vindo(a) ${data.user.name ?? ""}!`);
					navigate("/");
				},
			},
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md p-8">
				<h1 className="text-2xl font-bold mb-10">Crie sua conta</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="name">Nome</Label>
						<Input
							placeholder="Insira seu nome completo"
							className={cn(errors.name ? "border-destructive" : "")}
							icon={User}
							id="name"
							{...register("name")}
						/>
						{errors.name && <FormError message={errors.name.message} />}
					</div>

					<div className="grid gap-3">
						<Label htmlFor="email">Email</Label>
						<Input
							placeholder="john@example.com"
							className={cn(errors.email ? "border-destructive" : "")}
							icon={Mail}
							id="email"
							{...register("email")}
						/>
						{errors.email && <FormError message={errors.email.message} />}
					</div>

					<div className="grid gap-3">
						<Label htmlFor="password">Senha</Label>
						<Input
							placeholder="Mínimo 8 caracteres"
							className={cn(errors.password ? "border-destructive" : "")}
							icon={Lock}
							id="password"
							type="password"
							{...register("password")}
						/>
						{errors.password && <FormError message={errors.password.message} />}
					</div>

					<Button type="submit" className="mt-2">
						Sign In
					</Button>
				</form>

				<span className="text-sm text-muted-foreground text-center mt-10 block">
					Já possui uma conta?{" "}
					<Link to="/auth/sign-in" className="underline hover:text-primary">
						Entrar
					</Link>
				</span>
			</div>
		</div>
	);
}
