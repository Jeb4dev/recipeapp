// components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../style/globals.css';

const Layout = ({ children }) => (
  <div>
    <Header />
    <div className={'min-h-screen container mx-auto'}>{children}</div>
    <Footer />
  </div>
);

export default Layout;
