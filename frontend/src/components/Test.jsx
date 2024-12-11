import React, { useState } from 'react';
import axios from 'axios';

const Test = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipient_list: '',
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subject, message, recipient_list } = formData;
    try {
      const response = await axios.post('http://localhost:8000/api/send-email/', {
        subject,
        message,
        recipient_list: recipient_list.split(','), // Convert comma-separated string to list
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Recipients (comma-separated):</label>
          <input
            type="text"
            name="recipient_list"
            value={formData.recipient_list}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Test;