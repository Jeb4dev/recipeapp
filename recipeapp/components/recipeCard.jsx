// components/RecipeCard.js
import React from 'react';
import { Image } from 'react-datocms';
import Link from 'next/link';

const RecipeCard = ({ recipe }) => {
  const image = recipe.image[0];
  function ImageDiv() {
    return image ? (
      <Image className="w-full h-48" alt={image.responsiveImage.alt} data={image.responsiveImage} objectFit={'cover'} />
    ) : (
      <div className={"m-12"}>Image not found</div>
    );
  }
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg my-4">
      <ImageDiv />
      <div className="px-6 py-4">
        <Link href={`/recipes/${recipe.id}`}>
          <div className="font-bold text-xl mb-2 hover:underline">{recipe.title}</div>
        </Link>
        <p className="text-gray-700 text-base">{recipe.description.slice(0, 220)}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {`⭐️ ${recipe.likes}`}
        </span>
      </div>
    </div>
  );
};

export default RecipeCard;
