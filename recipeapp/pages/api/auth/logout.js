import Cookies from 'cookie';

export default async function handler(req, res) {
  // Remove the session cookie
  res.setHeader(
    'Set-Cookie',
    Cookies.serialize('session', '', {
      maxAge: -1, // This will remove the cookie
      path: '/',
    }),
  );

  // Redirect to the login page
  res.writeHead(302, { Location: '/login' });
  res.end();
}
