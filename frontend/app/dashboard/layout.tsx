import Link from "next/link";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/15 shadow-2xl shadow-primary/5">
        <div className="flex justify-between items-center px-8 py-2 w-full max-w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-h2">security</span>
            <Link href="/"><h1 className="font-h2 text-h2 font-bold tracking-tighter text-primary">CrisisLens</h1></Link>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-10">
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard">Dashboard</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard/verify">Verify News</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="/dashboard/deepfake">Deepfake Lab</Link>
            </nav>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary active:scale-95 duration-200">notifications</button>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer */}
      <aside className="fixed left-0 top-0 h-full w-16 fixed left-0 top-0 h-full w-16 bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/10 shadow-xl hidden lg:flex flex-col py-16 px-4 z-40">
        <div className="mb-16">
          <h3 className="font-h3 text-h3 text-primary-fixed">CrisisLens AI</h3>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-4 text-on-surface-variant p-3 hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-body-md text-body-md">Overview</span>
            </div>
          </Link>
          <Link href="/dashboard/verify">
            <div className="flex items-center gap-4 text-on-surface-variant p-3 hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">fact_check</span>
              <span className="font-body-md text-body-md">Verify News</span>
            </div>
          </Link>
          <Link href="/dashboard/predictions">
            <div className="flex items-center gap-4 text-on-surface-variant p-3 hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">trending_up</span>
              <span className="font-body-md text-body-md">Predictions</span>
            </div>
          </Link>
          <Link href="/dashboard/deepfake">
            <div className="flex items-center gap-4 text-on-surface-variant p-3 hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">visibility</span>
              <span className="font-body-md text-body-md">Deepfake Lab</span>
            </div>
          </Link>
          <Link href="/dashboard/profile" className="mt-auto">
            <div className="flex items-center gap-4 text-on-surface-variant p-3 hover:bg-surface-variant/30 hover:text-primary-fixed transition-all cursor-pointer group rounded-lg">
              <span className="material-symbols-outlined">person</span>
              <span className="font-body-md text-body-md">Profile</span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="pt-16 lg:pl-16 min-h-screen">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant/5 lg:pl-16">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 CrisisLens Intelligence. Secure Node Active.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">API Status</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors underline-offset-4 hover:underline" href="#">Privacy Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
