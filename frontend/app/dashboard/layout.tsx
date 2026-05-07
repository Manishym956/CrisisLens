import Link from "next/link";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/15 shadow-2xl shadow-primary/5">
        <div className="flex justify-between items-center px-margin py-base w-full max-w-full">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-h2">security</span>
            <Link href="/"><h1 className="font-h2 text-h2 font-bold tracking-tighter text-primary">CrisisLens</h1></Link>
          </div>
          <div className="flex items-center gap-md">
            <nav className="hidden md:flex gap-lg">
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard">Dashboard</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard/verify">Verify News</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard/deepfake">Deepfake Lab</Link>
            </nav>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary active:scale-95 duration-200">notifications</button>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer */}
      <aside className="fixed left-0 top-0 h-full w-xl fixed left-0 top-0 h-full w-xl bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/10 shadow-xl hidden lg:flex flex-col py-xl px-gutter z-40">
        <div className="mb-xl">
          <h3 className="font-h3 text-h3 text-primary-fixed">CrisisLens AI</h3>
        </div>
        <nav className="flex flex-col gap-base">
          <Link href="/dashboard">
            <div className="flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-body-md text-body-md">Overview</span>
            </div>
          </Link>
          <Link href="/dashboard/verify">
            <div className="flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">fact_check</span>
              <span className="font-body-md text-body-md">Verify News</span>
            </div>
          </Link>
          <Link href="/dashboard/predictions">
            <div className="flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">trending_up</span>
              <span className="font-body-md text-body-md">Predictions</span>
            </div>
          </Link>
          <Link href="/dashboard/deepfake">
            <div className="flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">visibility</span>
              <span className="font-body-md text-body-md">Deepfake Lab</span>
            </div>
          </Link>
          <Link href="/dashboard/analytics">
            <div className="flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">monitoring</span>
              <span className="font-body-md text-body-md">Analytics</span>
            </div>
          </Link>
          <div className="mt-auto flex items-center gap-gutter text-on-surface-variant p-sm hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="pt-xl lg:pl-xl min-h-screen">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant/5 lg:pl-xl">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto">
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 CrisisLens Intelligence. Secure Node Active.</p>
          <div className="flex gap-md mt-md md:mt-0">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">API Status</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">Privacy Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
