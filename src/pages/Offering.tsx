import PageHero from '../components/PageHero'
import { HeartHandshake, Sparkles } from 'lucide-react'

export default function Offering() {
  return (
    <>
      <PageHero
        eyebrow="Offering"
        title="Give as an act of worship"
        description="Offering is one way we thank Jesus for His grace and join in the work of the ministry."
        icon={<HeartHandshake size={15} />}
      />

      <section className="py-16 sm:py-20">
        <div className="content-wrap max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_.95fr]">
              <div className="min-w-0 bg-[#071f19] p-6 text-white sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e3bc62]">
                  <Sparkles size={14} />
                  Meaningful verse
                </div>
                <h2 className="offering-verse mt-6 text-3xl font-black leading-tight sm:text-4xl">
                  "ஒவ்வொருவனும் தன் மனதில் தீர்மானித்தபடியே கொடுக்கட்டும்;
                  மனக்கசப்போடு அல்ல, கட்டாயத்தோடும் அல்ல; ஏனெனில் தேவன்
                  மகிழ்ச்சியுடன் கொடுப்பவனை நேசிக்கிறார்."
                </h2>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
                  2 Corinthians 9:7
                </p>
                <p className="mt-6 max-w-2xl leading-8 text-white/70">
                  We give willingly, with gratitude and joy, trusting Jesus with what we place in His hands.
                </p>
              </div>

              <div className="offering-qr-panel grid place-items-center bg-stone-50 p-5 sm:p-8">
                <img
                  src="/assets/offering-screenshot.jpeg"
                  alt="Offering QR code screenshot"
                  className="offering-qr max-h-[760px] w-full rounded-[1.5rem] object-contain shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
