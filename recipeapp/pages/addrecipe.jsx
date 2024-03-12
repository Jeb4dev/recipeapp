import { request } from '../../lib/datocms';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddRecipe() {
  const router = useRouter();
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    incredients: [{ incredient: '', amount: '', unit: '' }],
    instructions: [{ instruction: '' }],
    images: [],
    serving: 1,
    author: heisenbergi // PLACEHOLDER
  });

  const handleInputChange = (event, index, type) => {
    const { name, value } = event.target;
    const updatedRecipe = { ...recipe };
    if (type === 'incredients') {
      updatedRecipe.incredients[index][name] = value;
    } else if (type === 'instructions') {
      updatedRecipe.instructions[index][name] = value;
    } else {
      updatedRecipe[name] = value;
    }
    setRecipe(updatedRecipe);
  };

  const handleAddField = (type) => {
    if (type === 'incredients') {
      setRecipe({
        ...recipe,
        incredients: [...recipe.incredients, { incredient: '', amount: '', unit: '' }],
      });
    } else if (type === 'instructions') {
      setRecipe({
        ...recipe,
        instructions: [...recipe.instructions, { instruction: '' }],
      });
    }
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      imagesArray.push(files[i]);
    }
    setRecipe({ ...recipe, images: imagesArray });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(recipe));

      recipe.images.forEach((image, index) => {
        formData.append(`files.images[${index}]`, image);
      });

      const data = await fetch('/api/createRecipe', {
        method: 'POST',
        body: formData,
      });

      const response = await data.json();
      console.log(response);
      router.push(`/recipes/${response.id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Add Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2">
            Recipe Name:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={(event) => handleInputChange(event)}
            className="w-full px-4 py-2 border rounded-md text-black"
            required
            placeholder="Write recipe name here."
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={(event) => handleInputChange(event)}
            rows="4"
            className="w-full px-4 py-2 border rounded-md text-black"
            required
            placeholder="Write description of your recipe here."
          ></textarea>
        </div>
        {/* Other form fields */}
        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-semibold">Ingredients:</h2>
          {recipe.incredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                name={`incredient-${index}`}
                value={ingredient.incredient}
                onChange={(event) => handleInputChange(event, index, 'incredients')}
                className="flex-1 px-4 py-2 border rounded-md text-black"
                placeholder="Ingredient"
              />
              <input
                type="text"
                name={`amount-${index}`}
                value={ingredient.amount}
                onChange={(event) => handleInputChange(event, index, 'incredients')}
                className="w-24 px-4 py-2 border rounded-md text-black"
                placeholder="Amount"
              />
              <input
                type="text"
                name={`unit-${index}`}
                value={ingredient.unit}
                onChange={(event) => handleInputChange(event, index, 'incredients')}
                className="w-24 px-4 py-2 border rounded-md text-black"
                placeholder="Unit"
              />
              {index === recipe.incredients.length - 1 && (
                <button type="button" onClick={() => handleAddField('incredients')} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Add Ingredient
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Instructions */}
        <div>
          <h2 className="text-xl font-semibold">Instructions:</h2>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                name={`instruction-${index}`}
                value={instruction.instruction}
                onChange={(event) => handleInputChange(event, index, 'instructions')}
                className="flex-1 px-4 py-2 border rounded-md text-black"
                placeholder={`Step ${index + 1}`}
              />
              {index === recipe.instructions.length - 1 && (
                <button type="button" onClick={() => handleAddField('instructions')} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Add Instruction
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
          Create Recipe
        </button>
      </form>
    </div>
  );
  
}