import { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import './Card.css';
import MyWeb3Storage from './MyWeb3Storage';





pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

function Card(props) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    async function fetchPdf() {
      const web3Storage = new MyWeb3Storage();
      try {
        const file = await web3Storage.retrieveFiles(props.pdfUrl);

        // Create a new instance of FileReader
        const reader = new FileReader();

        // Define a function to handle the onload event of the FileReader
        reader.onload = () => {
          const arrayBuffer = reader.result;

          // Create a new Blob object with the file contents and set its type to "application/pdf"
          const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });

          const pdfUrl = URL.createObjectURL(pdfBlob);
          const loadingTask = pdfjs.getDocument({ url: pdfUrl });

          loadingTask.promise.then((pdf) => {
            const canvasList = Array.from({ length: pdf.numPages });
            const pagePromises = [];

            for (let i = 1; i <= pdf.numPages; i++) {
              pagePromises.push(pdf.getPage(i));
            }

            Promise.all(pagePromises).then((pages) => {
              pages.forEach((page, index) => {
                const canvas = document.createElement("canvas");
                const viewport = page.getViewport({ scale: 1.0 });
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                context.scale(1.0, 1.0);
                page.render({ canvasContext: context, viewport }).promise.then(
                  () => {
                    canvasList[page.pageNumber - 1] = canvas;
                    if (canvasList.every((canvas) => canvas)) {
                      setPdfUrl(canvasList);
                    }
                  }
                );
              });
            });
          });
        };

        // Read the contents of the File object as an ArrayBuffer
        reader.readAsArrayBuffer(file);

        return () => {
          URL.revokeObjectURL(pdfUrl);
        };
      } catch (error) {
        console.error(error);
        // handle error here
      }
    }

    fetchPdf();
  }, [props.pdfUrl]);



  useEffect(() => {
    document.addEventListener("mousedown", handleCloseModal);
    return () =>
      document.removeEventListener("mousedown", handleCloseModal);
  }, []);

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <div
          className="card-image"
          style={{
            backgroundImage: `url(${pdfUrl ? pdfUrl[0].toDataURL("image/jpeg") : props.image
              })`,
          }}
        >
        </div>
        <div className='card-footer'>
          <div className="card-name">{props.name}</div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            {pdfUrl &&
              pdfUrl.map((canvas, index) => (
                <img
                  src={canvas.toDataURL("image/jpeg")}
                  key={index}
                  alt={`Page ${index + 1}`}
                  style={{ display: "block", marginBottom: "20px" }}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
}


export default Card;





