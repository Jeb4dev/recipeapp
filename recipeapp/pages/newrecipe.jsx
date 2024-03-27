import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import Layout from '../components/layout';
import Cookies from 'js-cookie';

export default function NewRecipePage() {
  const [session, setSession] = useState(null);
  const router = useRouter();
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Set the author from session if sessionData.username exists
    const authorId = session.userId;

    // Check if required fields are filled
    if (!title || !description || ingredients.length === 0 || instructions.length === 0) {
      setError('Missing required fields');
      return;
    }

    // Check if ingredient fields are filled
    const invalidIngredients = ingredients.filter(
      (ingredient) => !ingredient.name || !ingredient.amount || !ingredient.unit,
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

    try {
      const imageUrls = [];
      for (const imageUrl of images) {
        const response = await fetch('/api/uploadImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          throw new Error('Error uploading image to DatoCMS');
        }

        const imageData = await response.json();
        imageUrls.push(imageData);
      }

      // Prepare the data to send to the API route
      const data = {
        title,
        description,
        ingredients: ingredients.filter((ingredient) => ingredient.name && ingredient.amount && ingredient.unit),
        instructions: instructions.filter((instruction) => instruction),
        images: imageUrls,
        regonly: regonly,
        author: authorId,
      };

      // Call the API route for creating a new recipe
      const createRecipeResponse = await fetch('/api/createRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (createRecipeResponse.ok) {
        setTimeout(() => {
          router.push(`/recipes`);
        }, 2000);
      } else {
        const errorData = await createRecipeResponse.json();
        setError('Error creating recipe:', errorData.error);
      }
    } catch (error) {
      setError('Error:', error.message);
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
      setIngredients([
        ...ingredients,
        { name: ingredientName, amount: parseFloat(ingredientAmount), unit: ingredientUnit },
      ]);
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
      setInstructions([...instructions, instructionText]);
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
      setError(
        'Invalid image URL. URL must start with "http://" or "https://" and end with ".jpg", ".jpeg", or ".png".',
      );
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

  return (
    <Layout>
      <title>Uusi resepti</title>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4 mt-4">Luo uusi resepti</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Otsikko
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
              Kuvaus
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
                Ainesosan nimi
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
                Määrä
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
                Yksikkö
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
              Lisää ainesosa
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
            Valmistusvaiheet
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
              Lisää valmistusvaihe
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Kuvat</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Lisää kuvan URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="border border-gray-400 rounded w-full py-2 px-3 mr-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button" // Change the type to button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={handleAddImage}
              >
                Lisää kuva
              </button>
            </div>
          </div>

          {/* Display selected images */}
          <div className="mt-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <img src={image} alt={`Uploaded Image ${index}`} className="w-16 h-16 object-cover rounded mr-2" />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => removeImage(index)}
                >
                  Poista
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input type="checkbox" checked={regonly} onChange={handleRegOnlyToggle} className="mr-2" />
              Näytä vain rekisteröityneille käyttäjille
            </label>
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Luo resepti
          </button>
        </form>
      </div>

      {/* Other JSX elements */}
      {error && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
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
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sulje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
