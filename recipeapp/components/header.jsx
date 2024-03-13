// components/Header.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function LoginProfileComponent() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const decodedCookie = decodeURIComponent(sessionCookie);
      setSession(JSON.parse(decodedCookie));
    }
  }, []);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      await router.push('/login');
    } else {
      console.error('Failed to log out');
    }
  };

  let component = null;

  if (session) {
    component = (
      <div className={'flex space-x-4'}>
        <Link href={'/account'}>
          <p className="text-white hover:text-gray-300">{session.username}</p>
        </Link>
        <Link href={'#'} onClick={handleLogout}>
          <p className="text-white hover:text-gray-300">Logout</p>
        </Link>
      </div>
    );
  } else {
    component = (
      <div className={'flex space-x-4'}>
        <Link href={'/login'}>
          <p className="text-white hover:text-gray-300">Login</p>
        </Link>
        <Link href={'/register'}>
          <p className="text-white hover:text-gray-300">Register</p>
        </Link>
      </div>
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
            <LoginProfileComponent />
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
