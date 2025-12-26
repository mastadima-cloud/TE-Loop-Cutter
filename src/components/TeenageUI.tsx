import React from "react";

interface TeenageUIProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function TeenageUI({ children, title, subtitle }: TeenageUIProps) {
  return (
    <div className="relative bg-[#ebebeb] w-full max-w-4xl rounded-[40px] p-10 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border-b-8 border-r-8 border-[#ccc]">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#444] tracking-tighter leading-none">{title}</h1>
          <p className="text-[10px] font-bold text-[#888] tracking-[0.2em] mt-1">{subtitle}</p>
        </div>
          
        {/* Decorative elements */}
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-[#ddd] border-b-2 border-[#bbb]" />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {children}
      </div>

      {/* Side Vents / Decorative */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-8 bg-[#ddd] rounded-full shadow-inner" />
        ))}
      </div>
    </div>
  );
}