import React from "react";
import { Toast } from "react-bootstrap";

function Notification({ show, onClose, message, caption }) {
  const backgroundColorClass =
    caption &&
    (caption.toLowerCase().includes("error")
      ? "bg-danger"
      : caption.toLowerCase().includes("warning")
      ? "bg-warning"
      : "");
  const textColorClass =
    caption && (caption.toLowerCase().includes("warning") ? "text-dark" : "");

  return (
    <Toast
      show={show}
      onClose={onClose}
      delay={3000}
      autohide
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
      }}
    >
      {caption && (
        <Toast.Header className={`${backgroundColorClass} ${textColorClass}`}>
          <strong className="me-auto">{caption}</strong>
        </Toast.Header>
      )}
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default Notification;
