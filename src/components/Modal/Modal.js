import "./Modal.css"

function Modal({ show, header, children, onClose, onHide }) {
    return (
      <div 
        style={{display: (show ? 'block' : 'none')}}
        // style={{visibility: (show ? 'visible' : 'hidden')}}
      >
        <div className="modal-overlay"></div>
        <div className="modal">
          <h1>{header}</h1>
          <div>{children}</div>
          <div className="modal-footer">
            <button onClick={onHide}>Hide modal</button>
            <button onClick={onClose}>Close modal</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Modal;
  