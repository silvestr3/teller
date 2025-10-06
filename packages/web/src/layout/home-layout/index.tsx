import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContainer } from "./components/sidebar";
import { useNavigation } from "react-router";
import { Loader2 } from "lucide-react";

export const HomeLayout: React.FC = () => {
	const { state } = useNavigation();

	if (state === "loading") {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<Loader2 size={56} className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex h-screen w-full">
			<SidebarProvider>
				<SidebarContainer />
			</SidebarProvider>
		</div>
	);
};
