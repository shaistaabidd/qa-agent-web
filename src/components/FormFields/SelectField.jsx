import Form from 'react-bootstrap/Form'

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  includeBlank = true,
  blankLabel = 'All',
}) => {
  return (
    <Form.Group className="mb-3" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select name={name} value={value} onChange={onChange}>
        {includeBlank && <option value="">{blankLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}
