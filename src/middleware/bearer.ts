import { decode, Jwt, verify } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import {
  JWT_SIGNATURE,
  //  EXCLUDE_AUTH_GRAPHQL
} from '../config';
// import { OperationDefinitionNode, parse } from 'graphql';
import AccessModel from '../models/accessAccount';
import { stringToJson } from '../libs/stringToJson';

export const authentication =
  (errStatus: number = 401) =>
  async (ctx: ParameterizedContext, next: Function) => {
    let token;
    if (ctx.header && ctx.header['authorization']) {
      const parts = ctx.header['authorization'].split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
        if (!token) {
          console.log('kesini');
          ctx.status = errStatus;
          return;
        }
      }
    }
    try {
      const {
        header: { alg },
        payload: { iss },
      } = <Jwt>decode(token, { complete: true });

      if (alg !== 'HS256') {
        console.log('wrong alg', iss);
        ctx.status = errStatus;
        return;
      }

      if (iss === 'user@crediBook.co') {
        const { user } = <{ user: { _id: string; name: string; userRef: string; accessRef: string } }>(
          verify(token, JWT_SIGNATURE)
        );
        const access = await stringToJson(
          AccessModel.findOne({
            where: { id: user.accessRef, userRef: user.userRef, isActive: 0 },
          })
        );
        if (!access.response) {
          ctx.status = errStatus;
          return;
        }
        ctx._auth = { user };
        await next();
      } else {
        ctx.status = errStatus;
        return;
      }
    } catch (err) {
      console.log('authentication >>> ', err);
      ctx.status = errStatus;
      return;
    }
  };

