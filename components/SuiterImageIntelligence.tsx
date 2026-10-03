"use client";

import React, { useEffect, useState } from "react";

export type ImageResult = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  source?: string;
  rankScore?: number;
};

export type ImageIntelligenceProps = {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  aspectRatio?: "square" | "landscape" | "portrait" | "banner";
  fallbackUrl?: string;
  className?: string;
  showBadge?: boolean;
};

export default function SuiterImageIntelligence({
  title,
  description = "",
  category = "",
  tags = [],
  aspectRatio = "landscape",
  fallbackUrl,
  className = "",
  showBadge = true,
}: ImageIntelligenceProps) {
  const [image, setImage] = useState<ImageResult | null>(
    fallbackUrl ? { url: fallbackUrl, alt: title, source: "fallback" } : null
  );
  const [loading, setLoading] = useState(true);
  const [, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function findRelevantImage() {
      setLoading(true);

      try {
        /*
         * STEP 1: ImageContext
         * Build the context Suiter will use: title + description + category + tags.
         */
        const context = [title, description, category, ...tags]
          .filter(Boolean)
          .join(" ");

        /*
         * STEP 2: Analyse & Generate Keywords
         * Extracts high-intent domain keywords (architecture, trades, auto, retail, etc.).
         */
        const generatedKeywords = createImageKeywords(context);

        if (!cancelled) {
          setKeywords(generatedKeywords);
        }

        /*
         * STEP 3: Image Provider / Search API
         * Calls /api/images/search for Rank, Crop, Cache & Display.
         */
        const result = await imageProvider(generatedKeywords, aspectRatio, fallbackUrl);

        if (!cancelled) {
          setImage(result || (fallbackUrl ? { url: fallbackUrl, alt: title, source: "fallback" } : null));
        }
      } catch (error) {
        console.error("Suiter Image Intelligence error:", error);
        if (!cancelled && fallbackUrl) {
          setImage({ url: fallbackUrl, alt: title, source: "fallback" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    findRelevantImage();

    return () => {
      cancelled = true;
    };
  }, [title, description, category, tags, aspectRatio, fallbackUrl]);

  const aspectRatioClass = 
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "portrait" ? "aspect-[3/4]" :
    aspectRatio === "banner" ? "aspect-[21/9]" :
    "aspect-[16/9]";

  if (loading && !image) {
    return (
      <div className={`suiter-image-placeholder ${aspectRatioClass} ${className}`}>
        <div className="suiter-image-loading flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Finding relevant image...</span>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className={`suiter-image-placeholder ${aspectRatioClass} ${className}`}>
        <span>No suitable image found</span>
      </div>
    );
  }

  return (
    <div className={`suiter-smart-image ${aspectRatioClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt || title}
        loading="lazy"
        className="w-full h-full object-cover"
      />

      {showBadge && (
        <div className="suiter-image-intelligence-badge flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>AI selected</span>
        </div>
      )}
    </div>
  );
}

/* =====================================
   IMAGE KEYWORD INTELLIGENCE
===================================== */

export function createImageKeywords(context: string): string[] {
  const text = context.toLowerCase();
  const keywords: string[] = [];

  /*
   * Automotive / Cars
   */
  if (
    text.includes("car") ||
    text.includes("vehicle") ||
    text.includes("auto") ||
    text.includes("toyota") ||
    text.includes("dealership") ||
    text.includes("lmvd")
  ) {
    keywords.push("automotive vehicle", "pre-owned car inspection", "modern vehicle dealership");
  }

  /*
   * Construction & Trades & Kitchen Joinery
   */
  if (
    text.includes("kitchen") ||
    text.includes("joinery") ||
    text.includes("cabinet") ||
    text.includes("renovation") ||
    text.includes("builder") ||
    text.includes("stone")
  ) {
    keywords.push("luxury kitchen joinery", "architectural interior cabinetry", "modern renovation stone");
  }

  /*
   * Business
   */
  if (
    text.includes("business") ||
    text.includes("company") ||
    text.includes("office") ||
    text.includes("corporate")
  ) {
    keywords.push("professional business", "modern workplace");
  }

  /*
   * Technology & AI
   */
  if (
    text.includes("technology") ||
    text.includes("software") ||
    text.includes("ai") ||
    text.includes("artificial intelligence") ||
    text.includes("cad") ||
    text.includes("laser")
  ) {
    keywords.push("modern technology", "AI technology", "digital workspace");
  }

  /*
   * Finance & Payouts
   */
  if (
    text.includes("finance") ||
    text.includes("financial") ||
    text.includes("accounting") ||
    text.includes("money") ||
    text.includes("payout")
  ) {
    keywords.push("modern finance", "financial services");
  }

  /*
   * Construction & Architecture
   */
  if (
    text.includes("construction") ||
    text.includes("building") ||
    text.includes("property") ||
    text.includes("survey")
  ) {
    keywords.push("modern construction", "building project", "architecture");
  }

  /*
   * Cleaning & Home Services
   */
  if (
    text.includes("cleaning") ||
    text.includes("cleaner") ||
    text.includes("maintenance")
  ) {
    keywords.push("professional cleaning", "commercial cleaning", "clean modern office");
  }

  /*
   * Marketplace & Retail
   */
  if (
    text.includes("marketplace") ||
    text.includes("product") ||
    text.includes("shop") ||
    text.includes("store") ||
    text.includes("boutique")
  ) {
    keywords.push("professional product photography", "modern marketplace");
  }

  /*
   * Generic fallback
   */
  if (keywords.length === 0) {
    keywords.push("professional business", "modern professional service");
  }

  return [...new Set(keywords)];
}

/* =====================================
   IMAGE PROVIDER (Calls /api/images/search)
===================================== */

async function imageProvider(
  keywords: string[],
  aspectRatio: "square" | "landscape" | "portrait" | "banner",
  fallbackUrl?: string
): Promise<ImageResult | null> {
  try {
    const response = await fetch("/api/images/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: keywords.join(", "),
        aspectRatio,
        fallbackUrl
      }),
    });

    if (!response.ok) {
      throw new Error(`Image search failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.image ?? null;
  } catch (err) {
    console.warn("Client imageProvider fetch error:", err);
    return null;
  }
}
