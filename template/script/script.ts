const $search = document.querySelector<HTMLInputElement>('#search')
const $files = document.querySelector('#files')

$search?.addEventListener('keyup', () => {
  const value = $search.value
  const children = Array.from($files?.children ?? [])

  children.forEach(el => {
    const name = el.getAttribute('data-name')
    if (value && name !== '..' && name?.includes(value)) {
      el.classList.add('highlight')
    } else {
      el.classList.remove('highlight')
    }
  })
})
