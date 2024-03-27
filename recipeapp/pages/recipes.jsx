import { useState } from 'react';
import Layout from '../components/layout';
import { request } from '../lib/datocms';
import RecipeCard from '../components/RecipeCard';
import { useRouter } from 'next/router';

export default function RecipesPage({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const recipes = data.allRecipes;

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.ingredients &&
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))),
  );

  const router = useRouter();
  const handleRandomRecipe = () => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    router.push(`/recipes/${randomRecipe.id}`);
  };

  return (
    <Layout>
      <title>Reseptit</title>
      <div className="py-10 mx-auto max-w-[90%]">
        <div>
          <div className="px-10">
            <h1 className="text-2xl font-bold mb-4">All Recipes</h1>
            <input
              type="text"
              placeholder="Search by name or ingredient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 border rounded w-1/5"
            />
            <button
              style={{ marginLeft: '20px' }}
              onClick={handleRandomRecipe}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Satunnainen resepti
            </button>
            <div style={{ marginTop: '0px', marginBottom: '0px', marginLeft: '0px' }}></div>
          </div>
          <div className="flex flex-wrap justify-around gap-4 max-w-full">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ALL_RECIPES_QUERY = `
    query AllRecipes {
      allRecipes {
        id
        title
        likes
        description
        _createdAt
        ingredients {
            name
        }
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
  const data = await request({ query: ALL_RECIPES_QUERY });

  return {
    props: { data },
  };
}
