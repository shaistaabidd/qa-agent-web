import { gql } from '@apollo/client';

export const CREATE_SUBSCRIPTION_CHECKOUT = gql`
  mutation CreateSubscriptionCheckout($cancelUrl: String!, $successUrl: String!) {
    createSubscriptionCheckout(input: { cancelUrl: $cancelUrl, successUrl: $successUrl }) {
      checkoutUrl
    }
  }
`;
