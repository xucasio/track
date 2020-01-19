import defaultSettings from '@/settings'

const title = defaultSettings.title || '机车乘务标准化'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
