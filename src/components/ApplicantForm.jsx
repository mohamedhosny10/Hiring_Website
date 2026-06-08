import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function ApplicantForm({ onAdded }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [positions, setPositions] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPositions() {
      const { data, error } = await supabase
        .from('positions')
        .select('title')
        .order('id')

      if (error) {
        setError('Could not load positions')
        return
      }

      setPositions(data.map((p) => p.title))
      if (data.length > 0) {
        setPosition(data[0].title)
      }
    }

    loadPositions()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('applicants').insert({
      full_name: fullName,
      email: email,
      phone: phone,
      position: position,
    })

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setFullName('')
    setEmail('')
    setPhone('')
    if (positions.length > 0) {
      setPosition(positions[0])
    }
    onAdded()
  }

  return (
    <form className="applicant-form" onSubmit={handleSubmit}>
      <h2>Add Applicant</h2>

      {error && <p className="error-msg">{error}</p>}

      <label>
        Full Name
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Phone
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <label>
        Position
        <select value={position} onChange={(e) => setPosition(e.target.value)} required>
          {positions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Add Applicant'}
      </button>
    </form>
  )
}

export default ApplicantForm
