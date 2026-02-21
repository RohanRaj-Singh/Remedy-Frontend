"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, QrCode, Share2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ScannerPage() {
  const [shareLink, setShareLink] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId");

  const generateShareLink = async () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/survey${organizationId ? `?organizationId=${organizationId}` : ""}`;
    setShareLink(link);
    const qr = await QRCode.toDataURL(link, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1e293b",
        light: "#ffffff",
      },
    });
    setQrImage(qr);
  };

  const copyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Link copied to clipboard",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Remedy QR Scanner",
          text: "Scan this QR code to access the wellbeing survey",
          url: shareLink,
        });
      } catch (error) {
        console.log(error)
        setShowShareOptions(!showShareOptions);
      }
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  useEffect(() => {
    if (!shareLink) {
      generateShareLink();
    }
  }, [organizationId, shareLink, generateShareLink]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Scanner</h1>
          <p className="text-muted-foreground">Generate and share QR codes for surveys</p>
        </div>
        <Button onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Share This Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="md:flex items-center gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <Button
              size="sm"
              onClick={copyLink}
              className="gap-1 "
              variant="common"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>

          {showShareOptions && (
            <div className="rounded-lg border border-border bg-muted p-4">
              <h3 className="font-medium mb-2">Share Options</h3>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={copyLink}>
                  Copy Link
                </Button>
              </div>
            </div>
          )}

          {qrImage && (
            <div className="flex flex-col items-center">
              <div className="rounded-xl bg-white p-4 shadow-inner">
                <Image
                  height={300}
                  width={300}
                  src={qrImage}
                  alt="Share QR Code"
                  className="h-48 w-48 rounded-lg"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">Scan to open this scanner</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Share the QR code or link with your team members</li>
          <li>They can scan the QR code to access the wellbeing survey</li>
          <li>All responses will be collected and analyzed in your dashboard</li>
        </ol>
      </div>
    </div>
  );
}