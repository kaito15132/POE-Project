const navigation = ["Dashboard", "Opportunity Scanner", "Modifiers", "Combinations", "Research Queue", "Price Entry", "Current Eye", "Reroll Analyzer", "History", "Settings"];

export function Sidebar() {
  return <aside className="border-b border-slate-800 bg-[#0b111b]/95 p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
    <div className="mb-8 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-serif text-xl text-gold">◉</div><div><div className="font-semibold text-white">EyeScope</div><div className="text-[10px] uppercase tracking-[.22em] text-slate-500">Market intelligence</div></div></div>
    <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">{navigation.map((item) => <a key={item} href={item === "Dashboard" ? "/" : item === "Modifiers" ? "/modifiers" : `/#${item.toLowerCase().replaceAll(" ", "-")}`} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm lg:block ${item === "Modifiers" ? "bg-cyan/10 text-cyan" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{item}</a>)}</nav>
    <div className="mt-8 hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:block"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-400"><span className="size-2 rounded-full bg-emerald-400"/>LOCAL DATABASE</div><p className="text-xs leading-5 text-slate-500">Your research stays on this machine. No market API connected.</p></div>
  </aside>;
}
