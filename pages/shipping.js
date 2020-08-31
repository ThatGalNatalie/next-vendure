import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';

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

const ADD_ADDRESS_TO_ORDER = gql`
  mutation AddAddressToOrder($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ...ActiveOrder
    }
  }
  ${ORDER_FRAGMENT}
`;

const GET_ACTIVE_ORDER_FOR_CHECKOUT = gql`
  {
    activeOrder {
      ...ActiveOrder
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
        phoneNumber
      }
      customer {
        id
        firstName
        lastName
        emailAddress
      }
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

// fullName, company, street1, street2, city, province(state), postal code, country, phone number

function Shipping() {
  // const { data, loading, error } = useQuery(GET_ACTIVE_ORDER_FOR_CHECKOUT, {
  //   fetchPolicy: 'network-only',
  // });

  const { data } = useQuery(GET_ACTIVE_ORDER);
  const [addAddressToOrder] = useMutation(ADD_ADDRESS_TO_ORDER, {
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const submit = () => {
    const fullName = 'Natalie Smith';
    const company = '';
    const streetLine1 = '1313 Mockingbird Lane';
    const streetLine2 = '';
    const city = 'Los Angeles';
    const province = 'Califorina';
    const postalCode = '90028';
    const countryCode = 'US';
    const phoneNumber = '323-123-1234';

    const address = {
      fullName,
      company,
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
      countryCode,
      phoneNumber,
    };

    // addAddressToOrder({
    //   variables: {
    //     input: address,
    //   },
    // });

    console.log('data from shipping page', data);
  };

  return (
    <div>
      shipping page
      <button onClick={submit}>submit</button>
    </div>
  );
}

export default Shipping;
