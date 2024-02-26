import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { request } from '../../lib/datocms';

export default function EditRecipe({ recipeData }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (recipeData) {
      setTitle(recipeData.recipe.title);
      setDescription(recipeData.recipe.description);
      setIngredients(recipeData.recipe.incredients);
      // Assuming you also need to set images, adjust this according to your data structure
      setImages(recipeData.recipe.image);
    }
  }, [recipeData]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Add, remove, and handle ingredient functions here (similar to the NewRecipe component)

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages([...images, ...selectedImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Update the recipe with new data
    const updatedRecipe = {
      title,
      description,
      incredients: ingredients, // Assuming your API expects this key
      image: images, // Assuming your API expects this key
      // Assuming you need other data like author and likes, adjust this according to your data structure
    };

    // Send updated recipe to your backend to save changes
    const response = await fetch(`/api/recipe/${recipeData.recipe.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecipe),
    });

    if (response.ok) {
      await router.push(`/recipes/${recipeData.recipe.id}`);
    } else {
      const data = await response.json();
      setError(data.error);
    }
  };

  return (
    <Layout title="Edit Recipe">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-semibold mb-4">Edit Recipe</h1>
        <form onSubmit={handleSubmit}>
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
          {/* Form fields for ingredients and images can be added similarly */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
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
          incredient
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
