interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabGroup({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabGroupProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-1 py-2 px-4 font-body font-bold text-base transition-colors rounded-lg shadow-brand-glow
            ${activeTab === tab.id ? "bg-brand text-tertiary" : "bg-white text-brand"}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

