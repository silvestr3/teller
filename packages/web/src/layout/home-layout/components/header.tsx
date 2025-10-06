import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

export function Header() {
	const navigate = useNavigate();
	const { user } = useLoaderData();

	function handleLogout() {
		auth.signOut(
			{},
			{
				onSuccess: () => {
					navigate("/auth/sign-in");
				},
			},
		);
	}

	function getUserInitials(name: string | undefined) {
		if (!name) return "U";
		const names = name.split(" ");
		const initials = names.map((n) => n[0]).join("");
		return initials.slice(0, 2).toUpperCase();
	}

	return (
		<nav className="bg-sidebar h-12 display flex items-center justify-end p-4 border-b gap-2">
			<ThemeToggle />
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className="cursor-pointer">
						<AvatarImage src={user?.image ?? undefined} />
						<AvatarFallback className="text-sm font-medium">
							{getUserInitials(user?.name)}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem className="cursor-pointer flex items-center gap-2">
						<User size={16} /> Perfil
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={handleLogout}
						itemType="danger"
						className="cursor-pointer flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10"
					>
						<LogOut className="text-destructive" size={16} /> Sair
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	);
}
