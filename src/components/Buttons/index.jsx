import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

export const ButtonComponent = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
    >
      {loading && <Spinner animation="border" size="sm" className="me-2" />}
      {children}
    </Button>
  )
}
