import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { CalendarDays, ImagePlus, LockKeyhole, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { createGalleryPhoto, deleteGalleryPhoto, getGallery, updateGalleryPhoto } from '../data/api'
import { GalleryPhoto } from '../data/memberStore'
import { hasAdminSession, startAdminSession } from '../data/adminSession'

const emptyPhoto: Omit<GalleryPhoto, 'id'> = { photo: '', date: new Date().toISOString().slice(0, 10), description: '' }
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'ydm-admin-2026'

export default function AdminGallery({ embedded = false }: { embedded?: boolean }) {
  const [isAuthed, setIsAuthed] = useState(hasAdminSession)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [photo, setPhoto] = useState(emptyPhoto)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const refreshSession = () => setIsAuthed(hasAdminSession())
    window.addEventListener('jsc-admin-session', refreshSession)
    return () => window.removeEventListener('jsc-admin-session', refreshSession)
  }, [embedded])
  useEffect(() => { if (isAuthed) getGallery().then(setPhotos).catch(() => setMessage('Could not load gallery. Check the database connection.')) }, [isAuthed])

  const upload = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setPhoto(current => ({ ...current, photo: String(reader.result) })); reader.readAsDataURL(file) }
  const save = async () => { if (!photo.photo) { setMessage('Choose a photo first.'); return }; const next: GalleryPhoto = { id: editingId || crypto.randomUUID(), ...photo }; try { if (editingId) await updateGalleryPhoto(next); else await createGalleryPhoto(next); setPhotos(current => editingId ? current.map(item => item.id === editingId ? next : item) : [next, ...current]); setPhoto(emptyPhoto); setEditingId(null); if (inputRef.current) inputRef.current.value = ''; setMessage('Gallery photo saved successfully.') } catch { setMessage('Could not save gallery photo. Check the database connection.') } }
  const remove = async (id: string) => { try { await deleteGalleryPhoto(id); setPhotos(current => current.filter(item => item.id !== id)); setMessage('Gallery photo removed successfully.') } catch { setMessage('Could not remove gallery photo.') } }

  if (!isAuthed && !embedded) return <section className="py-20"><div className="mx-auto max-w-md px-5 lg:px-8"><div className="soft-card border border-emerald-100 shadow-lg"><div className="mb-6 flex items-center gap-3"><span className="icon-box"><ShieldCheck size={20} /></span><div><p className="eyebrow">Admin gallery</p><h1 className="mt-1 text-2xl font-black">Sign in to continue</h1></div></div><div className="grid gap-4"><label className="field-label">Username<input value={username} onChange={event => setUsername(event.target.value)} className="field" /></label><label className="field-label">Password<input value={password} onChange={event => setPassword(event.target.value)} type="password" className="field" onKeyDown={event => event.key === 'Enter' && username === ADMIN_USERNAME && password === ADMIN_PASSWORD && (startAdminSession(), setIsAuthed(true))} /></label><button onClick={() => username === ADMIN_USERNAME && password === ADMIN_PASSWORD && (startAdminSession(), setIsAuthed(true))} className="primary-btn justify-center"><LockKeyhole size={17} /> Enter gallery admin</button></div></div></div></section>

  return <section className={embedded ? 'admin-gallery-inline border-t border-slate-200 bg-white py-8 sm:py-10' : 'py-12 sm:py-16'}><div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8"><div className="mb-5 flex items-center justify-between gap-3"><div><p className="eyebrow">Gallery management</p><h2 className="mt-1 text-2xl font-black">Add gallery photos</h2><p className="mt-1 text-sm text-slate-500">Upload a photo with its date and description.</p></div>{embedded && <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline">Shared with everyone</span>}</div><div className="grid gap-5 lg:grid-cols-[340px_1fr]"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="grid gap-3"><label className="field-label">Photo<input ref={inputRef} type="file" accept="image/*" onChange={upload} className="field file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-700" /></label>{photo.photo && <img src={photo.photo} alt="Selected gallery" className="h-36 w-full rounded-xl object-cover" />}<label className="field-label">Date<input type="date" value={photo.date} onChange={event => setPhoto(current => ({ ...current, date: event.target.value }))} className="field" /></label><label className="field-label">Description<textarea value={photo.description} onChange={event => setPhoto(current => ({ ...current, description: event.target.value }))} className="field min-h-20 resize-none" placeholder="Describe this moment" /></label><div className="flex gap-2"><button onClick={() => void save()} className="primary-btn flex-1 justify-center"><ImagePlus size={16} /> {editingId ? 'Save changes' : 'Upload photo'}</button>{editingId && <button onClick={() => { setEditingId(null); setPhoto(emptyPhoto) }} className="secondary-dark-btn">Cancel</button>}</div>{message && <p className="text-sm text-emerald-700">{message}</p>}</div></div><div className="grid gap-4 sm:grid-cols-2">{photos.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 sm:col-span-2">No gallery photos uploaded yet.</div> : photos.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={item.photo} alt={item.description || 'Gallery photo'} className="h-40 w-full object-cover" /><div className="p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700">{item.date}</p>{item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}<div className="mt-3 flex gap-2"><button onClick={() => { setEditingId(item.id); setPhoto({ photo: item.photo, date: item.date, description: item.description }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="secondary-dark-btn"><Pencil size={14} /> Edit</button><button onClick={() => void remove(item.id)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"><Trash2 size={14} /> Delete</button></div></div></article>)}</div></div></div></section>
}
