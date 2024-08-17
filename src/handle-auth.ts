import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

const secretKey = '123-456-789';

export const handleAuth = async (ctx: Context) => {
  if (!ctx.request.headers.authorization) {
    ctx.throw("Unauthorized", 401);
  }

  const token = ctx.request.headers.authorization.split(' ')[1];

  const decoded = jwt.verify(token, secretKey);
  
  if (!token || !decoded) {
    ctx.throw("Unauthorized", 401);
  }

  ctx.state.user = decoded;
};
