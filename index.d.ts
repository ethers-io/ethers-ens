import { ethers } from 'ethers';
export declare function getDate(date: Date): string;
export declare function getDateTimer(timestamp: Date): string;
export declare const interfaces: {
    ens: ethers.utils.Interface;
    testRegistrar: ethers.utils.Interface;
    hashRegistrar: ethers.utils.Interface;
    reverseRegistrar: ethers.utils.Interface;
    simpleRegistrar: ethers.utils.Interface;
    resolver: ethers.utils.Interface;
};
export declare enum ABIEncodings {
    JSON = 1,
    zlibJSON = 2,
    CBOR = 4,
    URI = 8
}
export interface Auction {
    state: string;
    winningDeed: string;
    endDate: Date;
    revealDate: Date;
    value: ethers.utils.BigNumber;
    highestBid: ethers.utils.BigNumber;
}
export interface ENSTransactionResponse extends ethers.providers.TransactionResponse {
    metadata: {
        [key: string]: any;
    };
}
interface Bid {
    address: string;
    bidAmount: ethers.utils.BigNumber;
    salt: string;
    sealedBid: string;
    registrar: HashRegistrarContract;
    name: string;
    labelHash: string;
}
interface EnsContract {
    address: string;
    connect(signer: ethers.Signer): EnsContract;
    owner(nodeHash: string): Promise<string>;
    resolver(nodeHash: string): Promise<string>;
    ttl(nodeHash: string): Promise<ethers.utils.BigNumber>;
    setOwner(nodeHash: string, owner: string): Promise<ENSTransactionResponse>;
    setSubnodeOwner(node: string, label: string, owner: string): Promise<ENSTransactionResponse>;
    setResolver(nodeHash: string, resolver: string): Promise<ENSTransactionResponse>;
}
interface ResolverContract {
    address: string;
    connect(signer: ethers.Signer): ResolverContract;
    supportsInterface(interfaceId: string): Promise<boolean>;
    addr(nodeHash: string): Promise<string>;
    setAddr(nodeHash: string, addr: string): Promise<ENSTransactionResponse>;
    name(nodeHash: string): Promise<string>;
    setName(nodeHash: string, name: string): Promise<ENSTransactionResponse>;
    pubkey(nodeHash: string): Promise<{
        x: string;
        y: string;
    }>;
    setPubkey(nodeHash: string, x: string, y: string): Promise<ENSTransactionResponse>;
    text(nodeHash: string, key: string): Promise<string>;
    setText(nodeHash: string, key: string, value: string): Promise<ENSTransactionResponse>;
    ABI(nodeHash: string): Promise<{
        type: number;
        data: Uint8Array;
    }>;
    setABI(nodeHash: string, type: number, data: Uint8Array): Promise<ENSTransactionResponse>;
}
interface HashRegistrarContract {
    address: string;
    connect(signer: ethers.Signer): HashRegistrarContract;
    entries(labelHash: string): Promise<{
        state: number;
        winningDeed: string;
        endDate: ethers.utils.BigNumber;
        value: ethers.utils.BigNumber;
        highestBid: ethers.utils.BigNumber;
    }>;
    getAllowedTime(labelHash: string): Promise<ethers.utils.BigNumber>;
    shaBid(labelHash: string, owner: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<string>;
    startAuction(labelHash: string): Promise<ENSTransactionResponse>;
    newBid(sealedBid: string, options?: {
        value: ethers.utils.BigNumberish;
    }): Promise<ENSTransactionResponse>;
    unsealBid(labelHash: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<ENSTransactionResponse>;
    finalizeAuction(labelHash: string): Promise<ENSTransactionResponse>;
}
export declare class ENS {
    readonly provider: ethers.providers.Provider;
    readonly signer: ethers.Signer;
    private _ens;
    private _hashRegistrar;
    constructor(providerOrSigner: ethers.providers.Provider | ethers.Signer);
    getAuctionStartDate(name: string): Promise<Date>;
    getAuction(name: string): Promise<Auction>;
    startAuction(name: string): Promise<ENSTransactionResponse>;
    finalizeAuction(name: string): Promise<ENSTransactionResponse>;
    getBidHash(name: string, address: string, bidAmount: ethers.utils.BigNumber, salt: ethers.utils.Arrayish): Promise<string>;
    _getBid(name: string, bidAmount: ethers.utils.BigNumber, salt: ethers.utils.Arrayish): Promise<Bid>;
    placeBid(name: string, amount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish, extraAmount?: ethers.utils.BigNumberish): Promise<ENSTransactionResponse>;
    getDeedAddress(address: string, bidHash: string): Promise<string>;
    revealBid(name: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<ENSTransactionResponse>;
    setSubnodeOwner(parentName: string, label: string, owner: string): Promise<ENSTransactionResponse>;
    getResolver(name: string): Promise<string>;
    setResolver(name: string, address: string): Promise<ENSTransactionResponse>;
    getOwner(name: string): Promise<string>;
    setOwner(name: string, owner: string): Promise<ENSTransactionResponse>;
    getDeedOwner(address: string): Promise<string>;
    lookupAddress(address: string): Promise<string>;
    resolveName(name: string): Promise<string>;
    setReverseName(name: string): Promise<ENSTransactionResponse>;
    setAddress(name: string, addr: string): Promise<ENSTransactionResponse>;
    getAddress(name: string): Promise<string>;
    setName(address: string, name: string): Promise<ENSTransactionResponse>;
    setPublicKey(name: string, publicKey: string): Promise<ENSTransactionResponse>;
    getPublicKey(name: string, compressed?: boolean): Promise<string>;
    setText(name: string, key: string, value: string): Promise<ENSTransactionResponse>;
    getText(name: string, key: string): Promise<string>;
    _getResolver(name: string, interfaceId?: string): Promise<ResolverContract>;
    _getEns(): Promise<EnsContract>;
    _getHashRegistrar(name: string): Promise<{
        registrar: HashRegistrarContract;
        labelHash: string;
    }>;
}
export {};
