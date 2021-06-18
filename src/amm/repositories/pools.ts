import {PoolId} from "../types"
import {AmmPool} from "../entities/ammPool"
import {ErgoNetwork} from "../../services/ergoNetwork"
import {AssetAmount, Int32Constant} from "../../ergo"
import {RegisterId} from "../../ergo/entities/registers"
import {Blake2b256} from "../../utils/blake2b256"
import {toHex} from "../../utils/hex"
import {T2tPoolContracts} from "../contracts/t2tPoolContracts"
import {Paging} from "../../network/paging"
import {deserializeConstant} from "../../ergo/entities/constant"

export interface Pools {
  get(id: PoolId): Promise<AmmPool | undefined>

  getAll(paging: Paging): Promise<[AmmPool[], number]>
}

export class NetworkPools implements Pools {
  constructor(readonly network: ErgoNetwork) {}

  async get(id: PoolId): Promise<AmmPool | undefined> {
    let boxes = await this.network.getUnspentByTokenId(id, {offset: 0, limit: 1})
    if (boxes.length > 0) {
      let poolBox = boxes[0]
      let assetX = AssetAmount.fromToken(poolBox.assets[2])
      let assetY = AssetAmount.fromToken(poolBox.assets[3])
      let r4 = deserializeConstant(poolBox.additionalRegisters[RegisterId.R4])
      if (r4 instanceof Int32Constant && poolBox.ergoTree === T2tPoolContracts.pool()) {
        let scriptHash = toHex(Blake2b256.hash(poolBox.ergoTree))
        return new AmmPool(id, assetX, assetY, scriptHash, r4.value)
      }
    }
    return undefined
  }

  async getAll(paging: Paging): Promise<[AmmPool[], number]> {
    let [boxes, totalBoxes] = await this.network.getUnspentByErgoTree(T2tPoolContracts.pool(), paging)
    let pools = []
    for (let box of boxes) {
      let nft = box.assets[0].tokenId
      let assetX = AssetAmount.fromToken(box.assets[2])
      let assetY = AssetAmount.fromToken(box.assets[3])
      let r4 = box.additionalRegisters[RegisterId.R4]
      if (r4) {
        let feeNum = deserializeConstant(r4)
        if (feeNum instanceof Int32Constant) {
          let scriptHash = toHex(Blake2b256.hash(box.ergoTree))
          pools.push(new AmmPool(nft, assetX, assetY, scriptHash, feeNum.value))
        }
      }
    }
    const invalid = boxes.length - pools.length
    const total = totalBoxes - invalid
    return [pools, total]
  }
}
