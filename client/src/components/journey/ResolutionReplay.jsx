import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Activity } from 'lucide-react';

export const ResolutionReplay = ({ totalSteps = 8, currentStep = 0, onStepChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onStepChange((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, onStepChange]);

  const handleReset = () => {
    setIsPlaying(false);
    onStepChange(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    onStepChange((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    onStepChange((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  return (
    <Card className="p-4 bg-surface border border-border space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-600 animate-pulse" />
          <span className="text-xs font-bold text-dark">Interactive Resolution Replay Controls</span>
          <Badge variant="purple">Judge Mode</Badge>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-primary-600'
                  : i < currentStep
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
        <span className="text-xs text-dark-muted font-mono">
          Step <strong>{currentStep + 1}</strong> of {totalSteps}
        </span>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} title="Reset to Step 1">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
            <SkipBack className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Replay
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Replay
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep === totalSteps - 1}>
            <SkipForward className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
