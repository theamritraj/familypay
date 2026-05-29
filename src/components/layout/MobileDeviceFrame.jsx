import { useState, useEffect } from "react";
import { Wifi, Battery, ShieldCheck, Sparkles, Smartphone } from "lucide-react";

const MobileDeviceFrame = ({ children }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(98);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Monitor viewport size to toggle desktop frame vs direct mobile bleed
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Slowly drain battery over time for realism (just a fun micro-interaction)
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => (prev > 10 ? prev - 1 : 98));
    }, 300000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // If viewed on a physical mobile device or small screen, bypass the frame completely
  if (isMobileScreen) {
    return <div className="w-full min-h-screen bg-bg relative overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#07090e] via-[#0b0c11] to-[#120a1c] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Canvas Side Panel */}
      <div className="absolute left-12 top-1/2 transform -translate-y-1/2 hidden xl:flex flex-col gap-6 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">FamilyPay</h2>
            <p className="text-xs text-text-muted">Circle Payments Simulator</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-text">Native Environment</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Experience secure circle approvals, real-time limit controls, and NPCI UPI payments in our official native shell simulation.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-success mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-text">Interactive Demo</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Click buttons, scan QR codes, set limits, and trigger payments. The dynamic island and status bar respond automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-text-muted/50 leading-relaxed font-mono">
          SYSTEM PREVIEW • VERSION 2.6.4<br />
          ACTIVE DEEP LEARNING AGENT CONNECTIONS: STABLE<br />
          NPCI SIMULATOR: LIVE (SANDBOX)
        </div>
      </div>

      {/* Main Physical Phone Chassis */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Left Side Physical Buttons */}
        <div className="absolute left-[-15px] top-[140px] w-[3px] h-[40px] bg-slate-800 rounded-l border-r border-slate-700/50" />
        <div className="absolute left-[-15px] top-[195px] w-[3px] h-[55px] bg-slate-800 rounded-l border-r border-slate-700/50 shadow-md" />
        <div className="absolute left-[-15px] top-[260px] w-[3px] h-[55px] bg-slate-800 rounded-l border-r border-slate-700/50 shadow-md" />

        {/* Right Side Physical Power Button */}
        <div className="absolute right-[-15px] top-[210px] w-[3px] h-[75px] bg-slate-800 rounded-r border-l border-slate-700/50 shadow-md" />

        {/* Bezel / Phone Outer Edge */}
        <div className="w-[410px] h-[855px] bg-[#1c1e26] border-[10px] border-[#252834] rounded-[52px] shadow-2xl relative flex flex-col p-1.5 select-none ring-1 ring-white/10">
          
          {/* Inner Glossy Screen Border */}
          <div className="w-full h-full rounded-[44px] bg-bg overflow-hidden relative flex flex-col border border-black/40 ring-1 ring-slate-900/30">
            
            {/* 1. Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-full z-[60] flex items-center justify-between px-3.5 shadow-inner">
              {/* Camera Lens Flare Dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#090b14] border border-[#141829] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#182a4d]/40" />
              </div>
              {/* Sensor dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
            </div>

            {/* 2. Custom Native Status Bar */}
            <div className="h-[44px] bg-bg/95 backdrop-blur-md border-b border-white/[0.02] flex items-end justify-between px-6 pb-2.5 z-50 text-[11px] font-semibold text-text select-none">
              {/* Left Side: Time */}
              <div className="w-1/3 text-left pl-1 text-text/90 tracking-wide font-medium">
                {currentTime}
              </div>
              {/* Middle spacer (under dynamic island) */}
              <div className="w-1/3" />
              {/* Right Side: Network & Battery Icons */}
              <div className="w-1/3 flex items-center justify-end gap-2 text-text/80 pr-1">
                <span className="font-mono text-[9px] bg-white/10 px-1 rounded-sm text-primary-light">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{batteryLevel}%</span>
                  <Battery className="w-4 h-4 text-success" />
                </div>
              </div>
            </div>

            {/* 3. Screen Main Container */}
            <div className="flex-1 overflow-y-auto w-full h-[calc(100%-88px)] relative scrollbar-none transform translate-y-0 z-10">
              {children}
            </div>

            {/* 4. Bottom Safe Area & Home Indicator Bar */}
            <div className="h-[34px] bg-bg/95 backdrop-blur-md border-t border-white/[0.02] relative z-50 w-full flex items-center justify-center">
              <div className="w-[125px] h-[4.5px] bg-white/35 rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDeviceFrame;
