import React, { useState, useEffect } from 'react';

const NavigationDisplay = ({heading, pathDescription, speed}) => {

    const [image, setImage] = useState(null);
    const [navigationInfo, setNavigationInfo] = useState(null);


    const handleGetNavigationInfo = () => {
        fetch('http://127.0.0.1:5000/object_detect', {
            method: 'POST',
            body: JSON.stringify({ heading, pathDescription, speed }),
        })
    }

    useEffect(() => {
        fetch('http://127.0.0.1:5000/get_image')
            .then(response => response.json())
            .then(data => setImage(data.image))
            .catch(error => console.error('Error fetching image:', error));
        handleGetNavigationInfo();
    }, []);

  return (
    <div>
      {image && <Image src={image} alt="Navigation Image" />}
      {navigationInfo && (
        <div>
          <h2>Navigation Analysis</h2>
          <div>
            <p><strong>Obstacle Detected:</strong> {navigationInfo.obstacles_detected ? 'Yes' : 'No'}</p>
            {navigationInfo.obstacles_detected && (
              <>
                <p><strong>Obstacle Type:</strong> {navigationInfo.obstacle_type}</p>
                <p><strong>Risk Level:</strong> {navigationInfo.risk_level}</p>
                <p><strong>Distance:</strong> {navigationInfo.distance}m</p>
                <p><strong>Position:</strong> {navigationInfo.position}</p>
                <p><strong>Immediate Action Required:</strong> {navigationInfo.requires_immediate_action ? 'Yes' : 'No'}</p>
                <p><strong>Recommendation:</strong> {navigationInfo.recommendation}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default NavigationDisplay;