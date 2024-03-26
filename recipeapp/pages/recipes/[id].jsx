import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { Image } from 'react-datocms';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHeart, faPrint, faStar } from '@fortawesome/free-solid-svg-icons';

import Cookies from 'js-cookie';

export default function RecipePage(props) {

  const recipe = props.data.recipe;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  const initialServingSize = recipe.serving || 1;
  const [servingSize, setServingSize] = useState(initialServingSize);


  const [isFavorited, setIsFavorited] = useState(false);
  const [likes, setLikes] = useState(recipe.likes);
  const [isLiked, setIsLiked] = useState(false);

  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const decodedCookie = decodeURIComponent(sessionCookie);
      const sessionData = JSON.parse(decodedCookie);
      setSession(sessionData);
      
    }
  }, []);

  const toggleFavorite = () => {
    if (!isFavorited){
      console.log("Tähän tulisi lisäys suosikkeihin");
      //addFavorite();
    } else {
      console.log("Tähän tulisi poisto suosikeista");
    }
    setIsFavorited(!isFavorited);
  };
  //Ei toimi WIP
  /*const addFavorite = async () => {

    const userId = session.userId; // Oletetaan, että käyttäjän ID on saatavilla
    const favoriteRecipeId = recipe.id; // ID reseptistä, joka lisätään suosikkeihin

    try {
      const res = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`, // Varmista, että lisäät API-tokenin
          },
          body: JSON.stringify({
            id: userId,
            type: 'item',
            attributes: {
            favorites: [...session.favorites, favoriteRecipeId], // Lisää uusi suosikki nykyiseen listaan
          },
        }),
      });
    } catch (error) {
      console.log("Ei aiempia suosikkeja, lisätään ensimmäinen")
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`, // Varmista, että lisäät API-tokenin
        },
        body: JSON.stringify({
          id: userId,
          type: 'item',
          attributes: {
          favorites: favoriteRecipeId, // Lisää uusi suosikki nykyiseen listaan
        },
      }),
    });
    }
  }; */
  const incrementServingSize = () => {
    setServingSize(servingSize + 1);
  };

  const decrementServingSize = () => {
    if (servingSize > 1) {
      setServingSize(servingSize - 1);
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked); // Vaihtaa tilan vastakkaiseksi
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
            <button onClick={handleLike} title="Tykkää" className={` py-2 px-4 rounded ${isLiked ? 'bg-gray-200 text-gray-800' : 'bg-red-500 text-white'}`}>
              <FontAwesomeIcon icon={faStar} /> {likes}
              </button>
              <button onClick={toggleFavorite} title="Lisää suosikkeihin" className={`py-2 px-4 rounded ${isFavorited ? 'bg-gray-200 text-gray-800': 'bg-red-500 text-white'}`}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button onClick={() => window.print()} title="Tulosta" className="bg-red-500 text-white py-2 px-4 rounded">
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <a title="Lähetä sähköpostiin"
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
              <div className="flex items-center">
                <button
                  className={'bg-red-500 text-white py-1 px-3 rounded text-3xl flex justify-center items-center'}
                  onClick={decrementServingSize}
                >
                  -
                </button>
                <p className={'text-black py-2 px-4 rounded text-2xl'}>{servingSize} annosta</p>
                <button
                  className={'bg-red-500 text-white py-1 px-3 rounded text-3xl flex justify-center items-center'}
                  onClick={incrementServingSize}
                >
                  +
                </button>
              </div>
              <h3 className="text-red-600 text-2xl font-bold p-4">Ingredients</h3>
              <ul className="list-disc pl-8">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={`text-black p-2 ${ingredient.name.startsWith('--') ? 'list-none' : ''}`}>
                    {ingredient.amount === 0
                      ? ''
                      : parseFloat(((ingredient.amount * servingSize) / initialServingSize).toFixed(2))}{' '}
                    {ingredient.unit} <span className={'font-semibold'}>{ingredient.name}</span>
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
    serving
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
  ingredients {
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
