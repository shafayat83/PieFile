import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Header({ onReset }) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-group" onClick={onReset} role="button" tabIndex={0} title="Return to Home">
          <div className="brand-logo-wrap">
            <svg viewBox="0 0 44 44" width="42" height="42" className="brand-slice-icon">
              <defs>
                <linearGradient id="hdrCrust" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="60%" stopColor="#E26D2D" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <linearGradient id="hdrCheese" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="60%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <path d="M22 3 L40 37 C34 41 28 42 22 42 C16 42 10 41 4 37 Z" fill="url(#hdrCrust)" />
              <path d="M22 7 L37 35 C32 39 27 40 22 40 C17 40 12 39 7 35 Z" fill="#92400E" opacity="0.5" />
              <path d="M22 10 L34 33 C29 37 25 38 22 38 C19 38 15 37 10 33 Z" fill="url(#hdrCheese)" />
              <circle cx="18" cy="24" r="3" fill="#DC2626" />
              <circle cx="26" cy="28" r="2.8" fill="#DC2626" />
              <circle cx="25" cy="19" r="1.5" fill="#18181B" />
              <path d="M22 14 L22 28 M16 20 L22 14 L28 20" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="brand-pulse-dot" />
          </div>
          <div className="brand-text-col">
            <h1 className="brand-title">PieFile</h1>
            <span className="brand-badge">P2P TRANSFER</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="p2p-status-pill" title="Direct browser-to-browser WebRTC connection">
            <Zap size={14} className="p2p-lightning-icon" />
            <span className="p2p-status-text">Direct WebRTC</span>
          </div>

          <div className="privacy-pill" title="Zero cloud storage. Files stream directly between peers.">
            <ShieldCheck size={14} />
            <span>Zero Server Storage</span>
          </div>

          <button
            type="button"
            className={`sound-toggle-btn ${isMuted ? 'muted' : 'active'}`}
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
