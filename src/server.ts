import Koa from 'koa';
import cors from 'kcors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import { schema } from './schemas';
import { connectToDatabase } from './database';

const app = new Koa();
const router = new Router();
const port = 3000;

app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  })
);
app.use(cors({ origin: '*' }));

router.all(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    customFormatErrorFn: (err: any) => {
      return {
        message: err.message,
      };
    },
  })
);

app.use(router.routes());;

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`🚀 Server is running on port http://localhost:${port}/`);
  console.log(`🚀 GraphQL server is ready at http://localhost:${port}/graphql`);
});
