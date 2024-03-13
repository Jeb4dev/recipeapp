import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { Image } from 'react-datocms';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHeart, faPrint } from '@fortawesome/free-solid-svg-icons';

export default function RecipePage(props) {
  const recipe = props.data.recipe;
  const [likes, setLikes] = useState(recipe.likes);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % recipe.image.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + recipe.image.length) % recipe.image.length);
  };

  function ImageContainer() {
    return recipe.image[currentImageIndex] ? (
      <div className="relative group w-screen">
        <Image
          key={recipe.image[currentImageIndex]?.responsiveImage?.src}
          data={recipe.image[currentImageIndex]?.responsiveImage}
          alt={recipe.image[currentImageIndex]?.responsiveImage?.alt}
          objectFit={'cover'}
          className="h-[420px]"
        />
        <button
          onClick={handlePreviousImage}
          className="absolute top-0 left-0 bg-red-500 text-white p-2 rounded-r opacity-0 group-hover:opacity-50 h-full transition-opacity duration-200"
          title={'Previous'}
        >
          &lt;
        </button>
        <button
          onClick={handleNextImage}
          className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-l opacity-0 group-hover:opacity-50 h-full transition-opacity duration-200"
          title={'Next'}
        >
          &gt;
        </button>
      </div>
    ) : (
      <div className={'text-black'}>No images</div>
    );
  }

  return (
    <Layout>
      <div className={'bg-red-50 min-h-screen'}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-center items-center w-full">
            <ImageContainer />
          </div>
          <div className="flex items-center p-4">
            {recipe.author?.image && (
              <>
                <div className={'max-h-8 max-w-8'}>
                  <Image
                    data={recipe.author.image?.responsiveImage}
                    alt={recipe.author.image?.responsiveImage?.alt}
                    className="rounded-full"
                  />
                </div>
                <Link href={`/account?user=${recipe.author.id}`}>
                  <p className="pl-2 text-red-600 hover:underline">{recipe.author.username}</p>
                </Link>
              </>
            )}
            <div className={'flex-grow flex justify-end items-center gap-2'}>
              <button onClick={handleLike} className="bg-red-500 text-white py-2 px-4 rounded">
                <FontAwesomeIcon icon={faHeart} /> {likes}
              </button>
              <button onClick={() => window.print()} className="bg-red-500 text-white py-2 px-4 rounded">
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <a
                href={`mailto:?subject=${recipe.title}&body=Check out this recipe: ${currentUrl}`}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
          <h1 className="text-red-600 text-4xl font-bold p-4">{recipe.title}</h1>
          <p className="text-black p-4">{recipe.description}</p>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'}>
            <div>
              <h3 className="text-red-600 text-2xl font-bold p-4">Raaka-aineet</h3>
              <ul className="list-disc pl-8">
                {recipe.incredients.map((ingredient, index) => (
                  <li key={index} className="text-black p-2">
                    {ingredient.name} {ingredient.amount} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-red-600 text-2xl font-bold p-4">Ohje</h3>
              <ol className="list-decimal pl-8">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-black p-2">
                    {instruction.instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
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
      name
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
