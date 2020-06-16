interface AuthOptions {
  jwt: {
    secret: string;
  };
}

export default {
  jwt: {
    secret: '123456',
  },
} as AuthOptions;
