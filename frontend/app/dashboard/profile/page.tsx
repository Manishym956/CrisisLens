"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/axios";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [verifiedCount, setVerifiedCount] = useState<number>(0);
  const [threatsFlagged, setThreatsFlagged] = useState<number>(0);
  const [accuracyRate, setAccuracyRate] = useState<number>(0);
  const [activeDays, setActiveDays] = useState<number>(1);
  const [threatPushNotifications, setThreatPushNotifications] = useState<boolean>(true);
  const [automatedReportDispatch, setAutomatedReportDispatch] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiClient.get('/api/v1/profile/analytics');
        const data = response.data || {};
        setVerifiedCount(Number(data.verified_count ?? 0));
        setThreatsFlagged(Number(data.threats_flagged ?? 0));
        setAccuracyRate(Number(data.accuracy_rate ?? 0));
        setActiveDays(Number(data.active_days ?? 1));
        setThreatPushNotifications(Boolean(data?.settings?.threat_push_notifications ?? true));
        setAutomatedReportDispatch(Boolean(data?.settings?.automated_report_dispatch ?? false));
      } catch (error: any) {
        console.error("Profile API Error! URL:", error?.config?.url);
        console.error("Response:", error?.response?.data);
      }
    };
    
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const persistSettings = async (nextThreatPush: boolean, nextAutoDispatch: boolean) => {
    setIsSavingSettings(true);
    try {
      const response = await apiClient.patch("/api/v1/profile/settings", {
        threat_push_notifications: nextThreatPush,
        automated_report_dispatch: nextAutoDispatch,
      });
      setThreatPushNotifications(Boolean(response.data?.settings?.threat_push_notifications ?? nextThreatPush));
      setAutomatedReportDispatch(Boolean(response.data?.settings?.automated_report_dispatch ?? nextAutoDispatch));
      if (nextAutoDispatch && response.data?.dispatch?.status === "sent") {
        toast.success("Automated dispatch enabled. Low-threat export email sent.");
      } else {
        toast.success("Settings updated.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      <header className="space-y-1">
        <h2 className="font-h2 text-h2 text-primary font-bold">Profile & Analytics</h2>
        <p className="text-on-surface-variant text-body-lg">Manage your secure node identity and monitor intelligence contributions.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Identity Card */}
        <div className="glass-panel p-8 rounded-xl space-y-6 col-span-1 border border-outline-variant/30">
          <div className="flex flex-col items-center text-center">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-primary mb-4" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-container/20 border-2 border-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-primary">person</span>
              </div>
            )}
            <h3 className="font-h3 text-h3 text-on-surface">{user?.name || "Anonymous Node"}</h3>
            <p className="font-data-mono text-label-sm text-primary uppercase tracking-widest">{user?.role || "Operative"}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-outline-variant/20">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-label-sm">Email Access</span>
              <span className="text-on-surface text-label-sm">{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-label-sm">News Verified</span>
              <span className="text-primary-fixed text-label-sm font-bold">{verifiedCount}</span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full mt-6 py-3 rounded-lg border border-error/50 text-error hover:bg-error/10 transition-colors font-bold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Terminate Session
          </button>
        </div>

        {/* Analytics & Settings Panel */}
        <div className="glass-panel p-8 rounded-xl space-y-8 col-span-1 lg:col-span-2 border border-outline-variant/30">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            <h3 className="font-h3 text-h3 text-on-surface">Node Analytics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-surface-container-highest/50 border border-outline-variant/20 text-center">
              <span className="block text-h2 font-bold text-primary">{threatsFlagged}</span>
              <span className="text-[10px] uppercase font-data-mono text-on-surface-variant">Threats Flagged</span>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-highest/50 border border-outline-variant/20 text-center">
              <span className="block text-h2 font-bold text-secondary">{accuracyRate}%</span>
              <span className="text-[10px] uppercase font-data-mono text-on-surface-variant">Accuracy Rate</span>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-highest/50 border border-outline-variant/20 text-center col-span-2 md:col-span-1">
              <span className="block text-h2 font-bold text-tertiary">{activeDays}</span>
              <span className="text-[10px] uppercase font-data-mono text-on-surface-variant">Active Days</span>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4 mb-6">
              <span className="material-symbols-outlined text-primary">settings</span>
              <h3 className="font-h3 text-h3 text-on-surface">System Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                <div>
                  <h4 className="font-bold text-on-surface">Threat Push Notifications</h4>
                  <p className="text-label-sm text-on-surface-variant">Receive alerts for emerging threats in your region.</p>
                </div>
                <button
                  disabled={isSavingSettings}
                  onClick={() => persistSettings(!threatPushNotifications, automatedReportDispatch)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    threatPushNotifications ? "bg-primary" : "bg-surface-variant"
                  } ${isSavingSettings ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                    threatPushNotifications ? "right-1 bg-background" : "left-1 bg-on-surface-variant"
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                <div>
                  <h4 className="font-bold text-on-surface">Automated Report Dispatch</h4>
                  <p className="text-label-sm text-on-surface-variant">Send low-threat (Rank 7-10) fake-news export to your email when enabled.</p>
                </div>
                <button
                  disabled={isSavingSettings}
                  onClick={() => persistSettings(threatPushNotifications, !automatedReportDispatch)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    automatedReportDispatch ? "bg-primary" : "bg-surface-variant"
                  } ${isSavingSettings ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                    automatedReportDispatch ? "right-1 bg-background" : "left-1 bg-on-surface-variant"
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
