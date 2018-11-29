'use strict';

import { ethers } from 'ethers';

const errors = ethers.errors;
const constants = ethers.constants;
const utils = ethers.utils;

const basex = function(ALPHABET: string) {
  /**
   * Contributors:
   *
   * base-x encoding
   * Forked from https://github.com/cryptocoinjs/bs58
   * Originally written by Mike Hearn for BitcoinJ
   * Copyright (c) 2011 Google Inc
   * Ported to JavaScript by Stefan Thomas
   * Merged Buffer refactorings from base58-native by Stephen Pair
    * Copyright (c) 2013 BitPay Inc
   *
   * The MIT License (MIT)
   *
   * Copyright base-x contributors (c) 2016
   *
   * Permission is hereby granted, free of charge, to any person obtaining a
   * copy of this software and associated documentation files (the "Software"),
   * to deal in the Software without restriction, including without limitation
   * the rights to use, copy, modify, merge, publish, distribute, sublicense,
   * and/or sell copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
   * IN THE SOFTWARE.
   *
   */

  let ALPHABET_MAP: { [character: string ]: number } = {}
  let BASE = ALPHABET.length
  let LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (let i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;
  }

  function encode(source: Uint8Array): string {
    if (source.length === 0) return ''

    let digits = [0]
    for (let i = 0; i < source.length; ++i) {
      let carry = source[i];
      for (let j = 0; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    let string = ''

    // deal with leading zeros
    for (let k = 0; source[k] === 0 && k < source.length - 1; ++k) string += LEADER

    // convert digits to a string
    for (let q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string: string): Uint8Array {
    if (typeof string !== 'string') throw new TypeError('Expected String')
    let bytes: Array<number> = [];
    if (string.length === 0) { return new Uint8Array(bytes); }

    bytes.push(0);
    for (let i = 0; i < string.length; i++) {
      let value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      let carry = value;
      for (let j = 0; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (let k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return new Uint8Array(bytes.reverse())
  }

  function decode (string: string): Uint8Array {
    let buffer = decodeUnsafe(string)
    if (buffer) return buffer
    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decode: decode
  }
}
const Base58 = basex("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");


const ensInterface = [
    "function owner(bytes32 nodeHash) constant returns (address owner)",
    "function resolver(bytes32 nodeHash) constant returns (address resolver)",
    "function ttl(bytes32 nodeHash) returns (uint64 ttl)",

    "function setOwner(bytes32 nodeHash, address owner) @100000",
    "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) @85000",
    "function setResolver(bytes32 nodeHash, address resolver) @100000",
];

const testRegistrarInterface = [
    "function expiryTimes(bytes32 labelHash) constant returns (uint256 expiry)",
    "function register(bytes32 labelHash, address owner)"
];

const hashRegistrarInterface = [
    "function entries(bytes32 labelHash) constant returns (uint8 state, address winningDeed, uint endDate, uint value, uint highestBid)",
    "function getAllowedTime(bytes32 labelHash) constant returns (uint timestamp)",
    "function shaBid(bytes32 labelHash, address owner, uint256 bidAmount, bytes32 salt) constant returns (bytes32 sealedBid)",

    "function startAuction(bytes32 labelHash) @300000",
    "function newBid(bytes32 sealedBid) @500000",
    "function unsealBid(bytes32 labelHash, uint256 bidAmount, bytes32 salt) @200000",
    "function finalizeAuction(bytes32 labelHash) @200000",

    "event AuctionStarted(bytes32 albelHash, uint256 registrationDate)",
    "event NewBid(bytes32 sealedBid, address bidder, uint256 deposit)",
    "event BidRevealed(bytes32 labelHash, address owner, uint256 value, uint8 status)",
    "event HashRegistered(bytes32 labelHash, address owner, uint256 value, uint256 registrationData)",
    "event HashReleased(bytes32 labelHash, uint256 value)",
    "event HashInvalidated(bytes32 labelHash,string name, uint256 value, uint256 registrationDate)"
];

const simpleRegistrarInterface = [
    "function fee() constant returns (uint256 fee)",
    "function register(string label)"
];

const deedInterface = [
    "function owner() constant returns (address owner)"
];

const resolverInterface = [
    "function supportsInterface(bytes4 interfaceId) constant returns (bool supported)",

    "function addr(bytes32 nodeHash) constant returns (address addr)",
    "function name(bytes32 nodeHash) constant returns (string name)",
    "function ABI(bytes32 nodeHash, uint256 type) constant returns (uint contentType, bytes data)",
    "function pubkey(bytes32 nodeHash) constant returns (bytes32 x, bytes32 y)",
    "function text(bytes32 nodeHash, string key) constant returns (string value)",
    "function contenthash(bytes32 nodeHash) constant returns (bytes contenthash)",
    "function content(bytes32 nodeHash) constant returns (bytes32 content)",
    "function multihash(bytes32 nodeHash) constant returns (bytes multihash)",

    "function setAddr(bytes32 nodeHash, address addr) @150000",
    "function setName(bytes32 nodeHash, string name)",
    "function setABI(bytes32 nodeHash, uint256 contentType, bytes data)",
    "function setPubkey(bytes32 nodeHash, bytes32 x, bytes32 y)",
    "function setText(bytes32 nodeHash, string key, string value)",
    "function setContenthash(bytes32 nodeHash, bytes contenthash)",

];

const reverseRegistrarInterface = [
    "function setName(string name) returns (bytes32 node) @150000"
];

function zeroPad(value: number, length: number): string {
    let valueString = String(value);
    while (valueString.length < length) { valueString = '0' + valueString; }
    return valueString;
}

// Return YYYY-mm-dd HH:MM:SS
export function getDate(date: Date): string {
    return (
        date.getFullYear() + '-' +
        zeroPad(date.getMonth() + 1, 2) + '-' +
        zeroPad(date.getDate(), 2) + ' ' +
        zeroPad(date.getHours(), 2) + ':' +
        zeroPad(date.getMinutes(), 2) + ':' +
        zeroPad(date.getSeconds(), 2)
    )
}

// Return the delta time between now and the timestamp
function getTimer(timestamp: Date): string {
    let dt = (timestamp.getTime() - (new Date()).getTime()) / 1000;
    let negative = false;
    if (dt < 0) {
        negative = true;
        dt *= -1;
    }

    if (dt === 0) { return '0'; }

    let result: Array<string> = [];
    [60, 60, 24, 365, 1000].forEach(function(chunk) {
        if (dt === 0) { return; }

        let amount = zeroPad(Math.trunc(dt % chunk), 2);
        dt = Math.trunc(dt / chunk);
        result.unshift(amount);
    })

    let timer = result.join(":");

    // Trim leading zeros
    while (timer.length > 1 && timer.match(/^[0:].+/)) {
        timer = timer.substring(1);
    }

    if (negative) { timer = '-' + timer; }

    return timer;
}

export function getDateTimer(timestamp: Date): string {
    let timer = getTimer(timestamp);
    if (timer.substring(0, 1) === '-') {
        timer = ' (' + timer.substring(1) + ' ago)';
    } else {
        timer = ' (in ' + timer + ')';
    }
    return getDate(timestamp) + timer;
}

export const interfaces = {
    ens: new utils.Interface(ensInterface),
    testRegistrar: new utils.Interface(testRegistrarInterface),
    hashRegistrar: new utils.Interface(hashRegistrarInterface),
    reverseRegistrar: new utils.Interface(reverseRegistrarInterface),
    simpleRegistrar: new utils.Interface(simpleRegistrarInterface),
    resolver: new utils.Interface(resolverInterface),
}
Object.freeze(interfaces);

export enum ABIEncodings {
    JSON      = 1,
    zlibJSON  = 2,
    CBOR      = 4,
    URI       = 8,
}

export interface Auction {
    state: string;
    winningDeed: string
    endDate: Date;
    revealDate: Date;
    value: ethers.utils.BigNumber;
    highestBid: ethers.utils.BigNumber;
}

export interface ENSTransactionResponse extends ethers.providers.TransactionResponse {
    metadata: { [key: string]: any };
}

interface Bid {
    address: string,
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
    ttl(nodeHash: string): Promise<ethers.utils.BigNumber>

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

    pubkey(nodeHash: string): Promise<{ x: string, y: string }>;
    setPubkey(nodeHash: string, x: string, y: string): Promise<ENSTransactionResponse>;

    text(nodeHash: string, key: string): Promise<string>;
    setText(nodeHash: string, key: string, value: string): Promise<ENSTransactionResponse>;

    ABI(nodeHash: string): Promise<{ type: number, data: Uint8Array }>;
    setABI(nodeHash: string, type: number, data: Uint8Array): Promise<ENSTransactionResponse>;

    contenthash(nodeHash: string): Promise<string>;
    content(nodeHash: string): Promise<string>;
    setContenthash(nodeHash: string, contentHash: Uint8Array): Promise<ENSTransactionResponse>;
}

interface HashRegistrarContract {
    address: string;
    connect(signer: ethers.Signer): HashRegistrarContract;

    entries(labelHash: string): Promise<{ state: number, winningDeed: string, endDate: ethers.utils.BigNumber, value: ethers.utils.BigNumber, highestBid: ethers.utils.BigNumber}>;
    getAllowedTime(labelHash: string): Promise<ethers.utils.BigNumber>;
    shaBid(labelHash: string, owner: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<string>;

    startAuction(labelHash: string): Promise<ENSTransactionResponse>;
    newBid(sealedBid: string, options?: { value: ethers.utils.BigNumberish }): Promise<ENSTransactionResponse>;
    unsealBid(labelHash: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<ENSTransactionResponse>;
    finalizeAuction(labelHash: string): Promise<ENSTransactionResponse>;
}

interface ReverseRegistrarContract {
    setName(name: string): Promise<ENSTransactionResponse>;
}

function uintify(value: ethers.utils.BigNumberish): string {
    return utils.hexZeroPad(utils.bigNumberify(value).toHexString(), 32);
}

const states = [
    'open', 'auction', 'owned', 'forbidden', 'reveal', 'not-yet-available'
];

const interfaceIds = {
    addr:          '0x3b3b57de',
    name:          '0x691f3431',
    pubkey:        '0xc8690233',
    text:          '0x59d1d43c',
    abi:           '0x2203ab56',
    contenthash:   '0xbc1c58d1',
}

export class ENS {
    readonly provider: ethers.providers.Provider;
    readonly signer: ethers.Signer;

    private _ens: Promise<EnsContract> = null;
    private _hashRegistrar: Promise<HashRegistrarContract> = null;

    constructor(providerOrSigner: ethers.providers.Provider | ethers.Signer) {
        errors.checkNew(this, ENS);

        this.provider = null;
        this.signer = null;

        if (ethers.providers.Provider.isProvider(providerOrSigner)) {
             utils.defineReadOnly(this, 'provider', providerOrSigner);

        } else if (ethers.Signer.isSigner(providerOrSigner)) {
            if (!providerOrSigner.provider) {
                errors.throwError('signer is missing provider', errors.INVALID_ARGUMENT, {
                    argument: 'providerOrSigner',
                    value: providerOrSigner
                });
            }
            utils.defineReadOnly(this, 'signer', providerOrSigner);
            utils.defineReadOnly(this, 'provider', providerOrSigner.provider);

        } else {
            errors.throwError('invalid provider or signer', errors.INVALID_ARGUMENT, {
                argument: 'providerOrSigner',
                value: providerOrSigner
            });
        }
/*
        let ensPromise = this.provider.getNetwork((network) => {
            return new ethers.Contract(network.ensAddress, interfaces.ens, );
        });
        ethers.utils.defineReadOnly(this, '_ensPromise', ensPromise);
*/
    }

    getAuctionStartDate(name: string): Promise<Date> {
        return this._getHashRegistrar(name).then(({ labelHash, registrar }) => {
            return registrar.getAllowedTime(labelHash).then((timestamp) => {
                return new Date(timestamp.toNumber() * 1000);
            });
        });
    }

    async getAuction(name: string): Promise<Auction> {
        let { labelHash, registrar } = await this._getHashRegistrar(name);
        let auction = await registrar.entries(labelHash);
        return {
            endDate: new Date(auction.endDate.toNumber() * 1000),
            highestBid: auction.highestBid,
            revealDate: new Date((auction.endDate.toNumber() - (24 * 2 * 60 * 60)) * 1000),
            state: states[auction.state],
            value: auction.value,
            winningDeed: auction.winningDeed
        };
    }

    async startAuction(name: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        let { labelHash, registrar } = await this._getHashRegistrar(name)

        let auction = await this.getAuction(name);

        let errorMessages: { [state: string]: string } = {
            'auction': 'name already up for auction; please bid before ' + getDateTimer(auction.revealDate),
            'owned': 'name already owned',
            'forbidden': 'name forbidden',
            'reveal': 'bidding closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
//            'not-yet-available': ('name not available until ' + getDateTimer(nameInfo.startDate))
        };

        let errorMessage = errorMessages[auction.state];
        if (errorMessage) {
            errors.throwError(errorMessage, errors.UNSUPPORTED_OPERATION, {
                name: name
            });
        }

        let tx = await registrar.connect(this.signer).startAuction(labelHash);
        tx.metadata = {
            labelHash: labelHash,
            name: name
        };
        return tx;
    }

    async finalizeAuction(name: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        let auction = await this.getAuction(name);

        let errorMessages: { [state: string]: string } = {
            'auction': ('name still up for auction; wait until ' + getDateTimer(auction.revealDate)),
            'open': 'name not up for auction yet; please "start" first',
            'forbidden': 'name forbidden',
            'reveal': 'auction closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
//            'not-yet-available': ('name not available until ' + getDateTimer(result.startDate))
        };

        let errorMessage = errorMessages[auction.state];
        if (errorMessage) {
            errors.throwError(errorMessage, errors.UNSUPPORTED_OPERATION, {
                name: name
            });
        }

        let deedOwner = await this.getDeedOwner(name);
        let signerAddress = await this.signer.getAddress();
        if (deedOwner !== signerAddress) {
            errors.throwError('signer is not deed owner', errors.UNSUPPORTED_OPERATION, {
                signerAddress: signerAddress,
                deedOwner: deedOwner,
                name: name
            });
        }

        let { labelHash, registrar } = await this._getHashRegistrar(name);
        let tx = await registrar.connect(this.signer).finalizeAuction(labelHash);
        tx.metadata = {
            labelHash: labelHash,
            name: name
        }

        return tx;
    }

    async getBidHash(name: string, address: string, bidAmount: ethers.utils.BigNumber, salt: ethers.utils.Arrayish): Promise<string> {
        let { labelHash, registrar } = await this._getHashRegistrar(name);
        let sealedBid = await registrar.shaBid(labelHash, address, bidAmount, salt);
        return sealedBid;
    }

    _getBid(name: string, bidAmount: ethers.utils.BigNumber, salt: ethers.utils.Arrayish): Promise<Bid> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        if (!salt || utils.arrayify(salt).length !== 32) {
            errors.throwError('invalid salt', errors.INVALID_ARGUMENT, {
                argument: 'salt',
                value: salt
            });
        }

        return this.signer.getAddress().then((address) => {
            return this._getHashRegistrar(name).then(({ labelHash, registrar }) => {
                return registrar.shaBid(labelHash, address, bidAmount, salt).then((sealedBid) => {
                    return {
                        address: address,
                        bidAmount: bidAmount,
                        salt: utils.hexlify(salt),
                        sealedBid: sealedBid,
                        registrar: registrar,
                        name: name,
                        labelHash: labelHash
                    };
                });
            });
        });
    }

    async placeBid(name: string, amount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish, extraAmount?: ethers.utils.BigNumberish): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        let auction = await this.getAuction(name);

        let errorMessages: { [state: string]: string } = {
            'open': 'name not up for auction yet; please "start" first',
            'owned': 'name already owned',
            'forbidden': 'name forbidden',
            'reveal': 'bidding closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
//            'not-yet-available': ('name not available until ' + getHumanDate(result.startDate))
        };

        let errorMessage = errorMessages[auction.state];
        if (errorMessage) {
            throw new Error(errorMessage);
        }

        if (!extraAmount) { extraAmount = utils.bigNumberify(0); }

        let bidAmount = utils.bigNumberify(amount);

        let bid = await this._getBid(name, bidAmount, salt);

        let options = {
            value: bidAmount.add(extraAmount)
        };

        let tx = await bid.registrar.connect(this.signer).newBid(bid.sealedBid, options);

        tx.metadata = {
            bidAmount: bidAmount,
            extraAmount: utils.bigNumberify(extraAmount),
            name: name,
            labelHash: bid.labelHash,
            salt: salt,
            sealedBid: bid.sealedBid
        };

        return tx;
    }

    getDeedAddress(address: string, bidHash: string): Promise<string> {
        let addressBytes32 = '0x000000000000000000000000' + address.substring(2);
        let position = utils.keccak256(utils.concat([
            bidHash,
            utils.keccak256(utils.concat([
                addressBytes32,
                uintify(3)
            ]))
        ]));

        return this._getHashRegistrar('nothing-important.eth').then(({ labelHash, registrar }) => {
            return this.provider.getStorageAt(registrar.address, position).then((value) => {
                return '0x' + value.substring(26);
            });
        });
    }


    revealBid(name: string, bidAmount: ethers.utils.BigNumberish, salt: ethers.utils.Arrayish): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        let bid = utils.bigNumberify(bidAmount);

        return this._getBid(name, bid, salt).then(({ labelHash, registrar, salt, sealedBid }) => {
            return this.signer.getAddress().then((address) => {
                return this.getDeedAddress(address, sealedBid).then((deedAddress) => {
/*
                    if (deedAddress == ethers.constants.AddressZero) {
                        var error = new Error('bid not found');
                        (<any>error).address = address;
                        (<any>error).bid = bid;
                        (<any>error).name = name;
                        (<any>error).salt = salt;
                        (<any>error).sealedBid = sealedBid;
                        throw error;
                    }
*/
                    return registrar.unsealBid(labelHash, bid, salt).then((tx) => {
                        tx.metadata = {
                            name: name,
                            labelHash: labelHash,
                            salt: salt,
                            sealedBid: sealedBid,
                            bidAmount: bid
                        };
                        return tx;
                    });
                });
            });
        });
    }

    setSubnodeOwner(parentName: string, label: string, owner: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('no signer')); }

        let nodeHash = utils.namehash(parentName);
        let labelHash = utils.keccak256(utils.toUtf8Bytes(label));

        return this._getEns().then((ens) => {
            return ens.connect(this.signer).setSubnodeOwner(nodeHash, labelHash, owner).then((tx) => {
                tx.metadata = {
                    labelHash: labelHash,
                    label: label,
                    nodeHash: nodeHash,
                    owner: owner,
                    parentName: parentName,
                }
                return tx;
            });
        });

    }

    getResolver(name: string): Promise<string> {
        return this._getEns().then((ens) => {
            return ens.resolver(utils.namehash(name)).then((resolverAddress) => {
                if (resolverAddress === constants.AddressZero) { return null; }
                return resolverAddress;
            });
        });
    }

    setResolver(name: string, address: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let nodeHash = utils.namehash(name);
        return this._getEns().then((ens) => {
            return ens.connect(this.signer).setResolver(nodeHash, address).then((tx) => {
                tx.metadata = {
                    address: address,
                    name: name,
                    nodeHash: nodeHash
                };
                return tx;
            });
        });
    }

    getOwner(name: string): Promise<string> {
        return this._getEns().then((ens) => {
            return ens.owner(utils.namehash(name));
        });
    }

    setOwner(name: string, owner: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let nodeHash = utils.namehash(name);

        return this._getEns().then((ens) => {
            return ens.connect(this.signer).setOwner(nodeHash, owner).then((tx) => {
                tx.metadata = {
                    name: name,
                    owner: owner,
                    nodeHash: nodeHash
                }
                return tx;
            });
        });
    }

    getDeedOwner(address: string): Promise<string> {
        let deedContract = new ethers.Contract(address, deedInterface, this.provider);
        return deedContract.functions.owner().then((owner) => {
            return owner;
        }, function (error) {
            return null;
        });
    }

    lookupAddress(address: string): Promise<string> {
        return this.provider.lookupAddress(address);
    }

    resolveName(name: string): Promise<string> {
        return this.provider.resolveName(name);
    }

    async setReverseName(name: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let ens = await this._getEns();

        let owner = await ens.owner(utils.namehash('addr.reverse'));
        let reverseRegistrar: any = new ethers.Contract(owner, interfaces.reverseRegistrar, this.signer);

        let tx = await (<ReverseRegistrarContract>reverseRegistrar).setName(name);
        tx.metadata = { }
        return tx;
    }

/*
    setAbi(name: string, abi: any): Promise<ENSTransactionResponse> {
        var nodeHash = ethers.utils.namehash(name);

        return this._getResolver(name, interfaceIds.abi).then((resolver) => {
            return resolver.setABI(nodeHash, Registrar.ABIEncoding.JSON, ethers.utils.toUtf8Bytes(abi)).then((tx) => {
                tx.metadata = {
                    encoding: Registrar.ABIEncoding.JSON,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address,
                    abi: abi
                }
                return transaction;
            });
        });
    }

    getAbi(name: string): Promise<ethers.Interface> {
        var nodeHash = ethers.utils.namehash(name);
        return this._getResolver(name).then((resolver) => {
            return resolver.ABI(nodeHash, ABIEncoding.JSON).then(({ contentType, data }) => {
                if (contentType === 0) {
                    // @TODO: fallback onto the address record
                    return null;
                }
                return ethers.utils.toUtf8String(data);
            }, function (error) {
                return null;
            });
        }, function(error) {
            return null;
        });
    }
*/
    setAddress(name: string, addr: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let nodeHash = utils.namehash(name);
        return this._getResolver(name, interfaceIds.addr).then((resolver) => {
            return resolver.connect(this.signer).setAddr(nodeHash, addr).then((tx) => {
                tx.metadata = {
                    addr: addr,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address
                };
                return tx;
            });
        });
    }

    getAddress(name: string): Promise<string> {
        let nodeHash = utils.namehash(name);
        return this._getResolver(name).then(function(resolver) {
            return resolver.addr(nodeHash).then(function(addr) {
                if (addr === constants.AddressZero) { return null; }
                return addr;
            }, function (error) {
                return null;
            });
        }, function(error) {
            return null;
        });
    }

    setName(address: string, name: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let ensName = (utils.getAddress(address).substring(2) + '.addr.reverse').toLowerCase()
        let nodeHash = utils.namehash(ensName);
        return this._getResolver(ensName, interfaceIds.name).then((resolver) => {
            return resolver.connect(this.signer).setName(nodeHash, name).then((tx) => {
                tx.metadata = {
                    addr: address,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address
                }
                return tx;
            });
        });
    }

    setPublicKey(name: string, publicKey: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let nodeHash = utils.namehash(name);

        // Make sure the key is uncompressed, and strip the '0x04' prefix
        publicKey = utils.computePublicKey(publicKey, false).substring(4);

        let x = '0x' + publicKey.substring(0, 64);
        let y = '0x' + publicKey.substring(64, 128);

        return this._getResolver(name, interfaceIds.pubkey).then((resolver) => {
            return resolver.connect(this.signer).setPubkey(nodeHash, x, y).then((tx) => {
                tx.metadata = {
                    name: name,
                    nodeHash: nodeHash,
                    publicKey: publicKey,
                    resolver: resolver.address
                }
                return tx;
            });
        });
    }

    getPublicKey(name: string, compressed?: boolean): Promise<string> {
        let nodeHash = utils.namehash(name);
        return this._getResolver(name).then(function(resolverContract) {
            return resolverContract.pubkey(nodeHash).then(function(result) {
                if (result.x === constants.HashZero && result.y === constants.HashZero) {
                    return null;
                }
                return '0x04' + result.x.substring(2) + result.y.substring(2);
            }, function (error) {
                return null;
            });
        }, function(error) {
            return null;
        });
    }

    setText(name: string, key: string, value: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let nodeHash = utils.namehash(name);

        return this._getResolver(name, interfaceIds.text).then((resolver) => {
            return resolver.connect(this.signer).setText(nodeHash, key, value).then((tx) => {
                tx.metadata = {
                    key: key,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address,
                    text: value
                }
                return tx;
            });
        });
    }

    getText(name: string, key: string): Promise<string> {
        let nodeHash = utils.namehash(name);
        return this._getResolver(name).then((resolver) => {
            return resolver.text(nodeHash, key).then((text) => {
                return text;
            }, function (error) {
                return null;
            });
        }, function(error) {
            return null;
        });
    }

    setContentHash(name: string, contentHash: string): Promise<ENSTransactionResponse> {
        if (!this.signer) { return Promise.reject(new Error('missing signer')); }

        let comps = contentHash.split("://");
        if (comps.length !== 2) { throw new Error("invalid content hash"); }

        let bytes: Uint8Array = null;
        switch (comps[0]) {
            case "bzz":
                bytes = utils.concat([ "0x00", ('0x' + comps[1]) ]);
                break;
            case "ipfs":
                bytes = utils.concat([ "0x01", Base58.decode(comps[1]) ]);
                break;
            default:
                throw new Error('unsupported scheme');
        }

        let nodeHash = utils.namehash(name);

        return this._getResolver(name, interfaceIds.contenthash).then((resolver) => {
            return resolver.connect(this.signer).setContenthash(nodeHash, bytes).then((tx) => {
                tx.metadata = {
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address,
                    contentHash: contentHash
                }
                return tx;
            });
        });
    }

    getContentHash(name: string, legacy?: boolean): Promise<string> {
        let nodeHash = utils.namehash(name);
        return this._getResolver(name).then((resolver) => {
            return resolver.contenthash(nodeHash).then((contenthash) => {
                let bytes = utils.arrayify(contenthash);
                // See: https://github.com/ensdomains/multicodec/blob/master/table.csv
                switch (bytes[0]) {
                    case 0x00:
                        return "bzz://" + utils.hexlify(bytes.slice(1)).substring(2);
                    case 0x01:
                        return "ipfs://" + Base58.encode(bytes.slice(1));
                    default:
                        break;
                }
                throw new Error('unsupported contenthash type - ' + bytes[0]);
            }, (error) => {
                if (!legacy) { return null; }
                return resolver.content(nodeHash).then((content) => {
                    return "bzz://" + content.substring(2);
                }, (error) => {
                    return null;
                });
            });
        }, function(error) {
            return null;
        });
    }

    _getResolver(name: string, interfaceId?: string): Promise<ResolverContract> {
        return this.getResolver(name).then((resolverAddress) => {
            if (!resolverAddress) { throw new Error('invalid resolver'); }
            let resolverContract: any = new ethers.Contract(resolverAddress, interfaces.resolver, this.provider);
            let resolver = (<ResolverContract>resolverContract);
            if (interfaceId) {
                return resolver.supportsInterface(interfaceId).then((supported) => {
                    if (!supported) { throw new Error('unsupported method'); }
                    return resolver;
                });
            }
            return resolver;;
        });
    }

    _getEns(): Promise<EnsContract> {
        if (!this._ens) {
            this._ens = this.provider.getNetwork().then((network) => {
                let ens: any = new ethers.Contract(network.ensAddress, interfaces.ens, this.provider);
                return (<EnsContract>ens);
            });
        }
        return this._ens;
    }

    _getHashRegistrar(name: string): Promise<{ registrar: HashRegistrarContract, labelHash: string }> {
        let comps = name.toLowerCase().split('.');

        // Make sure it is a 2 component name
        if (comps.length < 2) {
            return Promise.reject('invalid name (must end have at least 2 components)');
        }

        let label = comps[0]
        let tld = comps[1];

        if (tld !== 'eth' || label.length < 7 || !label.match(/^[a-z0-9-]*$/)) {
            return Promise.reject('invalid name (must be 7 of more character)');
        }

        if (!this._hashRegistrar) {
            this._hashRegistrar = this._getEns().then((ens) => {
                return ens.owner(utils.namehash(tld)).then((owner) => {
                    let hashRegistrar: any = new ethers.Contract(owner, interfaces.hashRegistrar, this.provider);
                    return (<HashRegistrarContract>hashRegistrar);
                });
            });
        }

        return this._hashRegistrar.then((registrar) => {
            return {
                registrar: registrar,
                labelHash: utils.keccak256(utils.toUtf8Bytes(label))
            }
        });
    }
}
/*
Registrar.prototype._getEns = function(name) {

    var comps = name.toLowerCase().split('.');

    // Make sure it is a 2 component name
    if (comps.length !== 2) {
        return Promise.reject('invalid name (must end have exactly 2 components)');
    }

    var label = comps[0];
    var tld = comps[1];

    // Make sure it is a supported tld
    if (tld != 'eth') {
        return Promise.reject('invalid name (must end in .eth)');
    }

    // Must be 7 characters or longer and contain only a-z, 0-0 and the hyphen (-)
    if (comps[0].length < 7 || !comps[0].match(/^[a-z0-9-]*$/)) {
        return Promise.reject('invalid name (must be 7 of more character)');
    }

    // A promise (cached) that holds the registrarContract for a given tld
    var ownerPromise = this._ensLookup[tld];
    if (!ownerPromise) {
        var ensContract = new ethers.Contract(this.config.ensAddress, ensInterface, this.provider);

        ownerPromise = ensContract.owner(ethers.utils.namehash(tld)).then(function(result) {
            return result.owner;
        });

        this._ensLookup[tld] = ownerPromise;
    }

    var providerOrSigner = this.signer || this.provider;

    return ownerPromise.then(function(owner) {
        var registrarContract = new ethers.Contract(owner, registrarInterface, providerOrSigner );
        return {
            registrarContract: registrarContract,
            labelHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label))
        }
    });
}
*/
//Registrar.prototype.
/*
const isValidName = function(name) {

    var comps = name.toLowerCase().split('.');

    // Make sure it is a 2 component name
    if (comps.length !== 2) { return false; }

    // Make sure it is a supported tld
    //if (comps[1] != 'eth' || !(comps[1] == 'test' && this.provider.testnet)) 
    if (comps[1] != 'eth') {
        return false;
    }

    // Must be 7 characters or longer and contain only a-z, 0-0 and the hyphen (-)
    if (comps[0].length < 7 || !comps[0].match(/^[a-z0-9-]*$/)) { return false; }

    return true;
}
*/

//var StringZeros = '0000000000000000000000000000000000000000000000000000000000000000';





/**
 *  SimpleRegistrar Operations
 *
 *
 *
 */
/*
function SimpleRegistrar(address, registrar) {
    this.provider = registrar.provider;
    this.signer = registrar.signer;

    var providerOrSigner = this.signer || this.provider;

    this._simpleRegistrar = new ethers.Contract(address, SimpleRegistrarInterface, providerOrSigner);
}

SimpleRegistrar.prototype.getFee = function() {
    return this._simpleRegistrar.fee().then(function(result) {
        return result.fee;
    });
}

SimpleRegistrar.prototype.register = function(label, value) {
    var options = {
        gasLimit: 250000,
        value: (value || 0)
    };

    return this._simpleRegistrar.register(label, options).then(function(result) {
        result.label = label;
        return result;
    });
}

Registrar.prototype.getSimpleRegistrar = function(name) {
    var self = this;
    return this.getAddress(name).then(function(address) {
        if (!address) { return null; }
        return new SimpleRegistrar(address, self);
    });
}
*/
/**
 *  Event API (experimental)
 */

/*
Registrar.prototype.on = function(event, callback) {
    this._getEns('nothing-important.eth').then(function(result) {
        result.registrarContract['on' + event.toLowerCase()] = callback;
    });
}
*/

// Export for Browsers
let _e = (<any>global).ethers;
if (_e && _e.platform === 'browser' && !_e.ENS) {
    _e.ENS = ENS;
}
