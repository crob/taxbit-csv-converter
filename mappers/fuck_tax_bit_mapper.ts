import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

const parseAmount = (row) => {
    if (row.length === 0) {
        return ''
    }
    return Math.abs(parseFloat(row?.replace(/\,/g, '')))
}

export const fuck_tax_bit_mapper =  {
    [TaxBitHeaders.Date_and_Time]: row => row.Date,
    [TaxBitHeaders.Transaction_Type]: row => {
        const type = row[TaxBitHeaders.Transaction_Type]
        if (type === 'Sell') {
            return 'Sale'
        }
        return type
    },
    [TaxBitHeaders.Sent_Quantity]: row => {
        const sent = row[TaxBitHeaders.Sent_Quantity]
        return parseAmount(sent)
    },
    [TaxBitHeaders.Sent_Currency]: row => row[TaxBitHeaders.Sent_Currency],
    [TaxBitHeaders.Sending_Source]: row => {
        const type = row[TaxBitHeaders.Transaction_Type];
        if (
            type === 'Transfer Out' || 
            type === 'Buy' || 
            type === 'Sell' || 
            type === 'Trade' || 
            type === 'Expense') {
            return row['Source'];
        }

    },
    [TaxBitHeaders.Received_Quantity]: row => row[TaxBitHeaders.Received_Quantity],
    [TaxBitHeaders.Received_Currency]: row => row[TaxBitHeaders.Received_Currency],
    [TaxBitHeaders.Receiving_Destination]: row => {
        const type = row[TaxBitHeaders.Transaction_Type];
        if (
            type === 'Transfer In' || 
            type === 'Buy' || 
            type === 'Sell' || 
            type === 'Trade' || 
            type === 'Income' 
        ) {
            return row['Source'];
        }
    },
    [TaxBitHeaders.Fee]: row => row['Fee Amount'],
    [TaxBitHeaders.Fee_Currency]: row => row[TaxBitHeaders.Fee_Currency],
    [TaxBitHeaders.Exchange_Transaction_ID]: row => '',
    [TaxBitHeaders.Blockchain_Transaction_Hash]: row => ''
}