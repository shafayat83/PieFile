import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, Lock } from 'lucide-react';
import HeroIllustration from './HeroIllustration';
import { sound } from '../utils/sound';
import { createSampleFile } from '../utils/p2pSimulator';

export default function Dropzone({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging false if leaving dropzone container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      sound.playFileDrop();
      onFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      sound.playFileDrop();
      onFileSelect(file);
    }
  };

  const handleOpenFileDialog = () => {
    sound.playClick();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSampleClick = (e, type) => {
    e.stopPropagation();
    sound.playFileDrop();
    const sample = createSampleFile(type);
    onFileSelect(sample);
  };

  return (
    <div className="dropzone-section">
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleInputChange}
        id="piefile-hidden-input"
      />

      <div
        className={`dropzone-card ${isDragging ? 'is-dragover' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleOpenFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpenFileDialog();
        }}
        aria-label="Upload Dropzone. Drop a file to get started or click to select."
      >
        {/* Glow ambient background effect */}
        <div className="dropzone-glow-aura" />

        {/* Hero Pie Illustration */}
        <div className="hero-graphic-wrap">
          <HeroIllustration isDragging={isDragging} size={310} />
        </div>

        {/* Main Dropzone Copy */}
        <div className="dropzone-content">
          <h2 className="dropzone-heading">Drop a file to get started</h2>
          <p className="dropzone-subheading">
            or <span className="browse-link">browse from your device</span>
          </p>

          <div className="dropzone-features-pill">
            <span className="feat-item">
              <UploadCloud size={13} /> Direct WebRTC Transfer
            </span>
            <span className="feat-divider">•</span>
            <span className="feat-item">
              <Lock size={13} /> No Size Limits
            </span>
            <span className="feat-divider">•</span>
            <span className="feat-item">
              <Sparkles size={13} /> Never Uploaded to the Cloud
            </span>
          </div>
        </div>

        {/* Quick Sample Trigger inside Dropzone */}
        <div className="sample-pill-container" onClick={(e) => e.stopPropagation()}>
          <span className="sample-label">Want to test without a local file?</span>
          <div className="sample-buttons-row">
            <button
              type="button"
              className="sample-chip-btn"
              onClick={(e) => handleSampleClick(e, 'recipe')}
              title="Try with delicious pizza recipe markdown"
            >
              🍕 Try Secret Pizza Recipe (Markdown)
            </button>
            <button
              type="button"
              className="sample-chip-btn"
              onClick={(e) => handleSampleClick(e, 'guide')}
              title="Try with P2P Architecture Guide"
            >
              📄 Try Architecture Guide (.txt)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
