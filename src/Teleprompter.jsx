import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Toast,
} from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

function Teleprompter({ showNotification }) {
  const [top, setTop] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [textSize, setTextSize] = useState(16);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [highlightBorder, setHighlightBorder] = useState(false);
  const [showAboutToast, setShowAboutToast] = useState(true);
  const teleprompterRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    setHighlightBorder(false);
    const file = event.dataTransfer.files[0];

    if (file.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = function (e) {
        const fileText = e.target.result;
        if (fileText.trim() !== "") {
          setTeleprompterText(fileText);
          setTop(0);
          setShouldScroll(true);
          setShowAboutToast(false);
          return;
        }
        showNotification("File is empty.", "Error");
      };
      reader.readAsText(file);
      return;
    }
    showNotification("Only text files are supported.", "Error");
  };

  const setTeleprompterText = (text) => {
    if (teleprompterRef.current) {
      teleprompterRef.current.innerText = text;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const toggleScroll = () => {
    setShouldScroll(!shouldScroll);
  };

  const resetScroll = () => {
    setShouldScroll(false);
    setTop(0);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    if (!isNaN(newSpeed)) {
      setSpeed(100 - newSpeed);
    }
  };

  const handleTextSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (!isNaN(newSize)) {
      setTextSize(newSize);
    }
  };

  const handleAboutClose = () => setShowAboutToast(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        toggleScroll();
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      if (teleprompterRef.current && shouldScroll) {
        setTop((prevTop) => prevTop - 1);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [speed, shouldScroll]);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setHighlightBorder(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setHighlightBorder(false);
  };

  return (
    <Container fluid>
      <Row className="p-2">
        <Col xs="auto">
          <h2>Teleprompter</h2>
        </Col>
        <Col xs="auto" className="justify-content-left">
          <Button onClick={toggleScroll} className="mx-2">
            {shouldScroll ? "Stop" : "Start"}
          </Button>
          <Button onClick={resetScroll} className="mx-2">
            Reset
          </Button>
        </Col>
        <Col xs="auto" className="mx-1">
          <InputGroup>
            <InputGroup.Text>Speed</InputGroup.Text>
            <Form.Control
              type="number"
              value={100 - speed}
              min="0"
              max="100"
              onChange={handleSpeedChange}
            />
          </InputGroup>
        </Col>
        <Col xs="auto" className="mx-1">
          <InputGroup>
            <InputGroup.Text>Text Size</InputGroup.Text>
            <Form.Control
              type="number"
              value={textSize}
              min="10"
              max="40"
              onChange={handleTextSizeChange}
            />
          </InputGroup>
        </Col>
        <Col xs="auto" className="m-1">
          <BsQuestionCircle
            size={32}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAboutToast(true);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="flex-column">
          <Card
            onClick={toggleScroll}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            style={{
              width: "100%",
              height: "90vh",
              overflow: "hidden",
              border: highlightBorder
                ? "2px dashed #007bff"
                : "1px solid #4a5056",
            }}
          >
            <Card.Body>
              <div
                ref={teleprompterRef}
                style={{
                  position: "relative",
                  top: `${top}px`,
                  transition: "top linear 0.1s",
                  fontSize: `${textSize}px`,
                }}
              >
                Drag and drop a text file here
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toast
        show={showAboutToast}
        onClose={handleAboutClose}
        style={{
          position: "absolute",
          top: "100px",
          right: "50px",
        }}
      >
        <Toast.Header className="bg-info text-dark">
          <strong className="me-auto">About</strong>
          <i>&copy; Yuri_Rage 2023</i>
        </Toast.Header>
        <Toast.Body>
          This is a quick and dirty teleprompter web app created using React and
          React Bootstrap, partially developed with the help of{" "}
          <a href="https://chat.openai.com/">ChatGPT 3.5</a>.
          <hr />
          All data handling occurs on the client side, meaning that no file
          contents or user information is transmitted to or collected by the
          server.
          <hr />
          Drag and drop a text file to get started!
        </Toast.Body>
      </Toast>
    </Container>
  );
}

export default Teleprompter;
