import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout';

export default function NewRecipe() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [images, setImages] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleIngredientChange = (e) => {
    setIngredientInput(e.target.value);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages([...images, ...selectedImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const author = heisenberg;

    const response = await fetch('/api/recipe/addRecipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, author, likes }),
    });

    if (response.ok) {
      await router.push('/recipes');
    } else {
      const data = await response.json();
      setError(data.error);
    }
  }

  return (
    <Layout title="New Recipe">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-4">New Recipe</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">
              Recipe Name:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border rounded-md text-black"
              required
              placeholder="Write recipe name here."
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-md text-black"
              required
              placeholder="Write description of your recipe here."
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="ingredients" className="block mb-2">
              Ingredients:
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={ingredientInput}
              onChange={handleIngredientChange}
              className="w-full px-4 py-2 border rounded-md text-black"
              placeholder='Type your ingredient, then click "Add Ingredient" button to add it to the list of ingredients.'
            />
          </div>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Add Ingredient
          </button>
          {ingredients.length > 0 && (
            <ul className="mb-4">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mb-4">
            <label htmlFor="images" className="block mb-2">
              Images:
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="border rounded-md"
            />
          </div>
          {images.length > 0 && (
            <ul className="mb-4">
              {images.map((image, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{image.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7.414A2 2 0 0016.414 6L12 1.586A2 2 0 0010.586 1H5zm1 2h4v1.586L14.414 8H6V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
