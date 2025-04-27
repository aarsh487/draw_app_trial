"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const navLinks = [
  { name: "Home", id: "/" },
  { name: "Rooms", id: "/create-room" },
];

export const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authorization');
    setToken(storedToken);
  }, []);

  return (
    <header className="bg-white fixed w-full top-0 z-50 backdrop-blur-sm border-b border-white p-2">
      <div className="flex justify-between items-center rounded-full bg-white px-6 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl">
          <h1 className={twMerge("tracking-wide font-extrabold text-black")}>
            Pincel<span className="text-primary">Flow</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {token &&
            navLinks.map((nav) => (
              <Link
                key={nav.id}
                href={nav.id}
                className="text-neutral-700 undreline underline-offset-4"
              >
                {nav.name}
              </Link>
            ))}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden text-white">
          <button>
            <Menu size={25} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};
