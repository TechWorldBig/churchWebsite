import { useEffect, useState } from 'react'
import { Mail, Phone, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { Member, MEMBERS_STORAGE_KEY, readStored } from '../data/memberStore'

export default function Members() {
  const [members, setMembers] = useState<Member[]>(() => readStored<Member[]>(MEMBERS_STORAGE_KEY, []))

  useEffect(() => {
    const refreshMembers = () => setMembers(readStored<Member[]>(MEMBERS_STORAGE_KEY, []))
    window.addEventListener('storage', refreshMembers)
    return () => window.removeEventListener('storage', refreshMembers)
  }, [])

  return <><PageHero eyebrow="Our people" title="YDM Members" description="Meet the young people serving together with different gifts and one purpose — to glorify Christ and strengthen the youth community." icon={<Users size={15} />} /><section className="py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8">
    {members.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Member profiles added by the administrator will appear here.</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{members.map((member, index) => <motion.article key={member.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="soft-card overflow-hidden p-0"><div className="h-52 bg-[#071f19]">{member.photo ? <img src={member.photo} alt={member.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-5xl font-black text-[#e3bc62]">{member.name.slice(0, 2).toUpperCase()}</div>}</div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">{member.role}</p><h2 className="mt-2 text-2xl font-black">{member.name}</h2>{member.focus && <p className="mt-3 text-sm leading-7 text-slate-600">{member.focus}</p>}<div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">{member.email && <p className="flex items-center gap-2"><Mail size={15} /> {member.email}</p>}{member.phone && <p className="flex items-center gap-2"><Phone size={15} /> {member.phone}</p>}{member.address && <p>{member.address}</p>}</div></div></motion.article>)}</div>}
    <div className="mt-10 rounded-3xl bg-[#071f19] p-7 text-center text-white"><p className="eyebrow text-[#e3bc62]">Join the community</p><p className="mt-2 text-lg font-bold">There is a place for your gifts, your questions and your story.</p></div>
  </div></section></>
}
