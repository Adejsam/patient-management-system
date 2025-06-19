"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ModeToggle } from "../../../ui/modeToggle";
import LightfullLogo from "../../../public/assets/icons/logo-full-light.png";
import DarkfullLogo from "../../../public/assets/icons/logo-full.svg";
import { Button } from "../../../ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === "dark" ? DarkfullLogo : LightfullLogo;

  return (
    <header
      className={`h-[60px] shadow-md w-full fixed top-0 left-0 flex items-center z-[1000] ${
        resolvedTheme === "dark" ? "bg-background" : "bg-white"
      }`}>
      <nav aria-label="Global" className=" flex w-full items-center justify-between mx-10">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              alt="logo"
              src={logoSrc}
              className="h-10 w-auto p-1"
              width={100}
              height={100}
              priority={true}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-foreground">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link href="/" className="text-sm/6 hover:text-green-500">
            Home
          </Link>
          <Link href="/contact-us" className="text-sm/6 hover:text-green-500">
            Contact us
          </Link>
          <Link href="/data-usage" className="text-sm/6 hover:text-green-500">
            Data Usage
          </Link>
          <Link href="/emergency" className="text-sm/6 hover:text-green-500">
            Emergency
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild variant={"default"}>
            <Link href="/patient/login" className="text-sm/6 text-black mr-1 dark:text-foreground">
              Login
            </Link>
          </Button>
          <Button variant={"secondary"} asChild>
            <Link
              href="/patient/register"
              className="text-sm/6 text-black bg-green-500 mr-5 dark:text-foreground">
              Register
            </Link>
          </Button>
        </div>
        <div className="hidden lg:block">
          <ModeToggle />
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background dark:bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                alt="Logo"
                src={logoSrc}
                className="h-8 w-auto"
                width={100}
                height={100}
                priority={true}
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-foreground">
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-green-500">
                  Home
                </Link>
                <Link
                  href="/conatact-us"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-green-500">
                  Contact Us
                </Link>
                <Link
                  href="/data-usage"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-green-500">
                  Data Usage
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-green-500">
                  Company
                </Link>
              </div>
              <div className="py-6">
                <Button asChild>
                  <Link
                    href="/patient/login"
                    className="text-sm/6 text-black mr-1 dark:text-foreground">
                    Login
                  </Link>
                </Button>
                <Button variant={"secondary"} asChild>
                  <Link
                    href="/patient/register"
                    className="text-sm/6 text-black bg-green-500 mr-5 dark:text-foreground">
                    Register
                  </Link>
                </Button>
              </div>
              <ModeToggle />
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
