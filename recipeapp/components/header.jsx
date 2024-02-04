// components/Header.js
import React from 'react';
import Link from 'next/link';

const Header = () => (
  <header className="bg-blue-500 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold">RecipeApp</h1>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href={'/recipes'}>
              <p className="text-white hover:text-gray-300">Recipes</p>
            </Link>
          </li>
          <li>
            <Link href={'/about'}>
              <p className="text-white hover:text-gray-300">About</p>
            </Link>
          </li>
          <li>
            <Link href={'/account'}>
              <p className="text-white hover:text-gray-300">Account</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
