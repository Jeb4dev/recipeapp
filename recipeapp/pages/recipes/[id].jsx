import Layout from '../../components/layout';
import { request } from '../../lib/datocms';
import { Image } from 'react-datocms';

export default function Post(props) {
  const recipe = props.data.recipe;
  return (
    <Layout>
      <div>
        <Image
          className={'h-[600px]'}
          data={recipe.image[0].responsiveImage}
          alt={recipe.image[0].responsiveImage.alt}
          objectFit={'cover'}
        />
        <div className={"px-10"}>
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
  console.log(params);
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
