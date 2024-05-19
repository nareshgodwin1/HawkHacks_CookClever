import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

const CameraComponent = () => {
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [imageData, setImageData] = useState({
    imageSrc: '',
    imageRequirements: ''
    });

  const webcamRef = useRef(null);

  const requirements = {
    preperation: 'make sure there are different types of food. make sure they are presented nicely'
  }

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  useEffect(() => {
    analyzeImage()
  },[imageData])
  
  const capturePhoto = useCallback(() => {
    const imagebase64 = webcamRef.current.getScreenshot();
    setCapturedPhoto(imagebase64);
    setImageData({imageSrc: imagebase64, imageRequirements: requirements.preperation})
    setIsCameraOpen(false);
  }, [webcamRef]);

  function analyzeImage() {
    fetch('http://127.0.0.1:5000/imageanalysis', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ imageData })
      }
    )
    .then((res) => res.json()
    .then((data) => {
      console.log(data);
      // NOW DO SOMETHING WITH IT
    })
    );
  }

  return (
    <div>
      {!isCameraOpen && !capturedPhoto && (
        <div
          style={{
            width: '300px',
            height: '200px',
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={openCamera}
        >
          Click to open camera
        </div>
      )}

      {isCameraOpen && (
        <div style={{ position: 'relative' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: '100vw', height: '100vh' }}
          />
          <button className='camera-button'
            onClick={capturePhoto}>
            Capture
          </button>
        </div>
      )}

      {capturedPhoto && !isCameraOpen && (
        <div>
          <img src={capturedPhoto} alt="Captured" />
          <button onClick={() => setCapturedPhoto(null)}>Retake Photo</button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
