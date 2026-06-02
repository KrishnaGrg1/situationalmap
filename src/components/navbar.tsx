import { useState, useEffect } from 'react';
import { Plus, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './logo';

interface NavbarProps {
  onOpenReportForm: () => void;
}

export function Navbar({ onOpenReportForm }: NavbarProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`${time} NPT`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex items-center justify-between px-5 h-14 border-b sticky top-0 z-50 bg-background">
      <div className="hidden md:block">
        <Logo variant="full" />
      </div>
      <div className="block md:hidden">
        <Logo variant="compact" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold px-2 py-1 rounded">
          <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
          LIVE
        </div>

        <div className="text-xs text-muted-foreground bg-muted border px-2 py-1 rounded font-mono">
          {currentTime}
        </div>

        <Button variant="outline" size="sm" onClick={onOpenReportForm}>
          <Plus />
          Log Incident
        </Button>

        <Button variant="outline" size="icon-sm">
          <Bell />
        </Button>
      </div>
    </nav>
  );
}
