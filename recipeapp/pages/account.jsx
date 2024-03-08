import Layout from '../components/layout';
import { request } from '../lib/datocms';
import { useRouter } from 'next/router';
import { useState } from 'react';

const AccountPage = (props) => {
  const { data } = props;
  const user = data.user;
  const router = useRouter();

  // Add state for form inputs
  const [userId, setUserId] = useState(user.id);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      await router.push('/login');
    } else {
      console.error('Failed to log out');
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        username,
        email,
        password,
      }),
    });

    if (res.ok) {
      // Refresh the page to show the updated user data
      router.reload();
    } else {
      console.error('Failed to edit user data');
    }
  };

  return (
    <Layout>
      <div className="p-4 mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Account Page</h1>
        <form onSubmit={handleEdit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default AccountPage;

const ACCOUNT_QUERY = `
  query UserById($id: ItemId) {
    user(filter: {id: {eq: $id}}) {
      name
      username
      email
      id
    }
  }
`;

export async function getServerSideProps(context) {
  const { user } = context.query;
  const cookies = context.req.headers.cookie;
  let data;

  if (user) {
    data = await request({
      query: ACCOUNT_QUERY,
      variables: { id: user },
    });
  } else {
    if (!cookies) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const cookieString = decodeURIComponent(cookies);
    const session = JSON.parse(
      cookieString
        .split(';')
        .find((c) => c.trim().startsWith('session'))
        .split('=')[1],
    );
    data = await request({
      query: ACCOUNT_QUERY,
      variables: { id: session.userId },
    });
  }

  return {
    props: { data },
  };
}
