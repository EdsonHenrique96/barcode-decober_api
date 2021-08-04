
import { Request, Response, NextFunction } from 'express';
import ValidationError from './errors/validation-error';

const DIGITABLE_LINE_SIZE = 47;

const haveDigitNotNumber = (digitableLine: string) => {
  const digitsNotNumber = digitableLine
      .split('')
      .find((x) => isNaN(parseInt(x)));

  return !!digitsNotNumber;
} 

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const digitableLine = req.params.digitableLine.toString();
    const isWrongSize = !(digitableLine.length === DIGITABLE_LINE_SIZE);

    if (isWrongSize) {
      throw new ValidationError('digitableLine must be 47 digits');
    }    

    if (haveDigitNotNumber(digitableLine)) {
      throw new ValidationError('only numbers as a digit are accepted');
    }

    return next();
  } catch(e) {
    console.error(
      JSON.stringify(
        {
          status: 412,
          message: e.message,
          timestamp: new Date().getTime()
        }
      )
    );

    return res
      .status(412)
      .json({error: e.message });
  }
}