import axios from 'axios';
import { DocumentNode, print } from 'graphql';

export class requestMaker {
  static async post({ query, variables, headers }: { query: DocumentNode; variables?; headers? }) {
    return await axios.post(
      `http://localhost:${process.env.PORT}`,
      {
        query: print(query),
        variables,
      },
      { headers },
    );
  }
}
