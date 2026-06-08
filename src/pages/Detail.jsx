import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState(null)
  const [status, setStatus] = useState('Pending')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    async function loadApplicant() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('id', id)
        .single()

      setLoading(false)

      if (error) {
        setError(error.message)
        return
      }

      setApplicant(data)
      setStatus(data.status)
      setNotes(data.notes || '')
    }

    loadApplicant()
  }, [id])

  async function handleSave() {
    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('applicants')
      .update({ status: status, notes: notes })
      .eq('id', id)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  if (loading) {
    return (
      <div className="page">
        <main className="container">
          <p className="loading-msg">Loading...</p>
        </main>
      </div>
    )
  }

  if (error && !applicant) {
    return (
      <div className="page">
        <main className="container">
          <p className="error-msg">{error}</p>
          <Link to="/" className="btn-back">
            Back to list
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="navbar">
        <Link to="/">
          <img src="/Megasoft.png" alt="Megasoft" className="logo" />
        </Link>
        <h1>Applicant Detail</h1>
      </nav>

      <main className="container">
        <button type="button" className="btn-back" onClick={() => navigate('/')}>
          Back
        </button>

        <div className="detail-card">
          <h2>{applicant.full_name}</h2>
          <p>
            <strong>Email:</strong> {applicant.email}
          </p>
          <p>
            <strong>Phone:</strong> {applicant.phone || '—'}
          </p>
          <p>
            <strong>Position:</strong> {applicant.position}
          </p>
          <p>
            <strong>Applied:</strong>{' '}
            {new Date(applicant.created_at).toLocaleString()}
          </p>
        </div>

        <div className="detail-form">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label>
            Notes
            <textarea
              rows="6"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview notes, feedback, etc."
            />
          </label>

          {error && <p className="error-msg">{error}</p>}

          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Detail
