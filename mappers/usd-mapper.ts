import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

const parseAmount = (row) => {
    return parseFloat(row[TaxBitHeaders.Received_Quantity].replace(/\,/g, ''))
}

export const usd_mapping =  {
    [TaxBitHeaders.Date_and_Time]: row => {
        const date =new Date(row.Date);
        date.setMinutes(date.getMinutes() + 1);
        return moment(date).utc().format('yyyy-MM-DD HH:mm:ss')
    },
    [TaxBitHeaders.Transaction_Type]: row => {
        return TaxBitTransactionType.Transfer_In
    },
    [TaxBitHeaders.Sent_Currency]: '',
    [TaxBitHeaders.Sent_Quantity]: '',
    [TaxBitHeaders.Fee]: 'Fee amount',
    [TaxBitHeaders.Fee_Currency]: 'Fee currency',
    [TaxBitHeaders.Received_Currency]: row => 'USD',
    [TaxBitHeaders.Received_Quantity]: row => {
        const amount = parseAmount(row);
        return amount;
    },
    
    [TaxBitHeaders.Sending_Source]: row => '',
    [TaxBitHeaders.Receiving_Destination]: row => 'Coinbase Pro',
    [TaxBitHeaders.Exchange_Transaction_ID]: row => '',
    [TaxBitHeaders.Blockchain_Transaction_Hash]: row => ''
}