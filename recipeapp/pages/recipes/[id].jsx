import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { Image } from 'react-datocms';

export default function RecipePage(props) {
  const recipe = props.data.recipe;
  return (
    <Layout>
      <div>
        <div className="flex">
          {recipe.image.map((img, index) => (
            <Image
              key={index}
              className={'h-[600px] w-[600px]'}
              data={img.responsiveImage}
              alt={img.responsiveImage.alt}
              objectFit={'cover'}
            />
          ))}
        </div>
        <div className={'px-10'}>
          <div className={'flex justify-between items-center'}>
            <h1 className="text-2xl font-bold my-4">{recipe.title}</h1>
            <p className="text-2xl">{`⭐️ ${recipe.likes}`}</p>
          </div>
          <p className="text-gray-700 text-base">{recipe.description}</p>
        </div>
      </div>
    </Layout>
  );
}

const PATHS_QUERY = `
query MyQuery {
  allRecipes {
    id
  }
}
`;

export async function getStaticPaths() {
  const recipeQuery = await request({
    query: PATHS_QUERY,
  });

  let paths = [];
  recipeQuery.allRecipes.map((p) => paths.push(`/recipes/${p.id}`));

  return {
    paths,
    fallback: false,
  };
}

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
    }
  }
}
`;
export const getStaticProps = async ({ params }) => {
  const data = await request({
    query: POST_QUERY,
    variables: {
      id: params.id,
    },
  });

  return {
    props: { data },
  };
};
