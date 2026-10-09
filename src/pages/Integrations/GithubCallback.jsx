import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import {
  COMPLETE_GITHUB_INSTALLATION,
  AUTHORIZE_GITHUB_USER,
  SELECT_GITHUB_INSTALLATION,
} from '@graphql/mutations/integrations'
import { GITHUB_INSTALL_STATE_KEY } from '@pages/Projects/ProjectDetail/GithubConnect'
import { ButtonComponent, Loading, ErrorComponent } from '@components/index'
import { SweetAlert } from '@services/index'

// GitHub redirects here (the App's callback URL) after either the install
// screen (with installation_id) or a plain "Sign in with GitHub" (without).
export const GithubCallback = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [choice, setChoice] = useState(null)
  const [completeInstallation, { error: installError }] = useMutation(COMPLETE_GITHUB_INSTALLATION)
  const [authorizeUser, { error: authorizeError }] = useMutation(AUTHORIZE_GITHUB_USER)
  const [selectInstallation, { loading: selecting, error: selectError }] = useMutation(
    SELECT_GITHUB_INSTALLATION
  )
  // The OAuth code is single-use, so StrictMode's double effect must not resend it.
  const started = useRef(false)

  const finish = (project) => {
    SweetAlert('GitHub connected — now pick a repo')
    navigate(`/projects/${project.id}`, { replace: true })
  }

  const handleSelect = (choiceToken, installationId) =>
    selectInstallation({ variables: { choiceToken, installationId } })
      .then(({ data }) => finish(data.selectGithubInstallation.project))
      .catch(() => {}) // surfaced through `selectError`

  useEffect(() => {
    if (started.current) return
    started.current = true

    const installationId = params.get('installation_id')
    const code = params.get('code')
    // GitHub normally echoes `state` back; fall back to the copy saved before redirecting.
    const state = params.get('state') || sessionStorage.getItem(GITHUB_INSTALL_STATE_KEY)
    sessionStorage.removeItem(GITHUB_INSTALL_STATE_KEY)
    // Drop the one-time code from the URL so a reload can't resend it.
    window.history.replaceState(null, '', window.location.pathname)

    if (params.get('setup_action') === 'request') {
      setMessage(
        'Installation requested. Once an owner of the GitHub organization approves it, open your project and choose "Already installed? Sign in with GitHub".'
      )
      return
    }
    if (!code || !state) {
      setMessage('GitHub did not return the details needed to finish connecting. Please try again from your project.')
      return
    }

    if (installationId) {
      completeInstallation({ variables: { state, installationId, code } })
        .then(({ data }) => finish(data.completeGithubInstallation.project))
        .catch(() => {}) // surfaced through `installError`
      return
    }

    authorizeUser({ variables: { state, code } })
      .then(({ data }) => {
        const { choiceToken, installations } = data.authorizeGithubUser
        if (installations.length === 1) return handleSelect(choiceToken, installations[0].id)
        if (installations.length === 0) {
          setMessage(
            "The QA Agent GitHub App isn't installed anywhere you have access to. Ask an organization owner to install it, or use \"Connect GitHub\" to install it on your own account."
          )
          return
        }
        setChoice({ choiceToken, installations })
      })
      .catch(() => {}) // surfaced through `authorizeError`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const error = installError || authorizeError || selectError

  if (choice) {
    return (
      <div className="py-5">
        <div className="text-16 semibold mb-3">Choose the GitHub account or organization to use</div>
        <ErrorComponent error={selectError} />
        <div className="d-flex flex-column gap-2 align-items-start mb-3">
          {choice.installations.map((installation) => (
            <ButtonComponent
              key={installation.id}
              variant="outline-primary"
              loading={selecting}
              onClick={() => handleSelect(choice.choiceToken, installation.id)}
            >
              {installation.accountLogin} ({installation.accountType === 'Organization' ? 'organization' : 'personal'})
            </ButtonComponent>
          ))}
        </div>
        <Link to="/projects">Back to projects</Link>
      </div>
    )
  }

  if (!message && !error) return <Loading />

  return (
    <div className="py-5">
      {message ? <div className="mb-3">{message}</div> : <ErrorComponent error={error} />}
      <Link to="/projects">Back to projects</Link>
    </div>
  )
}
