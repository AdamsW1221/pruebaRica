export function parseImageUrl(url: string | null | undefined): string {
  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%234066B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E"
  if (!url) return placeholder

  if (url.includes('google.') && (url.includes('imgurl=') || url.includes('imgrefurl='))) {
    try {
      const urlObj = new URL(url)
      const imgUrlParam = urlObj.searchParams.get('imgurl')
      if (imgUrlParam) {
        return decodeURIComponent(imgUrlParam)
      }
    } catch {

    }
  }

  return url
}
