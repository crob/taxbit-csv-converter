import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

export const adalite_mapping =  {
    [TaxBitHeaders.Date_and_Time]: row => moment(new Date(row.Date)).utc().format('yyyy-MM-DD HH:mm:ss'),
    // [TaxBitHeaders.Blockchain_Transaction_Hash]: row => row['Transaction ID'],
    [TaxBitHeaders.Sent_Currency]: 'Sent currency',
    [TaxBitHeaders.Sent_Quantity]: 'Sent amount',
    [TaxBitHeaders.Fee]: 'Fee amount',
    [TaxBitHeaders.Fee_Currency]: 'Fee currency',
    [TaxBitHeaders.Received_Currency]: 'Received currency',
    [TaxBitHeaders.Received_Quantity]: 'Received amount',
    [TaxBitHeaders.Transaction_Type]: row => {
        const type = row['Type'];
        if(type === 'Reward awarded') {
            return TaxBitTransactionType.Income
        }
        if(type === 'Sent') {
            return TaxBitTransactionType.Transfer_Out
        }
        if(type === 'Received') {
            return TaxBitTransactionType.Transfer_In
        }
        throw new Error(`No transaction type for type: ${type}`)
    },
    [TaxBitHeaders.Sending_Source]: row => (row['Type'] === 'Sent') ? 'ADA WALLET' : '',
    [TaxBitHeaders.Receiving_Destination]: row => (row['Type'] === 'Received' || row['Type'] === 'Reward awarded') ? 'ADA WALLET' : ''
}

