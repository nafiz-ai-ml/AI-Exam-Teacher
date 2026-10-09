/**
 * Client-side PDF to Image Renderer
 * Renders PDF pages to compressed JPEG images in the browser using HTML5 Canvas.
 * No external server binaries required.
 */

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export async function renderPdfToImages(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPdfPage[]> {
  const pdfjs = await import('pdfjs-dist/build/pdf');

  // Configure worker for client-side rendering
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  if (numPages > 15) {
    throw new Error('PDF নথিতে সর্বোচ্চ ১৫টি পৃষ্ঠা সমর্থিত। অনুগ্রহ করে ১৫ পৃষ্ঠার কম সাইজের PDF দিন।');
  }

  const pages: RenderedPdfPage[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      onProgress(pageNum, numPages);
    }

    const page = await pdf.getPage(pageNum);
    const initialViewport = page.getViewport({ scale: 1.0 });

    // Target a max width of 1600px for crisp handwriting while keeping payload compact
    const scale = Math.min(1600 / initialViewport.width, 2.0);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas rendering context তৈরি করা যায়নি।');
    }

    // Fill white background for PDF transparent backgrounds
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert to compressed JPEG (0.84 quality keeps crisp handwriting at ~250KB per page)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.84);

    pages.push({
      pageNumber: pageNum,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    });
  }

  return pages;
}
