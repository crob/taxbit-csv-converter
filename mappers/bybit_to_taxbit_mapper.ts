import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

const parseAmount = (row) => {
    return parseFloat(row['Amount'].replace(/\,/g, ''))
}

export const bybit_to_taxbit =  {
    [TaxBitHeaders.Date_and_Time]: row => moment(new Date(row.Time)).utc().format('yyyy-MM-DD HH:mm:ss'),
    [TaxBitHeaders.Transaction_Type]: row => {
        const amount = parseAmount(row);
        if (row.Type === 'Realized P&L') {
            return amount > 0 ? TaxBitTransactionType.Income : TaxBitTransactionType.Expense
        } else {
            return amount > 0 ? TaxBitTransactionType.Transfer_In : TaxBitTransactionType.Transfer_Out
        }
    },
    [TaxBitHeaders.Sent_Quantity]: row => {
        const amount = parseAmount(row);
        return amount > 0 ? '' : Math.abs(amount);
    },
    [TaxBitHeaders.Sent_Currency]: row => {
        const amount = parseAmount(row);
        return amount > 0 ? '' : row['Coin'];
    },
    [TaxBitHeaders.Sending_Source]: row => {
        const amount = parseAmount(row);
        return amount > 0 ? '' : 'ByBit';
    },
    [TaxBitHeaders.Received_Quantity]: row => {
        // console.log('wtf', row['Amount'], parseAmount(row)) 
        const amount = parseAmount(row);
        return amount < 0 ? '' : Math.abs(amount);
    },
    [TaxBitHeaders.Received_Currency]: row => {
        const amount = parseAmount(row);
        return amount < 0 ? '' : row['Coin'];
    },
    [TaxBitHeaders.Receiving_Destination]: row => {
        const amount = parseAmount(row);
        if (row.Type === 'Realized P&L') {
            return amount < 0 ? '' : 'ByBit';
        } else {
            return amount < 0 ? '' : 'ByBit';
        }
    },
    [TaxBitHeaders.Fee]: row => '',
    [TaxBitHeaders.Fee_Currency]: row => '',
    [TaxBitHeaders.Exchange_Transaction_ID]: row => '',
    [TaxBitHeaders.Blockchain_Transaction_Hash]: row => ''
}

