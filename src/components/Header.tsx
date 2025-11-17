import React from 'react';
import '../styles/components/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header fade-in">
      <div className="container">
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-main">K-Stats</span>
            <span className="title-divider">|</span>
            <span className="title-sub">해외파 선수 아카이브</span>
          </h1>
          <p className="header-subtitle">
            주간 활약상을 한눈에 확인하세요
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
