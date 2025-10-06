import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, Outlet, useLocation } from "react-router";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Home,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoTrigger } from "./logo-trigger";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from "./header";

export function SidebarContainer() {
  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Entradas",
      url: "/income",
      icon: BanknoteArrowUp,
    },
    {
      title: "Saídas",
      url: "/expenses",
      icon: BanknoteArrowDown,
    },
    {
      title: "Investimentos",
      url: "/investments",
      icon: TrendingUp,
    },
  ];

  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader
          className={cn("flex items-center flex-row", "justify-between")}
        >
          <LogoTrigger />
          {open && <SidebarTrigger />}
        </SidebarHeader>
        <SidebarContent
          className={cn(
            "flex mt-4 list-none",
            open ? "items-start" : "items-center"
          )}
        >
          {sidebarItems.map((item) => (
            <Tooltip key={item.title} disableHoverableContent>
              <SidebarMenuItem
                className={cn(
                  "w-full transition-all text-muted-foreground font-light",
                  open ? "px-1" : "px-2"
                )}
              >
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        currentPath === item.url && "bg-accent text-foreground"
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent arrowPadding={90} side="right">
                    {item.title}
                  </TooltipContent>
                )}
              </SidebarMenuItem>
            </Tooltip>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="flex flex-col flex-1 lg:px-8 lg:py-6 md:px-4 md:py-4 p-2">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
