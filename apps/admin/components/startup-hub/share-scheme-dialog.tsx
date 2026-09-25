"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Share2 } from "lucide-react";
import { SharingCard } from "./sharing-card";

interface ShareSchemeDialogProps {
    scheme: any;
    startupHubId: string;
    trigger?: React.ReactNode;
}

export function ShareSchemeDialog({ scheme, startupHubId, trigger }: ShareSchemeDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="icon" className="rounded-full border-[#1A1A2E]/10 hover:border-[#F26522]/30 w-10 h-10">
                        <Share2 className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md bg-transparent border-none p-0 shadow-none">
                <SharingCard
                    startupHubId={startupHubId}
                    startupHubName={scheme.name}
                    type="funding_opportunity"
                    itemKey={`grant_${scheme.id}`}
                    title={`Share ${scheme.name}`}
                    description="Founders can scan this to apply for this specific opportunity."
                />
            </DialogContent>
        </Dialog>
    );
}
