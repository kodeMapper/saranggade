"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Comments.module.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-comments');
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      setComments([
        { id: 1, name: "Visitor", text: "Love the animations! Great work.", date: new Date().toLocaleDateString() }
      ]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      name,
      text,
      date: new Date().toLocaleDateString()
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('portfolio-comments', JSON.stringify(updated));
    setName('');
    setText('');
  };

  return (
    <section id="comments" className={styles.comments}>
      <h2 className={styles.title}>Visitor Comments</h2>
      
      <form className={styles.inputGroup} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your Name" 
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea 
          placeholder="Leave a message..." 
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={styles.button}>Post Comment</button>
      </form>

      <div className={styles.list}>
        {comments.map((comment) => (
          <motion.div 
            key={comment.id} 
            className={styles.commentCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.header}>
              <span className={styles.author}>{comment.name}</span>
              <span>{comment.date}</span>
            </div>
            <p className={styles.text}>{comment.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Comments;
