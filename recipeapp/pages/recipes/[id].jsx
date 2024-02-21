import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { Image } from 'react-datocms';
import { useState } from 'react';

export default function RecipePage(props) {
  const recipe = props.data.recipe;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % recipe.image.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + recipe.image.length) % recipe.image.length);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <div className="flex items-center">
          <button
            onClick={handlePreviousImage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <Image
            key={recipe.image[currentImageIndex].responsiveImage.src}
            className={'h-[600px] w-[600px]'}
            data={recipe.image[currentImageIndex].responsiveImage}
            alt={recipe.image[currentImageIndex].responsiveImage.alt}
            objectFit={'cover'}
          />
          <button
            onClick={handleNextImage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
        <p className="mt-4">{recipe.description}</p>
        <h2 className="text-2xl font-bold mt-4">Ingredients</h2>
        <ul className="list-disc ml-5">
          {recipe.incredients.map((ingredient, index) => (
            <li key={index} className="my-2">
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold mt-4">Instructions</h2>
        <ol className="list-decimal ml-5">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="my-2">
              {instruction.instruction}
            </li>
          ))}
        </ol>
        <h2 className="text-2xl font-bold mt-4">Author</h2>
        <div className="flex items-center">
          {recipe.author?.image && (
            <>
              <Image
                data={recipe.author.image.responsiveImage}
                className={'w-16 h-16 rounded-full mr-4'}
                alt={recipe.author.image.responsiveImage.alt}
                objectFit={'cover'}
              />
              <p>{recipe.author.username}</p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

const PATHS_QUERY = `
query MyQuery {
  allRecipes {
    id
  }
}
`;

export async function getStaticPaths() {
  const recipeQuery = await request({
    query: PATHS_QUERY,
  });

  let paths = [];
  recipeQuery.allRecipes.map((p) => paths.push(`/recipes/${p.id}`));

  return {
    paths,
    fallback: false,
  };
}

const POST_QUERY = `
query MyQuery($id: ItemId) {
  recipe(filter: {id: {eq: $id}}) {
    id
    image {
      responsiveImage {
        width
        webpSrcSet
        srcSet
        title
        src
        sizes
        height
        bgColor
        base64
        aspectRatio
        alt
      }
    }
    likes
    title
    description
    author {
      username
      id
      image {
      responsiveImage {
        width
        webpSrcSet
        srcSet
        title
        src
        sizes
        height
        bgColor
        base64
        aspectRatio
        alt
      }
    }
    }
    incredients {
      amount
      incredient
      unit
    }
    instructions {
      instruction
    }
  }
  user {
    username
    image {
      id
    }
  }
}
`;
export const getStaticProps = async ({ params }) => {
  const data = await request({
    query: POST_QUERY,
    variables: {
      id: params.id,
    },
  });

  return {
    props: { data },
  };
};
