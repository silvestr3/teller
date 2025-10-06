import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CustomTabsProps {
	tabs: Array<{
		value: string;
		label: string;
		icon: React.ReactNode;
		content: React.ReactNode;
	}>;
}

export function CustomTabs({ tabs }: CustomTabsProps) {
	return (
		<Tabs defaultValue={tabs[0].value} className="w-full">
			<TabsList className="justify-start text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-full">
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className="max-w-fit border-none cursor-pointer hover:bg-accent dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent bg-transparent hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5"
					>
						{tab.icon}
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
