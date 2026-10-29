import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { ImageUploader } from '@/shared/ui/image-uploader';

export function ImageUploaderSection() {
  const [value, setValue] = useState('');

  return (
    <ComponentSection
      description="Avatar-style image upload with change and remove."
      id="image-uploader"
      title="Image Uploader"
    >
      <Example title="Default">
        <ImageUploader onChange={setValue} value={value} />
      </Example>
    </ComponentSection>
  );
}
