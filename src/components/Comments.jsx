"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GradientOrbs from './GradientOrbs';

const Comments = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setError(false);

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
      } else {
        setError(true);
        setTimeout(() => setError(false), 4000);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledWrapper id="comments">
      {/* Background Animation - Gradient Orbs */}
      <div className="animation-bg">
        <GradientOrbs />
      </div>

      {/* Two Column Layout */}
      <div className="content-grid">
        {/* Left Side - Text Content */}
        <motion.div 
          className="left-content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Contact Me</h2>
          <p className="tagline">
            Interested in collaborating or have a project in mind? 
            I'd love to hear from you.
          </p>
          
          <div className="info-blocks">
            <div className="info-item">
              <div>
                <h4>Open for Work</h4>
                <p>Internships, freelance & collaborations</p>
              </div>
            </div>
            <div className="info-item">
              <div>
                <h4>Quick Response</h4>
                <p>Usually within 24 hours</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="right-content"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="error-popup"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ❌ Failed to send. Please try again.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                className="thank-you"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <h3>Message Sent! 🎉</h3>
                <p>I'll get back to you soon.</p>
              </motion.div>
            ) : (
              <div className="form-container">
                <h3 className="form-title">Let's Build Something Amazing</h3>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input 
                      required 
                      name="name" 
                      id="name" 
                      type="text"
                      placeholder="John Doe"
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
                      placeholder="Tell me about your project or idea..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span key="sending" exit={{ opacity: 0 }}>Sending...</motion.span>
                      ) : (
                        <motion.span key="idle">Send Message →</motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.section`
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  padding: 4rem 2rem;

  [data-theme='light'] & {
    background: #f1f5f9;
  }

  .animation-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .content-grid {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1100px;
    width: 100%;
    align-items: center;
  }

  /* Left Content */
  .left-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-title {
    font-family: var(--font-outfit);
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 1rem;
    color: var(--section-title);
    text-transform: uppercase;
    margin: 0 0 1rem 0;
  }

  .tagline {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 400px;
  }

  .info-blocks {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  [data-theme='light'] & .info-item {
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .info-item:hover {
    transform: translateX(5px);
    border-color: var(--primary);
  }

  .info-icon {
    font-size: 1.5rem;
  }

  .info-item h4 {
    margin: 0;
    font-size: 0.95rem;
    color: var(--foreground);
    font-weight: 600;
  }

  .info-item p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  /* Right Content - Form */
  .right-content {
    width: 100%;
  }

  .error-popup {
    text-align: center;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: #f87171;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .thank-you {
    text-align: center;
    padding: 3rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 16px;
    color: #4ade80;
    backdrop-filter: blur(10px);
  }

  .thank-you h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.6rem;
    font-family: var(--font-outfit);
  }

  .thank-you p {
    margin: 0;
  }

  .form-container {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  [data-theme='light'] & .form-container {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  }

  .form-title {
    font-family: var(--font-outfit);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0 0 1.5rem 0;
    background: linear-gradient(135deg, var(--foreground) 30%, var(--text-muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 10px;
    color: var(--foreground);
    font-family: inherit;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
  }

  [data-theme='light'] & .form-group input {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #1e293b;
  }

  .form-group textarea {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 10px;
    resize: none;
    color: var(--foreground);
    height: 130px;
    font-family: inherit;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
  }

  [data-theme='light'] & .form-group textarea {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #1e293b;
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .form-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-family: inherit;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.95rem;
    background: linear-gradient(135deg, var(--primary), #06d48fa8);
    border: none;
    padding: 1rem;
    cursor: pointer;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    margin-top: 0.5rem;
  }

  .form-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    filter: brightness(1.05);
  }

  .form-submit-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .form-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Mobile Responsive */
  @media (max-width: 900px) {
    padding: 3rem 1.5rem;

    .content-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }

    .left-content {
      align-items: center;
    }

    .tagline {
      max-width: 100%;
    }

    .info-blocks {
      width: 100%;
      max-width: 400px;
    }

    .info-item:hover {
      transform: translateY(-3px);
    }
  }
`;

export default Comments;
