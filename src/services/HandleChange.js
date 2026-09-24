// Generic controlled-input onChange helper for useState-based forms:
// const [form, setForm] = useState({ email: "", password: "" })
// <input name="email" onChange={(e) => HandleChange(e, setForm)} />
export const HandleChange = (e, setState) => {
  const { name, value } = e.target
  setState((prev) => ({ ...prev, [name]: value }))
}
