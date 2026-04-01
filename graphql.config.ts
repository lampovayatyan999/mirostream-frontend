import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['./src/graphql/**/*.graphql'],
  generates: {
    'src/graphql/generated/output.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        noNamespaces: true,
        useTypeImports: true,

      }
    }
  }
};

export default config;