import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const CompileView = ({ groupId, images }) => {

    const [show, setShow] = useState(false);

    function handleShow() {
        setShow(true);
    }

    function handleClose() {
        setShow(false);
    }

    return (
        <>
            <Button variant="primary" onClick={() => handleShow()}>
                Compiled notes
            </Button>

            <Modal className="notes-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{groupId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {images.map((img) => (
                    <p>{img["text"]}</p>
                ))}

                </Modal.Body>
            </Modal>

        </>
    )

}

export default CompileView;