import React from 'react';
import '../styles/components/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header fade-in">
      <div className="container">
        <div className="header-content">
          <h1 className="header-title">K-Stats</h1>
          <div className="header-subtitle-wrapper">
            <p className="header-subtitle">해외파 선수 아카이브</p>
            <span className="subtitle-divider">•</span>
            <p className="header-description">주간 활약상을 한눈에 확인하세요</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
