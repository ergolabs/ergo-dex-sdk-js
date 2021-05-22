import {ErgoTreeTemplateHash, TokenId} from "../wallet/types";
import {ErgoBox} from "../wallet/entities/ergoBox";
import axios, {AxiosInstance} from "axios";
import {ErgoTree} from "../wallet/entities/ergoTree";
import {Eip4Asset} from "../wallet/entities/eip4Asset";

export interface ErgoNetwork {

    /** Get unspent boxes with a given ErgoTree.
     */
    getUnspentByErgoTree(tree: ErgoTree): Promise<ErgoBox[]>

    /** Get unspent boxes with scripts matching a given template hash.
     */
    getUnspentByErgoTreeTemplate(templateHash: ErgoTreeTemplateHash): Promise<ErgoBox[]>

    /** Get unspent boxes containing a token with given id.
     */
    getUnspentByTokenId(tokenId: TokenId): Promise<ErgoBox[]>

    /** Get a token info by id.
     */
    getToken(tokenId: TokenId): Promise<Eip4Asset | undefined>
}

export class Explorer implements ErgoNetwork {

    readonly backend: AxiosInstance

    constructor(uri: string) {
        this.backend = axios.create({
            baseURL: uri,
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
        })
    }

    async getUnspentByErgoTree(tree: ErgoTree): Promise<ErgoBox[]> {
        return this.backend.request<ErgoBox[]>({
            url: `/boxes/unspent/byErgoTree/${tree}`
        }).then((res) => res.data)
    }

    async getUnspentByErgoTreeTemplate(templateHash: ErgoTreeTemplateHash): Promise<ErgoBox[]> {
        return this.backend.request<ErgoBox[]>({
            url: `/boxes/unspent/byErgoTreeTemplateHash/${templateHash}`
        }).then((res) => res.data)
    }

    async getUnspentByTokenId(tokenId: TokenId): Promise<ErgoBox[]> {
        return this.backend.request<ErgoBox[]>({
            url: `/boxes/unspent/byTokenId/${tokenId}`
        }).then((res) => res.data)
    }

    async getToken(tokenId: TokenId): Promise<Eip4Asset | undefined> {
        return this.backend.request<Eip4Asset>({
            url: `/api/v1/tokens/${tokenId}`
        }).then((res) => res.status != 404 ? res.data : undefined)
    }
}
