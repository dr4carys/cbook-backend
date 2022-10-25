import { userCreate, userLogin, userLogout } from './controller/user';
import { authentication } from './middleware/bearer';
import { transactionCreate, transactionUpdate, transactionGetAll, transactionDelete } from './controller/transaction';
import { Paging } from './middleware/paging';
import Router from 'koa-router';
const router = new Router();

router.post('/me/createUser', userCreate);
router.post('/me/signIn', userLogin);
router.post('/transactionCreate', authentication(), transactionCreate);
router.patch('/transactionUpdate', authentication(), transactionUpdate);
router.get('/transactionGet', authentication(), Paging, transactionGetAll);
router.get('/transactionDelete', authentication(), transactionDelete);
router.patch('/me/signout', authentication(), userLogout);

export default router;
