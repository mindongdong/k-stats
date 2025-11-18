import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RotateCcw } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { translateLeague, translatePosition } from '@/utils/translations';

interface FilterPanelProps {
  leagues: string[];
  positions: string[];
  selectedLeagues: string[];
  selectedPosition: string;
  injuredOnly: boolean;
  onLeagueChange: (leagues: string[]) => void;
  onPositionChange: (position: string) => void;
  onInjuredToggle: (checked: boolean) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  leagues,
  positions,
  selectedLeagues,
  selectedPosition,
  injuredOnly,
  onLeagueChange,
  onPositionChange,
  onInjuredToggle,
  onResetFilters
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLeagueToggle = (league: string, checked: boolean) => {
    if (checked) {
      onLeagueChange([...selectedLeagues, league]);
    } else {
      onLeagueChange(selectedLeagues.filter(l => l !== league));
    }
  };

  const hasActiveFilters = selectedLeagues.length > 0 || selectedPosition !== '' || injuredOnly;

  const filterContent = (
    <div className="space-y-4">
      {/* 리그 필터 - Accordion */}
      <Accordion type="single" collapsible className="rounded-xl border bg-card shadow-sm">
        <AccordionItem value="leagues" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">리그</span>
              {selectedLeagues.length > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {selectedLeagues.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leagues.map((league) => (
                <div key={league} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`league-${league}`}
                    checked={selectedLeagues.includes(league)}
                    onCheckedChange={(checked) => handleLeagueToggle(league, checked as boolean)}
                  />
                  <label
                    htmlFor={`league-${league}`}
                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                  >
                    {translateLeague(league)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* 포지션 필터 - Accordion */}
      <Accordion type="single" collapsible className="rounded-xl border bg-card shadow-sm">
        <AccordionItem value="positions" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">포지션</span>
              {selectedPosition && (
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                  {translatePosition(selectedPosition)}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <RadioGroup value={selectedPosition} onValueChange={onPositionChange} className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="" id="position-all" />
                <Label htmlFor="position-all" className="cursor-pointer flex-1">전체 포지션</Label>
              </div>
              {positions.map((position) => (
                <div key={position} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={position} id={`position-${position}`} />
                  <Label htmlFor={`position-${position}`} className="cursor-pointer flex-1">{translatePosition(position)}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* 부상 선수 필터 - Card Style */}
      <div className="flex items-center justify-between space-x-2 rounded-xl border bg-card shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-primary"
            fill="currentColor"
          >
            <rect x="10" y="3" width="4" height="18" rx="0.5" />
            <rect x="3" y="10" width="18" height="4" rx="0.5" />
          </svg>
          <Label htmlFor="injured-only" className="text-base font-bold cursor-pointer">
            부상 선수만 보기
          </Label>
        </div>
        <Switch
          id="injured-only"
          checked={injuredOnly}
          onCheckedChange={onInjuredToggle}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-b from-background to-muted/20 border-b border-border/30 mb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            필터
          </h2>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="gap-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </Button>
          )}
        </div>

        {filterContent}
      </div>
    </div>
  );
};

export default FilterPanel;
