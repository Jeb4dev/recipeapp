import { request } from '../../../lib/datocms';

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;
    await signIn(email, password);

    res.status(200).json({ success: true });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' });
    } else {
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
