import { useState, useEffect } from 'react'
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

    let query = supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'All') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

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

  return (
    <div className="page">
      <nav className="navbar">
        <img src="/Megasoft Logo-04.avif" alt="Megasoft" className="logo" />
        <h1>Hiring Tracker</h1>
      </nav>

      <main className="container">
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
        {!loading && !error && <ApplicantTable applicants={applicants} />}
      </main>
    </div>
  )
}

export default Home
