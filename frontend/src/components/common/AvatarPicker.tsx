import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Check,
  Shuffle,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  User,
  Palette,
} from 'lucide-react';
import {
  generateAvatarBatch,
  validateAvatarFile,
  AVATAR_UPLOAD,
  AVATAR_STYLES,
} from '../../constants/avatars';
import type { AvatarStyle } from '../../constants/avatars';
import { logger } from '../../utils/logger';

type TabId = 'generated' | 'upload';

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export default function AvatarPicker({ isOpen, onClose, onSelect, currentAvatar }: AvatarPickerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('generated');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('realistic');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [seed, setSeed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatars = useMemo(
    () => generateAvatarBatch(avatarStyle),
    [avatarStyle, seed]
  );

  const tabs: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'generated', label: 'Choose Avatar', icon: Sparkles },
    { id: 'upload', label: 'Upload', icon: Upload },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      logger.warn('Avatar upload validation failed', { error: validation.error }, 'AvatarPicker');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setUploadPreview(dataUrl);
      setSelectedUrl(dataUrl);
      logger.action('Avatar file uploaded', { name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      logger.action('Avatar selected', { source: activeTab, style: avatarStyle });
      onClose();
    }
  };

  const handleShuffle = () => {
    setSeed((s) => s + 1);
    setSelectedUrl(null);
    logger.action('Avatar shuffle triggered');
  };

  const previewUrl = selectedUrl || currentAvatar || '';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0c10] border border-gray-800/60 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Choose Avatar</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Profile Identity</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center py-6 bg-gradient-to-b from-blue-500/5 to-transparent">
              <motion.div
                key={previewUrl}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-28 h-28 rounded-full border-4 border-gray-800 overflow-hidden shadow-2xl bg-gray-900"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setUploadError(null); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'text-gray-500 hover:text-gray-300 border border-transparent'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-[240px]">
              {activeTab === 'generated' && (
                <div className="space-y-5">
                  {/* Style switch + Shuffle */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-2 bg-gray-900/60 rounded-xl p-1 border border-gray-800/50">
                      {AVATAR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => { setAvatarStyle(style.id); setSelectedUrl(null); }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            avatarStyle === style.id
                              ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {style.id === 'realistic' ? <User className="w-3.5 h-3.5" /> : <Palette className="w-3.5 h-3.5" />}
                          {style.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleShuffle}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-800/50 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all font-medium"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      Shuffle
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                    {avatarStyle === 'realistic' ? '30 photorealistic portraits' : '24 illustrated avatars'} · Click to select
                  </p>

                  {/* Avatar Grid */}
                  <div className={`grid gap-3 ${avatarStyle === 'realistic' ? 'grid-cols-6' : 'grid-cols-6'}`}>
                    {avatars.map((url, i) => (
                      <motion.button
                        key={`${avatarStyle}-${seed}-${i}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.015, duration: 0.25 }}
                        onClick={() => setSelectedUrl(url)}
                        className={`relative aspect-square rounded-full overflow-hidden border-[3px] transition-all duration-200 hover:scale-110 focus:outline-none ${
                          selectedUrl === url
                            ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/30 scale-110'
                            : 'border-gray-800/60 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Avatar ${i + 1}`}
                          className="w-full h-full object-cover bg-gray-900"
                          loading="lazy"
                        />
                        {selectedUrl === url && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-blue-500/30"
                          >
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-gray-600 cursor-pointer transition-all group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={AVATAR_UPLOAD.allowedExtensions}
                      onChange={handleFileChange}
                    />
                    <div className="p-4 bg-gray-800 rounded-full group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm">Click to upload an image</p>
                      <p className="text-gray-600 text-xs mt-1">JPG, PNG or WebP · Max {AVATAR_UPLOAD.maxSizeMB}MB</p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {uploadError}
                    </div>
                  )}

                  {uploadPreview && (
                    <div className="flex items-center gap-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <img src={uploadPreview} alt="Upload preview" className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">Image ready</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Click confirm to apply</p>
                      </div>
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800/40 flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-800 rounded-xl text-gray-400 text-sm font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedUrl}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold text-sm rounded-xl transition-all enabled:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                Confirm Selection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
