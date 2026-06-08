import { Link } from 'react-router-dom'

function getStatusClass(status) {
  if (status === 'Pending') return 'badge badge-pending'
  if (status === 'Interview') return 'badge badge-interview'
  if (status === 'Hired') return 'badge badge-hired'
  if (status === 'Rejected') return 'badge badge-rejected'
  return 'badge'
}

function ApplicantTable({ applicants }) {
  if (applicants.length === 0) {
    return <p className="empty-msg">No applicants found.</p>
  }

  return (
    <table className="applicant-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Position</th>
          <th>Status</th>
          <th>Applied</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((person) => (
          <tr key={person.id}>
            <td>{person.full_name}</td>
            <td>{person.email}</td>
            <td>{person.position}</td>
            <td>
              <span className={getStatusClass(person.status)}>{person.status}</span>
            </td>
            <td>{new Date(person.created_at).toLocaleDateString()}</td>
            <td>
              <Link to={`/applicant/${person.id}`} className="btn-view">
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ApplicantTable
