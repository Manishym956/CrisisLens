"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function DashboardOverviewPage() {
  const [topThreats, setTopThreats] = useState<any[]>([]);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const [wsStatus, setWsStatus] = useState("Connecting...");

  useEffect(() => {
    // Fetch Top Fake News from persistent storage
    const fetchTopThreats = async () => {
      try {
        const response = await axios.get("/api/v1/news/top-fake-news?limit=5");
        setTopThreats(response.data);
      } catch (error) {
        console.error("Error fetching top threats", error);
      }
    };
    fetchTopThreats();

    // Connect to WebSocket
    const ws = new WebSocket("ws://localhost:8000/api/v1/realtime/ws");
    
    ws.onopen = () => {
      setWsStatus("Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_threat') {
          toast.error(`NEW THREAT: ${data.data.risk_classification}`);
          setLiveAlerts(prev => [data.data, ...prev].slice(0, 10)); // Keep last 10
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.onclose = () => {
      setWsStatus("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-h1 text-h1 text-primary glow-cyan mb-1">Command Center</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Global misinformation live tracking & threat analysis.</p>
        </div>
        <div className="flex items-center gap-1 text-label-sm font-data-mono">
          <span className={`w-2 h-2 rounded-full ${wsStatus === 'Connected' ? 'bg-primary-container animate-pulse' : 'bg-error'}`}></span>
          <span className={wsStatus === 'Connected' ? 'text-primary' : 'text-error'}>WS: {wsStatus}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Fake News Component */}
        <section className="glass-panel p-6 rounded-xl flex flex-col min-h-[500px]">
          <div className="border-b border-outline-variant/10 pb-6 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-error text-[20px]">priority_high</span>
              <h3 className="font-h3 text-h3 text-error">Critical Threats (Top 5)</h3>
            </div>
          </div>
          <div className="space-y-6 overflow-y-auto">
            {topThreats.length > 0 ? topThreats.map((threat, idx) => (
              <div key={idx} className="group cursor-pointer bg-surface-container/50 p-3 rounded-lg border border-outline-variant/10 hover:border-primary-container/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-data-mono bg-error/20 px-1.5 py-0.5 rounded text-error uppercase">Score: {threat.total_threat_score.toFixed(1)}</span>
                  <div className="flex items-center gap-1 text-error">
                    <span className="text-[10px] font-data-mono">THREAT: {threat.risk_classification}</span>
                  </div>
                </div>
                <h4 className="font-body-md text-on-surface font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {threat.news_text}
                </h4>
              </div>
            )) : (
              <p className="text-on-surface-variant text-center py-10">No critical threats found in the database.</p>
            )}
          </div>
        </section>

        {/* Live Feed Component */}
        <section className="glass-panel p-6 rounded-xl flex flex-col min-h-[500px]">
          <div className="border-b border-outline-variant/10 pb-6 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
              <h3 className="font-h3 text-h3 text-primary">Live Verification Feed</h3>
            </div>
            <span className="text-label-sm font-data-mono px-2 py-1 bg-primary-container/20 text-primary-container rounded border border-primary-container/20 animate-pulse">LIVE</span>
          </div>
          <div className="space-y-6 overflow-y-auto">
            {liveAlerts.length > 0 ? liveAlerts.map((alert, idx) => (
              <div key={idx} className="flex gap-6 border-l-2 border-primary-container pl-3">
                <div className="text-on-surface-variant font-data-mono text-[10px] mt-1 whitespace-nowrap">JUST NOW</div>
                <div>
                  <p className="text-on-surface font-body-sm mb-1">{alert.news_text ? alert.news_text.substring(0, 80) + '...' : 'New item verified.'}</p>
                  <p className="text-primary font-data-mono text-[10px]">RISK: {alert.risk_classification}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50 py-20">
                <span className="material-symbols-outlined text-4xl mb-4 animate-spin-slow">radar</span>
                <p>Waiting for live verification events...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
