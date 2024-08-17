import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export const handleAuth = async (ctx: Context) => {
  if (!ctx.request.headers.authorization) {
    ctx.throw("Unauthorized", 401);
  }

  const token = ctx.request.headers.authorization.split(' ')[1];

  const decoded = jwt.verify(token, process.env.JWT_KEY as string);
  
  if (!token || !decoded) {
    ctx.throw("Unauthorized", 401);
  }

  ctx.state.user = decoded;
};
