import Link from "next/link";
import Image from "next/image";
import { Component as Hero2 } from "@/components/ui/hero-2";

export default function Home() {
  return (
    <>
      <main>
        <Hero2 />

        {/* Features Bento Grid */}
        <section className="py-16 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-h2 text-h2 text-on-surface mb-2">Platform Capabilities</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">The architecture of next-gen cognitive defense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Multi-AI Consensus */}
            <div className="md:col-span-8 glass-panel p-10 rounded-xl flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                </div>
                <h3 className="font-h2 text-h2 text-on-surface mb-3">Multi-AI Consensus</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[450px]">Our proprietary Neural-Link™ aggregates analysis from 3 distinct LLMs to eliminate bias and ensure maximum verification integrity.</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[200px]">cloud_sync</span>
              </div>
            </div>
            {/* Real-time Alerts */}
            <div className="md:col-span-4 glass-panel p-10 rounded-xl border-error/20 threat-pulse flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-6 border border-error/30">
                <span className="material-symbols-outlined text-error text-3xl">emergency_home</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-3">Real-time Alerts</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Instant push notifications for emerging misinformation spikes within your geofence.</p>
            </div>
            {/* Predictive Engine */}
            <div className="md:col-span-4 glass-panel p-10 rounded-xl hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-3xl">trending_up</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-3">Predictive Engine</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Forecast the viral potential of news cycles before they peak using advanced sentiment trend mapping.</p>
            </div>
            {/* Deepfake Lab */}
            <div className="md:col-span-8 glass-panel p-10 rounded-xl flex items-center gap-10 group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary text-4xl">visibility</span>
                </div>
              </div>
              <div>
                <h3 className="font-h2 text-h2 text-on-surface mb-3">Deepfake Lab</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Identify synthetic audio and video with pixel-level forensics and spectral analysis tools.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-8">
          <div className="max-w-5xl mx-auto glass-panel p-16 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
            <div className="relative z-10">
              <h2 className="font-h1 text-h1 text-on-surface mb-6">Ready to secure the truth?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-16 max-w-2xl mx-auto">Join the decentralized node network and start monitoring global narratives with CrisisLens AI.</p>
              <Link href="/dashboard">
                <button className="cta-glow px-16 py-6 rounded-lg font-h3 text-h3 text-on-primary">Establish Secure Connection</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 border-t border-outline-variant/5 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
          <div className="flex items-center gap-2">
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-widest">CrisisLens Intelligence</span>
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 CrisisLens Intelligence. Secure Node Active.</p>
          <div className="flex gap-10">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">API Status</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Privacy Protocol</a>
          </div>
        </div>
      </footer>
    </>
  );
}
