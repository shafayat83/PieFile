// Real-time Cross-Tab BroadcastChannel & WebRTC P2P Transfer Simulation

class P2PManager {
  constructor() {
    this.channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
      ? new BroadcastChannel('piefile_p2p_mesh') 
      : null;
    this.listeners = new Set();

    if (this.channel) {
      this.channel.onmessage = (event) => {
        this.listeners.forEach(cb => {
          try {
            cb(event.data);
          } catch (e) {
            console.error('Error in P2P message listener:', e);
          }
        });
      };
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  broadcast(message) {
    if (this.channel) {
      try {
        this.channel.postMessage({
          ...message,
          timestamp: Date.now()
        });
      } catch (e) {
        console.warn('Broadcast failed:', e);
      }
    }
  }
}

export const p2pManager = new P2PManager();

// Helper to format file size cleanly
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Generate realistic mock file for sample testing
export function createSampleFile(type = 'recipe') {
  if (type === 'recipe') {
    const content = `=====================================================
  PIEFILE SPECIAL: ARTISAN NEAPOLITAN PIZZA RECIPE
=====================================================
Crust & Dough:
- 500g Tipo 00 Flour (Italian Fine Ground)
- 325ml Warm Filtered Water (65% Hydration)
- 10g Fine Sea Salt
- 3g Active Dry Yeast
- 15ml Extra Virgin Olive Oil

The Secret Dough Fermentation:
1. Mix warm water and yeast, let bloom for 7 minutes.
2. In a large bowl, incorporate flour gradually.
3. Knead for 10-12 minutes until smooth as silk.
4. Cold ferment in refrigerator for 24-48 hours.

Sauce & Toppings:
- San Marzano tomatoes, crushed by hand with basil and pinch of sea salt.
- Fresh buffalo mozzarella, torn and drained.
- Fresh fragrant basil leaves added immediately post-bake.
- Drizzle of cold-pressed EVOO.

Bake at maximum oven temperature (500°F / 260°C) on a pre-heated pizza stone 
for 6-8 minutes until crust is beautifully blistered with leopard spotting!

Transfer verified securely by PieFile WebRTC P2P Protocol.
=====================================================`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    return new File([blob], 'secret-artisan-pizza-recipe.md', { type: 'text/markdown' });
  }

  if (type === 'guide') {
    const content = `# PieFile Architecture: WebRTC Peer-to-Peer Transfer Guide

PieFile establishes direct data tunnels between two browsers using WebRTC RTCDataChannel.
No files are ever stored on intermediary servers!

## Key Features:
- End-to-End Direct Streaming
- Zero Cloud Storage (True Privacy)
- AES-GCM 256-bit Password Encryption Option
- Dynamic QR Codes for Instant Mobile Transfers
- Real-Time Transfer Metrics & Progress Tracking

Enjoy file sharing the way it was meant to be: Fresh, direct, and warm!`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    return new File([blob], 'piefile-architecture-guide.txt', { type: 'text/plain' });
  }

  // Fallback sample
  const blob = new Blob(['Freshly baked file shared via PieFile P2P.'], { type: 'text/plain' });
  return new File([blob], 'warm-pie-sample.txt', { type: 'text/plain' });
}

// Computes a visual SHA-256 fingerprint preview for UX polish
export async function computeFileHashPreview(file) {
  try {
    const buffer = await file.slice(0, 1024 * 64).arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  } catch {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  }
}
