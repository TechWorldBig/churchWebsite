import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Check, Download, LockKeyhole, Pencil, Plus, Search, ShieldCheck, Trash2, UserCog, UserPlus, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import { AttendanceRecord, ATTENDANCE_STORAGE_KEY, Member, MEMBERS_STORAGE_KEY, readStored, SYSTEM_UPDATED_STORAGE_KEY } from '../data/memberStore'
import { createAttendance, createMember, deleteAttendance, deleteMember, getAttendance, getMembers, updateAttendance, updateMember as saveMemberToApi } from '../data/api'

const AUTH_KEY = 'jsc-ydm-admin-auth'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'ydm-admin-2026'
const emptyMember: Omit<Member, 'id'> = { name: '', role: '', email: '', phone: '', address: '', dateOfBirth: '', focus: '', photo: '' }

const uniqueMembers = (items: Member[]) => Array.from(new Map(items.map(item => [item.name.trim().toLowerCase(), item])).values())
const uniqueRecords = (items: AttendanceRecord[]) => Array.from(new Map(items.map(item => [`${item.memberId || item.name.trim().toLowerCase()}-${item.date}`, item])).values())

export default function Admin() {
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === 'true')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [member, setMember] = useState(emptyMember)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [memberId, setMemberId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'present' | 'absent'>('present')
  const [memberMessage, setMemberMessage] = useState('')
  const [attendanceMessage, setAttendanceMessage] = useState('')
  const [query, setQuery] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => localStorage.setItem(AUTH_KEY, String(isAuthed)), [isAuthed])
  useEffect(() => {
    if (!isAuthed) return
    Promise.all([getMembers(), getAttendance()]).then(([savedMembers, savedRecords]) => {
      setMembers(uniqueMembers(savedMembers))
      setRecords(uniqueRecords(savedRecords))
    }).catch(() => {
      setMembers(uniqueMembers(readStored<Member[]>(MEMBERS_STORAGE_KEY, [])))
      setRecords(uniqueRecords(readStored<AttendanceRecord[]>(ATTENDANCE_STORAGE_KEY, [])))
    })
  }, [isAuthed])

  const filtered = useMemo(() => { const term = query.toLowerCase(); return records.filter(r => r.name.toLowerCase().includes(term) || r.date.includes(term)) }, [records, query])
  const updateMember = (key: keyof typeof emptyMember, value: string) => setMember(current => ({ ...current, [key]: value }))
  const touchUpdated = () => localStorage.setItem(SYSTEM_UPDATED_STORAGE_KEY, new Date().toISOString())
  const uploadPhoto = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => updateMember('photo', String(reader.result)); reader.readAsDataURL(file) }

  const saveMember = () => {
    if (!member.name.trim()) { setMemberMessage('Enter a member name first.'); return }
    const duplicate = members.some(item => item.id !== editingId && item.name.trim().toLowerCase() === member.name.trim().toLowerCase())
    if (duplicate) { setMemberMessage('This member is already saved.'); return }
    const saved = { ...member, name: member.name.trim(), role: member.role.trim() || 'YDM Member' }
    const next = { id: editingId || crypto.randomUUID(), ...saved }
    const request = editingId ? saveMemberToApi(next) : createMember(next)
    request.then(() => {
      setMembers(current => editingId ? current.map(item => item.id === editingId ? next : item) : [next, ...current])
      setMember(emptyMember); setEditingId(null); setMemberMessage('Member saved successfully.'); touchUpdated()
    }).catch(() => setMemberMessage('Could not save member. Check the database connection.'))
  }
  const editMember = (item: Member) => { const { id: _id, ...details } = item; setMember(details); setEditingId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const removeMember = (id: string) => { deleteMember(id).then(() => { setMembers(current => current.filter(item => item.id !== id)); setRecords(current => current.filter(record => record.memberId !== id)); touchUpdated() }).catch(() => setMemberMessage('Could not remove member.')) }
  const addAttendance = () => {
    const selected = members.find(item => item.id === memberId)
    if (!selected) { setAttendanceMessage('Select a member before adding attendance.'); return }
    const existing = records.find(record => record.memberId === selected.id && record.date === date)
    const record = { id: existing?.id || crypto.randomUUID(), memberId: selected.id, name: selected.name, date, present: status === 'present', note: note.trim() }
    createAttendance(record).then(() => {
      setRecords(current => existing ? current.map(item => item.id === existing.id ? record : item) : [record, ...current])
      setNote(''); setAttendanceMessage('Attendance saved successfully.'); touchUpdated()
    }).catch(() => setAttendanceMessage('Could not save attendance. Check the database connection.'))
  }
  const exportCsv = () => { const rows = [['Name', 'Date', 'Status', 'Note'], ...records.map(r => [r.name, r.date, r.present ? 'Present' : 'Absent', r.note])]; const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'jsc-ydm-attendance.csv'; link.click(); URL.revokeObjectURL(link.href) }
  const handleLogin = () => { if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) { setIsAuthed(true); setUsername(''); setPassword('') } }

  if (!isAuthed) return <section className="py-20"><div className="mx-auto max-w-md px-5 lg:px-8"><div className="soft-card border border-emerald-100 shadow-lg"><div className="mb-6 flex items-center gap-3"><span className="icon-box"><ShieldCheck size={20} /></span><div><p className="eyebrow">Admin access</p><h1 className="mt-1 text-2xl font-black">Sign in to continue</h1></div></div><div className="grid gap-4"><label className="field-label">Username<input value={username} onChange={e => setUsername(e.target.value)} className="field" autoComplete="username" /></label><label className="field-label">Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" className="field" autoComplete="current-password" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></label><button onClick={handleLogin} className="primary-btn justify-center"><LockKeyhole size={17} /> Enter admin area</button></div></div></div></section>

  return <><PageHero eyebrow="Administration" title="Member and attendance management" description="Add complete member profiles, upload photos, and manage attendance records from one place." icon={<UserCog size={15} />} /><section className="admin-page py-10 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8"><div className="mb-5 flex justify-end"><button onClick={() => setIsAuthed(false)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100">Log out</button></div><div className="grid gap-5 lg:grid-cols-[420px_1fr]">
    <aside className="soft-card h-fit"><div className="mb-6 flex items-center gap-3"><span className="icon-box"><UserPlus size={20} /></span><div><h2 className="font-black">{editingId ? 'Edit member' : 'Add member'}</h2><p className="text-xs text-slate-500">All details appear in Attendance</p></div></div><div className="grid gap-3">
      <label className="field-label">Full name<input value={member.name} onChange={e => updateMember('name', e.target.value)} className="field" placeholder="Member name" /></label><label className="field-label">Role<input value={member.role} onChange={e => updateMember('role', e.target.value)} className="field" placeholder="e.g. Youth Leader" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="field-label">Email<input type="email" value={member.email} onChange={e => updateMember('email', e.target.value)} className="field" /></label><label className="field-label">Phone<input value={member.phone} onChange={e => updateMember('phone', e.target.value)} className="field" /></label></div><label className="field-label">Date of birth<input type="date" value={member.dateOfBirth} onChange={e => updateMember('dateOfBirth', e.target.value)} className="field" /></label><label className="field-label">Address<input value={member.address} onChange={e => updateMember('address', e.target.value)} className="field" /></label><label className="field-label">About / ministry focus<textarea value={member.focus} onChange={e => updateMember('focus', e.target.value)} className="field min-h-20 resize-none" /></label><label className="field-label">Profile photo<input ref={photoInputRef} type="file" accept="image/*" onChange={uploadPhoto} className="field file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-700" /></label>{member.photo && <div className="flex items-center gap-3"><img src={member.photo} alt="Selected profile" className="h-24 w-24 rounded-2xl object-cover" /><button type="button" onClick={() => { updateMember('photo', ''); if (photoInputRef.current) photoInputRef.current.value = '' }} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100">Remove photo</button></div>}<div className="flex gap-2"><button onClick={saveMember} className="primary-btn flex-1 justify-center"><Plus size={17} /> {editingId ? 'Save changes' : 'Add member'}</button>{editingId && <button onClick={() => { setEditingId(null); setMember(emptyMember); if (photoInputRef.current) photoInputRef.current.value = ''; setMemberMessage('') }} className="secondary-btn">Cancel</button>}</div>{memberMessage && <p className="text-sm text-emerald-700">{memberMessage}</p>}
    </div></aside>
    <div className="grid gap-5"><div className="soft-card"><div className="mb-5 flex items-center gap-3"><span className="icon-box"><CalendarDays size={20} /></span><div><h2 className="font-black">Add attendance</h2><p className="text-xs text-slate-500">Choose a saved member and status</p></div></div><div className="grid gap-3 md:grid-cols-[1fr_180px_150px_1fr_auto]"><select value={memberId} onChange={e => setMemberId(e.target.value)} className="field"><option value="">Select member</option>{members.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input value={date} onChange={e => setDate(e.target.value)} type="date" className="field" /><select value={status} onChange={e => setStatus(e.target.value as 'present' | 'absent')} className="field"><option value="present">Present</option><option value="absent">Absent</option></select><input value={note} onChange={e => setNote(e.target.value)} className="field" placeholder="Optional note" /><button onClick={addAttendance} className="primary-btn justify-center">Save <Plus size={17} /></button></div>{attendanceMessage && <p className="mt-3 text-sm font-semibold text-emerald-700">{attendanceMessage}</p>}</div>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={e => setQuery(e.target.value)} className="w-full rounded-xl bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none ring-emerald-700 focus:ring-2" placeholder="Search attendance" /></div><button onClick={exportCsv} className="secondary-dark-btn justify-center"><Download size={17} /> Export CSV</button></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-[.12em] text-slate-500"><tr><th className="px-5 py-4">Member</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Note</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.length === 0 ? <tr><td colSpan={5} className="px-5 py-14 text-center text-sm text-slate-400">No attendance records yet.</td></tr> : filtered.map(record => <tr key={record.id} className="text-sm"><td className="px-5 py-4 font-bold">{record.name}</td><td className="px-5 py-4 text-slate-500">{record.date}</td><td className="px-5 py-4"><button onClick={() => { setRecords(current => current.map(item => item.id === record.id ? { ...item, present: !item.present } : item)); touchUpdated() }} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${record.present ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{record.present ? <Check size={13} /> : <X size={13} />} {record.present ? 'Present' : 'Absent'}</button></td><td className="max-w-[220px] truncate px-5 py-4 text-slate-500">{record.note || '—'}</td><td className="px-5 py-4 text-right"><button onClick={() => { setRecords(current => current.filter(item => item.id !== record.id)); touchUpdated() }} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17} /></button></td></tr>)}</tbody></table></div></div>
      <div className="soft-card"><h2 className="mb-4 font-black">Saved members ({members.length})</h2><div className="grid gap-3 sm:grid-cols-2">{members.map(item => <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">{item.photo ? <img src={item.photo} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#071f19] font-black text-[#e3bc62]">{item.name.slice(0, 2).toUpperCase()}</div>}<div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="truncate text-xs text-slate-500">{item.role}</p></div><button onClick={() => editMember(item)} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-emerald-700"><Pencil size={16} /></button><button onClick={() => removeMember(item.id)} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-rose-600"><Trash2 size={16} /></button></div>)}</div>{members.length === 0 && <p className="text-sm text-slate-500">Add your first member using the form.</p>}</div>
    </div>
  </div></div></section></>
}
