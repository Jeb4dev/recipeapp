import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import Layout from '../../components/layout';
import Cookies from 'js-cookie';
import { request } from '../../lib/datocms';

export default function EditRecipePage() {
  const [session, setSession] = useState(null);
  const [recipe] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState(0);
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [images, setImages] = useState([]);
  const [regonly, setRegOnly] = useState(false);

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const decodedCookie = decodeURIComponent(sessionCookie);
      const sessionData = JSON.parse(decodedCookie);
      setSession(sessionData);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare data to send to the API route for updating the recipe
    const data = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      images: recipe.images,
      regonly: recipe.regonly,
    };
    // Call the API route for updating the recipe
    const response = await fetch(`/api/editrecipe/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push(`/recipes/${id}`);
    } else {
      const errorData = await response.json();
      console.error('Error updating recipe:', errorData.error);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Loading recipe...</div>;
  }


  const addIngredient = () => {
    if (ingredientName.trim() !== '' && ingredientAmount !== '' && ingredientUnit.trim() !== '') {
      setIngredients([...ingredients, { name: ingredientName, amount: parseFloat(ingredientAmount), unit: ingredientUnit }]);
      setIngredientName(''); // Reset ingredient name field after adding
      setIngredientAmount(0); // Reset ingredient amount field after adding
      setIngredientUnit(''); // Reset ingredient unit field after adding
    }
  };

  
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (instructionText.trim() !== '') {
      setInstructions([...instructions, instructionText]);
      setInstructionText('');
    }
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setImages([...images, selectedFile]);
};

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleRegOnlyToggle = () => {
    setRegOnly(!regonly);
  };


  return (
    <Layout>
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 mt-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* New ingredient input fields */}
        <div className="mb-4 flex items-bottom">
          <div className="mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredientName">
              Ingredient Name
            </label>
            <input
              className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ingredientName"
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
            />
          </div>
          <div className="mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredientAmount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ingredientAmount"
              type="number"
              step="0.1"
              value={Math.max(0, parseFloat(ingredientAmount))}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (!isNaN(newValue) && newValue >= 0) {
                  setIngredientAmount(newValue);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredientUnit">
              Unit
            </label>
            <input
              className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ingredientUnit"
              type="text"
              value={ingredientUnit}
              onChange={(e) => setIngredientUnit(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={addIngredient}
            style={{ marginLeft: '8px' }}
          >
            Add Ingredient
          </button>
        </div>

        {/* Display ingredients */}
        <div>
          <ul className="list-disc pl-6">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="mb-2">
                {ingredient.name}, {ingredient.amount} {ingredient.unit} 
                <button onClick={() => removeIngredient(index)}>
                  <MdDelete /> {/* Using the delete icon */}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* New instruction input field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instruction">
            Instruction
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="instruction"
            type="text"
            value={instructionText}
            onChange={(e) => setInstructionText(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
            type="button"
            onClick={addInstruction}
          >
            Add Instruction
          </button>
        </div>

        {/* Display instructions */}
        <div>
          <ul className="list-disc pl-6">
            {instructions.map((instruction, index) => (
              <li key={index} className="mb-2">
                {instruction} 
                <button onClick={() => removeInstruction(index)}>
                  <MdDelete /> {/* Using the delete icon */}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Image upload */}
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Images
        </label>
        <label htmlFor="imageUpload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          Browse Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
  
        {/* Display selected images */}
        <div className="mt-2">
          {images.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded Image ${index}`}
                className="w-16 h-16 object-cover rounded mr-2"
              />
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={() => removeImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            checked={regonly}
            onChange={handleRegOnlyToggle}
            className="mr-2"
          />
          Registered users only
        </label>
      </div>
      
      {/* "Edit Recipe" and "Delete Recipe" buttons */}
      <div className="flex justify-between mt-4">
              <button
                onClick={handleEditRecipe}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Recipe
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Recipe
              </button>
            </div>
          </form>
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
  recipeQuery.allRecipes.map((p) => paths.push(`/editrecipe/${p.id}`));

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


// export async function getServerSideProps(context) {
//   const { id } = context.query;
//   const cookies = context.req.headers.cookie;

//   if (!cookies) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   const cookieString = decodeURIComponent(cookies);
//   const sessionCookie = cookieString
//     .split(';')
//     .find((c) => c.trim().startsWith('session'));

//   if (!sessionCookie) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   const session = JSON.parse(sessionCookie.split('=')[1]);

//   const POST_QUERY = `
// query MyQuery($id: ItemId) {
//   recipe(filter: {id: {eq: $id}}) {
//     id
//     image {
//       responsiveImage {
//         width
//         webpSrcSet
//         srcSet
//         title
//         src
//         sizes
//         height
//         bgColor
//         base64
//         aspectRatio
//         alt
//       }
//     }
//     likes
//     serving
//     title
//     description
//     regonly
//     author {
//       username
//       id
//       image {
//       responsiveImage {
//         width
//         webpSrcSet
//         srcSet
//         title
//         src
//         sizes
//         height
//         bgColor
//         base64
//         aspectRatio
//         alt
//       }
//     }
//   }
//   ingredients {
//       amount
//       name
//       unit
//   }
//   instructions {
//       instruction
//     }
//   }
//   user {
//     username
//     image {
//       id
//     }
//   }
// }
// `;

//   const data = await request({
//     query: POST_QUERY,
//     variables: {
//       id,
//     },
//   });

//   const { recipe } = data;

//   if (!recipe || (session.username !== recipe.author.username && !session.isAdmin)) {
//     // Redirect to home page if the user is neither the author nor an admin
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       recipeData: data.recipe, // Adjust the key as per your query response structure
//       session,
//     },
//   };
// }