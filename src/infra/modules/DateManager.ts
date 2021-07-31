import { format, addDays } from 'date-fns';

export class DateManager {
  public addDays(baseDate: Date, numOfDays: number): string {
    return  format(addDays(baseDate, numOfDays), 'dd/MM/yyyy');
  }
}