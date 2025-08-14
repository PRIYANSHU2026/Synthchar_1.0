// Font utility for React

export function loadFont(fontFamily: string, url: string, descriptors?: FontFaceDescriptors) {
  if (typeof window !== 'undefined') {
    const font = new FontFace(fontFamily, `url(${url})`, descriptors);
    document.fonts.add(font);
    return font.load();
  }
  return Promise.resolve();
}

export const fontSans = {
  variable: '--font-sans',
};

// Load Inter font
export function loadInterFont() {
  return loadFont(
    'Inter', 
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  );
}