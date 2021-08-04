const icons = {
  'file-access': [],
  'file-archive': ['zip', '7z', 'rar', 'tar', 'tar.gz', 'tar.xz'],
  'file-audio': ['mp3', 'flac'],
  'file-excel': ['xls', 'xlsx'],
  'file-image': ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
  'file-onenote': [],
  'file-pdf': ['pdf'],
  'file-powerpoint': ['ppt', 'pptx'],
  'file-publisher': [],
  'file-video': ['mp4', 'mkv', 'avi'],
  'file-word': ['doc', 'docx']
}

const iconsMap = Object.entries(icons).reduce((map, [key, exts]) => {
  exts.forEach(ext => map.set(ext, key))
  return map
}, new Map<string, string>())

export default function getFileIcon (fileName: string): string {
  return iconsMap.get(fileName.toLowerCase().split('.').pop() ?? '') || 'file'
}
