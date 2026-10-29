import type { FindingDetails } from '../../types';
import { pretty } from '../../utils';
import { CodeBlock, EvidenceSection } from './primitives';

const NO_MESSAGE_TYPES = ['slow_request', 'n_plus_one', 'slow_query'];

export function ErrorSections({ details }: { details: FindingDetails }) {
  const showMessage = details.message && !NO_MESSAGE_TYPES.includes(details.type ?? '');

  return (
    <>
      {showMessage ? (
        <EvidenceSection title={details.errorName || 'Message'}>
          <CodeBlock>{details.message}</CodeBlock>
        </EvidenceSection>
      ) : null}
      {details.stack ? (
        <EvidenceSection title="Stack trace (browser)">
          <CodeBlock>{details.stack}</CodeBlock>
        </EvidenceSection>
      ) : null}
      {details.backtrace?.length ? (
        <EvidenceSection title="Backtrace (server)">
          <CodeBlock>{details.backtrace.join('\n')}</CodeBlock>
        </EvidenceSection>
      ) : null}
      {details.graphqlPath || details.extensions ? (
        <EvidenceSection title="GraphQL error">
          <CodeBlock>
            {pretty({ extensions: details.extensions, path: details.graphqlPath })}
          </CodeBlock>
        </EvidenceSection>
      ) : null}
      {details.responseBody ? (
        <EvidenceSection title="Response body">
          <CodeBlock>{details.responseBody}</CodeBlock>
        </EvidenceSection>
      ) : null}
      {details.excerpt ? (
        <EvidenceSection title="Text on screen">
          <CodeBlock>{details.excerpt}</CodeBlock>
        </EvidenceSection>
      ) : null}
    </>
  );
}
