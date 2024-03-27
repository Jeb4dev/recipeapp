// pages/index.js
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { request } from '../lib/datocms';

const HomePage = (props) => {
  const recipes = props.data.allRecipes;
  return (
    <Layout>
      <title>Etusivu</title>
      <div className="bg-red-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold my-4">Tykätyimmät reseptit</h1>
          <div className="flex flex-wrap justify-around">
            {recipes
              .sort((a, b) => b.likes - a.likes)
              .map((recipe, index) => <RecipeCard key={index} recipe={recipe} />)
              .slice(0, 3)}
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold my-4">Uusimmat reseptit</h1>
          <div className="flex flex-wrap justify-around">
            {recipes
              .sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
              .map((recipe, index) => <RecipeCard key={index} recipe={recipe} />)
              .slice(0, 3)}
          </div>
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
