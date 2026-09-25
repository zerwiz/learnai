// One place for the site's outbound links. Configuration resolves from env
// with one documented default (RULES/07).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://learn.zerwiz.org'

export const REPO_URL = 'https://github.com/zerwiz/learnai'
export const DISCUSSIONS_URL = `${REPO_URL}/discussions`
export const ISSUES_URL = `${REPO_URL}/issues/new/choose`

// Support: the Allfather's tip jar.
export const SUPPORT_URL =
  process.env.NEXT_PUBLIC_SUPPORT_URL ?? 'https://ko-fi.com/zerwiz'
