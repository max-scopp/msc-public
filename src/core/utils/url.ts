
export function getUrl(url: string, root: string) {
  // Don't allow double slashes
  if (url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
    return root.slice(0, root.length - 1) + url;
  }
  return root + url;
}

export function createObjectURL(blob: Blob) {
  return URL.createObjectURL(blob);
}
