import { useState } from 'react';
import Layout from '../components/layout';

export default function NewRecipe() {
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

  return (
    <Layout title="New Recipe">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-4">New Recipe</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Recipe Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
              placeholder='Write recipe name here.'
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-md"
              required
              placeholder='Write description of your recipe here.'
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="ingredients" className="block mb-2">Ingredients:</label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={ingredientInput}
              onChange={handleIngredientChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder='Type your ingredient, then click "Add Ingredient" button to add it to the list of ingredients.'
            />
          </div>
          <button type="button" onClick={handleAddIngredient} className="bg-red-500 text-white px-4 py-2 rounded-md mb-4">Add Ingredient</button>
          {ingredients.length > 0 && (
            <ul className="mb-4">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{ingredient}</span>
                  <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mb-4">
            <label htmlFor="images" className="block mb-2">Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple // Allow multiple file selection
              className="border rounded-md"
            />
          </div>
          {images.length > 0 && (
            <ul className="mb-4">
              {images.map((image, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{image.name}</span>
                  <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
