import * as fs  from 'fs/promises';
import { pareAFile, writeAFile, getMapper } from './helpers';
import * as path from 'path';
import { MappingRule, TaxBitHeaders, TaxBitTransactionType } from './models';
import {  } from './helpers/mapper';


const main = async () => {
    const output_path = path.join(__dirname, 'output');
    const input_path = path.join(__dirname, 'input');
    await fs.rm(output_path, { recursive: true });
    await fs.mkdir(output_path);
    
    
    let input_files = await fs.readdir(input_path);

    //listing all files using forEach
    input_files = input_files.filter(fileName => fileName !== '.DS_Store');

    let convertMap = (rule: MappingRule) => (row) => {
        return Object.entries(rule).reduce((current, next) => {
            const [key, rule] = next;
            current[key] = (typeof rule === 'function') ? rule(row) : row[rule]
            return current;
        }, {});
    }    

    input_files.forEach(async (input_file) => {
        console.log(`parsing: ${input_files}`); 
        const file_name_prefix = input_file.split('-')[0];
        let rows = await pareAFile(path.resolve(input_path, input_file));
        if (file_name_prefix === 'coinbase_usdc') {
            rows = rows.filter(row => {
                const filter = row.type === 'conversion' && Number(row['amount']) > 0
                if (filter) {
                    const unit = row['amount/balance unit'];
                    row.type = unit === 'USDC' ? TaxBitTransactionType.Buy : TaxBitTransactionType.Sale
                    row['amount/balance unit'] = row.type === TaxBitTransactionType.Buy ? 'USD' : 'USDC';
                }
                return filter;
            });
        }
        if (file_name_prefix === 'kraken_margin') {
            rows = rows.filter(row => {
                const filter = row.type === 'margin' || row.type === 'rollover'
                
                return filter;
            });
        }
        let converted_rows = rows.map(convertMap(getMapper(file_name_prefix)));

        let sum = 0;
        let fees = 0;
        let kraken_total = 0
        if (file_name_prefix === 'kraken_margin') {
            sum = converted_rows.map(row => Number(row[TaxBitHeaders.Sent_Quantity])).reduce((prev, curr) => {
                // debugger
                return prev += curr
            }, 0)
            fees = converted_rows.map(row => Number(row[TaxBitHeaders.Fee])).reduce((prev, curr) => {
                // debugger
                return prev += curr
            }, 0)
            kraken_total = sum - fees
            console.log("kraken total: ", kraken_total)
        }
        let bybit_income = 0;
        let bybit_expense = 0;
        let bybit_total = 0;
        if (file_name_prefix === 'bybit_pro_loss') {
            
            let sum = converted_rows.map(row => Number(row[TaxBitHeaders.Sent_Quantity])).reduce((prev, curr) => {
                // debugger
                if (curr > 0) {
                    bybit_income += curr
                } else {
                    bybit_expense += curr;
                }
                return prev += curr
            }, 0)
            bybit_total = bybit_income + bybit_expense;
            console.log("bybit total: ", bybit_total, bybit_income, bybit_expense)
        }

        if (file_name_prefix === 'kraken_eth_staking') {
            let eth_staking_total = 0
            eth_staking_total = converted_rows.map(row => Number(row[TaxBitHeaders.Received_Quantity])).reduce((prev, curr) => {
                return prev += curr
            }, 0)
            console.log("eth_staking_total total: ", eth_staking_total)
        }

        if (file_name_prefix === 'ada_staking') {
            let ada_staking_total = 0
            ada_staking_total = converted_rows.map(row => Number(row[TaxBitHeaders.Received_Quantity])).reduce((prev, curr) => {
                return prev += curr
            }, 0)
            console.log("ada_staking_total total: ", ada_staking_total)
        }

        
        
        //
        if (file_name_prefix !== 'coinbase') {
            
            // corrects weird issue with ADA transactions that send nothing but cost a network fee
            converted_rows = converted_rows.filter(row => row[TaxBitHeaders.Sent_Quantity] !== '0');
            if (rows.length > converted_rows.length) {
                console.warn(`${input_file} has ${rows.length - converted_rows.length} rows removed for having a 0 Sent Quantity`);
            }
        } else {
            
            // converted_rows = converted_rows.filter(row => {
            //     return (
            //         (row[TaxBitHeaders.Transaction_Type] === 'withdrawal' || row[TaxBitHeaders.Transaction_Type] === 'deposit') && 
            //         row[TaxBitHeaders.Sent_Currency] === "ETH" //&&
            //         // row[TaxBitHeaders.Blockchain_Transaction_Hash] === "default"
            //     )
            // });
            // converted_rows = converted_rows.filter(row => {
            //     return (
            //         (
            //             row[TaxBitHeaders.Transaction_Type] === 'conversion' &&
            //             Number(row[TaxBitHeaders.Sent_Quantity]) > 0
            //         )
            //     )
            // });
        }


        let finished = await writeAFile(path.resolve(output_path, input_file), converted_rows);
    });

    console.log('all files complete');
}
main().catch((e) => {
    console.error(e);
})

