export function dataUrlToFile(dataUrl: string, filename: string): File {
  if (!dataUrl.startsWith('data:')) {
    throw new Error('El string proporcionado no es un DataURL válido.');
  }

  const [metadata, base64] = dataUrl.split(',');
  const mime = metadata.split(':')[1].split(';')[0];

  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new File([array], filename, { type: mime });
}
