import {
  ComponentSection,
  Example,
  ExampleGrid,
} from '@/features/design-system/components/Showcase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

const OPEN_SAMPLE =
  "The enigmatic archaeologist, Dr. Aris Thorne, ventured deep into the whispering catacombs beneath the forgotten city of Eldoria, seeking the legendary Sunstone, a gem said to hold the secrets of the ancient civilization's mastery over solar energy, but little did he know that a shadowy cult, the Obsidian Order, also sought the artifact, intending to harness its power for their nefarious purposes, plunging the world into eternal darkness.";

export function AccordionSection() {
  return (
    <ComponentSection
      description="A vertically stacked set of interactive headings that each reveal a section of content."
      id="accordion"
      title="Accordion"
    >
      <Example
        contentClassName="block"
        description="Open=False and Open=True. CaretDown when collapsed, CaretUp when expanded."
        title="States"
      >
        <Accordion className="max-w-[500px]" defaultValue={['open']} type="multiple">
          <AccordionItem value="closed">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>{OPEN_SAMPLE}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="open">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>{OPEN_SAMPLE}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        contentClassName="block"
        description="No group border or radius. Use this when accordion items sit in a page or card that already provides the frame."
        title="Without container"
      >
        <Accordion
          className="max-w-[500px] rounded-none border-0"
          defaultValue={['open']}
          type="multiple"
        >
          <AccordionItem value="closed">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>{OPEN_SAMPLE}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="open">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>{OPEN_SAMPLE}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        contentClassName="block"
        description="Accordion Group. Rounded 8px container with a low border; items share a 1px divider."
        title="Group"
      >
        <Accordion className="max-w-[540px]" collapsible type="single">
          <AccordionItem value="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>
              Billing is charged at the start of each cycle. You can update your plan or payment
              method from account settings at any time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Is my data secured?</AccordionTrigger>
            <AccordionContent>
              Yes. Data is encrypted in transit and at rest, and access is limited to the people and
              systems that need it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="integrations">
            <AccordionTrigger>What integrations do you support?</AccordionTrigger>
            <AccordionContent>
              Connect billing and identity services from the integrations page. Additional
              connectors can be requested from support.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <ExampleGrid>
        <Example
          contentClassName="block"
          description="Only one item open at a time. The open item can be collapsed."
          title="Single, collapsible"
        >
          <Accordion collapsible defaultValue="item-1" type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is this project?</AccordionTrigger>
              <AccordionContent>
                SaaS Temp components, rendered with their variants, sizes, and states for visual QA.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Headers are buttons with aria-expanded. Arrow keys, Home, and End move focus between
                items.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I customize it?</AccordionTrigger>
              <AccordionContent>
                Yes. Compose Accordion, AccordionItem, AccordionTrigger, and AccordionContent, then
                pass className where you need it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          contentClassName="block"
          description="More than one item can stay open at once."
          title="Multiple open"
        >
          <Accordion defaultValue={['item-1', 'item-2']} type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>Billing</AccordionTrigger>
              <AccordionContent>Manage your subscription and invoices here.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Security</AccordionTrigger>
              <AccordionContent>Configure two-factor authentication and sessions.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Integrations</AccordionTrigger>
              <AccordionContent>Connect third-party apps to your workspace.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          contentClassName="block"
          description="Nested accordion inside an open panel, plus one inside a closed panel."
          title="Nested"
        >
          <Accordion data-testid="outer-accordion" defaultValue="outer-1" type="single" collapsible>
            <AccordionItem value="outer-1">
              <AccordionTrigger>Outer one</AccordionTrigger>
              <AccordionContent>
                <Accordion data-testid="inner-accordion" defaultValue={['inner-1']} type="multiple">
                  <AccordionItem value="inner-1">
                    <AccordionTrigger>Inner one</AccordionTrigger>
                    <AccordionContent>Inner content one.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="inner-2">
                    <AccordionTrigger>Inner two</AccordionTrigger>
                    <AccordionContent>Inner content two.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="outer-2">
              <AccordionTrigger>Outer two</AccordionTrigger>
              <AccordionContent>
                <Accordion defaultValue={['hidden-1']} type="multiple">
                  <AccordionItem value="hidden-1">
                    <AccordionTrigger>Hidden inner</AccordionTrigger>
                    <AccordionContent>Never visible while closed.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="outer-3">
              <AccordionTrigger>Outer three</AccordionTrigger>
              <AccordionContent>Last panel.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>
      </ExampleGrid>
    </ComponentSection>
  );
}
