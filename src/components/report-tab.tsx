import { useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useGetIncidents } from '#/hooks/use-incident';
import { useGetResources } from '#/hooks/use-resource';
import { timeline } from '#/lib/data';
import { cn } from '#/lib/utils';

const getSeverityColor = (severity: string) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
    low: 'bg-green-500',
  };
  return colors[severity as keyof typeof colors] || 'bg-muted-foreground';
};

export function ReportTab() {
  const { data: incidents } = useGetIncidents();
  const { data: resources } = useGetResources();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setTimeout(() => {
        setIsGenerated(false);
      }, 2000);
    }, 1800);
  };

  const totalOfficers = resources?.reduce((sum, r) => sum + r.officers, 0) || 0;
  const activeIncidentsCount = incidents?.filter((i) => i.status === 'active').length || 0;

  return (
    <div className="py-5 px-4 max-w-[800px] mx-auto space-y-3">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" />
            Generating...
          </>
        ) : isGenerated ? (
          <>
            <Check />
            Report Ready
          </>
        ) : (
          <>
            <Sparkles />
            Generate AI Situation Report
          </>
        )}
      </Button>

      <Card>
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Operational Overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase">
                Executive Summary
              </div>
              <div className="text-sm space-y-1">
                <div>
                  Date: <strong className="text-orange-500">{new Date().toLocaleDateString()}</strong>
                </div>
                <div>
                  Time: <strong className="text-orange-500">{new Date().toLocaleTimeString()}</strong>
                </div>
                <div>
                  Active Incidents: <strong className="text-red-500">{activeIncidentsCount}</strong>
                </div>
                <div>
                  Total Personnel: <strong className="text-blue-500">{totalOfficers} officers</strong>
                </div>
                <div>
                  Priority Areas: <strong className="text-red-500">Bardiya, Kathmandu</strong>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase">
                Command Notes
              </div>
              <div className="text-sm leading-relaxed">
                Bardiya flood situation deteriorating. Additional 2 rescue boats dispatched at
                13:45. Kaski landslide risk remains HIGH. KTM protest dispersed peacefully.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Activity Timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx !== timeline.length - 1 && (
                  <div className="absolute left-[5px] top-4 w-px h-[calc(100%+4px)] bg-border" />
                )}

                <div
                  className={cn(
                    'size-3 rounded-full mt-0.5 flex-shrink-0 border-2 border-background relative z-10',
                    getSeverityColor(item.severity)
                  )}
                />

                <div className="text-xs text-muted-foreground font-mono whitespace-nowrap min-w-[44px] mt-0.5">
                  {item.time}
                </div>

                <div className="text-sm leading-relaxed flex-1">{item.text}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Resource Deployment Summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-blue-500">{totalOfficers}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">Officers</div>
            </div>

            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-green-500">{resources?.length || 0}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">Vehicles</div>
            </div>

            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">Districts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
