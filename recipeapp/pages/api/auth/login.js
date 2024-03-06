import { request } from '../../../lib/datocms';
import { serialize } from 'cookie';
import { encrypt } from '../../../utils/encrypt';

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;
    await signIn(email, password);

    const sessionData = JSON.stringify(req.body);
    const encryptedSessionData = encrypt(sessionData);

    const cookie = serialize('session', encryptedSessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Successfully set cookie!' });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}

async function signIn(email, password) {
  const correctPassword = await getPassword(email);
  if (password !== correctPassword) {
    const error = new Error('Invalid credentials.');
    error.type = 'CredentialsSignin';
    throw error;
  }
}

async function getPassword(email) {
  const response = await request({
    query: PASSWORD_QUERY,
    variables: {
      email: email,
    },
  });
  return response.user.password;
}

const PASSWORD_QUERY = `
query MyQuery($email: String) {
  user(filter: {email: {eq: $email}}) {
    password
  }
}
`;
