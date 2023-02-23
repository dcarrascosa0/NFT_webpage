import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PDFViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handlePrevPage() {
    setPageNumber(pageNumber - 1);
  }

  function handleNextPage() {
    setPageNumber(pageNumber + 1);
  }

  return (
    <div className="pdf-container">
      <div className="pdf-header">
        <button onClick={() => window.history.back()}>Close PDF</button>
      </div>

      <div className="pdf-content">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.log}>
          <Page pageNumber={pageNumber} />
        </Document>

        <div className="pdf-pagination">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <div className="pdf-pagination-buttons">
            <button onClick={handlePrevPage} disabled={pageNumber === 1}>
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={pageNumber === numPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
