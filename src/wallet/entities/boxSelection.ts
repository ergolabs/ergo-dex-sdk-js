import {ChangeBox} from "./changeBox";
import {EmptyInputs} from "../errors/emptyInputs";
import {OverallAmount} from "./overallAmount";
import {ErgoBox} from "./ergoBox";
import {TokenAmount} from "./tokenAmount";
import {TokenId} from "../types";
import {UnsignedInput} from "./unsignedInput";

export class BoxSelection {

    private constructor(
        public readonly inputs: ErgoBox[],
        public readonly change?: ChangeBox
    ) {
    }

    static make(inputs: ErgoBox[], change?: ChangeBox): BoxSelection | EmptyInputs {
        return inputs.length > 0 ? new BoxSelection(inputs, change) : new EmptyInputs()
    }

    static safe(head: ErgoBox, others?: ErgoBox[], change?: ChangeBox): BoxSelection {
        return new BoxSelection([head].concat(others || []), change)
    }

    get newTokenId(): TokenId {
        return this.inputs[0].boxId
    }

    get unsignedInputs(): UnsignedInput[] {
        return this.inputs.map((bx, _ix, _xs) => ({boxId: bx.boxId, extension: {}}))
    }

    /** Amounts of all kinds of tokens with change excluded.
     */
    get totalOutputWithoutChange(): OverallAmount {
        let nErgsIn = this.inputs.map((bx, _i, _xs) => bx.value).reduce((x, y, _i, _xs) => x + y)
        let nErgsChange = this.change?.value || 0n
        let assetsChange = this.change?.assets || []
        let nErgs = nErgsIn - nErgsChange
        let tokensAgg = new Map<TokenId, bigint>()
        for (let t of this.inputs.flatMap((bx, _i, _xs) => bx.assets)) {
            let acc = tokensAgg.get(t.tokenId) || 0n
            tokensAgg.set(t.tokenId, t.amount + acc)
        }
        for (let a of assetsChange) {
            let amountIn = tokensAgg.get(a.tokenId)
            if (amountIn) tokensAgg.set(a.tokenId, amountIn - a.amount)
        }
        let tokens: TokenAmount[] = []
        tokensAgg.forEach((amount, tokenId, _xs) => tokens.push({tokenId, amount}))
        return {nErgs, tokens}
    }
}