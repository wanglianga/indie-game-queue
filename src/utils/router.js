export function push(path) {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  window.location.hash = path;
}

export function getPath() {
  const hash = window.location.hash || '#/';
  return hash.replace('#', '');
}
