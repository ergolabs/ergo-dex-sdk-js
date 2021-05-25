import * as wasm from "ergo-lib-wasm-browser";
import {I64} from "ergo-lib-wasm-browser";
import {BoxSelection} from "./entities/boxSelection";
import {ErgoBox} from "./entities/ergoBox";
import {ErgoTree, ergoTreeToBytea} from "./entities/ergoTree";
import {TokenAmount} from "./entities/tokenAmount";
import {ErgoBoxCandidate} from "./entities/ergoBoxCandidate";
import {Int32Constant, Int64Constant} from "./entities/constant";
import {RegisterId} from "./entities/registers";

export function boxSelectionToWasm(inputs: BoxSelection): wasm.BoxSelection {
    let boxes = new wasm.ErgoBoxes(boxToWasm(inputs.inputs[0]))
    let tokens = new wasm.Tokens()
    let changeList = new wasm.ErgoBoxAssetsDataList()
    if (inputs.change) {
        inputs.change.assets.forEach((a, _ix, _xs) => {
            let t = new wasm.Token(wasm.TokenId.from_str(a.tokenId), wasm.TokenAmount.from_i64(I64.from_str(a.amount.toString())))
            tokens.add(t)
        })
        let change = new wasm.ErgoBoxAssetsData(wasm.BoxValue.from_i64(I64.from_str(inputs.change.value.toString())), tokens)
        for (let box of inputs.inputs.slice(1)) boxes.add(boxToWasm(box))
        changeList.add(change)
    }
    return new wasm.BoxSelection(boxes, changeList)
}

export function boxCandidatesToWasm(boxes: ErgoBoxCandidate[]): wasm.ErgoBoxCandidates {
    let candidates = wasm.ErgoBoxCandidates.empty()
    for (let box of boxes) candidates.add(boxCandidateToWasm(box))
    return candidates
}

export function boxCandidateToWasm(box: ErgoBoxCandidate): wasm.ErgoBoxCandidate {
    let value = wasm.BoxValue.from_i64(I64.from_str(box.value.toString()))
    let contract = wasm.Contract.pay_to_address(wasm.Address.recreate_from_ergo_tree(ergoTreeToWasm(box.ergoTree)))
    let builder = new wasm.ErgoBoxCandidateBuilder(value, contract, box.creationHeight)
    for (let token of box.assets) {
        let t = tokenToWasm(token)
        builder.add_token(t.id(), t.amount())
    }
    for (let [id, value] of box.additionalRegisters) {
        let constant: wasm.Constant
        if (value instanceof Int32Constant)
            constant = wasm.Constant.from_i32(value.value)
        else if (value instanceof Int64Constant)
            constant = wasm.Constant.from_i64(I64.from_str(value.value.toString()))
        else
            constant = wasm.Constant.from_byte_array(value.value)
        builder.set_register_value(registerIdToWasm(id), constant)
    }
    return builder.build()
}

export function registerIdToWasm(id: RegisterId): number {
    return Number(id[1])
}

export function boxToWasm(box: ErgoBox): wasm.ErgoBox {
    let value = wasm.BoxValue.from_i64(I64.from_str(box.value.toString()))
    let contract = wasm.Contract.pay_to_address(wasm.Address.recreate_from_ergo_tree(ergoTreeToWasm(box.ergoTree)))
    let txId = wasm.TxId.from_str(box.transactionId)
    let tokens = tokensToWasm(box.assets)
    return new wasm.ErgoBox(value, box.creationHeight, contract, txId, box.index, tokens)
}

export function ergoTreeToWasm(tree: ErgoTree): wasm.ErgoTree {
    return wasm.ErgoTree.from_bytes(ergoTreeToBytea(tree))
}

export function tokenToWasm(token: TokenAmount): wasm.Token {
    let id = wasm.TokenId.from_str(token.tokenId)
    let amount = wasm.TokenAmount.from_i64(I64.from_str(token.amount.toString()))
    return new wasm.Token(id, amount)
}

export function tokensToWasm(tokens: TokenAmount[]): wasm.Tokens {
    let bf = new wasm.Tokens()
    for (let t of tokens) bf.add(tokenToWasm(t))
    return bf
}
