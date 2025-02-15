import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEnvelope, faHeart, faPrint, faStar } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'react-datocms';
import Cookies from 'js-cookie';

import { request } from '../../lib/datocms';
import Layout from '../../components/Layout';

export default function RecipePage(props) {
  const recipe = props.data.recipe;

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

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

    setComments(recipe.comments);
  }, []);

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

  useEffect(() => {
    if (session && session.favorites?.includes(recipe.id)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [session, recipe.id]);

  const toggleFavorite = async () => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch('/api/favorite', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.userId,
          recipeId: recipe.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      setIsFavorited(!isFavorited); // Update favorite status
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    if (!session) return;

    if (newComment.trim() === '') return;

    const formattedComment = `${session.username}: ${newComment}`;

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: recipe.id, comment: formattedComment, action: 'edit' }),
      });

      if (response.ok) {
        const newCommentObj = { comment: formattedComment, timestamp: new Date().toISOString() };
        setNewComment('');
        const updatedComments = [...comments, newCommentObj];
        setComments(updatedComments); // Update comments with new comment added
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked); // Vaihtaa tilan vastakkaiseksi

    /* Ei toimi
    // Prepare the data object with the new likes count
    const data = {
      likes: newLikes,
      // ... include other recipe data that needs to be updated
    };

     // Call the API route for updating the recipe's likes
  const response = await fetch(`/api/editrecipe/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log('Likes updated successfully!');
  } else {
    console.error('Failed to update likes.');
  }*/
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
      <div className={'text-black'}>Ei kuvia</div>
    );
  }

  if (!session && recipe.regonly) {
    return (
      <Layout>
        <div>Tämä resepti näkyy vain kirjautuneille käyttäjille.</div>
      </Layout>
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
              <Link href={`/editrecipe/${recipe.id}`}>
                <button
                  className={`py-2 px-4 rounded ${session?.userId !== recipe.author.id && session?.userId !== 'Wzxstkc8R6iQyPLfZc517Q' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}
                  disabled={session?.userId !== recipe.author.id && session?.userId !== 'Wzxstkc8R6iQyPLfZc517Q'}
                >
                  <FontAwesomeIcon icon={faEdit} /> Muokkaa reseptiä
                </button>
              </Link>
              <button
                onClick={handleLike}
                title="Tykkää"
                className={` py-2 px-4 rounded ${isLiked ? 'bg-gray-200 text-gray-800' : 'bg-red-500 text-white'}`}
              >
                <FontAwesomeIcon icon={faStar} /> {likes}
              </button>
              <button
                onClick={toggleFavorite}
                title={isFavorited ? 'Poista suosikeista' : 'Lisää suosikkeihin'}
                className={`py-2 px-4 rounded ${isFavorited ? 'bg-gray-200 text-gray-800' : 'bg-red-500 text-white'}`}
                disabled={!session}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button
                onClick={() => window.print()}
                title="Tulosta"
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <a
                title="Lähetä sähköpostiin"
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
              <h3 className="text-red-600 text-2xl font-bold p-4">Ainesosat</h3>
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

          {/* Comments Section */}
          {/* Display comments */}
          <div className="mt-8 p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kommentit</h2>
            <ul className="space-y-4">
              {comments.map((comment, index) => (
                <li key={index} className="p-4 bg-white rounded shadow">
                  <div className="flex items-start space-x-2">
                    <div className="space-y-1">
                      <div className="text-gray-900 font-semibold">
                        {comment.comment.split(':')[0]} {/* This will display the username */}
                      </div>
                      <p className="text-gray-700">
                        {comment.comment.split(':')[1]} {/* This will display the comment text */}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(comment.timestamp).toLocaleString('fi-FI', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </li>
              ))}
            </ul>
            {/* Input field for new comment */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Kirjoita kommentti..."
              className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Lisää kommentti
            </button>
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
    regonly
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
  comments {
    comment
    timestamp
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
