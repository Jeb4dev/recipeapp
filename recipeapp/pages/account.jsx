import Layout from '../components/layout';
import { request } from '../lib/datocms';
import { useRouter } from 'next/router';
import RecipeCard from '../components/RecipeCard';
import AccountForm from '../components/AccountForm';

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

  const handleEdit = async (username, email, password) => {
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        username: username,
        email: email,
        password: password,
      }),
    });

    if (res.ok) {
      router.reload();
    } else {
      console.error('Failed to edit user data');
    }
  };

  const userRecipes = data.ownRecipes.filter((recipe) => recipe.author.id === user.id);

  return (
    <Layout>
      <div className="p-4 mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Account Page</h1>
        <AccountForm user={user} handleEdit={handleEdit} />
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>

      <div className={'bg-red-50'}>
        <div className={'max-w-7xl mx-auto'}>
          <h1 className="text-2xl font-bold my-4">Omat reseptit</h1>
          <div className="flex flex-wrap justify-between">
            {userRecipes
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

export async function getServerSideProps(context) {
  const { user } = context.query;
  const cookies = context.req.headers.cookie;
  let data;
  let ownRecipesData;
  let session;

  // Hakee käyttäjän tiedot käyttäen ACCOUNT_QUERY-kyselyä

  // Jos user-parametri on olemassa url:ssa, käytetään sitä
  if (user) {
    data = await request({
      query: ACCOUNT_QUERY,
      variables: { id: user },
    });
  }
  // Jos ei ole user-parametria, käytetään session.userId cookieista (kirjautuneen käyttäjän id)
  else {
    // Jos ei ole session cookieta, ohjataan login-sivulle
    if (!cookies) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Hakee session cookien ja parsii siitä session objektin
    const cookieString = decodeURIComponent(cookies);
    session = JSON.parse(
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
    allRecipes(filter: {author: {eq: $Id}}) {
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
      author {
        id
      }
    }
  }
`;
