export const UserFragment = 'id name email birthDate';

export const LoginFragment = `user { ${UserFragment} } token`;

export const PageInfoFragment = `hasNextPage hasPreviousPage page offset limit totalPages`;

export const PaginatedUsersFragment = `users { ${UserFragment} } count pageInfo { ${PageInfoFragment} }`;
