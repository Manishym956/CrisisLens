import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/15 shadow-2xl shadow-primary/5">
        <div className="flex justify-between items-center px-margin py-base w-full max-w-full">
          <div className="flex items-center gap-base">
            <span className="material-symbols-outlined text-primary">security</span>
            <span className="font-h2 text-h2 font-bold tracking-tighter text-primary">CrisisLens</span>
          </div>
          <nav className="hidden md:flex gap-lg items-center">
            <Link className="text-primary font-bold font-label-sm text-label-sm hover:text-primary transition-colors duration-300" href="/">Overview</Link>
            <Link className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors duration-300" href="/dashboard">Dashboard</Link>
            <Link className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors duration-300" href="/dashboard/verify">Verify</Link>
            <Link href="/dashboard">
              <button className="cta-glow px-md py-xs rounded-full text-on-primary font-bold text-label-sm transition-all duration-200 active:scale-95">Go to Dashboard</button>
            </Link>
          </nav>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 duration-200">notifications</span>
            <span className="material-symbols-outlined md:hidden text-on-surface-variant">menu</span>
          </div>
        </div>
      </header>

      <main className="pt-xl">
        {/* Hero Section */}
        <section className="relative min-h-[795px] flex flex-col items-center justify-center text-center px-margin hero-gradient">
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
            <img 
              alt="3D Holographic Globe" 
              className="w-full max-w-4xl animate-pulse" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8YfB30lIaoUE8g9gZ914pzqeLY70LrEAEycAq1t5wJg5KbXg8Zwu7LK1YUKdA5iLeDHvcMO2TjFIcB94JTHTzIhsCOtV_eWIpXHMVy0lQ9aN_kka5ybYgPuNqIXHDg5dOCYyOos6NGR8mvjxosZ5tmX0nlpIj2jm4pD4a3er78WPzeTjCfvQp6Erhp9YbVvQx2ThKaGUcUgR-DNM0ATsa7RTw6QNPePdAqZrGhUZ5XmT8YJgInoVsgLX9Y9dMrkpeacJUlHiqwcY"
            />
          </div>
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-secondary-container/20 border border-primary/20 mb-md">
              <span className="w-2 h-2 rounded-full bg-primary-container threat-pulse"></span>
              <span className="font-data-mono text-data-mono text-primary-fixed uppercase">Real-time Global Surveillance Active</span>
            </div>
            <h1 className="font-h1 text-h1 text-on-surface mb-md leading-none">
              Not just a fake-news detector.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">An AI-Powered Early Warning Platform.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl">
              Deploying military-grade consensus algorithms to identify, predict, and neutralize misinformation campaigns before they go viral.
            </p>
            <div className="flex flex-col sm:flex-row gap-gutter justify-center">
              <Link href="/dashboard">
                <button className="cta-glow px-xl py-md rounded-lg font-h3 text-h3 text-on-primary flex items-center justify-center gap-sm group">
                  Go to Dashboard
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </Link>
              <button className="glass-panel px-xl py-md rounded-lg font-h3 text-h3 text-primary border border-outline-variant/30 hover:bg-surface-variant/30 transition-all">
                View API Protocol
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="absolute bottom-10 w-full max-w-6xl px-margin hidden lg:grid grid-cols-4 gap-lg">
            <div className="glass-panel p-md rounded-xl text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Active Nodes</p>
              <p className="font-h3 text-h3 text-primary">4,821 <span className="text-sm font-data-mono text-primary-fixed">+12%</span></p>
            </div>
            <div className="glass-panel p-md rounded-xl text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Detection Latency</p>
              <p className="font-h3 text-h3 text-primary">142ms <span className="text-sm font-data-mono text-on-tertiary-container">Optimal</span></p>
            </div>
            <div className="glass-panel p-md rounded-xl text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Threats Neutralized</p>
              <p className="font-h3 text-h3 text-primary">892k <span className="text-sm font-data-mono text-primary-fixed">Last 24h</span></p>
            </div>
            <div className="glass-panel p-md rounded-xl text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Consensus Accuracy</p>
              <p className="font-h3 text-h3 text-primary">99.98% <span className="text-sm font-data-mono text-on-tertiary-container">Verified</span></p>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-xl px-margin max-w-7xl mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-h2 text-h2 text-on-surface mb-base">Platform Capabilities</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">The architecture of next-gen cognitive defense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Multi-AI Consensus */}
            <div className="md:col-span-8 glass-panel p-lg rounded-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-md border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                </div>
                <h3 className="font-h2 text-h2 text-on-surface mb-sm">Multi-AI Consensus</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Our proprietary Neural-Link™ aggregates analysis from 3 distinct LLMs to eliminate bias and ensure maximum verification integrity.</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[200px]">cloud_sync</span>
              </div>
            </div>
            {/* Real-time Alerts */}
            <div className="md:col-span-4 glass-panel p-lg rounded-xl border-error/20 threat-pulse flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-md border border-error/30">
                <span className="material-symbols-outlined text-error text-3xl">emergency_home</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">Real-time Alerts</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Instant push notifications for emerging misinformation spikes within your geofence.</p>
            </div>
            {/* Predictive Engine */}
            <div className="md:col-span-4 glass-panel p-lg rounded-xl hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-md border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-3xl">trending_up</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">Predictive Engine</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Forecast the viral potential of news cycles before they peak using advanced sentiment trend mapping.</p>
            </div>
            {/* Deepfake Lab */}
            <div className="md:col-span-8 glass-panel p-lg rounded-xl flex items-center gap-lg group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary text-4xl">visibility</span>
                </div>
              </div>
              <div>
                <h3 className="font-h2 text-h2 text-on-surface mb-sm">Deepfake Lab</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Identify synthetic audio and video with pixel-level forensics and spectral analysis tools.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-xl px-margin">
          <div className="max-w-5xl mx-auto glass-panel p-xl rounded-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
            <div className="relative z-10">
              <h2 className="font-h1 text-h1 text-on-surface mb-md">Ready to secure the truth?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl mx-auto">Join the decentralized node network and start monitoring global narratives with CrisisLens AI.</p>
              <Link href="/dashboard">
                <button className="cta-glow px-xl py-md rounded-lg font-h3 text-h3 text-on-primary">Establish Secure Connection</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl border-t border-outline-variant/5 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-7xl mx-auto gap-md">
          <div className="flex items-center gap-base">
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-widest">CrisisLens Intelligence</span>
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 CrisisLens Intelligence. Secure Node Active.</p>
          <div className="flex gap-lg">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">API Status</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Privacy Protocol</a>
          </div>
        </div>
      </footer>
    </>
  );
}
