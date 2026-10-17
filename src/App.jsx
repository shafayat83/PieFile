import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ShareDashboard from './components/ShareDashboard';
import ReceiverView from './components/ReceiverView';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { generatePieSlug } from './utils/slug';
import { saveShare, getShare } from './utils/db';
import { computeFileHashPreview, p2pManager } from './utils/p2pSimulator';
import { sound } from './utils/sound';

export default function App() {
  // Current Route: 'uploader' | 'receiver'
  const [currentRoute, setCurrentRoute] = useState('uploader');
  const [receiverSlug, setReceiverSlug] = useState('');

  // Uploader State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shareSlug, setShareSlug] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [sharePassword, setSharePassword] = useState('');
  const [uploaderPeerStatus, setUploaderPeerStatus] = useState('waiting'); // 'waiting' | 'connected' | 'transferring' | 'completed'
  const [uploaderPeerProgress, setUploaderPeerProgress] = useState(0);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize hash routing: #/share/[slug]
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      // Support ultra-short #/p/[slug] as well as #/share/ and #/s/
      const match = hash.match(/^#\/(?:p|s|share)\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setCurrentRoute('receiver');
        setReceiverSlug(match[1]);
      } else {
        setCurrentRoute('uploader');
        setReceiverSlug('');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Subscribe to real-time P2P events across browser tabs
  useEffect(() => {
    const unsubscribe = p2pManager.subscribe((msg) => {
      if (!msg) return;

      // Handle events relevant to active uploader
      if (shareSlug && msg.slug === shareSlug) {
        if (msg.type === 'PEER_JOINED') {
          setUploaderPeerStatus('connected');
          showToast('A receiver connected to your file link!', 'info');
        } else if (msg.type === 'TRANSFER_START') {
          setUploaderPeerStatus('transferring');
          setUploaderPeerProgress(5);
        } else if (msg.type === 'TRANSFER_PROGRESS') {
          setUploaderPeerStatus('transferring');
          setUploaderPeerProgress(msg.progress || 0);
        } else if (msg.type === 'TRANSFER_COMPLETE') {
          setUploaderPeerStatus('completed');
          setUploaderPeerProgress(100);
          sound.playSuccess();
          showToast('Peer completed downloading your file!', 'success');
        }
      }
    });

    return () => unsubscribe();
  }, [shareSlug, showToast]);

  // Handle file drop/selection in Uploader
  const handleFileSelect = async (file) => {
    if (!file) return;

    const slug = generatePieSlug();
    setUploadedFile(file);
    setShareSlug(slug);
    setSharePassword('');
    setUploaderPeerStatus('waiting');
    setUploaderPeerProgress(0);

    // Compute preview SHA-256
    const hash = await computeFileHashPreview(file);
    setFileHash(hash);

    // Persist in IndexedDB for cross-tab receiver access
    try {
      await saveShare({
        slug,
        name: file.name,
        size: file.size,
        type: file.type,
        blob: file,
        password: '',
        hash,
        timestamp: Date.now()
      });
      showToast(`"${file.name}" is warm and ready to share!`, 'success');
    } catch (e) {
      console.warn('Failed to save to local IndexedDB:', e);
      showToast(`File ready to stream!`, 'success');
    }
  };

  // Handle password change for uploader
  const handlePasswordChange = async (newPassword) => {
    setSharePassword(newPassword);
    if (shareSlug && uploadedFile) {
      try {
        const record = await getShare(shareSlug);
        if (record) {
          record.password = newPassword;
          await saveShare(record);
        }
      } catch (err) {
        console.error('Failed to update password in IndexedDB:', err);
      }
    }
  };

  // Reset uploader state to upload another file
  const handleResetUploader = () => {
    setUploadedFile(null);
    setShareSlug('');
    setFileHash('');
    setSharePassword('');
    setUploaderPeerStatus('waiting');
    setUploaderPeerProgress(0);
    window.location.hash = '';
    setCurrentRoute('uploader');
    showToast('Ready for your next file!', 'info');
  };

  // Navigate back to uploader from receiver view
  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentRoute('uploader');
    setUploadedFile(null);
  };

  return (
    <div className="app-shell">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Navigation Header */}
      <Header onReset={handleResetUploader} />

      {/* Main App Body */}
      <main className="main-viewport">
        <div className="content-container">
          {currentRoute === 'receiver' ? (
            <ReceiverView
              slug={receiverSlug}
              onGoHome={handleGoHome}
              onToast={showToast}
            />
          ) : (
            <>
              {!uploadedFile ? (
                <Dropzone
                  onFileSelect={handleFileSelect}
                  onSampleSelect={handleFileSelect}
                />
              ) : (
                <ShareDashboard
                  file={uploadedFile}
                  slug={shareSlug}
                  fileHash={fileHash}
                  password={sharePassword}
                  onPasswordChange={handlePasswordChange}
                  onReset={handleResetUploader}
                  peerStatus={uploaderPeerStatus}
                  peerProgress={uploaderPeerProgress}
                  onToast={showToast}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer onSampleSelect={handleFileSelect} />
    </div>
  );
}
