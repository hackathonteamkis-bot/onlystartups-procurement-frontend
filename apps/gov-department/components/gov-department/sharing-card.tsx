"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@onlystartups/ui";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@onlystartups/ui";
import { toast } from "sonner";
import { trackAnalytics } from "@/actions/dashboard/analytics";

interface SharingCardProps {
    govDepartmentId: string;
    govDepartmentName: string;
    type?: "govDepartment_form" | "funding_opportunity";
    itemKey?: string;
    customUrl?: string;
    title?: string;
    description?: string;
    className?: string;
}

export function SharingCard({
    govDepartmentId,
    govDepartmentName,
    type = "govDepartment_form",
    itemKey,
    customUrl,
    title = "Share Your Startup Hub",
    description = "Get founders to apply directly to your hub.",
    className
}: SharingCardProps) {
    const [copied, setCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = customUrl || `${baseUrl}/join/${govDepartmentId}`;
    const analyticsKey = itemKey || type;

    const copyToClipboard = async () => {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // Fallback for non-secure contexts (HTTP / Local IP)
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }

            setCopied(true);
            toast.success("Link copied to clipboard!");

            // Track link tap (copy is a tap intent)
            await trackAnalytics("LINK_COPY", analyticsKey, govDepartmentId);

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const downloadQr = () => {
        const svg = document.getElementById(`qr-code-svg-${analyticsKey}`);
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${govDepartmentName.replace(/\s+/g, "-")}-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();

            // Track QR download
            trackAnalytics("QR_DOWNLOAD", "govDepartment_form", govDepartmentId);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <Card className={cn("border-none shadow-xl bg-white/80 backdrop-blur-sm h-full flex flex-col", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#1A1A2E]/5 border border-[#1A1A2E]/5">
                    <div className="flex-1 truncate px-3 text-sm font-medium text-[#1A1A2E]/60">
                        {shareUrl}
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full hover:bg-[#F26522] hover:text-white transition-all shrink-0 font-bold"
                        onClick={copyToClipboard}
                    >
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="rounded-full border-[#1A1A2E]/10"
                        onClick={() => setShowQr(true)}
                    >
                        Show QR
                    </Button>
                    <Button
                        variant="default"
                        className="rounded-full bg-[#1A1A2E] hover:bg-[#F26522] transition-colors"
                        onClick={downloadQr}
                    >
                        Download QR
                    </Button>
                </div>

                <Dialog open={showQr} onOpenChange={setShowQr}>
                    <DialogContent className="sm:max-w-md rounded-xl p-8 flex flex-col items-center">
                        <DialogHeader className="w-full text-center mb-4">
                            <DialogTitle className="text-xl font-black text-[#1A1A2E]">Startup Hub QR Code</DialogTitle>
                            <DialogDescription className="text-sm font-medium">
                                Founders can scan this code to apply directly to your program.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="bg-[#F5F5EE] p-8 rounded-xl border border-[#1A1A2E]/5 shadow-inner">
                            <QRCodeSVG
                                id={`qr-code-svg-${analyticsKey}`}
                                value={shareUrl}
                                size={220}
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                    src: "/favicon.ico",
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <div className="mt-8 text-center space-y-1">
                            <p className="text-[10px] font-black text-[#1A1A2E]/30 uppercase tracking-widest">Applying to</p>
                            <p className="text-lg font-bold text-[#F26522]">{govDepartmentName}</p>
                        </div>

                        <Button 
                            className="w-full mt-8 bg-[#1A1A2E] hover:bg-[#F26522] rounded-full h-12 font-bold"
                            onClick={downloadQr}
                        >
                            Download High-Res QR
                        </Button>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
