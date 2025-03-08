"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import AdminLayout from "../../shared/layout/AdminLayout";
import Header from "../components/headers/Header";
import Seo from "../../shared/seo/seo";
import { useTheme } from "next-themes";

export default function UnauthorizedPage() {
  const router = useRouter();
  
  // Theme setup
  useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state once component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch with theme
  if (!mounted) return null;

  return (
    <AdminLayout>
      <Seo title="Access Denied | Unauthorized" />
      <Header title="Unauthorized Access" breadcrumbLinkText="Dashboard" breadcrumbLinkHref="/admin/dashboard" />
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 w-[97%] mx-auto flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 text-center p-8">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="mt-6 text-3xl font-extrabold">
                Access Denied
              </h1>
            </div>
            
            <div className="">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You don&apos;t have permission to access this page.
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Link href="/admin/dashboard" passHref>
                <Button className="">
                  <Home className="h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Error Code: 403 - Forbidden
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}