// A tab label with an optional count pill. The pill only appears when there's
// something to look at (count > 0); `tone` says how urgent it is.
export const TabTitle = ({ label, count, tone = 'neutral', title }) => (
  <span className="d-inline-flex align-items-center gap-2" title={title}>
    {label}
    {count > 0 && <span className={`qa-tab-count qa-tab-count-${tone}`}>{count}</span>}
  </span>
)

// Danger when anything critical/high is involved, warning for the rest.
export const toneFor = (bySeverity = {}) =>
  (bySeverity.critical || bySeverity.CRITICAL || bySeverity.high || bySeverity.HIGH ? 'danger' : 'warning')
