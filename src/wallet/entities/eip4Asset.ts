import {TokenId} from "../types";

export class Eip4Asset {
    readonly id: TokenId
    readonly name: string
    readonly decimals: number
    readonly description?: string

    constructor(id: TokenId, name: string, decimals: number, description?: string) {
        this.id = id
        this.name = name
        this.decimals = decimals
        this.description = description
    }
}
