import Layout from '../components/layout';
import { request } from '../lib/datocms';
import { useRouter } from 'next/router';
import { useState } from 'react';

import RecipeCard from '../components/RecipeCard';

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

  const recipes = props.data.ownRecipes;

  // Tarkista, että recipes on määritelty ja se on taulukko
  if (!recipes || !Array.isArray(recipes)) {
    console.error('recipes ei ole taulukko tai se ei ole määritelty');
    // Reseptejä ei löytynyt WIP
    return <div>Reseptejä ei löytynyt.</div>;
  }

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

      <div className={'bg-red-50'}>
        <div className={'max-w-7xl mx-auto'}>
          <h1 className="text-2xl font-bold my-4">Omat reseptit</h1>
          <div className="flex flex-wrap justify-between">
            {recipes
              .sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
              .map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
          </div>
        </div>
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
const OWN_RECIPES_QUERY = `
  query RecipesByUser($Id: ItemId) {
    allRecipes(filter: {id: {eq: $Id}}) {
      id
      title
      likes
      description
      _createdAt
      image {
        responsiveImage {
          alt
          aspectRatio
          base64
          bgColor
          height
          sizes
          src
          srcSet
          title
          webpSrcSet
          width
        }
      }
    }
  }
`;

export async function getServerSideProps(context) {
  const { user } = context.query;
  const cookies = context.req.headers.cookie;
  let data;
  let ownRecipesData;
  let session;

  if (!cookies) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const cookieString = decodeURIComponent(cookies);
  session = JSON.parse(
    cookieString
      .split(';')
      .find((c) => c.trim().startsWith('session'))
      .split('=')[1],
  );

  if (user) {
    data = await request({
      query: ACCOUNT_QUERY,
      variables: { id: user },
    });
  } else {
    data = await request({
      query: ACCOUNT_QUERY,
      variables: { id: session.userId },
    });
  }

  // Hakee käyttäjän omat reseptit käyttäen OWN_RECIPES_QUERY-kyselyä
  ownRecipesData = await request({
    query: OWN_RECIPES_QUERY,
    variables: { userId: session.userId },
  });

  // Account data ja ownRecipesData
  return {
    props: { data: { ...data, ownRecipes: ownRecipesData.allRecipes } },
  };
}
