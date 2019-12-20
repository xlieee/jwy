export function splitByTitle (value, arg1) {
  if (!value) return 0
  return value.length <= arg1 ? value : (value.slice(0, arg1) + '...')
}
export function splitByDescription (value, arg1) {
  if (!value) return 0
  return value.length <= arg1 ? value : (value.slice(0, arg1) + '...')
}