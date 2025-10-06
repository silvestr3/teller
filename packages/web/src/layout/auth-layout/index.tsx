import { Outlet } from "react-router";
import signInImage from "./images/sign-in.svg";

export function AuthLayout() {
	return (
		<div className="flex h-screen w-full items-center">
			<div className="hidden md:w-1/2 lg:w-2/3 flex-1 md:flex-col md:flex md:items-center md:justify-center h-full">
				<img
					src={signInImage}
					alt="Auth"
					className="w-[300px] md:w-[400px] lg:w-[500px]"
				/>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
