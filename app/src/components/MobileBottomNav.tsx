"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V21h13.5V9.75" />
      </svg>
    ),
  },
  {
    href: "/gesture",
    label: "Gestur",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.5 20.25h5a3.75 3.75 0 0 0 3.75-3.75V12a2.25 2.25 0 0 0-4.5 0v2.25"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.75 14.25V6.75a2.25 2.25 0 1 0-4.5 0v8.25"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 15.75 7.5 14a2 2 0 0 0-2.828 0l-.172.172a2 2 0 0 0 0 2.828l2.672 2.672A4 4 0 0 0 10 21h4" />
      </svg>
    ),
  },
  {
    href: "/voice",
    label: "Suara",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 1 1-4.5 0v-4.5A2.25 2.25 0 0 1 12 4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.5v.75a5.25 5.25 0 1 0 10.5 0v-.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v3" />
      </svg>
    ),
  },
  {
    href: "/edu",
    label: "Edukasi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v10.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25 12 3l7.5 5.25-7.5 5.25L4.5 8.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.875v5.25L12 21l5.25-4.875v-5.25" />
      </svg>
    ),
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-40 hidden md:block" aria-label="Navigasi utama desktop">
        <div className="mx-auto w-full max-w-6xl px-6 pt-4">
          <ul className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/45 bg-[#fffdf8] px-3 py-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-emerald-100 text-emerald-950"
                        : "text-emerald-900/75 hover:bg-emerald-50"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-200 bg-[#fffdf8] md:hidden"
        aria-label="Navigasi utama mobile"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-2 py-2 text-[11px] font-semibold ${
                    active ? "text-emerald-900" : "text-emerald-900/65"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
