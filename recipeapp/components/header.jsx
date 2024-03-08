// components/Header.js
import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

function LoginProfileComponent() {
  let component = null;
  const session = Cookies.get('session');
  console.log(session);

  component = (
    <Link href={'/login'}>
      <p className="text-white hover:text-gray-300">Login</p>
    </Link>
  );

  if (Cookies.get('session')) {
    component = (
      <Link href={'/profile'}>
        <p className="text-white hover:text-gray-300">Cookies.get('session').username</p>
      </Link>
    );
  }

  return component;
}

const Header = () => (
  <header className="bg-red-500 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <Link href={'/'}>
        <h1 className="text-2xl font-bold">RecipeApp</h1>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href={'/newrecipe'}>
              <p className="text-white hover:text-gray-300">New Recipe</p>
            </Link>
          </li>
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
            <LoginProfileComponent />
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
