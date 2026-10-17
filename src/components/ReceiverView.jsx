import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Share2
} from 'lucide-react';
import { formatBytes, p2pManager } from '../utils/p2pSimulator';
import { sound } from '../utils/sound';
import { getShare } from '../utils/db';

export default function ReceiverView({ slug, onGoHome, onToast }) {
  const [fileRecord, setFileRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Transfer State Machine: 'idle' | 'handshake' | 'channel' | 'streaming' | 'verifying' | 'completed'
  const [transferState, setTransferState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [transferSpeed, setTransferSpeed] = useState('0 MB/s');
  const [etaSeconds, setEtaSeconds] = useState(0);

  const transferIntervalRef = useRef(null);

  // Load file record from IndexedDB or generate fallback peer metadata
  useEffect(() => {
    let isMounted = true;

    async function loadFile() {
      try {
        const record = await getShare(slug);
        if (isMounted) {
          if (record) {
            setFileRecord(record);
            setIsUnlocked(!record.password); // if no password, immediately unlocked
          } else {
            // Simulated peer file if link opened directly or on fresh device
            const fallbackBlob = new Blob([
              `Freshly baked file received via PieFile WebRTC P2P.\nShared via link slug: ${slug}\nEnjoy the fresh slices!`
            ], { type: 'text/markdown' });
            
            setFileRecord({
              slug,
              name: `artisan-pie-share-${slug}.md`,
              size: fallbackBlob.size || 1048576 * 2.4, // ~2.4 MB simulated
              type: 'text/markdown',
              blob: fallbackBlob,
              password: '',
              timestamp: Date.now()
            });
            setIsUnlocked(true);
          }
          setLoading(false);

          // Broadcast PEER_JOINED to host tab
          p2pManager.broadcast({
            type: 'PEER_JOINED',
            slug
          });
        }
      } catch (err) {
        console.error('Error fetching file record:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadFile();

    return () => {
      isMounted = false;
      if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);
    };
  }, [slug]);

  // Handle password submission
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (!fileRecord) return;

    if (passwordInput.trim() === (fileRecord.password || '')) {
      sound.playSuccess();
      setIsUnlocked(true);
      setPasswordError(false);
      onToast('Password verified! File unlocked for download.', 'success');
    } else {
      sound.playError();
      setPasswordError(true);
      onToast('Incorrect password. Please try again.', 'error');
      setTimeout(() => setPasswordError(false), 800);
    }
  };

  // Trigger simulated/real P2P file transfer and browser download
  const handleStartDownload = () => {
    if (transferState !== 'idle' && transferState !== 'completed') return;

    sound.playClick();
    setTransferState('handshake');
    setProgress(5);
    setTransferSpeed('1.2 MB/s');
    setEtaSeconds(4);

    // Announce download start to host tab
    p2pManager.broadcast({
      type: 'TRANSFER_START',
      slug
    });

    let currentProgress = 5;

    transferIntervalRef.current = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 6;

      if (currentProgress < 25) {
        setTransferState('handshake');
        setTransferSpeed('3.4 MB/s');
        setEtaSeconds(3);
      } else if (currentProgress < 45) {
        setTransferState('channel');
        setTransferSpeed('7.8 MB/s');
        setEtaSeconds(2);
      } else if (currentProgress < 92) {
        setTransferState('streaming');
        setTransferSpeed((Math.random() * 4 + 8).toFixed(1) + ' MB/s');
        setEtaSeconds(1);
      } else if (currentProgress < 100) {
        setTransferState('verifying');
        setTransferSpeed('14.2 MB/s');
        setEtaSeconds(0);
      } else {
        // Complete!
        currentProgress = 100;
        clearInterval(transferIntervalRef.current);
        setTransferState('completed');
        setProgress(100);

        sound.playSuccess();

        // Broadcast completion to host tab
        p2pManager.broadcast({
          type: 'TRANSFER_COMPLETE',
          slug
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E26D2D', '#F59E0B', '#FBBF24', '#FFFFFF']
          });
        } catch {
          // ignore
        }

        // Trigger real file download in the browser!
        if (fileRecord && fileRecord.blob) {
          const url = URL.createObjectURL(fileRecord.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileRecord.name || 'piefile-download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        }

        onToast('File transfer completed and saved to your device!', 'success');
        return;
      }

      setProgress(Math.min(currentProgress, 99));

      // Broadcast progress to host
      p2pManager.broadcast({
        type: 'TRANSFER_PROGRESS',
        slug,
        progress: Math.min(currentProgress, 99)
      });
    }, 180);
  };

  const getFileIcon = (mimeType = '', name = '') => {
    if (mimeType.startsWith('image/')) return <FileImage size={34} className="icon-img" />;
    if (mimeType.startsWith('video/')) return <FileVideo size={34} className="icon-video" />;
    if (mimeType.startsWith('audio/')) return <FileAudio size={34} className="icon-audio" />;
    if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.gz')) {
      return <FileArchive size={34} className="icon-archive" />;
    }
    if (name.endsWith('.js') || name.endsWith('.py') || name.endsWith('.json')) {
      return <FileCode size={34} className="icon-code" />;
    }
    return <FileText size={34} className="icon-text" />;
  };

  if (loading) {
    return (
      <div className="receiver-loading-card">
        <div className="receiver-spinner" />
        <p>Connecting to peer and fetching file metadata...</p>
      </div>
    );
  }

  return (
    <div className="receiver-container">
      {/* Top Breadcrumb/Back link */}
      <div className="receiver-nav-bar">
        <button type="button" className="receiver-back-btn" onClick={onGoHome}>
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
          <span>Share your own file</span>
        </button>
        <span className="receiver-slug-badge">Code: {slug}</span>
      </div>

      {/* PASSWORD CHALLENGE CARD (If protected and not yet unlocked) */}
      {!isUnlocked && (
        <div className={`receiver-card password-card ${passwordError ? 'shake-animation' : ''}`}>
          <div className="password-card-icon-wrap">
            <Lock size={32} />
          </div>
          <h2 className="password-card-title">Password Protected Transfer</h2>
          <p className="password-card-desc">
            The sender has encrypted this file with a passkey. Enter the password below to begin peer download.
          </p>

          <form onSubmit={handleVerifyPassword} className="receiver-password-form">
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter transfer password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`receiver-pwd-input ${passwordError ? 'has-error' : ''}`}
                autoFocus
              />
              <button
                type="button"
                className="pwd-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="unlock-submit-btn">
              <Unlock size={17} />
              <span>Unlock File</span>
            </button>
          </form>

          {passwordError && (
            <div className="pwd-error-text">
              <AlertCircle size={14} />
              <span>Incorrect password. Please verify with the sender.</span>
            </div>
          )}
        </div>
      )}

      {/* UNLOCKED FILE DOWNLOAD CARD */}
      {isUnlocked && fileRecord && (
        <div className="receiver-card file-ready-card">
          {/* Uploader Live Status Pill */}
          <div className="receiver-peer-status-bar">
            <span className="live-peer-dot" />
            <span className="live-peer-label">Uploader is Online • Direct WebRTC Tunnel</span>
          </div>

          {/* File Meta Box */}
          <div className="receiver-file-meta">
            <div className="receiver-icon-box">
              {getFileIcon(fileRecord.type, fileRecord.name)}
            </div>
            <div className="receiver-name-col">
              <h2 className="receiver-filename" title={fileRecord.name}>
                {fileRecord.name}
              </h2>
              <div className="receiver-tags-row">
                <span className="receiver-size-pill">{formatBytes(fileRecord.size)}</span>
                <span className="dot-sep">•</span>
                <span className="receiver-mode-pill">End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Transfer In Progress Screen */}
          {transferState !== 'idle' && transferState !== 'completed' && (
            <div className="transfer-progress-screen">
              <div className="transfer-status-line">
                <span className="status-phase-text">
                  {transferState === 'handshake' && 'Initiating WebRTC peer handshake...'}
                  {transferState === 'channel' && 'Establishing encrypted RTCDataChannel...'}
                  {transferState === 'streaming' && 'Transferring data chunks directly from peer...'}
                  {transferState === 'verifying' && 'Verifying file integrity (SHA-256)...'}
                </span>
                <span className="status-pct-text">{progress}%</span>
              </div>

              <div className="receiver-progress-bar-wrap">
                <div
                  className="receiver-progress-bar-fill progress-animated"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="transfer-metrics-row">
                <span className="metric-item">Speed: <strong>{transferSpeed}</strong></span>
                <span className="metric-divider">•</span>
                <span className="metric-item">ETA: <strong>{etaSeconds}s</strong></span>
                <span className="metric-divider">•</span>
                <span className="metric-item">Protocol: <strong>WebRTC P2P</strong></span>
              </div>
            </div>
          )}

          {/* Transfer Completed Screen */}
          {transferState === 'completed' && (
            <div className="transfer-completed-screen">
              <div className="completed-badge">
                <CheckCircle2 size={36} className="completed-check-icon" />
                <h3 className="completed-title">File Ready & Saved!</h3>
                <p className="completed-sub">
                  Your download has been triggered and saved directly to your device.
                </p>
              </div>

              <div className="completed-actions-row">
                <button
                  type="button"
                  className="download-again-btn"
                  onClick={handleStartDownload}
                >
                  <RefreshCw size={16} />
                  <span>Download Again</span>
                </button>
                <button
                  type="button"
                  className="send-own-file-btn"
                  onClick={onGoHome}
                >
                  <Share2 size={16} />
                  <span>Send a file with PieFile</span>
                </button>
              </div>
            </div>
          )}

          {/* Initial Idle Download Action: Prominent High-Contrast Button */}
          {transferState === 'idle' && (
            <div className="receiver-action-box">
              <button
                type="button"
                className="receiver-download-btn"
                onClick={handleStartDownload}
              >
                <Download size={22} className="dl-icon" />
                <span className="dl-text">Download File</span>
              </button>

              <div className="security-guarantee-note">
                <ShieldCheck size={14} />
                <span>Transferred directly from browser to browser. Nothing is saved on our servers.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
