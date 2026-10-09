declare module 'pdfjs-dist/build/pdf' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(src: any): {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getViewport: (params: { scale: number }) => {
          width: number;
          height: number;
        };
        render: (params: {
          canvasContext: CanvasRenderingContext2D;
          viewport: any;
        }) => {
          promise: Promise<void>;
        };
      }>;
    }>;
  };
}

declare module 'pdfjs-dist' {
  const pdfjs: any;
  export default pdfjs;
}
