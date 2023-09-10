const binaryToBase64 = binary => {
  const uint8Array = new Uint8Array(binary)
  let base64 = ''

  uint8Array.forEach(byte => base64 += String.fromCharCode(byte))

  return btoa(base64)
}

export { binaryToBase64 }