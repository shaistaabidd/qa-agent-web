import { ArticleIcon } from '@phosphor-icons/react/Article';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { ImageUploader } from '@/shared/ui/image-uploader';

import { reportSettingsError } from '../errors';
import type { ProfileUpdate } from '../hooks/useProfileMutations';
import type { AccountProfile } from '../types';
import { formatFullName, formatPhone } from '../utils';
import { EditDetailsDialog } from './EditDetailsDialog';
import { NewEmailDialog } from './NewEmailDialog';
import { SettingsGroup } from './SettingsGroup';
import { SettingsField, SettingsRow } from './SettingsRow';
import { VerifyCodeDialog } from './VerifyCodeDialog';

type EmailStep = 'email' | 'confirm' | null;

type AccountTabProps = {
  isPhotoPending: boolean;
  onConfirmNewEmail: (otp: string) => Promise<void>;
  onRemovePhoto: () => Promise<void>;
  onRequestNewEmail: (email: string, currentPassword: string) => Promise<boolean>;
  onResendNewEmailCode: () => Promise<void>;
  onUploadPhoto: (file: File) => Promise<void>;
  profile: AccountProfile;
  updateProfile: (patch: ProfileUpdate, message?: string) => Promise<void>;
};

export function AccountTab({
  isPhotoPending,
  onConfirmNewEmail,
  onRemovePhoto,
  onRequestNewEmail,
  onResendNewEmailCode,
  onUploadPhoto,
  profile,
  updateProfile,
}: AccountTabProps) {
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [emailStep, setEmailStep] = useState<EmailStep>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const fullName = formatFullName(profile.firstName, profile.lastName);

  return (
    <>
      <SettingsGroup icon={<ArticleIcon aria-hidden weight="regular" />} title="Update Information">
        <SettingsRow>
          <ImageUploader
            alt={profile.photoUrl ? fullName : ''}
            changeLabel="Change photo"
            className="w-full justify-between"
            onChange={(photoUrl) => {
              if (!photoUrl) {
                void onRemovePhoto().catch(reportSettingsError);
              }
            }}
            onFileChange={(file) => {
              void onUploadPhoto(file).catch(reportSettingsError);
            }}
            pending={isPhotoPending}
            removeVariant="danger-icon"
            shape="circular"
            uploadLabel="Upload Image"
            value={profile.photoUrl}
          >
            {(profile.firstName || profile.email).slice(0, 1)}
          </ImageUploader>
        </SettingsRow>
        <SettingsRow
          actions={
            <Button
              onClick={() => setEditDetailsOpen(true)}
              size="md"
              type="button"
              variant="outline"
            >
              Edit Details
            </Button>
          }
        >
          <SettingsField label="Full Name" value={fullName} />
          <SettingsField label="Phone Number" value={formatPhone(profile.phone)} />
        </SettingsRow>
        <SettingsRow
          actions={
            <Button onClick={() => setEmailStep('email')} size="md" type="button" variant="outline">
              Change Email
            </Button>
          }
        >
          <SettingsField label="Email" value={profile.email} />
        </SettingsRow>
        {profile.pendingEmail ? (
          <SettingsRow
            actions={
              <Button
                onClick={() => setEmailStep('confirm')}
                size="md"
                type="button"
                variant="outline"
              >
                Enter Code
              </Button>
            }
          >
            <SettingsField label="Waiting for a code" value={profile.pendingEmail} />
          </SettingsRow>
        ) : null}
      </SettingsGroup>

      {editDetailsOpen ? (
        <EditDetailsDialog
          initial={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
          }}
          onOpenChange={setEditDetailsOpen}
          onSave={async (value) => {
            await updateProfile(value);
            setEditDetailsOpen(false);
          }}
          open
        />
      ) : null}
      {emailStep === 'email' ? (
        <NewEmailDialog
          currentEmail={profile.email}
          onOpenChange={(open) => {
            if (!open) {
              setEmailStep(null);
            }
          }}
          onSubmitEmail={async (email, currentPassword) => {
            const needsCode = await onRequestNewEmail(email, currentPassword);
            setPendingEmail(email);
            setEmailStep(needsCode ? 'confirm' : null);
          }}
          open
        />
      ) : null}
      {emailStep === 'confirm' ? (
        <VerifyCodeDialog
          description={`Enter the 6-digit code we sent to ${profile.pendingEmail ?? pendingEmail}.`}
          onOpenChange={(open) => {
            if (!open) {
              setEmailStep(null);
            }
          }}
          onResend={onResendNewEmailCode}
          onVerify={async (otp) => {
            await onConfirmNewEmail(otp);
            setEmailStep(null);
          }}
          open
        />
      ) : null}
    </>
  );
}
