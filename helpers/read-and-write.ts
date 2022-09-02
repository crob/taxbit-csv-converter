import {createReadStream} from 'fs';
import { writeToPath } from '@fast-csv/format';
import { parse } from 'fast-csv';
import { TaxBitHeaders } from '../models';


export const pareAFile = (file_path, options = { headers: true }): Promise<any[]> => new Promise((resolve, reject) => {
    let rows = [];
    createReadStream(file_path)
        .pipe(parse(options))
        .on('error', error => reject(error))
        .on('data', row => rows.push(row))
        .on('end', (rowCount: number) => resolve(rows));
});

export const writeAFile = (file_path, rows) => new Promise((resolve, reject) => {
    writeToPath(file_path, rows, {
        headers: [
            TaxBitHeaders.Date_and_Time, 
            TaxBitHeaders.Transaction_Type, 
            TaxBitHeaders.Sent_Quantity, 
            TaxBitHeaders.Sent_Currency,
            TaxBitHeaders.Sending_Source,
            TaxBitHeaders.Received_Quantity,
            TaxBitHeaders.Received_Currency,
            TaxBitHeaders.Receiving_Destination,
            TaxBitHeaders.Fee,
            TaxBitHeaders.Fee_Currency,
            TaxBitHeaders.Exchange_Transaction_ID,
            TaxBitHeaders.Blockchain_Transaction_Hash,
        ]
    })
    .on('error', err => reject(err))
    .on('finish', () => resolve(true));
});