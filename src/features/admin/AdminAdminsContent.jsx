import { useEffect, useState } from "react"

const AdminAdminsContent = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/admins')
      .then((res) => res.json())
      .then((data) => setAdmins(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load system administrators'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">System administrators</h2>
        <p className="text-slate-500 text-xs">Displaying all active working administrators with authorized system oversight permissions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <p className="py-14 text-center text-xs text-slate-400">Loading administrators…</p>}
        {error && <p className="py-14 text-center text-xs text-rose-600">{error}</p>}
        {!loading && !error && admins.length === 0 && (
          <p className="py-14 text-center text-xs text-slate-500">No active administrators found in the database.</p>
        )}

        {!loading && !error && admins.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Admin Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4 text-center">Authorization Level</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {admins.map((adm) => (
                  <tr key={adm._id || adm.email} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{adm.name || 'Administrator'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{adm.email}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                        Super Admin
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">Active</td>
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

export default AdminAdminsContent