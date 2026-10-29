import { FormDropdown } from '@/shared/lib/FormDropdown';
import { FormInput } from '@/shared/lib/FormInput';
import { FormTextarea } from '@/shared/lib/FormTextarea';
import { Segmented, SegmentedItem } from '@/shared/ui/segmented';

import {
  RESOURCE_CATEGORY_OPTIONS,
  RESOURCE_TITLE_MAX_LENGTH,
  RESOURCE_TYPE_OPTIONS,
} from '../constants';
import type { ResourceFormApi } from '../hooks/useResourceForm';
import {
  descriptionSchema,
  resourceCategorySchema,
  resourceTitleSchema,
  videoLinkSchema,
} from '../schemas';
import { ResourceDocumentField } from './ResourceDocumentField';

type ResourceFormFieldsProps = {
  existingFileUrl?: string | null;
  form: ResourceFormApi;
};

export function ResourceFormFields({ existingFileUrl, form }: ResourceFormFieldsProps) {
  return (
    <>
      <form.Field name="resourceType">
        {(field) => (
          <Segmented
            aria-label="Resource type"
            onValueChange={field.handleChange}
            value={field.state.value}
          >
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <SegmentedItem key={option.value} value={option.value}>
                {option.label}
              </SegmentedItem>
            ))}
          </Segmented>
        )}
      </form.Field>

      <FormDropdown
        form={form}
        label="Category"
        name="category"
        options={RESOURCE_CATEGORY_OPTIONS}
        placeholder="Select category"
        required
        size="md"
        validate={resourceCategorySchema}
      />

      <FormInput
        form={form}
        label="Title"
        maxLength={RESOURCE_TITLE_MAX_LENGTH}
        name="title"
        placeholder="Enter the title"
        required
        validate={resourceTitleSchema}
      />

      <FormTextarea
        form={form}
        label="Description"
        name="description"
        optional
        placeholder="Enter a description"
        size="md"
        validate={descriptionSchema}
      />

      <ResourceDocumentField existingUrl={existingFileUrl} form={form} />

      <FormInput
        form={form}
        label="Video URL"
        name="videoLink"
        optional
        placeholder="Enter Vimeo or YouTube URL"
        validate={videoLinkSchema}
      />
    </>
  );
}
