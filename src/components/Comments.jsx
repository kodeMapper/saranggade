"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Comments = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text })
      });

      if (response.ok) {
        setSubmitted(true);
        setName('');
        setText('');
        
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledWrapper id="comments">
      <h2 className="title">Feedback</h2>
      
      {submitted ? (
        <motion.div 
          className="thank-you"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>Thank you! 🎉</h3>
          <p>Your feedback has been received.</p>
        </motion.div>
      ) : (
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input 
                required 
                name="name" 
                id="name" 
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="textarea">Your Message</label>
              <textarea 
                required 
                cols={50} 
                rows={10} 
                id="textarea" 
                name="textarea"
                placeholder="Share your thoughts..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  padding: 6rem 1rem;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    text-align: center;
    font-family: var(--font-outfit);
    font-size: 2rem;
    letter-spacing: 0.5rem;
    color: var(--section-title);
    margin-bottom: 4rem;
    text-transform: uppercase;
    font-weight: 300;
  }

  .thank-you {
    text-align: center;
    padding: 3rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 16px;
    color: #4ade80;
    width: 100%;
  }

  .thank-you h3 {
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    font-family: var(--font-outfit);
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    background: linear-gradient(#212121, #212121) padding-box,
                linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
    background-size: 200% 100%;
    animation: gradient 5s ease infinite;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #fffdfda4;
    font-weight: 400;
    font-size: 12px;
  }

  .form-container .form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-container .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    resize: none;
    color: #fff;
    height: 96px;
    border: 1px solid #414141;
    background-color: transparent;
    font-family: inherit;
  }

  .form-container .form-group input::placeholder,
  .form-container .form-group textarea::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-group textarea:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    font-family: inherit;
    color: #f2babaff;
    font-weight: 500;
    width: 40%;
    background: #04294fda;
    border: 1px solid #4c6f09ff;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .form-container .form-submit-btn:hover:not(:disabled) {
    background-color: #fff;
    border-color: #fff;
    color: #212121;
  }

  .form-container .form-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    
    .form-container {
      padding: 24px 16px;
    }

    .form-container .form-submit-btn {
      width: 100%;
    }
  }

  /* Light Mode Styles */
  html[data-theme='light'] & .form-container {
    background: linear-gradient(#ffffff, #ffffff) padding-box,
                linear-gradient(145deg, transparent 35%, #7c3aed, #0ea5e9) border-box;
    color: #0f172a;
  }

  html[data-theme='light'] & .form-container .form-group label {
    color: #64748b;
  }

  html[data-theme='light'] & .form-container .form-group input,
  html[data-theme='light'] & .form-container .form-group textarea {
    color: #0f172a;
    border-color: #cbd5e1;
    background-color: rgba(241, 245, 249, 0.5);
  }

  html[data-theme='light'] & .form-container .form-group input::placeholder,
  html[data-theme='light'] & .form-container .form-group textarea::placeholder {
    color: #94a3b8;
  }

  html[data-theme='light'] & .form-container .form-group input:focus,
  html[data-theme='light'] & .form-container .form-group textarea:focus {
    border-color: #7c3aed;
    background-color: #fff;
  }

  html[data-theme='light'] & .form-container .form-submit-btn {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
  }

  html[data-theme='light'] & .form-container .form-submit-btn:hover:not(:disabled) {
    background-color: #7c3aed;
    border-color: #7c3aed;
    color: #fff;
  }

  html[data-theme='light'] & .thank-you {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
    color: #16a34a;
  }
`;

export default Comments;
