import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode as QrIcon,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  FileImage,
  Eye,
  EyeOff,
  Radio,
  Sparkles
} from 'lucide-react';
import { formatBytes } from '../utils/p2pSimulator';
import { sound } from '../utils/sound';

export default function ShareDashboard({
  file,
  slug,
  fileHash,
  password,
  onPasswordChange,
  onReset,
  peerStatus,
  peerProgress,
  onToast
}) {
  const [copied, setCopied] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(Boolean(password));
  const [pwdValue, setPwdValue] = useState(password || '');
  const [showPwdText, setShowPwdText] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Compute ultra-short shareable URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname === '/' ? '' : window.location.pathname.replace(/\/$/, '')}/#/p/${slug}`
    : `https://piefile.app/#/p/${slug}`;

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#121212',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [shareUrl]);

  // Copy share URL to clipboard
  const handleCopyLink = async () => {
    sound.playCopy();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast('Share link copied to clipboard! Ready to send to peer.', 'success');
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      onToast('Share link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // Toggle password feature
  const handleTogglePassword = () => {
    sound.playClick();
    if (showPasswordInput) {
      setShowPasswordInput(false);
      setPwdValue('');
      onPasswordChange('');
      onToast('Password protection removed. Transfer is public.', 'info');
    } else {
      setShowPasswordInput(true);
      onToast('Set a password to encrypt this file transfer.', 'info');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    onPasswordChange(pwdValue.trim());
    onToast(
      pwdValue.trim()
        ? 'Password protection locked! Receiver must enter this password.'
        : 'Password removed.',
      pwdValue.trim() ? 'success' : 'info'
    );
  };

  // Pick file icon based on type
  const getFileIcon = (mimeType = '', name = '') => {
    if (mimeType.startsWith('image/')) return <FileImage size={28} className="icon-img" />;
    if (mimeType.startsWith('video/')) return <FileVideo size={28} className="icon-video" />;
    if (mimeType.startsWith('audio/')) return <FileAudio size={28} className="icon-audio" />;
    if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.gz') || name.endsWith('.rar')) {
      return <FileArchive size={28} className="icon-archive" />;
    }
    if (name.endsWith('.js') || name.endsWith('.py') || name.endsWith('.json') || name.endsWith('.html')) {
      return <FileCode size={28} className="icon-code" />;
    }
    return <FileText size={28} className="icon-text" />;
  };

  return (
    <div className="dashboard-container">
      {/* Top Banner Status */}
      <div className="dashboard-header-card">
        <div className="live-status-badge">
          <span className="pulsing-beacon" />
          <Radio size={15} className="beacon-icon" />
          <span className="live-status-text">
            {peerStatus === 'transferring'
              ? 'Sending file to peer...'
              : peerStatus === 'connected'
              ? 'Peer connected & ready!'
              : peerStatus === 'completed'
              ? 'Transfer completed successfully!'
              : 'File is ready! Share the link to begin transfer.'}
          </span>
        </div>
        <p className="dashboard-hint">
          Keep this tab open while transferring. PieFile streams directly from your browser to your peer!
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: File Details Card */}
        <div className="dash-card file-meta-card">
          <div className="card-section-label">HOT & READY FILE</div>

          <div className="file-info-header">
            <div className="file-icon-wrapper">
              {getFileIcon(file.type, file.name)}
            </div>
            <div className="file-name-block">
              <h3 className="file-display-name" title={file.name}>
                {file.name}
              </h3>
              <div className="file-specs-row">
                <span className="file-size-tag">{formatBytes(file.size)}</span>
                <span className="dot-sep">•</span>
                <span className="file-mime-tag">{file.type || 'Binary / Document'}</span>
              </div>
            </div>
          </div>

          <div className="file-attributes-list">
            <div className="attr-item">
              <span className="attr-name">P2P Hash Fingerprint:</span>
              <span className="attr-value mono-val" title="SHA-256 Preview">
                {fileHash || 'Calculating...'}
              </span>
            </div>
            <div className="attr-item">
              <span className="attr-name">Transfer Mode:</span>
              <span className="attr-value">Direct WebRTC DataChannel</span>
            </div>
            <div className="attr-item">
              <span className="attr-name">Security Status:</span>
              <span className={`attr-value ${password ? 'security-locked' : 'security-open'}`}>
                {password ? '🔒 Password Protected' : '🌐 Direct Link'}
              </span>
            </div>
          </div>

          {/* Active Live Transfer Progress if peer is downloading */}
          {peerStatus === 'transferring' && (
            <div className="uploader-live-progress">
              <div className="progress-labels">
                <span className="progress-phase">Uploading chunks to receiver...</span>
                <span className="progress-pct">{peerProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill progress-animated"
                  style={{ width: `${peerProgress}%` }}
                />
              </div>
            </div>
          )}

          {peerStatus === 'completed' && (
            <div className="uploader-success-banner">
              <Sparkles size={16} />
              <span>Receiver downloaded this file successfully!</span>
            </div>
          )}
        </div>

        {/* Right Column: Share Link & QR Code */}
        <div className="dash-card share-actions-card">
          <div className="share-section-top-row">
            <div className="card-section-label">SHORT SHARE LINK</div>
            <span className="short-code-pill" title="4-character short code">
              CODE: <strong>{slug}</strong>
            </span>
          </div>

          {/* Link Box */}
          <div className="share-link-box">
            <span className="share-url-text" title={shareUrl}>
              {shareUrl}
            </span>
            <button
              type="button"
              className={`copy-link-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyLink}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Receiver Preview Button */}
          <div className="test-receiver-row">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-receiver-btn"
              onClick={() => sound.playClick()}
              title="Open shared link in a new tab to test receiver view"
            >
              <span>Test Receiver View in New Tab</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* QR Code and Password Row */}
          <div className="dash-tools-row">
            {/* QR Code Preview */}
            <div className="qr-preview-col">
              <div className="qr-box-inner" onClick={() => setShowQrModal(true)} title="Click to enlarge QR Code">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Share QR Code" className="qr-image" />
                ) : (
                  <div className="qr-placeholder">Generating QR...</div>
                )}
                <div className="qr-overlay-hover">
                  <QrIcon size={18} />
                  <span>Enlarge</span>
                </div>
              </div>
              <span className="qr-caption">Scan with mobile camera</span>
            </div>

            {/* Password Protection Control */}
            <div className="password-control-col">
              <div className="password-toggle-header">
                <button
                  type="button"
                  className={`pwd-toggle-switch ${showPasswordInput ? 'active' : ''}`}
                  onClick={handleTogglePassword}
                >
                  {showPasswordInput ? <Lock size={15} /> : <Unlock size={15} />}
                  <span>{showPasswordInput ? 'Password Enabled' : 'Add Password'}</span>
                </button>
              </div>

              {showPasswordInput && (
                <form onSubmit={handlePasswordSubmit} className="password-form-box">
                  <div className="password-input-wrap">
                    <input
                      type={showPwdText ? 'text' : 'password'}
                      placeholder="Enter passkey..."
                      value={pwdValue}
                      onChange={(e) => setPwdValue(e.target.value)}
                      className="pwd-text-input"
                    />
                    <button
                      type="button"
                      className="pwd-eye-btn"
                      onClick={() => setShowPwdText(!showPwdText)}
                      aria-label={showPwdText ? 'Hide password' : 'Show password'}
                    >
                      {showPwdText ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button type="submit" className="save-pwd-btn">
                    Set Lock
                  </button>
                </form>
              )}

              <p className="password-note">
                {password
                  ? 'Receiver must enter this password to initiate download.'
                  : 'Optional: protect your transfer with client-side password verification.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploader Action Controls: STRICTLY NO DOWNLOAD BUTTON FOR UPLOADER AS REQUIRED */}
      <div className="uploader-action-bar">
        <button
          type="button"
          className="upload-another-btn"
          onClick={() => {
            sound.playClick();
            onReset();
          }}
        >
          <RefreshCw size={17} />
          <span>Upload Another File</span>
        </button>

        <span className="uploader-action-helper">
          Original uploader view • Download is only available for remote receivers
        </span>
      </div>

      {/* Modal for enlarged QR code */}
      {showQrModal && (
        <div className="qr-modal-backdrop" onClick={() => setShowQrModal(false)}>
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="qr-modal-title">Scan to Download on Mobile</h3>
            <p className="qr-modal-subtitle">
              Point your smartphone camera at the QR code to open the receiver link.
            </p>
            <div className="qr-modal-img-wrap">
              <img src={qrDataUrl} alt="Enlarged QR Code" className="qr-modal-img" />
            </div>
            <div className="qr-modal-url">{shareUrl}</div>
            <button
              type="button"
              className="qr-modal-close-btn"
              onClick={() => setShowQrModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
