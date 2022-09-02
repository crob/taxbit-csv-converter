import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

const getTransactionType = function(row) {
    return row['Direction'] === "SELL" ? "Sale" : "Buy"
}

const getPair = function(row) {
    return row['Spot Pairs'].split('/');
}

const getSentPair = function(row) {
    const index = getTransactionType(row) === "Buy" ? 1 : 0;
    return getPair(row)[index];
}

const getSentAmount = function(row) {
    const index = getTransactionType(row) === "Buy" ? 'Filled Value' : 'Filled Quantity';
    return row[index].split(' ')[0];
}

const getReceivedPair = function(row) {
    const index = getTransactionType(row) === "Buy" ? 0 : 1;
    return getPair(row)[index];
}

const getReceivedAmount = function(row) {
    const index = getTransactionType(row) === "Buy" ? 'Filled Quantity' : 'Filled Value';
    return row[index].split(' ')[0];
}

export const bybit_spot_mapping =  {
    [TaxBitHeaders.Date_and_Time]: row => moment(new Date(row['Timestamp (UTC)'])).utc().format('yyyy-MM-DD HH:mm:ss'),
    [TaxBitHeaders.Transaction_Type]: row => 'Trade',
    [TaxBitHeaders.Sent_Quantity]: row => getSentAmount(row),
    [TaxBitHeaders.Sent_Currency]: row => getSentPair(row),
    [TaxBitHeaders.Sending_Source]: row => 'ByBit Spot',
    [TaxBitHeaders.Received_Quantity]: row => getReceivedAmount(row),
    [TaxBitHeaders.Received_Currency]: row => getReceivedPair(row),
    [TaxBitHeaders.Receiving_Destination]: row => 'ByBit Spot',
    [TaxBitHeaders.Fee]: row => row['Fees'].split(' ')[0],
    [TaxBitHeaders.Fee_Currency]: row => row['Fees'].split(' ')[1],
    // [TaxBitHeaders.Sending_Source]: row => 'Coinbase Pro'
    // [TaxBitHeaders.Blockchain_Transaction_Hash]: 'portfolio'
}

