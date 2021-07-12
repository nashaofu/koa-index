export default function joinUrlPath (...args: string[]): string {
  let path = ''
  for (let i = 0; i < args.length; i++) {
    const segment = args[i]
    if (typeof segment !== 'string') {
      throw new TypeError('Arguments to joinUrlPath must be strings')
    }
    if (segment) {
      if (!path) {
        path += segment
      } else {
        path += `/${segment}`
      }
    }
  }

  const stack = []
  const paths = path.split('/')

  // 处理为空、“..”与“.”的情况
  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i]
    if (segment === '..') {
      if (stack.length && stack[stack.length - 1] !== '..') {
        stack.pop()
      } else {
        stack.push(segment)
      }
    } else if (segment !== '' && segment !== '.') {
      stack.push(segment)
    }
  }

  const prefix = path.startsWith('/') ? '/' : ''
  const suffix = stack.length && path.endsWith('/') ? '/' : ''

  return `${prefix}${stack.join('/')}${suffix}`
}
