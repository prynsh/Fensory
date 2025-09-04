"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { FilterState } from "@/types/pool"

interface FiltersProps {
  filters: FilterState;
  categories: readonly string[];
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export function Filters({ filters, categories, onFilterChange, onReset }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <CategorySelect 
        value={filters.category} 
        categories={categories}
        onChange={(value) => onFilterChange('category', value)} 
      />
      
      <TVLSelect 
        value={filters.tvlFilter}
        onChange={(value) => onFilterChange('tvlFilter', value)} 
      />
      
      <APYSelect 
        value={filters.apyFilter}
        onChange={(value) => onFilterChange('apyFilter', value)} 
      />
      
      <PredictionSelect 
        value={filters.predictionFilter}
        onChange={(value) => onFilterChange('predictionFilter', value)} 
      />
      
      <SigmaSelect 
        value={filters.sigmaFilter}
        onChange={(value) => onFilterChange('sigmaFilter', value)} 
      />

      <div className="flex justify-end">
        <Button variant="default" onClick={onReset} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>
    </div>
  );
}

function CategorySelect({ value, categories, onChange }: {
  value: string;
  categories: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Category">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TVLSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="TVL" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TVL">All TVL</SelectItem>
        <SelectItem value="HIGH">High (&gt; $1B)</SelectItem>
        <SelectItem value="MEDIUM">Medium ($100M – $1B)</SelectItem>
        <SelectItem value="LOW">Low (&lt; $100M)</SelectItem>
      </SelectContent>
    </Select>
  );
}

function APYSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="APY" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="APY">All APY</SelectItem>
        <SelectItem value="HIGH">High Yield (&gt; 10%)</SelectItem>
        <SelectItem value="MODERATE">Moderate (2–10%)</SelectItem>
        <SelectItem value="LOW">Low (&lt; 2%)</SelectItem>
      </SelectContent>
    </Select>
  );
}

function PredictionSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Prediction" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Prediction">All Predictions</SelectItem>
        <SelectItem value="LOW">0 – 50</SelectItem>
        <SelectItem value="MEDIUM">50 – 75</SelectItem>
        <SelectItem value="HIGH">75 – 100</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SigmaSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sigma" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Sigma">All Sigma</SelectItem>
        <SelectItem value="LOW">Low (&lt; 0.05)</SelectItem>
        <SelectItem value="MEDIUM">Medium (0.05 – 0.15)</SelectItem>
        <SelectItem value="HIGH">High (&gt; 0.15)</SelectItem>
      </SelectContent>
    </Select>
  );
}