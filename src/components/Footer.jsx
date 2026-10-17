import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { createSampleFile } from '../utils/p2pSimulator';
import { sound } from '../utils/sound';

export default function Footer({ onSampleSelect }) {
  const handleTrySample = (e) => {
    e.preventDefault();
    sound.playFileDrop();
    const sample = createSampleFile('recipe');
    onSampleSelect(sample);
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top-row">
          <div className="footer-col-info">
            <span className="footer-brand-tag">PieFile P2P</span>
            <p className="footer-tagline">
              Direct, encrypted file delivery powered by WebRTC. Your files never touch a cloud server.
            </p>
          </div>

          <div className="footer-col-sample">
            <button
              type="button"
              className="discreet-sample-link"
              onClick={handleTrySample}
              title="Test the transfer experience immediately with a sample file"
            >
              <FileText size={14} />
              <span>Try with a sample file</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-privacy-badge">
            <ShieldCheck size={14} className="shield-icon" />
            <span>End-to-End Encrypted DataChannel • Zero Log Policy</span>
          </div>

          <div className="footer-credit">
            <span>Freshly baked with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
