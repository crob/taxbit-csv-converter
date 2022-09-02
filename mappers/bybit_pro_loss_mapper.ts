import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

export const bybit_pro_loss_mapping =  {
    [TaxBitHeaders.Date_and_Time]: row => row.Date,
    [TaxBitHeaders.Transaction_Type]: row => row[TaxBitHeaders.Transaction_Type] === 'Income' ? 'Margin win' : 'Margin loss',
    [TaxBitHeaders.Sent_Quantity]: row => {
        const amount = Number(row['Market Value']);
        return (row[TaxBitHeaders.Transaction_Type] === 'Expense') ? amount * -1 : amount;
    }
}

