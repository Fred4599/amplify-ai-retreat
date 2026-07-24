import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { getCroppedAvatarFile } from '../../lib/crop-image';

type Props = {
  imageSrc: string;
  fileName?: string;
  onCancel: () => void;
  onComplete: (file: File, previewUrl: string) => void;
};

export default function AvatarCropModal({ imageSrc, fileName, onCancel, onComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError('');
    try {
      const file = await getCroppedAvatarFile(imageSrc, croppedAreaPixels, fileName);
      const previewUrl = URL.createObjectURL(file);
      onComplete(file, previewUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not crop that photo.');
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-crop-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Cancel crop"
        onClick={onCancel}
      />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-black/95 shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Profile photo</p>
          <h2 id="avatar-crop-title" className="text-2xl font-heading italic text-white">
            Center your face
          </h2>
          <p className="text-white/55 font-body text-sm mt-1.5 leading-relaxed">
            Drag to move. Pinch or use the slider to zoom. We’ll crop to a circle for Connect.
          </p>
        </div>

        <div className="relative mx-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border border-white/10">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            objectFit="contain"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <label className="block">
            <span className="text-white/45 font-body text-xs uppercase tracking-wider">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-2 w-full accent-white"
            />
          </label>

          {error && <p className="text-red-400/90 text-sm font-body">{error}</p>}

          <div className="flex flex-wrap gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-50 px-5 py-2.5 text-sm font-body text-white/85 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={busy || !croppedAreaPixels}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-6 py-2.5 font-medium text-sm"
            >
              {busy ? 'Cropping…' : 'Use this crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
