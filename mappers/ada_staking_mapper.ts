import * as moment from "moment";
import { TaxBitHeaders, TaxBitTransactionType } from "../models";

export const ada_staking_mapper =  {
    [TaxBitHeaders.Date_and_Time]: row => row.Date,
    [TaxBitHeaders.Transaction_Type]: row =>'Income from Staking',
    [TaxBitHeaders.Received_Quantity]: row =>  Number(row['Market Value']),
    [TaxBitHeaders.Received_Currency]: row =>'USD',
    [TaxBitHeaders.Sent_Currency]: row => 'ADA',
    [TaxBitHeaders.Sent_Quantity]: TaxBitHeaders.Received_Quantity,
}

