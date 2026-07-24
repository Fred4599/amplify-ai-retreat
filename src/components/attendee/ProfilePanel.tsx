import { useEffect, useState, type FormEvent } from 'react';
import {
  updateMyAttendeeProfile,
  uploadAttendeeAvatar,
  type AttendeeProfile,
} from '../../lib/attendee-auth';
import AvatarCropModal from './AvatarCropModal';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30';

type Props = {
  profile: AttendeeProfile;
  onProfileChange: (profile: AttendeeProfile) => void;
};

export default function ProfilePanel({ profile, onProfileChange }: Props) {
  const [company, setCompany] = useState(profile.company || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || '');
  const [cropSource, setCropSource] = useState<{ src: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCompany(profile.company || '');
    setBio(profile.bio || '');
    setPhone(profile.phone || '');
    setAvatarUrl(profile.avatar_url || '');
    setAvatarPreview(profile.avatar_url || '');
    setAvatarFile(null);
  }, [profile.id, profile.company, profile.bio, profile.phone, profile.avatar_url]);

  function handleAvatarChange(file: File | null) {
    if (!file) return;
    setMessage('');
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setCropSource({ src: URL.createObjectURL(file), name: file.name });
  }

  function handleCropCancel() {
    if (cropSource) URL.revokeObjectURL(cropSource.src);
    setCropSource(null);
  }

  function handleCropComplete(file: File, previewUrl: string) {
    if (cropSource) URL.revokeObjectURL(cropSource.src);
    if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    setCropSource(null);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    let nextAvatarUrl = avatarUrl;
    if (avatarFile) {
      const uploaded = await uploadAttendeeAvatar(avatarFile);
      if (!uploaded.ok) {
        setSaving(false);
        setError(uploaded.error);
        return;
      }
      nextAvatarUrl = uploaded.url;
    }

    if (!nextAvatarUrl) {
      setSaving(false);
      setError('Add a profile photo so others can recognize you.');
      return;
    }

    const result = await updateMyAttendeeProfile({
      company,
      bio,
      phone,
      avatarUrl: nextAvatarUrl,
    });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setAvatarUrl(result.avatar_url || nextAvatarUrl);
    setAvatarPreview(result.avatar_url || nextAvatarUrl);
    setAvatarFile(null);
    onProfileChange(result);
    setMessage(avatarFile ? 'Photo updated.' : 'Profile saved.');
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
      <div>
        <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-2">Profile</p>
        <h2 className="text-2xl font-heading italic text-white mb-2">Update how you show up</h2>
        <p className="text-white/55 font-body text-sm leading-relaxed">
          Change your photo anytime. Company, bio, and phone also appear in Connect.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label htmlFor="dash-avatar" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Profile photo
          </label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border border-white/15 bg-white/5 shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/35 font-body text-xs">
                  Photo
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <input
                id="dash-avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleAvatarChange(e.target.files?.[0] ?? null);
                  e.target.value = '';
                }}
                className="block w-full text-sm font-body text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:text-black file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-white/90"
              />
              <p className="text-white/40 font-body text-xs mt-2">
                You’ll crop to a circle next · JPEG/PNG · under 5MB
              </p>
            </div>
          </div>
        </div>

        {cropSource && (
          <AvatarCropModal
            imageSrc={cropSource.src}
            fileName={cropSource.name}
            onCancel={handleCropCancel}
            onComplete={handleCropComplete}
          />
        )}

        <div>
          <label htmlFor="dash-company" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Company
          </label>
          <input
            id="dash-company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dash-bio" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Short bio
          </label>
          <textarea
            id="dash-bio"
            required
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`${inputClass} resize-y min-h-[110px]`}
          />
        </div>

        <div>
          <label htmlFor="dash-phone" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Phone <span className="text-white/40">(optional — for Connect approvals)</span>
          </label>
          <input
            id="dash-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-red-400/90 text-sm font-body">{error}</p>}
        {message && <p className="text-emerald-200 text-sm font-body">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3 font-medium text-sm"
        >
          {saving ? 'Saving…' : avatarFile ? 'Save new photo' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
