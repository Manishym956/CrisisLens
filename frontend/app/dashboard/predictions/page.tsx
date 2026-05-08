"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const downloadReportPdf = async () => {
    if (!predictions) {
      toast.error("No predictions loaded yet.");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 54;

      const addLine = (text: string, opts?: { size?: number; bold?: boolean; gap?: number }) => {
        const size = opts?.size ?? 11;
        const gap = opts?.gap ?? 16;
        doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
        doc.setFontSize(size);

        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        for (const line of lines) {
          if (y > 800) {
            doc.addPage();
            y = 54;
          }
          doc.text(String(line), margin, y);
          y += gap;
        }
      };

      const now = new Date();
      addLine("CrisisLens — Predictive Report", { size: 18, bold: true, gap: 24 });
      addLine(`Generated: ${now.toLocaleString()}`, { size: 10, gap: 18 });
      addLine(`Total analyzed: ${predictions.total_articles_analyzed ?? "—"} | Fake detected: ${predictions.total_fake_detected ?? "—"}`, { size: 11, gap: 18 });

      addLine(" ");
      addLine("Executive summary", { size: 14, bold: true, gap: 20 });
      addLine(predictions.analysis_summary ?? "—");

      addLine(" ");
      addLine("Top 5 fake news (today / recent)", { size: 14, bold: true, gap: 20 });
      const topFake = Array.isArray(predictions.top_fake_today) ? predictions.top_fake_today : [];
      if (topFake.length === 0) {
        addLine("No items available.");
      } else {
        topFake.slice(0, 5).forEach((item: any, idx: number) => {
          addLine(`${idx + 1}. ${item.title ?? "Untitled"}`, { bold: true });
          addLine(`   Risk: ${item.risk_classification ?? "—"} | Score: ${item.threat_score ?? "—"} | Topic: ${item.topic ?? "—"}`, { size: 10, gap: 14 });
          addLine(`   ${item.excerpt ?? ""}`, { size: 10, gap: 14 });
          addLine(" ");
        });
      }

      addLine("Emerging threats", { size: 14, bold: true, gap: 20 });
      const emerging = Array.isArray(predictions.emerging_threats) ? predictions.emerging_threats : [];
      if (emerging.length === 0) {
        addLine("No emerging threats available.");
      } else {
        emerging.slice(0, 6).forEach((t: any) => {
          addLine(`- ${t.category ?? "Unknown"} (${t.confidence_level ?? "—"}): ${t.predicted_narrative ?? ""}`, { size: 11, gap: 16 });
        });
      }

      addLine(" ");
      addLine("Election risk", { size: 14, bold: true, gap: 20 });
      addLine(predictions.election_misinformation_risk ?? "—");

      addLine(" ");
      addLine("Scam forecast", { size: 14, bold: true, gap: 20 });
      addLine(predictions.scam_narrative_prediction ?? "—");

      const filename = `crisislens-predictive-report-${now.toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      toast.success("PDF report downloaded.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF report.");
    }
  };

  const hotspots = (() => {
    const em = Array.isArray(predictions?.emerging_threats) ? predictions.emerging_threats : [];
    const coordsByCategory: Record<string, { top: string; left: string; colorClass: string; borderClass: string }> = {
      Political: { top: "18%", left: "28%", colorClass: "text-error", borderClass: "border-error/30" },
      Military: { top: "32%", left: "54%", colorClass: "text-primary", borderClass: "border-primary/30" },
      Health: { top: "54%", left: "62%", colorClass: "text-secondary", borderClass: "border-secondary/30" },
      Financial: { top: "40%", left: "36%", colorClass: "text-error", borderClass: "border-error/30" },
      Conspiracy: { top: "46%", left: "48%", colorClass: "text-primary", borderClass: "border-primary/30" },
    };

    const picked = em.slice(0, 2).map((t: any) => {
      const category = String(t?.category ?? "Threat");
      const key = Object.keys(coordsByCategory).find((k) => category.toLowerCase().includes(k.toLowerCase()));
      const coords = (key && coordsByCategory[key]) || { top: "22%", left: "22%", colorClass: "text-primary", borderClass: "border-primary/30" };
      return { category, count: t?.count ?? 0, confidence: t?.confidence_level ?? "—", ...coords };
    });

    if (picked.length > 0) return picked;
    return [
      { category: "No live hotspots yet", count: 0, confidence: "—", top: "22%", left: "22%", colorClass: "text-on-surface-variant", borderClass: "border-outline-variant/30" },
    ];
  })();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await axios.get("/api/v1/predictions/");
        // Check if there's enough data (the API returns {message: "Not enough data"} if db is empty)
        if (res.data.error || res.data.message) {
          toast(res.data.error || res.data.message, { icon: '⚠️' });
        } else {
          setPredictions(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load predictions. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      {/* Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-h1 text-h1 text-primary glow-cyan mb-1">Predictive Dashboard</h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">Forecasting information warfare maneuvers using heuristic analysis and neural artifact detection.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadReportPdf}
              disabled={loading || !predictions}
              className="bg-gradient-to-r from-[#00dbe9] to-[#571bc1] hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] hover:-translate-y-0.5 transition-all px-6 py-3 rounded-lg text-on-primary font-data-mono text-data-mono flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">download</span> EXPORT REPORT
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Trend Heatmap: Dark world map */}
        <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden relative group">
          <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">public</span>
              <h2 className="font-h3 text-h3">Global Threat Heatmap</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-error">
                <span className="w-2 h-2 rounded-full bg-error threat-pulse"></span> CRITICAL HOTSPOTS
              </span>
            </div>
          </div>
          <div className="relative bg-surface-container-lowest overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]">
            <img 
              className="w-full h-full object-cover opacity-60" 
              alt="World Map" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0CT2LUTYL63du1re5-5ZXMS_KFg7iWc5dPxO2nsqLqibGzhRe9SoraUZQ2P7yKtrC8HvQZVjaN-DNokAu7wSEDCYGA43tYU9Azooxl1C4Za4PFRmoiqeQZWVmC4ZkXtcrgAo83LjGJmZWSCdH4dUM_qhU3OluhyChcct2mLnYdH2FOwDYi9ncqeO_f-vvJAH2e2vpR7xJA077H_YCuDL-vl-TtQ0V0w4ngyZ4eBcTfZ_EdYMWMT387BD2tWz4K3FoPy2SBz5HxK0" 
            />
            {/* Hotspots (data-driven from emerging threats) */}
            {hotspots.map((h, i) => (
              <div
                key={`${h.category}-${i}`}
                className={`absolute p-2 sm:p-3 glass-panel rounded-lg ${h.borderClass} max-w-[70%] sm:max-w-none ${i === 0 ? "animate-pulse" : ""}`}
                style={{ top: h.top, left: h.left }}
              >
                <p className={`${h.colorClass} font-data-mono text-data-mono`}>
                  {h.category.toUpperCase()}
                </p>
                <p className="text-on-surface-variant text-[10px]">
                  {h.confidence} risk • {h.count} recent article(s)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Velocity: Glowing line chart */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">insights</span>
              <h2 className="font-h3 text-h3 text-secondary">Topic Velocity</h2>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                </div>
              ) : predictions && predictions.trending_topics ? (
                predictions.trending_topics.slice(0,3).map((topic: string, i: number) => {
                  const colors = ['#ffb4ab', '#00f0ff', '#d0bcff'];
                  const textColors = ['text-error', 'text-primary', 'text-secondary'];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-label-sm text-label-sm">
                        <span className="text-on-surface">#{topic.replace(/\s+/g, '')}</span>
                        <span className={`${textColors[i]} font-bold`}>+{(Math.random() * 300 + 100).toFixed(0)}%</span>
                      </div>
                      <div className="relative h-16 w-full overflow-hidden">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 64">
                          <path className="opacity-80" d={`M0 ${64-i*5} L100 ${50-i*10} L200 ${40-i*5} L300 ${20-i*8} L400 5`} fill="none" stroke={colors[i]} strokeWidth="2"></path>
                        </svg>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-on-surface-variant text-sm">Insufficient data. Verify more news items first.</p>
              )}
            </div>
          </div>
          <div className="pt-6 border-t border-outline-variant/10 mt-6">
            <p className="font-data-mono text-data-mono text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">timer</span> LIVE AI INFERENCE
            </p>
          </div>
        </div>

        {/* Predictive Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          
          {loading ? (
            [1,2,3].map(i => <div key={i} className="glass-panel rounded-xl h-48 animate-pulse bg-surface-variant/20"></div>)
          ) : predictions && predictions.emerging_threats ? (
            predictions.emerging_threats.map((threat: any, idx: number) => {
              const isCritical = threat.confidence_level === 'High';
              return (
                <div key={idx} className={`glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col min-h-[240px] min-w-0 ${isCritical ? 'border-error/20 threat-pulse' : 'border-primary/20'}`}>
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`${isCritical ? 'bg-error text-on-error' : 'bg-primary-container text-on-primary-container'} font-data-mono text-[10px] px-1 py-[2px] rounded uppercase`}>
                      {threat.confidence_level} RISK
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className={`${isCritical ? 'bg-error-container/20 text-error' : 'bg-primary-container/20 text-primary'} p-1 rounded-lg`}>
                      <span className="material-symbols-outlined">{isCritical ? 'warning' : 'analytics'}</span>
                    </div>
                    <div>
                      <h4 className={`font-h3 text-h3 ${isCritical ? 'text-error' : 'text-primary'}`}>{threat.category}</h4>
                      <p className="text-on-surface-variant text-label-sm font-label-sm">ID: PRD-{Math.floor(Math.random()*1000)}</p>
                    </div>
                  </div>
                  <p className="font-h3 text-h3 mb-3 line-clamp-2">{threat.predicted_narrative}</p>
                  
                  <div className="bg-surface-container-low p-3 rounded-lg mt-auto">
                    <p className="text-on-surface-variant font-body-md text-body-md italic leading-tight text-sm">
                      Keywords:{" "}
                      {Array.isArray(threat.related_keywords) && threat.related_keywords.length > 0
                        ? threat.related_keywords.join(", ")
                        : threat.category
                          ? `${threat.category} (${threat.count ?? 0} articles)`
                          : "—"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10 text-on-surface-variant">
              No predictive data available. The system needs more verified fake news to train on.
            </div>
          )}

          {/* Special Static Summaries from Predictions */}
          {predictions && predictions.election_misinformation_risk && (
            <div className="col-span-3 lg:col-span-12 glass-panel p-6 rounded-xl mt-6">
               <h3 className="text-primary font-h3 mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined">policy</span> Election Misinformation Risk
               </h3>
               <p className="text-on-surface-variant">{predictions.election_misinformation_risk}</p>
            </div>
          )}
          {predictions && predictions.scam_narrative_prediction && (
            <div className="col-span-3 lg:col-span-12 glass-panel p-6 rounded-xl mt-6">
               <h3 className="text-secondary font-h3 mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined">money_off</span> Scam Narrative Forecast
               </h3>
               <p className="text-on-surface-variant">{predictions.scam_narrative_prediction}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
