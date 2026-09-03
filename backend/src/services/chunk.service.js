const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

export const createChunks = (text) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === text.length) {
      break;
    }

    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};
