import { Request, Response, Router } from 'express';
import { DateManager } from '../infra/modules/DateManager';
import BarCodeManager from '../services/BarCodeManager';

const routes = Router();
const dateManager = new DateManager();

routes.get('/boleto/:digitableLine', (req: Request, res: Response) => {
  const boleto = req.params.digitableLine.toString();
  const barCodeManager = new BarCodeManager(boleto, dateManager);
  
  try{
    barCodeManager.isValid();
  } catch(e) {
    return res.status(400).json({ error: e.message || 'Unknown error' });
  }

  const expirationDate = barCodeManager.getExpirationDate();
  const amount = barCodeManager.getAmount();
  const barCode = barCodeManager.getBarCode();

  const responseData = {
    barCode,
    amount,
    expirationDate
  };

  return res.json(responseData);
});

export default routes;