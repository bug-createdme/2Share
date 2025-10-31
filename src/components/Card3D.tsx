import React from 'react';
import styled from 'styled-components';

interface Card3DProps {
  className?: string;
  images?: string[]; // Array of image URLs
}

const Card3D: React.FC<Card3DProps> = ({ className, images }) => {
  // Default images if none provided
  const defaultImages = [
    'https://via.placeholder.com/150x220/8EF9FC/000?text=Card+1',
    'https://via.placeholder.com/150x220/8EFCCC/000?text=Card+2',
    'https://via.placeholder.com/150x220/8EFC9D/000?text=Card+3',
    'https://via.placeholder.com/150x220/D7FC8E/000?text=Card+4',
    'https://via.placeholder.com/150x220/FCFC8E/000?text=Card+5',
    'https://via.placeholder.com/150x220/FCD08E/000?text=Card+6',
    'https://via.placeholder.com/150x220/FC8E8E/000?text=Card+7',
    'https://via.placeholder.com/150x220/FC8EEF/000?text=Card+8',
    'https://via.placeholder.com/150x220/CC8EFC/000?text=Card+9',
    'https://via.placeholder.com/150x220/8ECAFC/000?text=Card+10',
  ];

  const cardImages = images && images.length >= 10 ? images : defaultImages;

  return (
    <StyledWrapper className={className}>
      <div className="wrapper">
        <div className="inner">
          {cardImages.slice(0, 10).map((imgSrc, index) => (
            <div className="card" key={index}>
              <img src={imgSrc} alt={`Card ${index + 1}`} className="img" />
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    min-height: 400px;
  }

  .inner {
    position: relative;
    width: 150px;
    height: 220px;
    transform-style: preserve-3d;
    transform: perspective(1200px) rotateX(-10deg);
    animation: rotating 25s linear infinite;
  }
  
  @keyframes rotating {
    from {
      transform: perspective(1200px) rotateX(-10deg) rotateY(0deg);
    }
    to {
      transform: perspective(1200px) rotateX(-10deg) rotateY(360deg);
    }
  }

  .card {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid;
    border-radius: 16px;
    overflow: hidden;
    inset: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .card:nth-child(1) {
    border-color: rgb(142, 249, 252);
    transform: rotateY(0deg) translateZ(250px);
  }
  .card:nth-child(2) {
    border-color: rgb(142, 252, 204);
    transform: rotateY(36deg) translateZ(250px);
  }
  .card:nth-child(3) {
    border-color: rgb(142, 252, 157);
    transform: rotateY(72deg) translateZ(250px);
  }
  .card:nth-child(4) {
    border-color: rgb(215, 252, 142);
    transform: rotateY(108deg) translateZ(250px);
  }
  .card:nth-child(5) {
    border-color: rgb(252, 252, 142);
    transform: rotateY(144deg) translateZ(250px);
  }
  .card:nth-child(6) {
    border-color: rgb(252, 208, 142);
    transform: rotateY(180deg) translateZ(250px);
  }
  .card:nth-child(7) {
    border-color: rgb(252, 142, 142);
    transform: rotateY(216deg) translateZ(250px);
  }
  .card:nth-child(8) {
    border-color: rgb(252, 142, 239);
    transform: rotateY(252deg) translateZ(250px);
  }
  .card:nth-child(9) {
    border-color: rgb(204, 142, 252);
    transform: rotateY(288deg) translateZ(250px);
  }
  .card:nth-child(10) {
    border-color: rgb(142, 202, 252);
    transform: rotateY(324deg) translateZ(250px);
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export default Card3D;
