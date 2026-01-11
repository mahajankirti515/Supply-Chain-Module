import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (page: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Use custom navigate event if onNavigate not provided
      const event = new CustomEvent('navigate', {
        detail: { path },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="flex items-center gap-[8px] mb-[20px]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          {item.path ? (
            <button
              onClick={() => handleClick(item.path!)}
              className="text-[14px] text-[#718096] hover:text-[#0a6659] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[14px] text-[#262c36]">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="size-[16px] text-[#718096]" />
          )}
        </div>
      ))}
    </div>
  );
}