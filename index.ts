
import { App } from './src';
import { dbConnect } from './src/configs/database';
dbConnect();
console.log('server listening on port 3400');
App.listen(3000);