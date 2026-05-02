declare module 'html2pdf.js' {
  interface Worker {
    from(src: HTMLElement | string): Worker;
    set(options: any): Worker;
    save(filename?: string): Promise<void>;
    toPdf(): Worker;
    then(onFulfilled?: (pdf: any) => void, onRejected?: (error: any) => void): Worker;
    catch(onRejected?: (error: any) => void): Worker;
  }

  function html2pdf(): Worker;
  export default html2pdf;
}
