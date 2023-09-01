import { adalite_mapping, ada_staking_mapper, bybit_pro_loss_mapping, bybit_spot_mapping, bybit_to_taxbit, coinbase_mapping, fuck_tax_bit_mapper, kraken_eth_staking_mapper, kraken_margin_mapping, usd_mapping } from "../mappers";
import { MappingRule } from "../models";

export const getMapper = (mappingName): MappingRule => {
    switch(mappingName) {
        case 'bybit_to_taxbit':
            return bybit_to_taxbit;
        case 'adalite':
            return adalite_mapping;
        case 'coinbase_usdc':
            return coinbase_mapping;
        case 'Bybit_Spot':
            return bybit_spot_mapping;
        case 'kraken_margin':
            return kraken_margin_mapping;
        case 'bybit_pro_loss':
            return bybit_pro_loss_mapping;
        case 'kraken_eth_staking':
            return kraken_eth_staking_mapper;
        case 'ada_staking':
            return ada_staking_mapper;
        case 'usd':
            return usd_mapping;
        case 'fuck_taxbit':
            return fuck_tax_bit_mapper;
        default:
            throw new Error(`no mapping for for ${mappingName}`);
    }
};