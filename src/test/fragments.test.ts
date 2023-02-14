export const AddressFragment = `id street streetNumber complement neighborhood city state cep`;

export const UserFragment = `id name email birthDate address { ${AddressFragment} }`;

export const LoginFragment = `user { ${UserFragment} } token`;

export const PageInfoFragment = `hasNextPage hasPreviousPage page offset limit totalPages`;

export const PaginatedUsersFragment = `users { ${UserFragment} } count pageInfo { ${PageInfoFragment} }`;
