import { useState } from 'react'
import { Trash2, Edit3, X, Check } from 'lucide-react'
import axios from 'axios'
import { fetchAllUsers } from '../../api'

const AdminAdminsContent = ({ loading, admins, error, setUsers, setAdmins }) => {
  const [editingAdminId, setEditingAdminId] = useState(null)
  const [selectedRole, setSelectedRole] = useState('admin')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const handleStartEdit = (adm) => {
    setEditingAdminId(adm._id || adm.id)
    setSelectedRole(adm.role || 'admin')
  }

  const handleCancelEdit = () => {
    setEditingAdminId(null)
  }

  const handleSaveRole = async (adminId) => {
    setActionLoadingId(adminId)
    try {
      const response = await axios.put('/admin/user/role', { userId: adminId, role: selectedRole })
      const updatedAdmin = response.data.user

      if (setAdmins) {
        setAdmins((prevAdmins) =>
          prevAdmins.map((a) => ((a._id || a.id) === adminId ? { ...a, role: updatedAdmin.role } : a))
        )
      }
      const fetchUsers = await fetchAllUsers()
      const user = fetchUsers.filter((f) => f.role === 'buyer' || f.role === 'seller')
      const admin = fetchUsers.filter((f) => f.role === 'admin')
      setUsers(user)
      setAdmins(admin)
    } catch (err) {
      console.error(err.response?.data?.message || err.message)
    } finally {
      setActionLoadingId(null)
      setEditingAdminId(null)
    }
  }

  const handleDelete = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to delete ${adminName || 'this administrator'} entirely from the backend?`)) {
      setActionLoadingId(adminId)
      try {
        await axios.delete('/admin/user', { data: { userId: adminId } })

        if (setAdmins) {
          setAdmins((prevAdmins) => prevAdmins.filter((a) => (a._id || a.id) !== adminId))
        }
      } catch (err) {
        console.error(err.response?.data?.message || err.message)
      } finally {
        setActionLoadingId(null)
      }
    }
  }

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
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {admins.map((adm) => {
                  const adminId = adm._id || adm.id
                  const isEditing = editingAdminId === adminId
                  const isProcessing = actionLoadingId === adminId

                  return (
                    <tr key={adminId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{adm.name || 'Administrator'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{adm.email}</td>
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-slate-500 capitalize"
                            >
                              <option value="admin">Admin</option>
                              <option value="buyer">Buyer</option>
                              <option value="seller">Seller</option>
                            </select>
                            <button
                              disabled={isProcessing}
                              onClick={() => handleSaveRole(adminId)}
                              className="p-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                              title="Save role"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              disabled={isProcessing}
                              onClick={handleCancelEdit}
                              className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 capitalize">
                            {adm.role || 'Super Admin'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">Active</td>
                      <td className="py-3.5 px-4 text-right">
                        {isProcessing ? (
                          <span className="text-slate-400 text-[11px] italic">Processing...</span>
                        ) : (
                          <div className="inline-flex items-center gap-2 justify-end">
                            {!isEditing && (
                              <button
                                onClick={() => handleStartEdit(adm)}
                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                                title="Edit Role"
                              >
                                <Edit3 className="h-3 w-3" /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(adminId, adm.name)}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                              title="Delete Admin"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAdminsContent