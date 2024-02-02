// pages/index.js
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';

const dummyData = [
    {
        image: 'https://via.placeholder.com/150',
        title: 'Recipe 1',
        description: 'This is a description for Recipe 1.',
        rating: 4.5,
    },
    {
        image: 'https://via.placeholder.com/150',
        title: 'Recipe 2',
        description: 'This is a description for Recipe 2.',
        rating: 4.0,
    },
    {
        image: 'https://via.placeholder.com/150',
        title: 'Recipe 3',
        description: 'This is a description for Recipe 3.',
        rating: 5.0,
    },
    {
        image: 'https://via.placeholder.com/150',
        title: 'Recipe 4',
        description: 'This is a description for Recipe 4.',
        rating: 3.5,
    },
    {
        image: 'https://via.placeholder.com/150',
        title: 'Recipe 5',
        description: 'This is a description for Recipe 5.',
        rating: 4.5,
    },
];

const HomePage = () => (
    <Layout>
        <div>
            <h1 className="text-2xl font-bold mb-4">Top Recipes</h1>
            <div className="flex flex-wrap justify-around">
                {dummyData.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe}/>
                ))}
            </div>
            <h1 className="text-2xl font-bold mb-4">Trending Recipes</h1>
            <div className="flex flex-wrap justify-around">
                {dummyData.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe}/>
                ))}
            </div>
        </div>
    </Layout>
);

export default HomePage;