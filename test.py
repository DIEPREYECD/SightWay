import cv2
import time

# Initialize the camera (0 is usually the default camera index)
cap = cv2.VideoCapture(1)

# Set frame width and height if needed
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# Continuously capture frames
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Check if frame is captured successfully
    if not ret:
        print("Failed to grab frame.")
        break

    # Display the captured frame
    cv2.imshow('Camera Feed', frame)

    # Save the frame if needed (optional)
    timestamp = int(time.time())  # Unique name with timestamp
    cv2.imwrite(f'captured_frame_{timestamp}.jpg', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close windows
cap.release()
cv2.destroyAllWindows()
