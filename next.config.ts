import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",  // Build standalone pour Electron
  images: {
    unoptimized: true, // Nécessaire pour Electron
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorer les erreurs TypeScript pour le build
  },
};

export default nextConfig;
