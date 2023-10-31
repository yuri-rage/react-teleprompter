import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Teleprompter from "./Teleprompter";
import Notification from "./Notification";

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationCaption, setNotificationCaption] = useState("");

  const closeNotification = () => {
    setShowNotification(false);
  };

  // Function to show the notification with a message and caption
  const showAppNotification = (message, caption) => {
    setNotificationMessage(message);
    setNotificationCaption(caption); // Set the caption
    setShowNotification(true);
  };

  return (
    <Container fluid>
      <Row>
        <Teleprompter
          initSpeed={localStorage.getItem("speed")}
          initFontSize={localStorage.getItem("fontSize")}
          showNotification={showAppNotification}
        />
      </Row>
      <Row className="justify-content-center fw-light fst-italic">
        All file content is processed solely on the client side. No data is
        transmitted to or collected by the server.
      </Row>
      <Row className="justify-content-center fw-light fst-italic">
        &copy; 2023 Yuri_Rage
      </Row>
      <Notification
        show={showNotification}
        onClose={closeNotification}
        message={notificationMessage}
        caption={notificationCaption}
      />
    </Container>
  );
}

export default App;