import {Eip4Asset} from "./entities/eip4Asset";
import {Constant} from "./entities/constant";

export type HexString = string
export type Base58String = string

export type TokenId = HexString
export type BoxId = HexString
export type TxId = HexString

export type ErgoTreeTemplateHash = HexString

export type Register = { readonly id: number, readonly value: Constant }

export type MintToken = { token: Eip4Asset, amount: bigint }

export type NErg = bigint
