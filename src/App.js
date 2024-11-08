import { Console } from '@woowacourse/mission-utils';
import CStoreController from './controllers/CStoreController.js';

class App {
  async run() {
    try {
      const cstoreController = new CStoreController();
      cstoreController.start();
    } catch (error) {
      Console.print(error.message);
    }
  }
}

export default App;
