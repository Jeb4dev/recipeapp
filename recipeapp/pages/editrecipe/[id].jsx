import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditRecipePage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(props.data.recipe);

  // Function to handle changes in input fields
  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedRecipe = { ...recipe };
    if (name.startsWith('ingredient')) {
      // Update ingredient
      const ingredientIndex = parseInt(name.split('-')[1]);
      updatedRecipe.ingredients[ingredientIndex][name.split('-')[0]] = value;
    } else if (name.startsWith('instruction')) {
      // Update instruction
      const instructionIndex = parseInt(name.split('-')[1]);
      updatedRecipe.instructions[instructionIndex][name.split('-')[0]] = value;
    } else {
      // Update other fields
      updatedRecipe[name] = value;
    }
    setRecipe(updatedRecipe);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/editrecipe/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      if (res.ok) {
        router.push(`/recipes/${id}`);
      } else {
        throw new Error('Failed to update recipe.');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      // Handle error
    }
  };

  // Function to handle recipe deletion
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/editrecipe/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push(`/recipes`);
      } else {
        throw new Error('Failed to delete recipe.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      // Handle error
    }
  };

  return (
    <Layout>
      <div className={'bg-red-50 min-h-screen'}>
        <div className="max-w-screen-xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Your form UI */}
            {/* Title */}
            <input type="text" name="title" value={recipe.title} onChange={handleInputChange} placeholder="Title" />
            {/* Description */}
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            {/* Ingredients */}
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`ingredient-${index}`}
                  value={ingredient.ingredient}
                  onChange={(event) => handleInputChange(event, index)}
                  placeholder="Ingredient"
                />
                <input
                  type="text"
                  name={`amount-${index}`}
                  value={ingredient.amount}
                  onChange={(event) => handleInputChange(event, index)}
                  placeholder="Amount"
                />
                <input
                  type="text"
                  name={`unit-${index}`}
                  value={ingredient.unit}
                  onChange={(event) => handleInputChange(event, index)}
                  placeholder="Unit"
                />
              </div>
            ))}
            {/* Instructions */}
            {recipe.instructions.map((instruction, index) => (
              <input
                key={index}
                type="text"
                name={`instruction-${index}`}
                value={instruction.instruction}
                onChange={(event) => handleInputChange(event, index)}
                placeholder={`Step ${index + 1}`}
              />
            ))}
            <button type="submit">Save</button>
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

const GET_RECIPE_QUERY = `
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
    title
    description
    author {
      username
      id
    }
    ingredients {
      amount
      ingredient
      unit
    }
    instructions {
      instruction
    }
  }
}
`;

export const getStaticProps = async ({ params }) => {
  const data = await request({
    query: GET_RECIPE_QUERY,
    variables: {
      id: params.id,
    },
  });

  return {
    props: { data },
  };
};

export async function getStaticPaths() {
  const recipesQuery = await request({
    query: `
      query {
        allRecipes {
          id
        }
      }
    `,
  });

  const paths = recipesQuery.allRecipes.map((recipe) => ({
    params: { id: recipe.id.toString() },
  }));

  return { paths, fallback: false };
}
