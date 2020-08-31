import React from 'react';
import { gql } from 'apollo-boost';
// import { Mutation, Query } from 'react-apollo';
import { useMutation, useQuery } from '@apollo/react-hooks';

import Link from 'next/link';

import styles from '../styles/ProductCard.module.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const ORDER_FRAGMENT = gql`
  fragment ActiveOrder on Order {
    id
    code
    state
    total
    currencyCode
    lines {
      id
      productVariant {
        id
        name
        currencyCode
      }
      unitPriceWithTax
      quantity
      totalPrice
      featuredAsset {
        id
        preview
      }
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ...ActiveOrder
    }
  }
  ${ORDER_FRAGMENT}
`;

const GET_ACTIVE_ORDER = gql`
  {
    activeOrder {
      ...ActiveOrder
    }
  }
  ${ORDER_FRAGMENT}
`;

var s = new Array();

function ProductCard({ productData }) {
  const classes = useStyles();
  const { items } = productData.products;
  const { loading, error, data } = useQuery(GET_ACTIVE_ORDER);

  const [addItemToOrder] = useMutation(ADD_TO_CART, {
    update: (cache, mutationResult) => {
      const { activeOrder } = cache.readQuery({
        query: GET_ACTIVE_ORDER,
      });

      cache.writeQuery({
        query: GET_ACTIVE_ORDER,
        data: {
          activeOrder: mutationResult.data.addItemToOrder,
        },
      });
    },
    onCompleted: () => {
      s.push(data);
      console.log(s);
    },
  });

  const addProduts = async (id) => {
    await addItemToOrder({
      variables: {
        productVariantId: Number(id),
        quantity: 2,
      },
    });
  };

  return (
    <section className={styles.container}>
      {items.map((item) => {
        const imgUrl = item.assets[0].source;

        return (
          <div key={item.slug}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={imgUrl}
                  title={item.slug}
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2'>
                    {item.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {/* <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => handleAdd(item.variants[0].id)}
                >
                  Add To Cart
                </Button> */}

                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    addProduts(item.variants[0].id);
                  }}
                >
                  Add To Cart
                </Button>

                {/* <Button variant='outlined' color='primary'>
                  Add to Cart
                </Button> */}

                {/* <Button variant='outlined' color='secondary' onClick={checkout}>
                  Checkout
                </Button> */}
              </CardActions>
            </Card>
          </div>
        );
      })}
    </section>
  );
}
export default ProductCard;
