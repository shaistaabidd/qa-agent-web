import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';

import { GithubStatusTag, type Project, useCanManage } from '@/features/projects';
import { FormDropdown } from '@/shared/lib/FormDropdown';
import { getMessageString } from '@/shared/lib/getMessageString';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderText,
  CardTitle,
} from '@/shared/ui/card';
import { toast } from '@/shared/ui/toast';

import { useGithubConnect } from '../hooks/useGithubConnect';

const repositorySchema = z.string().min(1, 'Choose a repository');

export function GithubConnectCard({ project }: { project: Project }) {
  const canManage = useCanManage(project);
  const github = useGithubConnect(project);
  const [busy, setBusy] = useState<'install' | 'scan' | 'sign-in' | null>(null);

  async function run(kind: 'install' | 'scan' | 'sign-in', action: () => Promise<unknown>) {
    setBusy(kind);
    try {
      await action();
    } catch (error) {
      toast.error(getMessageString(error, 'Something went wrong. Please try again.'));
    } finally {
      setBusy(null);
    }
  }

  const form = useForm({
    defaultValues: { repoFullName: project.repoFullName ?? '' },
    onSubmit: async ({ value }) => {
      try {
        await github.connectRepository(value.repoFullName);
        toast.success('GitHub repository connected');
      } catch (error) {
        toast.error(getMessageString(error, 'Could not connect the repository.'));
      }
    },
  });

  async function scan() {
    const data = await github.scan();
    if (data.scanCodebase.success) {
      toast.success(data.scanCodebase.message ?? 'Scan started');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>GitHub</CardTitle>
          <CardDescription>
            The repository is scanned for the routes and controllers to test.
          </CardDescription>
        </CardHeaderText>
        <CardAction>
          <GithubStatusTag project={project} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {!canManage ? (
          <p className="text-fg-secondary">Only project admins can connect GitHub.</p>
        ) : !project.githubInstalled ? (
          <>
            <p className="text-fg-secondary">
              Install the QA Agent GitHub App on your account or organization and choose which
              repositories it can read. Installing on an organization needs an owner; other members
              can send a request.
            </p>
            <div className="flex flex-wrap items-center gap-[8px]">
              <Button
                disabled={busy !== null}
                onClick={() => void run('install', github.install)}
                size="md"
                type="button"
              >
                {busy === 'install' ? 'Redirecting…' : 'Connect GitHub'}
              </Button>
              <Button
                disabled={busy !== null}
                onClick={() => void run('sign-in', github.signIn)}
                size="md"
                type="button"
                variant="ghost"
              >
                Already installed? Sign in with GitHub
              </Button>
            </div>
          </>
        ) : (
          <form
            className="flex flex-col gap-[16px]"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FormDropdown
              form={form}
              label="Repository"
              name="repoFullName"
              options={github.repositories.map((repository) => ({
                label: repository,
                value: repository,
              }))}
              placeholder={
                github.repositoriesLoading ? 'Loading repositories…' : 'Select a repository'
              }
              required
              validate={repositorySchema}
            />
            {!github.repositoriesLoading && github.repositories.length === 0 ? (
              <p className="text-fg-secondary">
                The app can&apos;t see any repositories yet. Grant it access to one on GitHub, then
                reload.
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-[8px]">
              <form.Subscribe
                selector={(state) => [state.isSubmitting, state.values.repoFullName] as const}
              >
                {([isSubmitting, repoFullName]) => (
                  <Button
                    disabled={
                      isSubmitting || !repoFullName || repoFullName === project.repoFullName
                    }
                    size="md"
                    type="submit"
                  >
                    {isSubmitting
                      ? 'Saving…'
                      : project.repoConnected
                        ? 'Change repository'
                        : 'Link repository'}
                  </Button>
                )}
              </form.Subscribe>
              <Button
                disabled={busy !== null}
                onClick={() => void run('install', github.install)}
                size="md"
                type="button"
                variant="ghost"
              >
                Add repositories or switch organization
              </Button>
              <Button
                disabled={busy !== null}
                onClick={() => void run('sign-in', github.signIn)}
                size="md"
                type="button"
                variant="ghost"
              >
                Use another installation
              </Button>
            </div>
          </form>
        )}
        {canManage ? (
          <div className="flex flex-col gap-[8px] border-t border-subtle pt-[16px]">
            <div>
              <Button
                disabled={!project.repoConnected || busy !== null}
                onClick={() => void run('scan', scan)}
                size="md"
                type="button"
                variant="outline"
              >
                {busy === 'scan' ? 'Scanning…' : 'Scan codebase'}
              </Button>
            </div>
            {!project.repoConnected ? (
              <p className="text-fg-secondary">Connect a repository before scanning.</p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
