"use client";

import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { RECRUITMENT_INFO } from "@/app/data/clubData";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-28 lg:pt-32 pb-16 lg:pb-24 overflow-hidden flex items-center min-h-[75vh]"
      style={{ background: "var(--bg)" }}
    >
      {/* Background Illustration covering the right side seamlessly without cropping */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Main image container covering full width. 
            bg-[length:auto_85%] ensures the image scales to 85% of height, anchoring to right-bottom, pulling it away from the text to the left. */}
        <div className="absolute inset-0 bg-[url('/assets/hero-illustration.png')] bg-cover sm:bg-[length:auto_85%] lg:bg-[length:auto_85%] bg-bottom sm:bg-right-bottom bg-no-repeat translate-x-8 sm:translate-x-16 lg:translate-x-24" />
        
        {/* Soft edge on the left - A massive gradient covering the left side to blend the image edge seamlessly into the background */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[65%] bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />
        
        {/* Gradient edge on the bottom to feather out harsh lines */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent" />
        
        {/* Overlay to hide Gemini watermark at bottom right gracefully */}
        <div className="absolute bottom-[-20px] right-[-20px] w-56 h-36 bg-[var(--bg)] rounded-tl-full blur-2xl z-10" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start text-left"
        >
          <div className="mb-4">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] text-[#3B82F6] uppercase opacity-70">
              CÂU LẠC BỘ
            </span>
          </div>

          <h1 className="font-extrabold text-6xl sm:text-7xl lg:text-[5.5rem] tracking-tight leading-[1] mb-5 flex flex-wrap items-center gap-x-4">
            <span className="text-[#E2E8F0] tracking-tighter">o365</span> 
            <span className="text-[#3B82F6] font-[900]">- HUST</span>
          </h1>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-white leading-[1.3] mb-5">
            Đại sứ chuyển đổi số <br className="hidden lg:block" />
            của sinh viên Bách Khoa
          </h2>

          <p className="text-[15px] sm:text-base text-[#94A3B8] max-w-[440px] mb-10 leading-relaxed font-medium">
            Cùng học hỏi, kết nối và sáng tạo với công nghệ để kiến tạo phiên bản tốt hơn của chính mình.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
            <a
              href={RECRUITMENT_INFO.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] transition-all bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Tham gia ngay 
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
            
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white hover:text-white border border-[#334155] hover:border-[#475569] transition-all bg-transparent"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#0A192F]">
                <Play className="w-3 h-3 ml-0.5 fill-current" />
              </span>
              Tìm hiểu thêm
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 sm:gap-14 text-left">
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">500+</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Thành viên</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">50+</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Sự kiện</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">1000+</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Lượt tiếp cận</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#3B82F6] text-shadow-glow">∞</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Cơ hội phát triển</span>
            </div>
          </div>

           {/* Hand-written stylized text bottom left */}
           <div className="mt-14 hidden lg:block opacity-70 transform -rotate-[8deg] ml-6 pb-4">
             <span className="font-display text-4xl text-ink font-medium block opacity-90" style={{ fontFamily: "var(--font-display), cursive" }}>
                Students
             </span>
             <span className="font-display text-4xl text-ink font-medium block ml-6 mt-1 opacity-90" style={{ fontFamily: "var(--font-display), cursive" }}>
                Create Tomorrow <span className="inline-block text-accent text-2xl -rotate-12 translate-y-1">🎵</span>
             </span>
          </div>
        </motion.div>

        {/* Right Column: Intentionally left transparent so the absolute background illustration is shown fully */}
        <div className="hidden lg:block w-full h-[600px] pointer-events-none" />
      </div>
    </section>
  );
}
