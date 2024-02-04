import Layout from '../components/layout';
import { request } from '../lib/datocms';

const AccountPage = (props) => {
  const { data } = props;

  const user = data.user;

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
      </div>
    </Layout>
  );
};

export default AccountPage;

const ACCOUNT_QUERY = `
{
  user(filter: {id: {eq: "Wzxstkc8R6iQyPLfZc517Q"}}) {
    name
    username
    email
  }
}
`;

export async function getStaticProps() {
  const data = await request({
    query: ACCOUNT_QUERY,
  });
  return {
    props: { data },
  };
}
