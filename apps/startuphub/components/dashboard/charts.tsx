"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@onlystartups/ui";

interface ChartProps {
  data: any[];
  height?: number;
}

const chartConfig = {
  activity: { label: "Platform Activity", color: "#F26522" },
  profileViews: { label: "Profile Views", color: "#3B82F6" },
  applications: { label: "Applications", color: "#F26522" },
  accepted: { label: "Accepted", color: "#10B981" },
  scans: { label: "Form Scans", color: "#F26522" },
  count: { label: "Founders", color: "#F26522" },
  raised: { label: "Capital Raised", color: "#10B981" },
} satisfies ChartConfig;

const pieConfig = {
  value: { label: "Traffic", color: "#F26522" },
  Direct: { label: "Direct", color: "#F26522" },
  LinkedIn: { label: "LinkedIn", color: "#3B82F6" },
  Twitter: { label: "Twitter", color: "#10B981" },
  Referral: { label: "Referral", color: "#A855F7" },
} satisfies ChartConfig;

const industryConfig = {
  value: { label: "Startups", color: "#F26522" },
  FinTech: { label: "FinTech", color: "#F26522" },
  HealthTech: { label: "HealthTech", color: "#3B82F6" },
  SaaS: { label: "SaaS", color: "#10B981" },
  "AI/ML": { label: "AI/ML", color: "#A855F7" },
} satisfies ChartConfig;

export function ActivityAreaChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12 }} 
          dy={10} 
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="activity"
          stroke="var(--color-activity)"
          fill="var(--color-activity)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="profileViews"
          stroke="var(--color-profileViews)"
          fill="var(--color-profileViews)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function PipelineBarChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted)/0.5)" }} />
        <Bar dataKey="applications" fill="var(--color-applications)" radius={[4, 4, 0, 0]} barSize={32} />
        <Bar dataKey="accepted" fill="var(--color-accepted)" radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ChartContainer>
  );
}

export function AnalyticsLineChart({ data, height = 250 }: ChartProps) {
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="var(--color-scans)"
          fill="var(--color-scans)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function TrafficPieChart({ data, height = 250 }: ChartProps) {
  return (
    <ChartContainer config={pieConfig} className={`h-[${height}px] w-full`}>
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={pieConfig[entry.name as keyof typeof pieConfig]?.color || pieConfig.value.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export function FunnelBarChart({ data, height = 250 }: ChartProps) {
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
        <XAxis type="number" hide />
        <YAxis dataKey="step" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={100} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted)/0.5)" }} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={24} />
      </BarChart>
    </ChartContainer>
  );
}

export function FundingBarChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted)/0.5)" }} />
        <Bar dataKey="raised" fill="var(--color-raised)" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ChartContainer>
  );
}

export function DemographicsPieChart({ data, height = 250 }: ChartProps) {
  return (
    <ChartContainer config={industryConfig} className={`h-[${height}px] w-full`}>
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={industryConfig[entry.name as keyof typeof industryConfig]?.color || industryConfig.value.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

const stageConfig = {
  PreSeed: { label: "Pre-Seed", color: "#3B82F6" },
  Seed: { label: "Seed", color: "#10B981" },
  SeriesA: { label: "Series A", color: "#F26522" },
} satisfies ChartConfig;

export function StageBarChart({ data, height = 250 }: ChartProps) {
  return (
    <ChartContainer config={stageConfig} className={`h-[${height}px] w-full`}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
        <XAxis type="number" hide />
        <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={100} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted)/0.5)" }} />
        <Bar dataKey="count" fill="var(--color-PreSeed)" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((entry, index) => {
            const colorMap: any = {
              "Pre-Seed": "#3B82F6",
              "Seed": "#10B981",
              "Series A": "#F26522"
            };
            return <Cell key={`cell-${index}`} fill={colorMap[entry.stage] || "#3B82F6"} />;
          })}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

