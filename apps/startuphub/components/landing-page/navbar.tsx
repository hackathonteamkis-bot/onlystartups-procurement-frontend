"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LogoutButton from "@/components/auth/logout-button";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@onlystartups/ui";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const menuItems: { name: string; href: string }[] = [
  { name: "Explore", href: "/explore" },
  { name: "OS Daily", href: "/os-daily" },
  { name: "FixThis", href: "/fix-this" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = session 
    ? [{ name: "Dashboard", href: "/dashboard" }, ...menuItems]
    : menuItems;

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className="fixed top-3 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[95%] max-w-6xl">
      {/* Main Navbar */}
      <div className="bg-[#1A1A2E] rounded-full border border-white/10 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Logo Group */}
          <div className="flex items-center shrink-0">
            <Link href={session ? "/dashboard" : "/"} className="flex items-center group shrink-0">
              <Image
                src="/logo/os-logo-white.svg"
                alt="OnlyStartups"
                width={32}
                height={32}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>
            
            <div className="w-[1px] h-6 sm:h-8 bg-white/20 mx-3 sm:mx-4"></div>
            
            <Link href={session ? "/dashboard" : "/"} className="flex items-center group shrink-0">
              <Image
                src="/logo/msis.png"
                alt="Maharashtra State Innovation Society"
                width={300}
                height={100}
                unoptimized
                className="h-8 w-auto sm:h-9 md:h-10 transition-opacity duration-300 group-hover:opacity-80 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end mr-3 lg:mr-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.name}</span>
                <span className="absolute bottom-1.5 left-3 right-3 h-[2px] bg-[#F26522] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-6 bg-white/20 mr-3 lg:mr-4 shrink-0" />

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center shrink-0 gap-2">
            {session ? (
              <LogoutButton>
                <Button
                  variant="outline"
                  className="rounded-full border-white/50 bg-white text-black hover:bg-white/90 transition-all duration-300"
                >
                  Logout
                </Button>
              </LogoutButton>
            ) : (
              <>
                <LoginButton>
                  <Button variant="outline" className="rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 text-sm px-4 py-2">
                    Founders Login
                  </Button>
                </LoginButton>
                <Link href="http://localhost:3003/" target="_blank">
                  <Button className="rounded-full bg-[#F26522] text-white hover:bg-[#d95a1e] transition-all duration-300 shadow-lg hover:shadow-xl text-sm px-4 py-2 border-none">
                    Join as Startuphub
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-1.5 sm:p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu - Separate Box */}
      <div
        className={`lg:hidden mt-3 overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen
          ? "max-h-[500px] opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span>{item.name}</span>
                <svg
                  className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>

          {/* Divider */}
          {menuItems.length > 0 && (
            <div className="my-4 border-t border-white/10" />
          )}

          {/* Auth Button */}
          <div className="px-2 flex flex-col gap-3">
            {session ? (
              <LogoutButton>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/50 bg-white text-black hover:bg-white/90 transition-all duration-300 h-12 text-base"
                >
                  Logout
                </Button>
              </LogoutButton>
            ) : (
              <>
                <LoginButton>
                  <Button variant="outline" className="w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 h-12 text-base">
                    Founders Login
                  </Button>
                </LoginButton>
                <Link href="http://localhost:3003/" target="_blank" className="block w-full">
                  <Button className="w-full rounded-full bg-[#F26522] text-white hover:bg-[#d95a1e] transition-all duration-300 shadow-lg hover:shadow-xl h-12 text-base border-none">
                    Join as Startuphub
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
