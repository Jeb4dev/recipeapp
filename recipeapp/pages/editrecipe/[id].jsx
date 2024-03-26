import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import Layout from '../../components/layout';
import Cookies from 'js-cookie';
import { request } from '../../lib/datocms';

export default function EditRecipePage({ recipeData }) {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState(0);
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [regonly, setRegOnly] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const decodedCookie = decodeURIComponent(sessionCookie);
      const sessionData = JSON.parse(decodedCookie);
      setSession(sessionData);
      
    }
  }, []);

  useEffect(() => {
    if (recipeData) {
      setRecipe(recipeData.recipe);
      setTitle(recipeData.recipe.title);
      setDescription(recipeData.recipe.description);
      setIngredients(recipeData.recipe.ingredients);
      setInstructions(recipeData.recipe.instructions);
      // setImages(recipeData.recipe.images); Ei toimi WIP
      setRegOnly(recipeData.recipe.regonly);
    }
  }, [recipeData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('hi')

    if (session.userId !== recipeData.recipe.author.id ) {
      if (session.userId !== 'Wzxstkc8R6iQyPLfZc517Q') {
        setError('Unauthorized!');
        return;
      }

    }

    // Check if required fields are filled
  if (!title || !description || ingredients.length === 0 || instructions.length === 0) {
    setError('Missing required fields');
    return;
  }

  // Check if ingredient fields are filled
  const invalidIngredients = ingredients.filter(
    (ingredient) => !ingredient.name || !ingredient.amount || !ingredient.unit
  );
  if (invalidIngredients.length > 0) {
    setError('Invalid ingredient fields:', invalidIngredients);
    return;
  }

  // Check if instruction fields are filled
  const invalidInstructions = instructions.filter((instruction) => !instruction);
  if (invalidInstructions.length > 0) {
    setError('Invalid instruction fields:', invalidInstructions);
    return;
  }

  const { id } = recipeData.recipe;

    // Prepare the data to send to the API route
    const data = {
      id: id,
      title,
      description,
      ingredients: ingredients.filter(ingredient => ingredient.name && ingredient.amount && ingredient.unit),
      instructions: instructions.filter(instruction => instruction),
      // images: images.map(image => ({ localPath: URL.createObjectURL(image), filename: image.name })),
      regonly: regonly,
      action: 'edit'
    };

    console.log(data)

    // Call the API route for updating the recipe
    const response = await fetch(`/api/editRecipe/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push(`/`);
    } else {
      const errorData = await response.json();
      console.error('Error updating recipe:', errorData.error);
    }
  };

  const handleCloseModal = () => {
    setError('');
  };

  const addIngredient = () => {

    if (!ingredientName || isNaN(ingredientAmount) || !ingredientUnit) {
      setError('Invalid ingredient data');
      return;
    }

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

    if (!instructionText) {
      setError('Invalid instruction data');
      return;
    }

    if (instructionText.trim() !== '') {
      setInstructions([...instructions, { instruction: instructionText }]);
      setInstructionText('');
    }
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    const isValidImageUrl = (url) => {
      return /^https?:\/\/.*\.(jpg|jpeg|png)$/i.test(url);
    };
  
    if (imageInput.trim() === '') {
      setError('Image URL cannot be empty');
      return;
    }
  
    if (!isValidImageUrl(imageInput.trim())) {
      setError('Invalid image URL. URL must start with "http://" or "https://" and end with ".jpg", ".jpeg", or ".png".');
      return;
    }
  
    setImages([...images, imageInput.trim()]);
    setImageInput('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleRegOnlyToggle = () => {
    setRegOnly(!regonly);
  };

  const handleDiscard = () => {
    router.push('/');
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
                {instruction.instruction} 
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
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Paste Image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="border border-gray-400 rounded w-full py-2 px-3 mr-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button" // Change the type to button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleAddImage}
              >
                Add Image
              </button>
            </div>
          </div>
  
          {/* Display selected images */}
          <div className="mt-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <img
                  src={image}
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
            )
            )
            }
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
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Recipe
        </button>
        <button
          onClick={handleDiscard}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Discard changes
        </button>
      </div>
          </form>
        </div>

    {/* Other JSX elements */}
    {error && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Error
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleCloseModal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export async function getStaticPaths() {
  const PATHS_QUERY = `
    query MyQuery {
      allRecipes {
        id
      }
    }
  `;

  const recipeQuery = await request({
    query: PATHS_QUERY,
  });

  const paths = recipeQuery.allRecipes.map((recipe) => ({
    params: { id: recipe.id.toString() }, // Ensure the id is converted to a string
  }));

  return {
    paths,
    fallback: false,
  };
}


// Fetch recipe data based on the ID provided in the URL
export const getStaticProps = async ({ params }) => {
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
          name
          amount
          unit
        }
        instructions {
          instruction
        }
      }
    }
  `;
  const data = await request({
    query: POST_QUERY,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      recipeData: data,
    },
  };
};


/* export async function getServerSideProps(context) {
  const { id } = context.query;
  const cookies = context.req.headers.cookie;

  const cookieString = decodeURIComponent(cookies);
  const sessionCookie = cookieString
    .split(';')
    .find((c) => c.trim().startsWith('session'));

  if (!sessionCookie) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const session = JSON.parse(sessionCookie.split('=')[1]);

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

  const data = await request({
    query: POST_QUERY,
    variables: {
      id,
    },
  });

  const { recipe } = data;

  if (!recipe || (session.username !== recipe.author.username && !session.isAdmin)) {
    // Redirect to home page if the user is neither the author nor an admin
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      recipeData: data, // Adjust the key as per your query response structure
      session,
    },
  };
} */