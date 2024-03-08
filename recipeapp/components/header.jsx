// components/Header.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

function LoginProfileComponent() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const decodedCookie = decodeURIComponent(sessionCookie);
      setSession(JSON.parse(decodedCookie));
    }
  }, []);

  let component = null;

  if (session) {
    component = (
        <Link href={'/account'}>
          <p className="text-white hover:text-gray-300">{session.username}</p>
        </Link>
    );
  } else {
    component = (
        <Link href={'/login'}>
          <p className="text-white hover:text-gray-300">Login</p>
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
