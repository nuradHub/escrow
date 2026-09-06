import { useState } from 'react'
import { Trash2, Edit3, X, Check, Building2 } from 'lucide-react'
import axios from 'axios'
import { fetchAllUsers } from '../../api'

const AdminUsersContent = ({ loading, users, error, setUsers, setAdmins }) => {
  const [editingUserId, setEditingUserId] = useState(null)
  const [selectedRole, setSelectedRole] = useState('seller')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const handleStartEdit = (user) => {
    setEditingUserId(user._id || user.id)
    setSelectedRole(user.role || 'user')
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
  }

  const handleSaveRole = async (userId) => {
    setActionLoadingId(userId)
    try {
      const response = await axios.put('/admin/user/role', { userId, role: selectedRole })
      const updatedUser = response.data.user

      if (setUsers) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => ((u._id || u.id) === userId ? { ...u, role: updatedUser.role } : u))
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
      setEditingUserId(null)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName || 'this user'} entirely from the database?`)) {
      setActionLoadingId(userId)
      try {
        await axios.delete('/admin/user', { data: { userId } })

        if (setUsers) {
          setUsers((prevUsers) => prevUsers.filter((u) => (u._id || u.id) !== userId))
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform users</h2>
        <p className="text-slate-500 text-xs">Displaying all registered users stored in the database with their profiles and payout destinations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <p className="py-14 text-center text-xs text-slate-400">Loading users database…</p>}
        {error && <p className="py-14 text-center text-xs text-rose-600">{error}</p>}
        {!loading && !error && users?.length === 0 && (
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
                  <th className="py-3 px-4">Payout Account Details</th>
                  <th className="py-3 px-4 text-right">Time Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => {
                  const userId = u._id || u.id
                  const isEditing = editingUserId === userId
                  const isProcessing = actionLoadingId === userId
                  const bank = u.bankDetails

                  return (
                    <tr key={userId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{u.name || 'Unnamed User'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-slate-500 capitalize"
                            >
                              <option value="admin">Admin</option>
                              <option value="seller">Seller</option>
                              <option value="buyer">Buyer</option>
                            </select>
                            <button
                              disabled={isProcessing}
                              onClick={() => handleSaveRole(userId)}
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
                          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 capitalize">
                            {u.role || 'user'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {bank && bank.accountNumber ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-indigo-600" />
                              {bank.bankName} ({bank.accountNumber})
                            </p>
                            <p className="text-[11px] text-slate-400">{bank.accountName} {bank.bankCode ? `· Code: ${bank.bankCode}` : ''}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No account added</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isProcessing ? (
                          <span className="text-slate-400 text-[11px] italic">Saving...</span>
                        ) : (
                          <div className="inline-flex items-center gap-2 justify-end">
                            {!isEditing && (
                              <button
                                onClick={() => handleStartEdit(u)}
                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                                title="Edit Role"
                              >
                                <Edit3 className="h-3 w-3" /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(userId, u.name)}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                              title="Delete User"
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

export default AdminUsersContent