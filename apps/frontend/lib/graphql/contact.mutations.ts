import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_MESSAGE = gql`
  mutation SubmitContactMessage(
    $input: CreateContactMessageInput!
    $recaptchaToken: String
  ) {
    submitContactMessage(input: $input, recaptchaToken: $recaptchaToken) {
      success
      message
    }
  }
`;
