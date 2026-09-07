"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

export function StudioShell({
  children,
  active = "timetable",
}: {
  children: React.ReactNode;
  active?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 hidden max-[650px]:block"
        />
      )}

      <aside
        className={`w-[232px] fixed [inset:0_auto_0_0] bg-[#f0f2ec] [border-right:1px_solid_#e3e7dc] flex flex-col [padding:34px_19px_0] z-40
          min-[1500px]:w-[250px]
          max-[1200px]:w-[200px] max-[1200px]:pl-[13px] max-[1200px]:pr-[13px]
          max-[950px]:w-[76px] max-[950px]:[padding:28px_12px_0] max-[950px]:[&_nav]:mt-[43px]
          max-[650px]:w-[240px] max-[650px]:[padding:28px_19px_0] max-[650px]:transition-transform max-[650px]:duration-200
          ${isOpen ? "max-[650px]:translate-x-0" : "max-[650px]:-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between max-[650px]:pr-[4px]">
          <Link
            className="flex items-center gap-[9px] [padding:0_12px] text-[38px] font-[750] tracking-[-2.4px] leading-[1] max-[950px]:text-[0] max-[950px]:p-0 max-[950px]:justify-center max-[650px]:text-[38px] max-[650px]:gap-[9px] max-[650px]:p-0"
            href="/"
          >
            <span className="bg-[#31573f] text-[#e1edc9] w-[35px] h-[35px] rounded-full grid place-items-center max-[950px]:w-[36px] max-[950px]:shrink-0 max-[650px]:w-[32px] max-[650px]:h-[32px]">
              <Icon name="leaf" size={24} />
            </span>
            <span className="max-[950px]:hidden max-[650px]:inline">form</span>
            <span className="text-[#739257] ml-[-8px] max-[950px]:hidden max-[650px]:inline">.</span>
          </Link>

          {/* Close button, mobile only */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="hidden max-[650px]:grid place-items-center w-[28px] h-[28px] text-[#788371] text-[16px]"
          >
            ✕
          </button>
        </div>

        <div className="text-[9px] font-bold text-[#949c8b] tracking-[1.4px] [padding:0_14px] mb-[14px] max-[950px]:hidden max-[650px]:block max-[650px]:mt-[20px]">
          WORKSPACE
        </div>

        <nav>
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={
              active === "timetable"
                ? "active flex items-center gap-[12px] [padding:13px_13px] mb-[7px] rounded-[7px] text-[#788371] text-[12px] font-medium [&:hover]:bg-[#e8eddf] [&&.active]:bg-[#dfe8d4] [&&.active]:text-[#35543c] [&&.active]:font-semibold max-[950px]:[&_.nav-count]:hidden max-[950px]:[&_.small-dot]:hidden max-[950px]:text-[0] max-[950px]:gap-[0] max-[950px]:justify-center max-[950px]:[padding:14px_0] max-[950px]:[&_svg]:w-[20px] max-[950px]:[&_svg]:h-[20px] max-[650px]:text-[12px] max-[650px]:gap-[12px] max-[650px]:justify-start max-[650px]:[padding:13px_13px] max-[650px]:[&_.nav-count]:grid max-[650px]:[&_svg]:w-auto max-[650px]:[&_svg]:h-auto"
                : "flex items-center gap-[12px] [padding:13px_13px] mb-[7px] rounded-[7px] text-[#788371] text-[12px] font-medium [&:hover]:bg-[#e8eddf] [&&.active]:bg-[#dfe8d4] [&&.active]:text-[#35543c] [&&.active]:font-semibold max-[950px]:[&_.nav-count]:hidden max-[950px]:[&_.small-dot]:hidden max-[950px]:text-[0] max-[950px]:gap-[0] max-[950px]:justify-center max-[950px]:[padding:14px_0] max-[950px]:[&_svg]:w-[20px] max-[950px]:[&_svg]:h-[20px] max-[650px]:text-[12px] max-[650px]:gap-[12px] max-[650px]:justify-start max-[650px]:[padding:13px_13px] max-[650px]:[&_.nav-count]:grid max-[650px]:[&_svg]:w-auto max-[650px]:[&_svg]:h-auto"
            }
          >
            <Icon name="calendar" />
            <span className="max-[950px]:hidden max-[650px]:inline">Timetable</span>
            <span className="nav-count text-[10px] grid place-items-center bg-[#f5f8ef] [border:1px_solid_#d1dcc3] w-[25px] h-[20px] rounded-[5px] ml-auto">
              12
            </span>
          </Link>
          <Link
            href="/secondary-dataset-demo"
            onClick={() => setIsOpen(false)}
            className={
              active === "equipment"
                ? "active flex items-center gap-[12px] [padding:13px_13px] mb-[7px] rounded-[7px] text-[#788371] text-[12px] font-medium [&:hover]:bg-[#e8eddf] [&&.active]:bg-[#dfe8d4] [&&.active]:text-[#35543c] [&&.active]:font-semibold max-[950px]:[&_.nav-count]:hidden max-[950px]:[&_.small-dot]:hidden max-[950px]:text-[0] max-[950px]:gap-[0] max-[950px]:justify-center max-[950px]:[padding:14px_0] max-[950px]:[&_svg]:w-[20px] max-[950px]:[&_svg]:h-[20px] max-[650px]:text-[12px] max-[650px]:gap-[12px] max-[650px]:justify-start max-[650px]:[padding:13px_13px] max-[650px]:[&_.small-dot]:block max-[650px]:[&_svg]:w-auto max-[650px]:[&_svg]:h-auto"
                : "flex items-center gap-[12px] [padding:13px_13px] mb-[7px] rounded-[7px] text-[#788371] text-[12px] font-medium [&:hover]:bg-[#e8eddf] [&&.active]:bg-[#dfe8d4] [&&.active]:text-[#35543c] [&&.active]:font-semibold max-[950px]:[&_.nav-count]:hidden max-[950px]:[&_.small-dot]:hidden max-[950px]:text-[0] max-[950px]:gap-[0] max-[950px]:justify-center max-[950px]:[padding:14px_0] max-[950px]:[&_svg]:w-[20px] max-[950px]:[&_svg]:h-[20px] max-[650px]:text-[12px] max-[650px]:gap-[12px] max-[650px]:justify-start max-[650px]:[padding:13px_13px] max-[650px]:[&_.small-dot]:block max-[650px]:[&_svg]:w-auto max-[650px]:[&_svg]:h-auto"
            }
          >
            <Icon name="grid" />
            <span className="max-[950px]:hidden max-[650px]:inline">Equipment</span>
            <span className="small-dot h-[5px] w-[5px] bg-[#a2ae91] rounded-full ml-auto" />
          </Link>
        </nav>

        <div className="mt-auto">
          <div className="text-[9px] text-[#8b9383] [padding:0_8px_19px] flex gap-[7px] items-center [&_>_span]:w-[5px] [&_>_span]:h-[5px] [&_>_span]:bg-[#81a16c] [&_>_span]:rounded-full max-[950px]:hidden max-[650px]:flex">
            <span /> All systems operational
          </div>
          <div className="[&_strong]:text-[12px] [&_strong]:block [&_strong]:font-semibold [&_small]:block [&_small]:text-[#8a9284] [&_small]:text-[10px] [&_small]:mt-[4px] flex gap-[10px] items-center [border-top:1px_solid_#dfe4d7] [padding:19px_3px] [&_>_span:last-child]:ml-auto [&_>_span:last-child]:text-[#7e8977] max-[950px]:[&_>_div]:hidden max-[950px]:[&_>_span:last-child]:hidden max-[950px]:justify-center max-[650px]:[&_>_div]:block max-[650px]:[&_>_span:last-child]:inline max-[650px]:justify-start">
            <span className="w-[32px] h-[32px] rounded-full inline-grid place-items-center text-[10px] font-semibold shrink-0 bg-[#d9dfcb] text-[#708064]">
              JL
            </span>
            <div>
              <strong>Jamie Lewis</strong>
              <small>Studio manager</small>
            </div>
            <span>⌄</span>
          </div>
        </div>
      </aside>

      <div className="ml-[232px] w-[calc(100%_-_232px)] min-w-0
        min-[1500px]:ml-[250px] min-[1500px]:w-[calc(100%_-_250px)]
        max-[1200px]:ml-[200px] max-[1200px]:w-[calc(100%_-_200px)]
        max-[950px]:ml-[76px] max-[950px]:w-[calc(100%_-_76px)]
        max-[650px]:ml-0 max-[650px]:w-full">
        <header className="h-[76px] [border-bottom:1px_solid_var(--border)] flex items-center justify-between [padding:0_40px] bg-[#fbfcf9] max-[1200px]:[padding:0_25px] max-[650px]:h-[62px] max-[650px]:[padding:0_16px]">
          <div className="flex items-center gap-[12px]">
            {/* Hamburger, mobile only */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="hidden max-[650px]:grid place-items-center w-[28px] h-[28px] -ml-[4px] text-[#4d5c46]"
            >
              <span className="block w-[18px] h-[2px] bg-current relative before:content-[''] before:absolute before:w-[18px] before:h-[2px] before:bg-current before:-translate-y-[6px] after:content-[''] after:absolute after:w-[18px] after:h-[2px] after:bg-current after:translate-y-[6px]" />
            </button>
            <div className="flex items-center gap-[16px] text-[11px] text-[#93998d] [&_span]:text-[#c2c8bc] [&_strong]:font-medium [&_strong]:text-[#4d5c46] max-[650px]:text-[10px] max-[650px]:gap-[9px]">
              Workspace <span>/</span>{" "}
              <strong>
                {active === "equipment" ? "Equipment" : "Timetable"}
              </strong>
            </div>
          </div>
          <div className="flex items-center gap-[22px] max-[650px]:gap-[10px]">
            <span className="[&_>_span]:w-[5px] [&_>_span]:h-[5px] [&_>_span]:bg-[#81a16c] [&_>_span]:rounded-full flex items-center gap-[7px] text-[#809074] text-[10px] max-[650px]:hidden">
              <span /> Studio is open
            </span>
            <span className="h-[20px] w-[1px] bg-[var(--border)] max-[650px]:hidden" />
            <span className="w-[28px] h-[28px] rounded-full inline-grid place-items-center text-[9px] font-semibold shrink-0 bg-[#dce3d2] text-[#708064]">
              JL
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-[1540px] [padding:39px_40px_0] min-[1500px]:pt-[46px] max-[1200px]:[padding:30px_25px_0] max-[650px]:[padding:25px_15px_0]">
          {children}
        </main>
        <footer className="max-w-[1540px] [margin:38px_auto_0] [padding:0_40px_23px] flex justify-between text-[8px] text-[#aeb6a1] [&_>_span:last-child]:text-[#92a080] [&_>_span:last-child_span]:text-[#b4bca9] [&_>_span:last-child_span]:ml-[9px] max-[1200px]:pl-[25px] max-[1200px]:pr-[25px] max-[650px]:[padding:0_15px_20px] max-[650px]:mt-[30px] max-[650px]:text-[7px] max-[650px]:gap-[15px] max-[650px]:[&_>_span:first-child]:max-w-[155px] max-[650px]:[&_>_span:first-child]:leading-[1.5] max-[650px]:[&_>_span:last-child]:whitespace-nowrap">
          <span>Made for movement. Built for your studio.</span>
          <span>
            Form Studio <span>© 2026</span>
          </span>
        </footer>
      </div>
    </div>
  );
}