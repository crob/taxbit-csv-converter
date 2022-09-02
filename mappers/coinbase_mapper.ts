import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

export const coinbase_mapping =  {
    [TaxBitHeaders.Date_and_Time]: row => moment(new Date(row.time)).utc().format('yyyy-MM-DD HH:mm:ss'),
    [TaxBitHeaders.Sent_Quantity]: 'amount',
    [TaxBitHeaders.Transaction_Type]: 'type',
    [TaxBitHeaders.Sent_Currency]: 'amount/balance unit',
    [TaxBitHeaders.Received_Quantity]: 'amount',
    [TaxBitHeaders.Received_Currency]: row => {
        const unit = row['amount/balance unit'];
        return unit === 'USDC' ? 'USD' : 'USDC'
        
        // throw new Error(`No transaction type for type: ${type}`)
    },
    [TaxBitHeaders.Receiving_Destination]: row => 'Coinbase Pro',
    // [TaxBitHeaders.Sending_Source]: row => 'Coinbase Pro'
    // [TaxBitHeaders.Blockchain_Transaction_Hash]: 'portfolio'
}

