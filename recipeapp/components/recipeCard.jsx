// components/RecipeCard.js
import React from 'react';

const RecipeCard = ({ recipe }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-amber-500">
            <img className="w-full" src={recipe.image} alt={recipe.title} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{recipe.title}</div>
                <p className="text-gray-700 text-base">{recipe.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {`⭐️ ${recipe.rating}`}
        </span>
            </div>
        </div>
    );
};

export default RecipeCard;