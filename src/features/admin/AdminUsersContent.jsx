import { useEffect, useState } from "react"

const AdminUsersContent = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load database users'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform users</h2>
        <p className="text-slate-500 text-xs">Displaying all registered users stored in the database with their profiles and registration timelines.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <p className="py-14 text-center text-xs text-slate-400">Loading users database…</p>}
        {error && <p className="py-14 text-center text-xs text-rose-600">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="py-14 text-center text-xs text-slate-500">No registered user records found in the database.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-right">Time Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u._id || u.email} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name || 'Unnamed User'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 capitalize">
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsersContent