import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { CopyIcon } from '@phosphor-icons/react/Copy';
import { PlusIcon } from '@phosphor-icons/react/Plus';
import { type ReactNode, useId } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardFooterActions,
  CardHeader,
  CardHeaderText,
  CardMedia,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

// The sample forms and media stay together so this catalog section has one anchor.

const CARD_WIDTH = 'w-[358px]';
const COVER_SRC = '/images/card/card-cover.png';

function CoverImage() {
  return (
    <CardMedia variant="cover">
      <img alt="" src={COVER_SRC} />
    </CardMedia>
  );
}

function CopyMedia() {
  return (
    <CardMedia>
      <CopyIcon aria-hidden weight="light" />
    </CardMedia>
  );
}

function ActionsFooter({
  primary = 'Submit',
  secondary,
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <CardFooter>
      <CardFooterActions>
        <Button size="md" variant="outline">
          Close
        </Button>
      </CardFooterActions>
      <CardFooterActions>
        {secondary ? (
          <Button size="md" variant="outline">
            {secondary}
          </Button>
        ) : null}
        <Button size="md">{primary}</Button>
      </CardFooterActions>
    </CardFooter>
  );
}

function Field({
  children,
  htmlFor,
  label,
}: {
  children: ReactNode;
  htmlFor?: string;
  label?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
    </div>
  );
}

function LoginForm() {
  const emailId = useId();
  const passwordId = useId();

  return (
    <Card className={CARD_WIDTH}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent>
        <Field htmlFor={emailId} label="Email">
          <Input defaultValue="John Doe" id={emailId} size="md" />
        </Field>
        <Field htmlFor={passwordId} label="Password">
          <Input defaultValue="John Doe" id={passwordId} size="md" type="password" />
        </Field>
      </CardContent>
      <ActionsFooter secondary="Retry" />
    </Card>
  );
}

function InformationForm() {
  const nameId = useId();
  const addressId = useId();
  const line2Id = useId();
  const stateId = useId();
  const cityId = useId();
  const zipId = useId();

  return (
    <Card className={CARD_WIDTH} size="sm">
      <CoverImage />
      <CardHeader>
        <CopyMedia />
        <CardHeaderText>
          <CardTitle>Card title</CardTitle>
          <CardDescription>This card uses the small size variant.</CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-[16px]">
          <Typography as="p" fontWeight="bold" variant="body2">
            Your Information
          </Typography>
          <Field htmlFor={nameId} label="Full Name">
            <Input defaultValue="John Doe" id={nameId} size="md" />
          </Field>
          <div className="flex w-full flex-col gap-[8px]">
            <Label htmlFor={addressId}>Address</Label>
            <Input defaultValue="Street 43" id={addressId} size="md" />
            <Label className="sr-only" htmlFor={line2Id}>
              Line 2
            </Label>
            <Input id={line2Id} placeholder="Line 2" size="md" />
            <div className="flex gap-[8px]">
              <Label className="sr-only" htmlFor={stateId}>
                State
              </Label>
              <Input
                defaultValue="California"
                id={stateId}
                rightIcon={<CaretDownIcon aria-hidden weight="light" />}
                size="md"
              />
              <Label className="sr-only" htmlFor={cityId}>
                City
              </Label>
              <Input defaultValue="San Diego" id={cityId} size="md" />
              <Label className="sr-only" htmlFor={zipId}>
                ZIP
              </Label>
              <Input defaultValue="12894" id={zipId} size="md" />
            </div>
          </div>
        </div>
        <Typography as="p" size="sm">
          The card component supports a size prop that can be set to &quot;sm&quot; for a more
          compact appearance.
        </Typography>
      </CardContent>
      <ActionsFooter secondary="Retry" />
    </Card>
  );
}

export function CardSection() {
  return (
    <ComponentSection
      description="Container for grouping related content and actions. Header, cover, content, and footer compose independently."
      id="card"
      title="Card"
    >
      <Example
        contentClassName="items-start"
        description="Optional 32px icon, title, and supporting text."
        title="Header"
      >
        <Card className={CARD_WIDTH}>
          <CardHeader>
            <CopyMedia />
            <CardHeaderText>
              <CardTitle>Dialog title</CardTitle>
              <CardDescription>Supporting text</CardDescription>
            </CardHeaderText>
          </CardHeader>
        </Card>
      </Example>

      <Example
        contentClassName="items-start p-0 overflow-hidden"
        description="Full-bleed cover at 160px. Clips to the card radius."
        title="Cover"
      >
        <Card className={CARD_WIDTH}>
          <CoverImage />
        </Card>
      </Example>

      <Example
        contentClassName="items-start"
        description="Left and right action groups on the background surface."
        title="Footer"
      >
        <Card className={CARD_WIDTH}>
          <ActionsFooter secondary="Retry" />
        </Card>
      </Example>

      <Example
        contentClassName="items-start"
        description="Title, supporting text, and a single primary action."
        title="Basic"
      >
        <Card className={CARD_WIDTH}>
          <CardHeader>
            <CardHeaderText>
              <CardTitle>Design System Enhancements</CardTitle>
              <CardDescription>
                A practical talk on component APIs, accessibility, and shipping faster.
              </CardDescription>
            </CardHeaderText>
          </CardHeader>
          <ActionsFooter primary="RSVP" />
        </Card>
      </Example>

      <Example
        contentClassName="items-start"
        description="Body slot for form fields. Medium inputs and outline plus primary buttons."
        title="Form"
      >
        <LoginForm />
      </Example>

      <Example
        contentClassName="items-start"
        description="Cover, icon header, body copy, and footer. size=sm tightens padding."
        title="Cover with content"
      >
        <Card className={CARD_WIDTH} size="sm">
          <CoverImage />
          <CardHeader>
            <CopyMedia />
            <CardHeaderText>
              <CardTitle>Design System Enhancements</CardTitle>
              <CardDescription>This card uses the small size variant.</CardDescription>
            </CardHeaderText>
          </CardHeader>
          <CardContent>
            <Typography as="p" size="sm">
              A practical talk on component APIs, accessibility, and shipping faster.
            </Typography>
          </CardContent>
          <ActionsFooter secondary="Retry" />
        </Card>
      </Example>

      <Example
        contentClassName="items-start"
        description="Header action aligned to the title block."
        title="With CardAction"
      >
        <Card className={CARD_WIDTH}>
          <CardHeader>
            <CardHeaderText>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive alerts.</CardDescription>
            </CardHeaderText>
            <CardAction>
              <Button aria-label="Add notification rule" size="icon-sm" variant="ghost">
                <PlusIcon aria-hidden weight="light" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Typography as="p" className="text-fg-secondary" size="sm">
              Email and push notifications are currently enabled.
            </Typography>
          </CardContent>
        </Card>
      </Example>

      <Example
        contentClassName="items-start"
        description="Small size with cover, icon, nested form, and footer actions."
        title="Small size"
      >
        <InformationForm />
      </Example>
    </ComponentSection>
  );
}
