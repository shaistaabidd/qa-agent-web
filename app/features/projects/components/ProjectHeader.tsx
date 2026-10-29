import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { GithubLogoIcon } from '@phosphor-icons/react/GithubLogo';
import { LinkIcon } from '@phosphor-icons/react/Link';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { PROJECTS_PATH } from '../constants';
import type { Project } from '../types';
import { GithubStatusTag } from './GithubStatusTag';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="flex flex-col gap-[8px] px-[16px] pt-[16px] md:px-[24px]">
      <div className="flex items-center gap-[12px]">
        <Button asChild size="icon-sm" variant="ghost">
          <Link aria-label="All projects" to={PROJECTS_PATH}>
            <ArrowLeftIcon aria-hidden weight="regular" />
          </Link>
        </Button>
        <Typography as="h1" className="min-w-0 truncate" fontWeight="semibold" variant="h6">
          {project.name}
        </Typography>
        <GithubStatusTag project={project} />
      </div>
      <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[4px] pl-[44px] text-fg-secondary">
        <a
          className="inline-flex items-center gap-[4px] hover:underline"
          href={project.targetUrl}
          rel="noreferrer"
          target="_blank"
        >
          <LinkIcon aria-hidden size={14} weight="regular" />
          <Typography as="span" variant="body3">
            {project.targetUrl}
          </Typography>
        </a>
        {project.repoFullName ? (
          <span className="inline-flex items-center gap-[4px]">
            <GithubLogoIcon aria-hidden size={14} weight="regular" />
            <Typography as="span" variant="body3">
              {project.repoFullName}
            </Typography>
          </span>
        ) : null}
      </div>
    </header>
  );
}
