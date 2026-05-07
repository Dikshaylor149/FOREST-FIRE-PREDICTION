import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ title, description, image, delay }) => {
  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
    >
      {/* Subtle background glow effect */}
      <div className="card-glow"></div>

      <div className="card-inner">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{description}</p>
      </div>
      
      <div className="mask-container">
        <div 
          className="circular-mask-image" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>
    </motion.div>
  );
};

export default Card;