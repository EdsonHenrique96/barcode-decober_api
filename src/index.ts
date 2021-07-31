import BarCodeManager from './services/BarCodeMenager';
import { Calculator } from './infra/modules/Calculator';
import { DateManager } from './infra/modules/DateManager';

const testCode = "00190500954014481606906809350314384360000000000000000000";


const meuBoleto = "03399201595100029953080202201028584360000127236";
const cal = new Calculator();
const date = new DateManager();
const barCodeManager = new BarCodeManager(testCode, cal, date);
console.log(barCodeManager.validateBarCode());
console.log(barCodeManager.getExpirationDate());
// adicionar timezone como env?