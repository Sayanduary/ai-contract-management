import { PDFParse } from "pdf-parse";

export const extractTextFromPdf = async (buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    const text = result.text.replace(/\s+/g, " ").trim();

    if (!text) {
      throw new Error("No text could be extracted from this PDF");
    }

    return {
      text,
      pages: result.total,
    };
  } finally {
    await parser.destroy();
  }
};
