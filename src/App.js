import CStoreController from './controllers/CStoreController.js';

class App {
  async run() {
    const cstoreController = new CStoreController();
    cstoreController.start();
  }
}

export default App;
