import {ByteaConstant, Constant, Int32Constant, Int64Constant, Registers, SigmaType} from "../ergo";
import {fromHex} from "../utils/hex";
import {parseRegisterId, RegisterId} from "../ergo/entities/registers";
import * as wallet from "../ergo";

export type ErgoBox = {
    boxId: string,
    transactionId: string,
    blockId: string,
    value: bigint,
    index: number,
    creationHeight: number,
    settlementHeight: number,
    ergoTree: string,
    address: string,
    assets: BoxAsset[],
    additionalRegisters: { [key: string]: BoxRegister },
    spentTransactionId?: string
}

export type BoxAsset = {
    tokenId: string,
    index: number,
    amount: bigint,
    name?: string,
    decimals?: number
}

export type BoxRegister = {
    serializedValue: string,
    sigmaType: SigmaType,
    renderedValue: string
}

export function toWalletConstant(reg: BoxRegister): wallet.Constant | undefined {
    switch (reg.sigmaType) {
        case "Coll[Byte]":
            return new ByteaConstant(fromHex(reg.renderedValue))
        case "SInt":
            return new Int32Constant(Number(reg.renderedValue))
        case "SLong":
            return new Int64Constant(BigInt(reg.renderedValue))
        default:
            return undefined
    }
}

export function toWalletToken(asset: BoxAsset): wallet.TokenAmount {
    return {tokenId: asset.tokenId, amount: asset.amount, name: asset.name, decimals: asset.decimals}
}

export function toWalletErgoBox(box: ErgoBox): wallet.ErgoBox {
    let registers = new Map<RegisterId, Constant>()
    Object.keys(box.additionalRegisters).forEach((k, _ix, _xs) => {
        let c = toWalletConstant(box.additionalRegisters[k])
        let regId = parseRegisterId(k)
        if (c && regId) registers.set(regId, c)
    })
    return {
        boxId: box.boxId,
        transactionId: box.transactionId,
        index: box.index,
        ergoTree: box.ergoTree,
        creationHeight: box.creationHeight,
        value: box.value,
        assets: box.assets.map((a, _ix, _xs) => toWalletToken(a)),
        additionalRegisters: registers
    }
}