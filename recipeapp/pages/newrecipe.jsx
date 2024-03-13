import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';

const NewRecipePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [serving, setServing] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { instruction: '' }]);
  };

  const removeInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const handleIngredientChange = (index, event) => {
    const { name, value } = event.target;
    const newIngredients = [...ingredients];
    newIngredients[index][name] = value;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index, event) => {
    const { value } = event.target;
    const newInstructions = [...instructions];
    newInstructions[index].instruction = value;
    setInstructions(newInstructions);
  };

  const handleImageChange = (event) => {
    const newImages = [...images];
    for (const file of event.target.files) {
      newImages.push(file);
    }
    setImages(newImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('serving', serving);
      formData.append('author', 'heisenbergi');
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}][name]`, ingredient.name);
        formData.append(`ingredients[${index}][amount]`, ingredient.amount);
        formData.append(`ingredients[${index}][unit]`, ingredient.unit);
      });
      instructions.forEach((instruction, index) => {
        formData.append(`instructions[${index}][instruction]`, instruction.instruction);
      });
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch('/api/createRecipe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      console.log('New recipe created:', data.recipe);
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setIngredients([]);
      setInstructions([]);
      setServing('');
      setImages([]);
      setError('');
      // Redirect to the newly created recipe page or any other page as needed
      router.push(`/recipes/${data.recipe.id}`);
    } catch (error) {
      console.error('Error creating new recipe:', error.message);
      setError('Error creating new recipe. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-4">Create a New Recipe</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Title:
            <input className="border border-gray-300 px-4 py-2 mt-2 w-full" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block mb-4">
            Description:
            <textarea className="border border-gray-300 px-4 py-2 mt-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <div className="mb-4">
            <label className="block mb-2">Ingredients:</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input className="border border-gray-300 px-2 py-1 mr-2 w-1/3" type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} placeholder="Name" />
                <input className="border border-gray-300 px-2 py-1 mr-2 w-1/3" type="text" name="amount" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, e)} placeholder="Amount" />
                <input className="border border-gray-300 px-2 py-1 mr-2 w-1/3" type="text" name="unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)} placeholder="Unit" />
                <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 px-2 py-1 bg-transparent border border-red-500 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="bg-blue-500 text-white px-4 py-2 rounded">Add Ingredient</button>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Instructions:</label>
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea className="border border-gray-300 px-4 py-2 mr-2 w-full" value={instruction.instruction} onChange={(e) => handleInstructionChange(index, e)} placeholder={`Step ${index + 1}`} />
                <button type="button" onClick={() => removeInstruction(index)} className="text-red-500 px-2 py-1 bg-transparent border border-red-500 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="bg-blue-500 text-white px-4 py-2 rounded">Add Instruction</button>
          </div>
          <label className="block mb-4">
            Serving:
            <input className="border border-gray-300 px-4 py-2 mt-2 w-full" type="text" value={serving} onChange={(e) => setServing(e.target.value)} />
          </label>
          <label className="block mb-4">
            Add Images:
            <input className="border border-gray-300 px-4 py-2 mt-2 w-full" type="file" accept="image/*" multiple onChange={handleImageChange} />
          </label>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default NewRecipePage;