import Layout from '../components/layout';
import { request } from '../lib/datocms';
import { useRouter } from 'next/router';

const AccountPage = (props) => {
  const { data } = props;
  const user = data.user;
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      await router.push('/login');
    } else {
      console.error('Failed to log out');
    }
  };

  return (
    <Layout>
      <div className="p-4 outline outline-amber-200">
        <h1 className="text-2xl font-bold mb-4">Account Page</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Username
            </label>
            <p className="text-gray-600">{user.username}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <p className="text-gray-600">{user.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
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
