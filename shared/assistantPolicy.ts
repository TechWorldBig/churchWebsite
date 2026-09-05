// Public policy only. Never import server configuration into this module.
export const SENSITIVE_REPLY = 'Ask church or bible related questions'
export const OUT_OF_SCOPE_REPLY = 'Ask ydm or bible related questions'

export function isSensitiveRequest(input: string): boolean {
  const normalized = input.normalize('NFKC').toLowerCase().replace(/[\u200B-\u200D\uFEFF]/gu, '')
  const compact = normalized.replace(/[^\p{L}\p{N}]/gu, '')
  return [
    'apikey', 'secretkey', 'privatekey', 'accesskey', 'accesstoken',
    'authtoken', 'authenticationtoken', 'bearertoken', 'password', 'credential',
    'databaseurl', 'databaseconnection', 'connectionstring', 'processenv',
    'environmentvariable', 'systemprompt', 'developerinstruction', 'internalinstruction',
    'hiddenprompt', 'serversecret', 'geminikey', 'openaikey',
    'கடவுச்சொல்', 'ரகசியசாவி', 'പാസ്‌വേഡ്'.replace(/\u200C/gu, ''), 'രഹസ്യകീ',
  ].some((term) => compact.includes(term)) || /\.env\b/u.test(normalized)
}

export function isInstructionOverride(input: string): boolean {
  return /(?:ignore|override|disregard|forget|bypass)[\s\S]{0,60}(?:instructions?|rules?|restrictions?|prompts?|scope)|(?:system|developer)\s*:\s*|(?:jailbreak|developer mode)|(?:reveal|print|repeat)[\s\S]{0,30}(?:hidden|instructions|configuration)/iu.test(input.normalize('NFKC'))
}
