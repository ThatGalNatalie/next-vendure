import Head from 'next/head';
import styles from '../styles/Home.module.css';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/apollo';

import ProductCard from '../components/ProductCard';

const QUERY = gql`
  {
    products {
      items {
        name
        slug
        description
        variants {
          id
        }
        assets {
          source
        }
      }
    }
  }
`;

function Home() {
  const { loading, data } = useQuery(QUERY);

  return (
    <div className={styles.container}>
      {loading ? <h1>Loading...</h1> : <ProductCard productData={data} />}
    </div>
  );
}

export default Home;
