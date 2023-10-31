import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Toast,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

function Teleprompter({ showNotification }) {
  const pauseResumeKey = "Space";
  const defaultCaption = "Drag and drop a text file here.";
  const defaultSpeed = 50;
  const defaultFontSize = 16;
  const [speed, setSpeed] = useState(
    localStorage.getItem("speed") || defaultSpeed
  );
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || defaultFontSize
  );
  const [shouldScroll, setShouldScroll] = useState(false);
  const [highlightBorder, setHighlightBorder] = useState(false);
  const [showAboutToast, setShowAboutToast] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const teleprompterRef = useRef(null);

  const handleEditModeChange = (event) => {
    setEditMode(event.target.checked);
    showNotification(
      event.target.checked
        ? "Enabled. Spacebar and mouse will function normally."
        : "Disabled. Spacebar and mouse will pause/resume teleprompter scrolling.",
      "Edit mode"
    );
  };

  const handleTooltip = (show) => {
    setShowTooltip(show);
  };

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
          return;
        }
        showNotification("File is empty.", "Error");
      };
      reader.readAsText(file);
      return;
    }
    showNotification("Only text files are supported.", "Error");
  };

  const handlePaste = (event) => {
    event.preventDefault();
    setTeleprompterText(event.clipboardData.getData("text"));
  };

  const setTeleprompterText = (text) => {
    if (teleprompterRef.current) {
      teleprompterRef.current.value = text;
      teleprompterRef.current.scrollTop = 0;
      teleprompterRef.current.setSelectionRange(0, 0);
      localStorage.setItem("teleprompterText", text);
      setShouldScroll(false);
      setShowAboutToast(false);
    }
  };

  const handleTextChange = (e) => {
    localStorage.setItem("teleprompterText", e.target.value);
    setShowAboutToast(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const toggleScroll = () => {
    const newVal =
      teleprompterRef.current.value !== defaultCaption &&
      !shouldScroll &&
      !editMode;
    setShouldScroll(newVal);
    if (newVal) {
      setShowAboutToast(false);
    }
    if (editMode) {
      showNotification("Disable edit mode to start scrolling.", "Warning");
    }
  };

  const resetScroll = () => {
    setShouldScroll(false);
    teleprompterRef.current.scrollTop = 0;
  };

  const handleSpeedChange = (e) => {
    localStorage.setItem("speed", e.target.value);
    setSpeed(parseInt(e.target.value));
  };

  const handleFontSizeChange = (e) => {
    localStorage.setItem("fontSize", e.target.value);
    setFontSize(e.target.value);
  };

  const handleAboutClose = () => {
    setShowAboutToast(false);
  };

  const handleClick = () => {
    if (!editMode) {
      toggleScroll();
    }
  };

  useEffect(() => {
    let keyDown = false;

    const handleKeyDown = (event) => {
      if (!editMode && event.code === pauseResumeKey && !keyDown) {
        event.preventDefault();
        keyDown = true;
        toggleScroll();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === pauseResumeKey) {
        keyDown = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const interval = setInterval(() => {
      if (teleprompterRef.current && shouldScroll) {
        teleprompterRef.current.scrollTop += 1;
      }
    }, 100 - speed);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, [speed, shouldScroll, editMode]);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setHighlightBorder(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setHighlightBorder(false);
  };

  const resetApp = () => {
    localStorage.clear();
    setSpeed(defaultSpeed);
    setFontSize(defaultFontSize);
    setTeleprompterText(defaultCaption);
    teleprompterRef.current.scrollTop = 0;
    setShouldScroll(false);
    showNotification("App settings cleared.", "Success");
  };

  return (
    <Container fluid>
      <Row className="p-2">
        <Col xs="auto" className="justify-content-left">
          <Button onClick={toggleScroll} className="mx-2">
            {shouldScroll ? "Stop" : "Start"}
          </Button>
          <Button onClick={resetScroll} className="mx-2">
            Reset
          </Button>
        </Col>
        <Col xs="auto" className="mx-1 text-center">
          <Form.Label className="my-0" style={{ fontSize: "0.8em" }}>
            Speed: {speed}
          </Form.Label>
          <Form.Range
            value={speed}
            onChange={handleSpeedChange}
            min={1}
            max={100}
            step={1}
          />
        </Col>
        <Col xs="auto" className="mx-1 text-center">
          <Form.Label className="my-0" style={{ fontSize: "0.8em" }}>
            Font Size: {Number(fontSize).toFixed(1)}
          </Form.Label>
          <Form.Range
            value={fontSize}
            onChange={handleFontSizeChange}
            min={10}
            max={40}
            step={0.5}
          />
        </Col>
        <Col
          className="text-center"
          onMouseEnter={() => handleTooltip(true)}
          onMouseLeave={() => handleTooltip(false)}
        >
          <Overlay
            show={showTooltip}
            target={() => document.getElementById("tooltip-target")}
            placement="bottom"
          >
            {(props) => (
              <Tooltip id="tooltip" {...props}>
                Disables scroll pause/resume on spacebar or mouse click.
              </Tooltip>
            )}
          </Overlay>
          <Form.Group
            id="tooltip-target"
            as={Row}
            className="my-1 justify-content-center"
          >
            <div style={{ fontSize: "0.8em" }}>Edit Mode</div>
            <Col xs="auto">
              <Form.Check
                type="checkbox"
                checked={editMode}
                onChange={handleEditModeChange}
              />
            </Col>
          </Form.Group>
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
          <textarea
            id="teleprompter-textarea"
            ref={teleprompterRef}
            onClick={handleClick}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onChange={handleTextChange}
            className="rounded px-2 py-1"
            style={{
              width: "100%",
              height: "90vh",
              border: highlightBorder
                ? "2px dashed #007bff"
                : "1px solid #4a5056",
              outline: "none",
              backgroundColor: "inherit",
              fontSize: `${fontSize}px`,
            }}
            defaultValue={
              localStorage.getItem("teleprompterText") || defaultCaption
            }
          />
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
          server. No cookies are created. Rather, app settings are stored in{" "}
          <a href="https://www.w3schools.com/jsref/prop_win_localstorage.asp">
            localStorage
          </a>
          .
          <hr />
          Drag and drop a text file to get started!
          <hr />
          <div className="text-center">
            <Button onClick={resetApp} className="m-2 py-0">
              Reset App to Default
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </Container>
  );
}

export default Teleprompter;
