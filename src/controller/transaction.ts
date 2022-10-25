import Transaction from '../models/transaction';
import { stringToJson } from '../libs/stringToJson';
import { ParameterizedContext } from 'koa';
import { Op } from 'sequelize';

export const transactionCreate = async (ctx: ParameterizedContext, next: Function) => {
  const { amount, note, type } = ctx.request.body;
  if (!amount || !note || !type) {
    ctx.status = 409;
    return;
  }
  const { response, error } = await stringToJson(
    Transaction.create({
      amount,
      note,
      type,
      userRef: ctx._auth.user.userRef,
      createAt: new Date(),
      updatedAt: new Date(),
    })
  );
  if (!response || error) {
    ctx.status = 409;
    return;
  }
  ctx.body = { body: 'successfully create transaction' };
  return;
};

export const transactionUpdate = async (ctx: ParameterizedContext, next: Function) => {
  const { id, amount, note, type } = ctx.request.body;
  if (!id || !amount || !note || !type) {
    ctx.status = 409;
    return;
  }
  try {
    await Transaction.update(
      { amount, note, type, userRef: ctx._auth.user.userRef },
      {
        where: {
          id,
        },
      }
    );
  } catch (e) {
    console.log(e);
    ctx.status = 409;
    return;
  }
  ctx.body = { body: 'successfully update transaction' };
  return;
};
export const transactionDelete = async (ctx: ParameterizedContext, next: Function) => {
  const { id } = ctx.request.query;
  if (!id) {
    ctx.status = 409;
    return;
  }
  const resolveDelete = await Transaction.destroy({ where: { id } });
  if (resolveDelete === 0) {
    ctx.status = 409;
    return;
  }
  ctx.body = { body: 'successfully delete transaction' };
  return;
};
export const transactionGetAll = async (ctx: ParameterizedContext, next: Function) => {
  const { limit, sort, cursor, kind, type, startAt, endAt } = ctx._pagingRequest;
  const types = ['income', 'expense'];
  const kindSort =
    kind === 'date'
      ? { createdAt: sort === 'DESC' ? { [Op.lt]: new Date(cursor * 1000) } : { [Op.gt]: new Date(cursor * 1000) } }
      : { amount: sort === 'DESC' ? { [Op.lt]: cursor } : { [Op.gt]: cursor } };

  const kindFilter = types.includes(type) ? { type } : { amount: { [Op.between]: [startAt, endAt] } };
  const query = cursor
    ? {
        ...kindSort,
        ...kindFilter,
        userRef: ctx._auth.user.userRef,
      }
    : { ...kindFilter, userRef: ctx._auth.user.userRef };

  const kindOrder: [any, any] = kind === 'date' ? ['createdAt', sort] : ['amount', sort];
  const todoData = await Transaction.findAll({
    where: query,
    order: [kindOrder],
    limit: parseInt(limit) + 1,
  });
  ctx.body = { payload: todoData };
  return next();
};
