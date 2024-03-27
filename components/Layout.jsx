// components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div>
    <Header />
    <div className="min-h-screen mx-auto">{children}</div>
    <Footer />
  </div>
);

export default Layout;
