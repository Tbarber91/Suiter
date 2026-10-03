import { NextRequest, NextResponse } from "next/server";

interface SearchRequestBody {
  query: string;
  aspectRatio?: "square" | "landscape" | "portrait" | "banner";
  fallbackUrl?: string;
}

interface ImageMetadata {
  url: string;
  alt: string;
  width: number;
  height: number;
  source: string;
  aspectRatio: string;
  rankScore: number;
}

// In-Memory Cache: Suiter Image Intelligence Cache Layer
const imageIntelligenceCache = new Map<string, { image: ImageMetadata; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// Dimension mapping for smart crop based on aspect ratio
function getDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "square":
      return { width: 800, height: 800 };
    case "portrait":
      return { width: 600, height: 800 };
    case "banner":
      return { width: 1600, height: 600 };
    case "landscape":
    default:
      return { width: 1200, height: 675 };
  }
}

// Curated high-relevance image seeds by domain
const DOMAIN_IMAGE_REGISTRY: Array<{
  keywords: string[];
  photoId: string;
  description: string;
}> = [
  {
    keywords: ["kitchen", "joinery", "cabinet", "renovation", "stone", "benchtops"],
    photoId: "photo-1556911220-e15b29be8c8f",
    description: "Modern architectural kitchen with custom cabinetry and stone island"
  },
  {
    keywords: ["car", "vehicle", "auto", "toyota", "dealership", "lmvd"],
    photoId: "photo-1542282088-72c9c27ed0cd",
    description: "Verified pre-owned automotive vehicle with roadworthy inspection"
  },
  {
    keywords: ["construction", "building", "builder", "architecture", "cad", "survey"],
    photoId: "photo-1504307651254-35680f356dfd",
    description: "Commercial building construction and master architectural engineering"
  },
  {
    keywords: ["technology", "software", "ai", "digital", "laser"],
    photoId: "photo-1518770660439-4636190af475",
    description: "High-performance digital workstation and modern technology workspace"
  },
  {
    keywords: ["store", "shop", "retail", "marketplace", "boutique", "fashion"],
    photoId: "photo-1441986300917-64674bd600d8",
    description: "Artisanal boutique retail storefront and design collective"
  },
  {
    keywords: ["cleaning", "cleaner", "maintenance"],
    photoId: "photo-1581578731548-c64695cc6952",
    description: "Professional cleaning and pristine commercial interior"
  },
  {
    keywords: ["finance", "accounting", "money", "business", "corporate"],
    photoId: "photo-1486406146926-c627a92ad1ab",
    description: "Modern Adelaide corporate commercial boardroom and finance advisory"
  }
];

export async function POST(req: NextRequest) {
  try {
    const body: SearchRequestBody = await req.json();
    const { query = "", aspectRatio = "landscape", fallbackUrl } = body;

    const cacheKey = `${query.toLowerCase().trim()}_${aspectRatio}`;
    const cachedEntry = imageIntelligenceCache.get(cacheKey);

    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        image: {
          ...cachedEntry.image,
          cached: true
        }
      });
    }

    const { width, height } = getDimensions(aspectRatio);
    const qLower = query.toLowerCase();

    // Rank & Relevance filtering across domain registry
    let bestMatch = DOMAIN_IMAGE_REGISTRY[0];
    let highestScore = 0;

    for (const entry of DOMAIN_IMAGE_REGISTRY) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (qLower.includes(kw)) {
          score += 25;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    // Determine final image URL with smart crop
    let finalUrl: string;
    let rankScore = 0.85;

    if (highestScore > 0) {
      rankScore = Math.min(0.99, 0.70 + (highestScore / 100));
      finalUrl = `https://images.unsplash.com/${bestMatch.photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
    } else if (fallbackUrl && fallbackUrl.startsWith("http")) {
      finalUrl = fallbackUrl;
      rankScore = 0.80;
    } else {
      // High-resolution fallback based on query hash
      const hash = Math.abs(query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 100;
      finalUrl = `https://picsum.photos/seed/suiter-${hash}/${width}/${height}`;
      rankScore = 0.75;
    }

    const imageResult: ImageMetadata = {
      url: finalUrl,
      alt: bestMatch ? `${bestMatch.description} (${query})` : query || "Suiter Marketplace",
      width,
      height,
      source: "suiter-image-intelligence",
      aspectRatio,
      rankScore
    };

    // Store in LRU cache
    imageIntelligenceCache.set(cacheKey, {
      image: imageResult,
      timestamp: Date.now()
    });

    return NextResponse.json({
      image: imageResult
    });
  } catch (err: any) {
    console.error("Image search route error:", err);
    return NextResponse.json(
      {
        error: "Failed to process image intelligence query",
        image: {
          url: "https://picsum.photos/seed/suiter-default/1200/675",
          alt: "Suiter Marketplace Asset",
          width: 1200,
          height: 675,
          source: "suiter-fallback",
          aspectRatio: "landscape",
          rankScore: 0.5
        }
      },
      { status: 500 }
    );
  }
}
