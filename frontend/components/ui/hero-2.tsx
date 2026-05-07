"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import Link from "next/link";

export const Component = () => {
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full rounded-lg")}>
      <div className="w-full">
        <header className="py-4 bg-transparent sm:py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="shrink-0">
                <Link href="/" title="" className="flex font-bold text-3xl font-h1 text-primary items-center gap-2">
                  <span className="material-symbols-outlined text-4xl">travel_explore</span>
                  CrisisLens
                </Link>
              </div>

              <div className="flex md:hidden">
                <button 
                  type="button" 
                  className="text-on-surface"
                  onClick={() => setMobileMenuExpanded(!mobileMenuExpanded)}
                >
                  {!mobileMenuExpanded ? (
                    <Menu className="w-7 h-7" />
                  ) : (
                    <X className="w-7 h-7" />
                  )}
                </button>
              </div>

              <nav className="hidden md:flex md:items-center md:justify-end md:space-x-12">
                <Link href="/dashboard" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">Dashboard</Link>
                <Link href="#features" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">Capabilities</Link>
                <Link href="#protocol" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">API Protocol</Link>
              </nav>
            </div>

            {mobileMenuExpanded && (
              <nav className="md:hidden">
                <div className="flex flex-col pt-8 pb-4 space-y-6">
                  <Link href="/dashboard" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">Dashboard</Link>
                  <Link href="#features" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">Capabilities</Link>
                  <Link href="#protocol" className="text-base font-normal text-on-surface-variant transition-all duration-200 hover:text-primary">API Protocol</Link>
                </div>
              </nav>
            )}
          </div>
        </header>

        <section className="py-12 bg-transparent sm:pb-16 lg:pb-20 xl:pb-24">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
              <div>
                <p className="text-sm font-data-mono tracking-widest text-primary uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Real-time Global Surveillance Active
                </p>
                <h1 className="mt-6 text-4xl font-h1 text-on-surface sm:mt-10 sm:text-5xl lg:text-6xl xl:text-7xl">
                  Not just a fake-news detector. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">An AI-Powered Early Warning Platform.</span>
                </h1>
                <p className="max-w-[512px] mt-4 text-xl font-body-lg text-on-surface-variant sm:mt-8">
                  Deploying military-grade consensus algorithms to identify, predict, and neutralize misinformation campaigns before they go viral.
                </p>
                <div className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/50"></div>
                  <Link href="/dashboard" title="" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-background bg-primary hover:bg-primary/90 border border-transparent rounded-full" role="button">
                    <Rocket className="w-5 h-5 mr-2" />
                    Enter the Dashboard
                  </Link>
                </div>

                <div>
                  <div className="inline-flex items-center pt-6 mt-8 border-t border-outline-variant/30 sm:pt-10 sm:mt-14">
                    <Rocket className="w-6 h-6 text-secondary" />
                    <span className="ml-2 text-base font-data-mono text-on-surface-variant">892k threats neutralized in the last 24h</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 lg:mt-0 z-0 pointer-events-none flex justify-center lg:justify-end">
                <img className="w-full max-w-[320px] lg:max-w-[512px] xl:max-w-[600px] rounded-full mix-blend-screen opacity-90" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Global Network" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
