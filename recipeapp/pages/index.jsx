// pages/index.js
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { request } from '../lib/datocms';

const dummyData = [
  {
    image: 'https://via.placeholder.com/150',
    title: 'Recipe 1',
    description: 'This is a description for Recipe 1.',
    rating: 4.5,
  },
  {
    image: 'https://via.placeholder.com/150',
    title: 'Recipe 2',
    description: 'This is a description for Recipe 2.',
    rating: 4.0,
  },
  {
    image: 'https://via.placeholder.com/150',
    title: 'Recipe 3',
    description: 'This is a description for Recipe 3.',
    rating: 5.0,
  },
  {
    image: 'https://via.placeholder.com/150',
    title: 'Recipe 4',
    description: 'This is a description for Recipe 4.',
    rating: 3.5,
  },
  {
    image: 'https://via.placeholder.com/150',
    title: 'Recipe 5',
    description: 'This is a description for Recipe 5.',
    rating: 4.5,
  },
];
const HomePage = (props) => {
  const recipes = props.data.allRecipes;
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Tykätyimmät reseptit</h1>
        <div className="flex flex-wrap justify-around">
          {recipes
            .sort((a, b) => b.likes - a.likes)
            .map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
        </div>
        <h1 className="text-2xl font-bold mb-4">Uusimmat reseptit</h1>
        <div className="flex flex-wrap justify-around">
          {recipes
            .sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
            .map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

const ALL_RECIPES_QUERY = `
{
  allRecipes {
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

export async function getStaticProps() {
  const data = await request({
    query: ALL_RECIPES_QUERY,
  });
  return {
    props: { data },
  };
}
