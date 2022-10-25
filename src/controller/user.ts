import { ParameterizedContext } from 'koa';
import { JWT_SIGNATURE } from '../config';
import { sign } from 'jsonwebtoken';
import { stringToJson } from '../libs/stringToJson';
import UserModel from '../models/userAccount';
import AccessModel from '../models/accessAccount';


const createJwtAccessToken = (user: any, access: any) => {
  const jwtPayload = {
    user: { _id: user.email, name: user.username, userRef: user.id, accessRef: access.id },
    iss: 'user@crediBook.co',
  };
  const jwtOptions = { expiresIn: '120m' };
  const accessToken = sign(jwtPayload, JWT_SIGNATURE, jwtOptions);

  return accessToken;
};

export const userCreate = async (ctx: ParameterizedContext, next: Function) => {
  const { username, password } = ctx.request.body;

  const { response, error } = await stringToJson(
    UserModel.create({ username, password, isRemoved: 0, createdAt: new Date(), updatedAt: new Date() })
  );
  if (error || !response) {
    ctx.status = 409;
    return;
  }
  ctx.body = { body: 'user succesfully creted' };
  return;
};

export const userLogin = async (ctx: ParameterizedContext, next: Function) => {
  const { password, username } = ctx.request.body;
  const { response, error } = await stringToJson(
    UserModel.findOne({ where: { password: password, username: username } })
  );
  if (error || !response) {
    ctx.status = 409;
    return;
  }
  const { response: responseAuth } = await stringToJson(
    AccessModel.findOne({ where: { userRef: response.id, isActive: 0 } })
  );
  if (responseAuth) {
    ctx.status = 401;
    ctx.body = 'already logged in';
    return;
  }
  const { response: responseAccess, error: errorAccess } = await stringToJson(
    AccessModel.create({ userRef: response.id, createdAt: new Date(), updatedAt: new Date() })
  );
  if (errorAccess || !responseAccess) {
    ctx.status = 409;
    return;
  }
  const token = createJwtAccessToken(response, responseAccess);
  ctx.body = { token };
  return;
};

export const userLogout = async (ctx: ParameterizedContext, next: Function) => {
  console.log('kesin', ctx._auth.user.accessRef);
  try {
    await AccessModel.update(
      { isActive: 1 },
      {
        where: {
          id: ctx._auth.user.accessRef,
        },
      }
    );
  } catch (e) {
    console.log(e);
    ctx.status = 409;
    return;
  }
  ctx.status = 200;
  return;
};
