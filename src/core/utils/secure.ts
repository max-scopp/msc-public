export function decrypt(salt, ...parts) {
  return parts.map((v) => atob(v).split(`${salt}:`)[1]).join('').match(/.{2}/g).map((k) => String.fromCharCode(parseInt(k, 36)))
    .join('');
}

// let's hope this will get removed when building for prod
export function encrypt(string, salt) {
  return string
    .split('')
    .map((char) => char.charCodeAt(0).toString(36).padStart(2, '0'))
    .join('')
    .match(/.{0,24}/g)
    .map((v) => btoa(`${salt}:${v}`).replace(/==$/, ''));
}
