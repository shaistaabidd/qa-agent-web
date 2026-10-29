import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Avatar, AVATAR_SIZES, type AvatarShape } from '@/shared/ui/avatar';

const MALE_SRC = '/images/avatar/male.png';
const FEMALE_SRC = '/images/avatar/female.png';
const SHAPES: AvatarShape[] = ['circular', 'rectangular'];

const SIZELESS_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23059669'/%3E%3C/svg%3E";

function TypeRow({ shape, size }: { shape: AvatarShape; size: (typeof AVATAR_SIZES)[number] }) {
  return (
    <div className="flex items-end gap-[16px]">
      <Avatar alt="Male profile" shape={shape} size={size} src={MALE_SRC} />
      <Avatar alt="Female profile" shape={shape} size={size} src={FEMALE_SRC} />
      <Avatar shape={shape} size={size}>
        JD
      </Avatar>
      <Avatar shape={shape} size={size} />
    </div>
  );
}

export function AvatarSection() {
  return (
    <ComponentSection
      description="Profile photo with image, initials, and unknown fallback. Sizes and shapes match the Figma Avatar set."
      id="avatar"
      title="Avatar"
    >
      <Example description="Male, female, initials, and unknown. 80 down to 16." title="Circular">
        <div className="flex flex-col gap-[24px]">
          {[...AVATAR_SIZES].reverse().map((size) => (
            <TypeRow key={size} shape="circular" size={size} />
          ))}
        </div>
      </Example>

      <Example
        description="Corner radius scales with size, from 20px at 80 to 2px at 16."
        title="Rectangular"
      >
        <div className="flex flex-col gap-[24px]">
          {[...AVATAR_SIZES].reverse().map((size) => (
            <TypeRow key={size} shape="rectangular" size={size} />
          ))}
        </div>
      </Example>

      <Example description="Image, initials, and unknown at the default 40 size." title="Types">
        {SHAPES.map((shape) => (
          <TypeRow key={shape} shape={shape} size="40" />
        ))}
      </Example>

      <Example
        description="Broken image sources the initials or unknown fallback."
        title="Image fallback"
      >
        <Avatar alt="Broken" src="/images/avatar/missing.png">
          JD
        </Avatar>
        <Avatar alt="Broken" shape="rectangular" src="/images/avatar/missing.png" />
      </Example>

      <Example
        description="SVG without intrinsic size, and initials that do not fit."
        title="Edge cases"
      >
        <span data-testid="avatar-svg">
          <Avatar alt="Vector" src={SIZELESS_SVG} />
        </span>
        <span data-testid="avatar-long">
          <Avatar size="24">VeryLongInitials</Avatar>
        </span>
        <span data-testid="avatar-long-40">
          <Avatar>AlexanderTheGreat</Avatar>
        </span>
      </Example>
    </ComponentSection>
  );
}
