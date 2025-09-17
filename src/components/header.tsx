
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Menu, LogOut, Shield } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const userNavLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Community Feed", href: "/community-feed" },
    { name: "My Reports", href: "/my-reports" },
    { name: "Report an Issue", href: "/report-issue" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  const adminNavLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Manage Reports", href: "/admin/manage-reports" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Leaderboard", href: "/admin/leaderboard" },
  ];

  const navLinks = user?.role === 'admin' ? adminNavLinks : userNavLinks;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const Logo = () => (
    <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
      <Building2 className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline tracking-tight">Civify</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Desktop Logo */}
        <div className="mr-6 hidden md:flex">
          <Logo />
        </div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                )}
              >
                {link.name}
              </Link>
            ))}
        </nav>

        {/* Mobile Header Layout */}
        <div className="flex flex-1 items-center justify-between md:hidden">
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                 <SheetHeader className="p-4 mb-4 border-b">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                   <Logo />
                </SheetHeader>
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "transition-colors hover:text-primary pl-4 py-2 rounded-l-md text-md",
                          pathname === link.href ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo */}
            <div className="flex items-center">
                <Logo />
            </div>

            {/* Placeholder for Profile Button */}
            <div className="w-10"></div>
        </div>

        {/* Profile / Right Aligned Section */}
        <div className="flex items-center justify-end md:flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-primary/50">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback className="font-bold">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize flex items-center gap-1">
                    {user?.role === 'admin' && <Shield className="w-3 h-3 text-primary" />}
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
