import type * as React from "react";

import { cn } from "@/lib/utils";
import type { LucideProps } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
	icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

function Input({ className, type, icon: Icon, ...props }: InputProps) {
	return (
		<div className="relative">
			{Icon && (
				<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 text-muted-foreground" />
			)}
			<input
				type={type}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					Icon ? "pl-10" : "",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export { Input };
