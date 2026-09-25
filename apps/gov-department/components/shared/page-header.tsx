"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A2E] leading-tight">{title}</h1>
                {description && (
                    <p className="text-xs sm:text-sm font-medium text-[#1A1A2E]/50">{description}</p>
                )}
            </div>
            {children && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
}
