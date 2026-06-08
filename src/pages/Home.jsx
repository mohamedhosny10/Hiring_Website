import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ApplicantForm from '../components/ApplicantForm.jsx'
import ApplicantTable from '../components/ApplicantTable.jsx'

function Home() {
  const [applicants, setApplicants] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadApplicants() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setApplicants(data)
  }

  useEffect(() => {
    loadApplicants()
  }, [statusFilter])

  function handleAdded() {
    setShowForm(false)
    loadApplicants()
  }

  const filtered =
    statusFilter === 'All'
      ? applicants
      : applicants.filter((a) => a.status === statusFilter)

  return (
    <div className="page">
      <nav className="navbar">
        <Link to="/">
          <img src="/Megasoft.png" alt="Megasoft" className="logo" />
        </Link>
        <h1>Hiring Tracker</h1>
      </nav>

      <main className="container">
        <div className="stats-cards">
          <div className="stat-card stat-total">
            <span>Total</span>
            <strong>{applicants.length}</strong>
          </div>
          <div className="stat-card stat-interview">
            <span>Interview</span>
            <strong>{applicants.filter((a) => a.status === 'Interview').length}</strong>
          </div>
          <div className="stat-card stat-hired">
            <span>Hired</span>
            <strong>{applicants.filter((a) => a.status === 'Hired').length}</strong>
          </div>
          <div className="stat-card stat-rejected">
            <span>Rejected</span>
            <strong>{applicants.filter((a) => a.status === 'Rejected').length}</strong>
          </div>
        </div>

        <div className="toolbar">
          <label className="filter-label">
            Filter by status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <button
            type="button"
            className="btn-toggle"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Hide Form' : 'Add Applicant'}
          </button>
        </div>

        {showForm && <ApplicantForm onAdded={handleAdded} />}

        {error && <p className="error-msg">{error}</p>}
        {loading && <p className="loading-msg">Loading applicants...</p>}
        {!loading && !error && <ApplicantTable applicants={filtered} />}
      </main>
    </div>
  )
}

export default Home
