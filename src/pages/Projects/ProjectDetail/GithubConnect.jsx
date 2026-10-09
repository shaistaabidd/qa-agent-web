import { useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react'
import Badge from 'react-bootstrap/Badge'
import { GITHUB_INSTALL_URL, GITHUB_AUTHORIZE_URL, GITHUB_REPOSITORIES } from '@graphql/queries/integrations'
import { CONNECT_GITHUB, SCAN_CODEBASE } from '@graphql/mutations/integrations'
import { FETCH_PROJECT } from '@graphql/queries/projects'
import { ButtonComponent, SelectField, ErrorComponent } from '@components/index'
import { SweetAlert } from '@services/index'

export const GITHUB_INSTALL_STATE_KEY = 'githubInstallState'

export const GithubConnect = ({ project }) => {
  const [repoFullName, setRepoFullName] = useState(project.repoFullName || '')

  const [fetchInstallUrl, { loading: redirecting, error: installError }] = useLazyQuery(GITHUB_INSTALL_URL, {
    fetchPolicy: 'network-only',
  })
  const [fetchAuthorizeUrl, { loading: signingIn, error: signInError }] = useLazyQuery(
    GITHUB_AUTHORIZE_URL,
    { fetchPolicy: 'network-only' }
  )
  const {
    data: reposData,
    loading: loadingRepos,
    error: reposError,
  } = useQuery(GITHUB_REPOSITORIES, {
    variables: { projectId: project.id },
    skip: !project.githubInstalled,
    fetchPolicy: 'network-only',
  })
  const [connectGithub, { loading: connecting, error: connectError }] = useMutation(CONNECT_GITHUB, {
    refetchQueries: [{ query: FETCH_PROJECT, variables: { id: project.id } }],
  })
  const [scanCodebase, { loading: scanning }] = useMutation(SCAN_CODEBASE)

  const redirectToGithub = (url) => {
    if (!url) return
    sessionStorage.setItem(GITHUB_INSTALL_STATE_KEY, new URL(url).searchParams.get('state'))
    window.location.assign(url)
  }

  // Sends the user to GitHub's install screen, where they choose the account
  // or organization and which repos the app may read.
  const handleInstall = async () => {
    const { data } = await fetchInstallUrl({ variables: { projectId: project.id } })
    redirectToGithub(data?.githubInstallUrl)
  }

  // For an app that's already installed (e.g. by an org owner): sign in with
  // GitHub and pick one of the installations the user can access.
  const handleSignIn = async () => {
    const { data } = await fetchAuthorizeUrl({ variables: { projectId: project.id } })
    redirectToGithub(data?.githubAuthorizeUrl)
  }

  const handleConnectRepo = async (e) => {
    e.preventDefault()
    await connectGithub({ variables: { projectId: project.id, repoFullName } })
    SweetAlert('GitHub repo connected')
  }

  const handleScan = async () => {
    const { data } = await scanCodebase({ variables: { projectId: project.id } })
    if (data?.scanCodebase?.success) SweetAlert(data.scanCodebase.message)
  }

  const repos = reposData?.githubRepositories || []

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-16 semibold">GitHub</div>
        <Badge bg={project.repoConnected ? 'success' : 'secondary'}>
          {project.repoConnected ? project.repoFullName : 'Not connected'}
        </Badge>
      </div>
      <ErrorComponent error={installError || signInError || reposError || connectError} />

      {!project.githubInstalled ? (
        <>
          <div className="text-14 text-gray-600 mb-3">
            Install the QA Agent GitHub App on your account or organization and choose which repos it can
            read. Installing on an organization needs an org owner — other members can send a request.
          </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <ButtonComponent loading={redirecting} onClick={handleInstall}>
              Connect GitHub
            </ButtonComponent>
            <ButtonComponent variant="link" loading={signingIn} onClick={handleSignIn}>
              Already installed? Sign in with GitHub
            </ButtonComponent>
          </div>
        </>
      ) : (
        <form onSubmit={handleConnectRepo}>
          <SelectField
            label="Repository"
            name="repoFullName"
            value={repoFullName}
            onChange={(e) => setRepoFullName(e.target.value)}
            options={repos.map((repo) => ({ value: repo, label: repo }))}
            blankLabel={loadingRepos ? 'Loading repos…' : 'Select a repo'}
          />
          {!loadingRepos && repos.length === 0 && (
            <div className="text-14 text-gray-600 mb-3">
              The app can&apos;t see any repos yet. Grant it access to a repo on GitHub, then reload.
            </div>
          )}
          <div className="d-flex gap-2 align-items-center">
            <ButtonComponent
              type="submit"
              loading={connecting}
              disabled={!repoFullName || repoFullName === project.repoFullName}
            >
              {project.repoConnected ? 'Change repo' : 'Link repo'}
            </ButtonComponent>
            <ButtonComponent variant="link" loading={redirecting} onClick={handleInstall}>
              Add repos or switch org
            </ButtonComponent>
            <ButtonComponent variant="link" loading={signingIn} onClick={handleSignIn}>
              Use another installation
            </ButtonComponent>
          </div>
        </form>
      )}

      <hr />
      <ButtonComponent
        variant="outline-primary"
        loading={scanning}
        disabled={!project.repoConnected}
        onClick={handleScan}
      >
        Scan codebase
      </ButtonComponent>
      {!project.repoConnected && (
        <div className="text-14 text-gray-600 mt-2">Connect a repo before scanning.</div>
      )}
    </>
  )
}
