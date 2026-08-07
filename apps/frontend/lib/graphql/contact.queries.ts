import { gql } from '@apollo/client';

// Admin-only: list persisted contact-form inquiries, newest first.
// Backend guards this with platform_admin role (GqlAuthGuard + GqlRolesGuard).
export const CONTACT_MESSAGES = gql`
  query ContactMessages($limit: Int) {
    contactMessages(limit: $limit) {
      id
      name
      email
      projectType
      message
      createdAt
    }
  }
`;
