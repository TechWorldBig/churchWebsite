export type BibleLanguage = 'en' | 'ta' | 'ml'

type BibleBook = {
  id: string
  name: string
  commonName: string
}

type BibleBooksResponse = {
  books: BibleBook[]
}

type BibleChapterResponse = {
  translation: {
    name: string
    shortName: string
  }
  book: BibleBook
  chapter: {
    content: Array<{
      type: string
      number?: number
      text?: string
    }>
  }
}

type ParsedReference = {
  bookText: string
  chapter: number
  firstVerse: number | null
  lastVerse: number | null
}

const API_BASE = 'https://bible.helloao.org/api'

const translations: Record<BibleLanguage, string> = {
  en: 'ENGWEBP',
  ta: 'tam_irv',
  ml: 'mal_irv',
}

const bibleMessages: Record<BibleLanguage, {
  askReference: string
  unknownBook: string
  invalidReference: string
  invalidRange: string
  missingVerse: string
  unavailable: string
}> = {
  en: {
    askReference: 'Which Bible book, chapter, and verse would you like? For example: Genesis 1:1 or John 3:16.',
    unknownBook: 'I could not recognize that Bible book. Please check the book name and try a reference such as Genesis 1:1.',
    invalidReference: 'Please enter a valid chapter and verse number.',
    invalidRange: 'The ending verse must be after the starting verse.',
    missingVerse: 'I could not find that verse. Please check the chapter and verse numbers.',
    unavailable: 'I could not load that Bible passage right now. Please check your internet connection and try again.',
  },
  ta: {
    askReference: 'எந்த வேதாகமப் புத்தகம், அதிகாரம் மற்றும் வசனம் வேண்டும்? உதாரணம்: ஆதியாகமம் 1:1 அல்லது யோவான் 3:16.',
    unknownBook: 'அந்த வேதாகமப் புத்தகத்தை அடையாளம் காண முடியவில்லை. புத்தகத்தின் பெயரைச் சரிபார்த்து ஆதியாகமம் 1:1 போன்ற குறிப்பை முயற்சிக்கவும்.',
    invalidReference: 'சரியான அதிகாரம் மற்றும் வசன எண்ணை உள்ளிடவும்.',
    invalidRange: 'இறுதி வசன எண் தொடக்க வசன எண்ணுக்குப் பிறகு இருக்க வேண்டும்.',
    missingVerse: 'அந்த வசனத்தைக் கண்டுபிடிக்க முடியவில்லை. அதிகாரம் மற்றும் வசன எண்ணைச் சரிபார்க்கவும்.',
    unavailable: 'இந்த வேதாகமப் பகுதியை இப்போது ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  },
  ml: {
    askReference: 'ഏത് ബൈബിൾ പുസ്തകം, അധ്യായം, വാക്യം വേണം? ഉദാഹരണം: ഉല്‍പത്തി 1:1 അല്ലെങ്കിൽ യോഹന്നാൻ 3:16.',
    unknownBook: 'ആ ബൈബിൾ പുസ്തകം തിരിച്ചറിയാനായില്ല. പുസ്തകത്തിന്റെ പേര് പരിശോധിച്ച് ഉല്‍പത്തി 1:1 പോലുള്ള ഒരു റഫറൻസ് നൽകുക.',
    invalidReference: 'ശരിയായ അധ്യായവും വാക്യ നമ്പറും നൽകുക.',
    invalidRange: 'അവസാന വാക്യ നമ്പർ ആദ്യ വാക്യ നമ്പറിന് ശേഷമായിരിക്കണം.',
    missingVerse: 'ആ വാക്യം കണ്ടെത്താനായില്ല. അധ്യായവും വാക്യ നമ്പറും പരിശോധിക്കുക.',
    unavailable: 'ആ ബൈബിൾ ഭാഗം ഇപ്പോൾ ലഭ്യമാക്കാനായില്ല. ഇന്റർനെറ്റ് ബന്ധം പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.',
  },
}

const bookAliases: Array<{ id: string; aliases: string[] }> = [
  { id: 'GEN', aliases: ['genesis', 'gen', 'ge', 'gn'] },
  { id: 'EXO', aliases: ['exodus', 'exod', 'exo', 'ex'] },
  { id: 'LEV', aliases: ['leviticus', 'lev', 'le'] },
  { id: 'NUM', aliases: ['numbers', 'number', 'num', 'nu'] },
  { id: 'DEU', aliases: ['deuteronomy', 'deut', 'deu', 'dt'] },
  { id: 'JOS', aliases: ['joshua', 'josh', 'jos'] },
  { id: 'JDG', aliases: ['judges', 'judg', 'jdg'] },
  { id: 'RUT', aliases: ['ruth', 'rut'] },
  { id: '1SA', aliases: ['1 samuel', '1 sam', 'first samuel', 'i samuel'] },
  { id: '2SA', aliases: ['2 samuel', '2 sam', 'second samuel', 'ii samuel'] },
  { id: '1KI', aliases: ['1 kings', '1 king', '1 kgs', 'first kings', 'i kings'] },
  { id: '2KI', aliases: ['2 kings', '2 king', '2 kgs', 'second kings', 'ii kings'] },
  { id: '1CH', aliases: ['1 chronicles', '1 chron', '1 chr', 'first chronicles', 'i chronicles'] },
  { id: '2CH', aliases: ['2 chronicles', '2 chron', '2 chr', 'second chronicles', 'ii chronicles'] },
  { id: 'EZR', aliases: ['ezra', 'ezr'] },
  { id: 'NEH', aliases: ['nehemiah', 'neh'] },
  { id: 'EST', aliases: ['esther', 'est'] },
  { id: 'JOB', aliases: ['job'] },
  { id: 'PSA', aliases: ['psalms', 'psalm', 'psa', 'ps'] },
  { id: 'PRO', aliases: ['proverbs', 'proverb', 'prov', 'pro', 'pr'] },
  { id: 'ECC', aliases: ['ecclesiastes', 'eccles', 'eccl', 'ecc'] },
  { id: 'SNG', aliases: ['song of solomon', 'song of songs', 'songs', 'canticles', 'song'] },
  { id: 'ISA', aliases: ['isaiah', 'isa'] },
  { id: 'JER', aliases: ['jeremiah', 'jer'] },
  { id: 'LAM', aliases: ['lamentations', 'lam'] },
  { id: 'EZK', aliases: ['ezekiel', 'ezek', 'ezk'] },
  { id: 'DAN', aliases: ['daniel', 'dan'] },
  { id: 'HOS', aliases: ['hosea', 'hos'] },
  { id: 'JOL', aliases: ['joel', 'jol'] },
  { id: 'AMO', aliases: ['amos', 'amo'] },
  { id: 'OBA', aliases: ['obadiah', 'obad', 'oba'] },
  { id: 'JON', aliases: ['jonah', 'jon'] },
  { id: 'MIC', aliases: ['micah', 'mic'] },
  { id: 'NAM', aliases: ['nahum', 'nah', 'nam'] },
  { id: 'HAB', aliases: ['habakkuk', 'hab'] },
  { id: 'ZEP', aliases: ['zephaniah', 'zeph', 'zep'] },
  { id: 'HAG', aliases: ['haggai', 'hag'] },
  { id: 'ZEC', aliases: ['zechariah', 'zech', 'zec'] },
  { id: 'MAL', aliases: ['malachi', 'mal'] },
  { id: 'MAT', aliases: ['matthew', 'matt', 'mat', 'mt'] },
  { id: 'MRK', aliases: ['mark', 'mrk', 'mk'] },
  { id: 'LUK', aliases: ['luke', 'luk', 'lk'] },
  { id: 'JHN', aliases: ['john', 'jhn', 'jn'] },
  { id: 'ACT', aliases: ['acts of the apostles', 'acts', 'act'] },
  { id: 'ROM', aliases: ['romans', 'roman', 'rom', 'ro'] },
  { id: '1CO', aliases: ['1 corinthians', '1 cor', 'first corinthians', 'i corinthians'] },
  { id: '2CO', aliases: ['2 corinthians', '2 cor', 'second corinthians', 'ii corinthians'] },
  { id: 'GAL', aliases: ['galatians', 'gal'] },
  { id: 'EPH', aliases: ['ephesians', 'eph'] },
  { id: 'PHP', aliases: ['philippians', 'philippian', 'phil', 'php'] },
  { id: 'COL', aliases: ['colossians', 'col'] },
  { id: '1TH', aliases: ['1 thessalonians', '1 thess', '1 thes', 'first thessalonians'] },
  { id: '2TH', aliases: ['2 thessalonians', '2 thess', '2 thes', 'second thessalonians'] },
  { id: '1TI', aliases: ['1 timothy', '1 tim', 'first timothy'] },
  { id: '2TI', aliases: ['2 timothy', '2 tim', 'second timothy'] },
  { id: 'TIT', aliases: ['titus', 'tit'] },
  { id: 'PHM', aliases: ['philemon', 'philem', 'phm'] },
  { id: 'HEB', aliases: ['hebrews', 'hebrew', 'heb'] },
  { id: 'JAS', aliases: ['james', 'jas', 'jam'] },
  { id: '1PE', aliases: ['1 peter', '1 pet', 'first peter', 'i peter'] },
  { id: '2PE', aliases: ['2 peter', '2 pet', 'second peter', 'ii peter'] },
  { id: '1JN', aliases: ['1 john', '1 jn', 'first john', 'i john'] },
  { id: '2JN', aliases: ['2 john', '2 jn', 'second john', 'ii john'] },
  { id: '3JN', aliases: ['3 john', '3 jn', 'third john', 'iii john'] },
  { id: 'JUD', aliases: ['jude', 'jud'] },
  { id: 'REV', aliases: ['revelation', 'revelations', 'rev'] },
]

function normalizeBookName(value: string): string {
  return value.toLocaleLowerCase().replace(/[.,!?]/g, ' ').replace(/\s+/g, ' ').trim()
}

function endsWithBookName(value: string, bookName: string): boolean {
  return value === bookName || value.endsWith(` ${bookName}`)
}

function detectLanguage(input: string, fallback: BibleLanguage): BibleLanguage {
  const lower = input.toLocaleLowerCase()
  if (/[\u0D00-\u0D7F]/u.test(input) || lower.includes('malayalam')) return 'ml'
  if (/[\u0B80-\u0BFF]/u.test(input) || lower.includes('tamil')) return 'ta'
  if (lower.includes('english')) return 'en'
  return fallback
}

function parseReference(input: string): ParsedReference | null {
  const verseMatch = /(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?/u.exec(input)
  if (verseMatch) {
    return {
      bookText: input.slice(0, verseMatch.index),
      chapter: Number(verseMatch[1]),
      firstVerse: Number(verseMatch[2]),
      lastVerse: verseMatch[3] ? Number(verseMatch[3]) : Number(verseMatch[2]),
    }
  }

  const chapterMatch = /(\d+)(?![\s\S]*\d)/u.exec(input)
  if (!chapterMatch) return null

  return {
    bookText: input.slice(0, chapterMatch.index),
    chapter: Number(chapterMatch[1]),
    firstVerse: null,
    lastVerse: null,
  }
}

function resolveEnglishBook(bookText: string): string | null {
  const normalized = normalizeBookName(bookText)
  const candidates = bookAliases
    .flatMap((book) => book.aliases.map((alias) => ({ id: book.id, alias })))
    .sort((a, b) => b.alias.length - a.alias.length)

  return candidates.find((candidate) => endsWithBookName(normalized, candidate.alias))?.id ?? null
}

async function resolveLocalizedBook(bookText: string, translation: string): Promise<string | null> {
  const response = await fetch(`${API_BASE}/${translation}/books.json`)
  if (!response.ok) throw new Error('Could not load Bible books')

  const data = await response.json() as BibleBooksResponse
  const normalized = normalizeBookName(bookText)
  const candidates = data.books
    .flatMap((book) => [book.name, book.commonName].map((name) => ({ id: book.id, name: normalizeBookName(name) })))
    .filter((candidate) => candidate.name)
    .sort((a, b) => b.name.length - a.name.length)

  return candidates.find((candidate) => endsWithBookName(normalized, candidate.name))?.id ?? null
}

export function isBibleRequest(input: string): boolean {
  const lower = input.toLocaleLowerCase()
  const reference = parseReference(input)
  const requestsTopicAnswer = ['preach', 'preaching', 'sermon', 'missionary', 'missionaries', 'topic', 'outline', 'points', 'பிரசங்க', 'மிஷனரி', 'தலைப்பு', 'പ്രസംഗ', 'മിഷനറി', 'വിഷയം']
    .some((term) => lower.includes(term))
  if (requestsTopicAnswer) return false

  const asksForExplanation = ['explain', 'meaning', 'mean', 'context', 'why', 'how', 'lesson', 'விளக்க', 'அர்த்தம்', 'എന്താണ്', 'അർത്ഥം', 'വിശദീകര']
    .some((term) => lower.includes(term))
  const recognizedReference = reference !== null
    && (resolveEnglishBook(reference.bookText) !== null || /[\u0B80-\u0BFF\u0D00-\u0D7F]/u.test(reference.bookText))
  if (recognizedReference) return !asksForExplanation

  const mentionsVerse = lower.includes('verse')
    || lower.includes('scripture')
    || lower.includes('வசனம்')
    || lower.includes('വചനം')
  if (mentionsVerse && asksForExplanation && reference === null) return true
  return mentionsVerse && !asksForExplanation
}

export async function getBibleReply(input: string, preferredLanguage: BibleLanguage = 'en'): Promise<string> {
  const parsedReference = parseReference(input)
  const language = detectLanguage(input, preferredLanguage)
  const translation = translations[language]
  const messages = bibleMessages[language]
  if (!parsedReference) return messages.askReference

  const reference: ParsedReference = parsedReference

  try {
    const bookId = resolveEnglishBook(reference.bookText)
      ?? await resolveLocalizedBook(reference.bookText, translation)
    if (!bookId) {
      return messages.unknownBook
    }

    if (reference.chapter < 1 || (reference.firstVerse !== null && reference.firstVerse < 1)) {
      return messages.invalidReference
    }

    if (reference.firstVerse !== null && reference.lastVerse !== null && reference.lastVerse < reference.firstVerse) {
      return messages.invalidRange
    }

    const response = await fetch(`${API_BASE}/${translation}/${bookId}/${reference.chapter}.simple.json`)
    if (!response.ok) throw new Error('Bible passage was not found')

    const data = await response.json() as BibleChapterResponse
    const verses = data.chapter.content.filter((item) => {
      if (item.type !== 'verse' || typeof item.number !== 'number' || typeof item.text !== 'string') return false
      if (reference.firstVerse === null || reference.lastVerse === null) return true
      return item.number >= reference.firstVerse && item.number <= reference.lastVerse
    })

    if (verses.length === 0) {
      return messages.missingVerse
    }

    const versePart = reference.firstVerse === null
      ? ''
      : `:${reference.firstVerse}${reference.lastVerse !== reference.firstVerse ? `-${reference.lastVerse}` : ''}`
    const passage = verses.map((verse) => `${verse.number}. ${verse.text}`).join('\n')

    return `${data.book.name} ${reference.chapter}${versePart}\n${passage}\n\n${data.translation.name}`
  } catch {
    return messages.unavailable
  }
}
