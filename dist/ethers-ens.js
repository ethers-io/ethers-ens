(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ENS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var errors = ethers_1.ethers.errors;
var constants = ethers_1.ethers.constants;
var utils = ethers_1.ethers.utils;
var ensInterface = [
    "function owner(bytes32 nodeHash) constant returns (address owner)",
    "function resolver(bytes32 nodeHash) constant returns (address resolver)",
    "function ttl(bytes32 nodeHash) returns (uint64 ttl)",
    "function setOwner(bytes32 nodeHash, address owner) @100000",
    "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) @85000",
    "function setResolver(bytes32 nodeHash, address resolver) @100000",
];
var testRegistrarInterface = [
    "function expiryTimes(bytes32 labelHash) constant returns (uint256 expiry)",
    "function register(bytes32 labelHash, address owner)"
];
var hashRegistrarInterface = [
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
var simpleRegistrarInterface = [
    "function fee() constant returns (uint256 fee)",
    "function register(string label)"
];
var deedInterface = [
    "function owner() constant returns (address owner)"
];
var resolverInterface = [
    "function supportsInterface(bytes4 interfaceId) constant returns (bool supported)",
    "function addr(bytes32 nodeHash) constant returns (address addr)",
    "function name(bytes32 nodeHash) constant returns (string name)",
    "function ABI(bytes32 nodeHash, uint256 type) constant returns (uint contentType, bytes data)",
    "function pubkey(bytes32 nodeHash) constant returns (bytes32 x, bytes32 y)",
    "function text(bytes32 nodeHash, string key) constant returns (string value)",
    "function setAddr(bytes32 nodeHash, address addr) @150000",
    "function setName(bytes32 nodeHash, string name)",
    "function setABI(bytes32 nodeHash, uint256 contentType, bytes data)",
    "function setPubkey(bytes32 nodeHash, bytes32 x, bytes32 y)",
    "function setText(bytes32 nodeHash, string key, string value)"
];
var reverseRegistrarInterface = [
    "function setName(string name) returns (bytes32 node) @150000"
];
function zeroPad(value, length) {
    var valueString = String(value);
    while (valueString.length < length) {
        valueString = '0' + valueString;
    }
    return valueString;
}
// Return YYYY-mm-dd HH:MM:SS
function getDate(date) {
    return (date.getFullYear() + '-' +
        zeroPad(date.getMonth() + 1, 2) + '-' +
        zeroPad(date.getDate(), 2) + ' ' +
        zeroPad(date.getHours(), 2) + ':' +
        zeroPad(date.getMinutes(), 2) + ':' +
        zeroPad(date.getSeconds(), 2));
}
exports.getDate = getDate;
// Return the delta time between now and the timestamp
function getTimer(timestamp) {
    var dt = (timestamp.getTime() - (new Date()).getTime()) / 1000;
    var negative = false;
    if (dt < 0) {
        negative = true;
        dt *= -1;
    }
    if (dt === 0) {
        return '0';
    }
    var result = [];
    [60, 60, 24, 365, 1000].forEach(function (chunk) {
        if (dt === 0) {
            return;
        }
        var amount = zeroPad(Math.trunc(dt % chunk), 2);
        dt = Math.trunc(dt / chunk);
        result.unshift(amount);
    });
    var timer = result.join(":");
    // Trim leading zeros
    while (timer.length > 1 && timer.match(/^[0:].+/)) {
        timer = timer.substring(1);
    }
    if (negative) {
        timer = '-' + timer;
    }
    return timer;
}
function getDateTimer(timestamp) {
    var timer = getTimer(timestamp);
    if (timer.substring(0, 1) === '-') {
        timer = ' (' + timer.substring(1) + ' ago)';
    }
    else {
        timer = ' (in ' + timer + ')';
    }
    return getDate(timestamp) + timer;
}
exports.getDateTimer = getDateTimer;
exports.interfaces = {
    ens: new utils.Interface(ensInterface),
    testRegistrar: new utils.Interface(testRegistrarInterface),
    hashRegistrar: new utils.Interface(hashRegistrarInterface),
    reverseRegistrar: new utils.Interface(reverseRegistrarInterface),
    simpleRegistrar: new utils.Interface(simpleRegistrarInterface),
    resolver: new utils.Interface(resolverInterface),
};
Object.freeze(exports.interfaces);
var ABIEncodings;
(function (ABIEncodings) {
    ABIEncodings[ABIEncodings["JSON"] = 1] = "JSON";
    ABIEncodings[ABIEncodings["zlibJSON"] = 2] = "zlibJSON";
    ABIEncodings[ABIEncodings["CBOR"] = 4] = "CBOR";
    ABIEncodings[ABIEncodings["URI"] = 8] = "URI";
})(ABIEncodings = exports.ABIEncodings || (exports.ABIEncodings = {}));
function uintify(value) {
    return utils.hexZeroPad(utils.bigNumberify(value).toHexString(), 32);
}
var states = [
    'open', 'auction', 'owned', 'forbidden', 'reveal', 'not-yet-available'
];
var interfaceIds = {
    addr: '0x3b3b57de',
    name: '0x691f3431',
    pubkey: '0xc8690233',
    text: '0x59d1d43c',
    abi: '0x2203ab56'
};
var ENS = /** @class */ (function () {
    function ENS(providerOrSigner) {
        this._ens = null;
        this._hashRegistrar = null;
        errors.checkNew(this, ENS);
        this.provider = null;
        this.signer = null;
        if (ethers_1.ethers.providers.Provider.isProvider(providerOrSigner)) {
            utils.defineReadOnly(this, 'provider', providerOrSigner);
        }
        else if (ethers_1.ethers.Signer.isSigner(providerOrSigner)) {
            if (!providerOrSigner.provider) {
                errors.throwError('signer is missing provider', errors.INVALID_ARGUMENT, {
                    argument: 'providerOrSigner',
                    value: providerOrSigner
                });
            }
            utils.defineReadOnly(this, 'signer', providerOrSigner);
            utils.defineReadOnly(this, 'provider', providerOrSigner.provider);
        }
        else {
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
    ENS.prototype.getAuctionStartDate = function (name) {
        return this._getHashRegistrar(name).then(function (_a) {
            var labelHash = _a.labelHash, registrar = _a.registrar;
            return registrar.getAllowedTime(labelHash).then(function (timestamp) {
                return new Date(timestamp.toNumber() * 1000);
            });
        });
    };
    ENS.prototype.getAuction = function (name) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, labelHash, registrar, auction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getHashRegistrar(name)];
                    case 1:
                        _a = _b.sent(), labelHash = _a.labelHash, registrar = _a.registrar;
                        return [4 /*yield*/, registrar.entries(labelHash)];
                    case 2:
                        auction = _b.sent();
                        return [2 /*return*/, {
                                endDate: new Date(auction.endDate.toNumber() * 1000),
                                highestBid: auction.highestBid,
                                revealDate: new Date((auction.endDate.toNumber() - (24 * 2 * 60 * 60)) * 1000),
                                state: states[auction.state],
                                value: auction.value,
                                winningDeed: auction.winningDeed
                            }];
                }
            });
        });
    };
    ENS.prototype.startAuction = function (name) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, labelHash, registrar, auction, errorMessages, errorMessage, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.signer) {
                            return [2 /*return*/, Promise.reject(new Error('no signer'))];
                        }
                        return [4 /*yield*/, this._getHashRegistrar(name)];
                    case 1:
                        _a = _b.sent(), labelHash = _a.labelHash, registrar = _a.registrar;
                        return [4 /*yield*/, this.getAuction(name)];
                    case 2:
                        auction = _b.sent();
                        errorMessages = {
                            'auction': 'name already up for auction; please bid before ' + getDateTimer(auction.revealDate),
                            'owned': 'name already owned',
                            'forbidden': 'name forbidden',
                            'reveal': 'bidding closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
                        };
                        errorMessage = errorMessages[auction.state];
                        if (errorMessage) {
                            errors.throwError(errorMessage, errors.UNSUPPORTED_OPERATION, {
                                name: name
                            });
                        }
                        return [4 /*yield*/, registrar.connect(this.signer).startAuction(labelHash)];
                    case 3:
                        tx = _b.sent();
                        tx.metadata = {
                            labelHash: labelHash,
                            name: name
                        };
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    ENS.prototype.finalizeAuction = function (name) {
        return __awaiter(this, void 0, Promise, function () {
            var auction, errorMessages, errorMessage, deedOwner, signerAddress, _a, labelHash, registrar, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.signer) {
                            return [2 /*return*/, Promise.reject(new Error('no signer'))];
                        }
                        return [4 /*yield*/, this.getAuction(name)];
                    case 1:
                        auction = _b.sent();
                        errorMessages = {
                            'auction': ('name still up for auction; wait until ' + getDateTimer(auction.revealDate)),
                            'open': 'name not up for auction yet; please "start" first',
                            'forbidden': 'name forbidden',
                            'reveal': 'auction closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
                        };
                        errorMessage = errorMessages[auction.state];
                        if (errorMessage) {
                            errors.throwError(errorMessage, errors.UNSUPPORTED_OPERATION, {
                                name: name
                            });
                        }
                        return [4 /*yield*/, this.getDeedOwner(name)];
                    case 2:
                        deedOwner = _b.sent();
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 3:
                        signerAddress = _b.sent();
                        if (deedOwner !== signerAddress) {
                            errors.throwError('signer is not deed owner', errors.UNSUPPORTED_OPERATION, {
                                signerAddress: signerAddress,
                                deedOwner: deedOwner,
                                name: name
                            });
                        }
                        return [4 /*yield*/, this._getHashRegistrar(name)];
                    case 4:
                        _a = _b.sent(), labelHash = _a.labelHash, registrar = _a.registrar;
                        return [4 /*yield*/, registrar.connect(this.signer).finalizeAuction(labelHash)];
                    case 5:
                        tx = _b.sent();
                        tx.metadata = {
                            labelHash: labelHash,
                            name: name
                        };
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    ENS.prototype.getBidHash = function (name, address, bidAmount, salt) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, labelHash, registrar, sealedBid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getHashRegistrar(name)];
                    case 1:
                        _a = _b.sent(), labelHash = _a.labelHash, registrar = _a.registrar;
                        return [4 /*yield*/, registrar.shaBid(labelHash, address, bidAmount, salt)];
                    case 2:
                        sealedBid = _b.sent();
                        return [2 /*return*/, sealedBid];
                }
            });
        });
    };
    ENS.prototype._getBid = function (name, bidAmount, salt) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('no signer'));
        }
        if (!salt || utils.arrayify(salt).length !== 32) {
            errors.throwError('invalid salt', errors.INVALID_ARGUMENT, {
                argument: 'salt',
                value: salt
            });
        }
        return this.signer.getAddress().then(function (address) {
            return _this._getHashRegistrar(name).then(function (_a) {
                var labelHash = _a.labelHash, registrar = _a.registrar;
                return registrar.shaBid(labelHash, address, bidAmount, salt).then(function (sealedBid) {
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
    };
    ENS.prototype.placeBid = function (name, amount, salt, extraAmount) {
        return __awaiter(this, void 0, Promise, function () {
            var auction, errorMessages, errorMessage, bidAmount, bid, options, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signer) {
                            return [2 /*return*/, Promise.reject(new Error('no signer'))];
                        }
                        return [4 /*yield*/, this.getAuction(name)];
                    case 1:
                        auction = _a.sent();
                        errorMessages = {
                            'open': 'name not up for auction yet; please "start" first',
                            'owned': 'name already owned',
                            'forbidden': 'name forbidden',
                            'reveal': 'bidding closed; please "reveal" your bid before ' + getDateTimer(auction.endDate),
                        };
                        errorMessage = errorMessages[auction.state];
                        if (errorMessage) {
                            throw new Error(errorMessage);
                        }
                        if (!extraAmount) {
                            extraAmount = utils.bigNumberify(0);
                        }
                        bidAmount = utils.bigNumberify(amount);
                        return [4 /*yield*/, this._getBid(name, bidAmount, salt)];
                    case 2:
                        bid = _a.sent();
                        options = {
                            value: bidAmount.add(extraAmount)
                        };
                        return [4 /*yield*/, bid.registrar.connect(this.signer).newBid(bid.sealedBid, options)];
                    case 3:
                        tx = _a.sent();
                        tx.metadata = {
                            bidAmount: bidAmount,
                            extraAmount: utils.bigNumberify(extraAmount),
                            name: name,
                            labelHash: bid.labelHash,
                            salt: salt,
                            sealedBid: bid.sealedBid
                        };
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    ENS.prototype.getDeedAddress = function (address, bidHash) {
        var _this = this;
        var addressBytes32 = '0x000000000000000000000000' + address.substring(2);
        var position = utils.keccak256(utils.concat([
            bidHash,
            utils.keccak256(utils.concat([
                addressBytes32,
                uintify(3)
            ]))
        ]));
        return this._getHashRegistrar('nothing-important.eth').then(function (_a) {
            var labelHash = _a.labelHash, registrar = _a.registrar;
            return _this.provider.getStorageAt(registrar.address, position).then(function (value) {
                return '0x' + value.substring(26);
            });
        });
    };
    ENS.prototype.revealBid = function (name, bidAmount, salt) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('no signer'));
        }
        var bid = utils.bigNumberify(bidAmount);
        return this._getBid(name, bid, salt).then(function (_a) {
            var labelHash = _a.labelHash, registrar = _a.registrar, salt = _a.salt, sealedBid = _a.sealedBid;
            return _this.signer.getAddress().then(function (address) {
                return _this.getDeedAddress(address, sealedBid).then(function (deedAddress) {
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
                    return registrar.unsealBid(labelHash, bid, salt).then(function (tx) {
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
    };
    ENS.prototype.setSubnodeOwner = function (parentName, label, owner) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('no signer'));
        }
        var nodeHash = utils.namehash(parentName);
        var labelHash = utils.keccak256(utils.toUtf8Bytes(label));
        return this._getEns().then(function (ens) {
            return ens.connect(_this.signer).setSubnodeOwner(nodeHash, labelHash, owner).then(function (tx) {
                tx.metadata = {
                    labelHash: labelHash,
                    label: label,
                    nodeHash: nodeHash,
                    owner: owner,
                    parentName: parentName,
                };
                return tx;
            });
        });
    };
    ENS.prototype.getResolver = function (name) {
        return this._getEns().then(function (ens) {
            return ens.resolver(utils.namehash(name)).then(function (resolverAddress) {
                if (resolverAddress === constants.AddressZero) {
                    return null;
                }
                return resolverAddress;
            });
        });
    };
    ENS.prototype.setResolver = function (name, address) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var nodeHash = utils.namehash(name);
        return this._getEns().then(function (ens) {
            return ens.connect(_this.signer).setResolver(nodeHash, address).then(function (tx) {
                tx.metadata = {
                    address: address,
                    name: name,
                    nodeHash: nodeHash
                };
                return tx;
            });
        });
    };
    ENS.prototype.getOwner = function (name) {
        return this._getEns().then(function (ens) {
            return ens.owner(utils.namehash(name));
        });
    };
    ENS.prototype.setOwner = function (name, owner) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var nodeHash = utils.namehash(name);
        return this._getEns().then(function (ens) {
            return ens.connect(_this.signer).setOwner(nodeHash, owner).then(function (tx) {
                tx.metadata = {
                    name: name,
                    owner: owner,
                    nodeHash: nodeHash
                };
                return tx;
            });
        });
    };
    ENS.prototype.getDeedOwner = function (address) {
        var deedContract = new ethers_1.ethers.Contract(address, deedInterface, this.provider);
        return deedContract.functions.owner().then(function (owner) {
            return owner;
        }, function (error) {
            return null;
        });
    };
    ENS.prototype.lookupAddress = function (address) {
        return this.provider.lookupAddress(address);
    };
    ENS.prototype.resolveName = function (name) {
        return this.provider.resolveName(name);
    };
    ENS.prototype.setReverseName = function (name) {
        return __awaiter(this, void 0, Promise, function () {
            var ens, owner, reverseRegistrar, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signer) {
                            return [2 /*return*/, Promise.reject(new Error('missing signer'))];
                        }
                        return [4 /*yield*/, this._getEns()];
                    case 1:
                        ens = _a.sent();
                        return [4 /*yield*/, ens.owner(utils.namehash('addr.reverse'))];
                    case 2:
                        owner = _a.sent();
                        reverseRegistrar = new ethers_1.ethers.Contract(owner, exports.interfaces.reverseRegistrar, this.signer);
                        return [4 /*yield*/, reverseRegistrar.setName(name)];
                    case 3:
                        tx = _a.sent();
                        tx.metadata = {};
                        return [2 /*return*/, tx];
                }
            });
        });
    };
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
    ENS.prototype.setAddress = function (name, addr) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var nodeHash = utils.namehash(name);
        return this._getResolver(name, interfaceIds.addr).then(function (resolver) {
            return resolver.connect(_this.signer).setAddr(nodeHash, addr).then(function (tx) {
                tx.metadata = {
                    addr: addr,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address
                };
                return tx;
            });
        });
    };
    ENS.prototype.getAddress = function (name) {
        var nodeHash = utils.namehash(name);
        return this._getResolver(name).then(function (resolver) {
            return resolver.addr(nodeHash).then(function (addr) {
                if (addr === constants.AddressZero) {
                    return null;
                }
                return addr;
            }, function (error) {
                return null;
            });
        }, function (error) {
            return null;
        });
    };
    ENS.prototype.setName = function (address, name) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var ensName = (utils.getAddress(address).substring(2) + '.addr.reverse').toLowerCase();
        var nodeHash = utils.namehash(ensName);
        return this._getResolver(ensName, interfaceIds.name).then(function (resolver) {
            return resolver.connect(_this.signer).setName(nodeHash, name).then(function (tx) {
                tx.metadata = {
                    addr: address,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address
                };
                return tx;
            });
        });
    };
    ENS.prototype.setPublicKey = function (name, publicKey) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var nodeHash = utils.namehash(name);
        // Make sure the key is uncompressed, and strip the '0x04' prefix
        publicKey = utils.computePublicKey(publicKey, false).substring(4);
        var x = '0x' + publicKey.substring(0, 64);
        var y = '0x' + publicKey.substring(64, 128);
        return this._getResolver(name, interfaceIds.pubkey).then(function (resolver) {
            return resolver.connect(_this.signer).setPubkey(nodeHash, x, y).then(function (tx) {
                tx.metadata = {
                    name: name,
                    nodeHash: nodeHash,
                    publicKey: publicKey,
                    resolver: resolver.address
                };
                return tx;
            });
        });
    };
    ENS.prototype.getPublicKey = function (name, compressed) {
        var nodeHash = utils.namehash(name);
        return this._getResolver(name).then(function (resolverContract) {
            return resolverContract.pubkey(nodeHash).then(function (result) {
                if (result.x === constants.HashZero && result.y === constants.HashZero) {
                    return null;
                }
                return '0x04' + result.x.substring(2) + result.y.substring(2);
            }, function (error) {
                return null;
            });
        }, function (error) {
            return null;
        });
    };
    ENS.prototype.setText = function (name, key, value) {
        var _this = this;
        if (!this.signer) {
            return Promise.reject(new Error('missing signer'));
        }
        var nodeHash = utils.namehash(name);
        return this._getResolver(name, interfaceIds.text).then(function (resolver) {
            return resolver.connect(_this.signer).setText(nodeHash, key, value).then(function (tx) {
                tx.metadata = {
                    key: key,
                    name: name,
                    nodeHash: nodeHash,
                    resolver: resolver.address,
                    text: value
                };
                return tx;
            });
        });
    };
    ENS.prototype.getText = function (name, key) {
        var nodeHash = utils.namehash(name);
        return this._getResolver(name).then(function (resolver) {
            return resolver.text(nodeHash, key).then(function (text) {
                return text;
            }, function (error) {
                return null;
            });
        }, function (error) {
            return null;
        });
    };
    ENS.prototype._getResolver = function (name, interfaceId) {
        var _this = this;
        return this.getResolver(name).then(function (resolverAddress) {
            if (!resolverAddress) {
                throw new Error('invalid resolver');
            }
            var resolverContract = new ethers_1.ethers.Contract(resolverAddress, exports.interfaces.resolver, _this.provider);
            var resolver = resolverContract;
            if (interfaceId) {
                return resolver.supportsInterface(interfaceId).then(function (supported) {
                    if (!supported) {
                        throw new Error('unsupported method');
                    }
                    return resolver;
                });
            }
            return resolver;
            ;
        });
    };
    ENS.prototype._getEns = function () {
        var _this = this;
        if (!this._ens) {
            this._ens = this.provider.getNetwork().then(function (network) {
                var ens = new ethers_1.ethers.Contract(network.ensAddress, exports.interfaces.ens, _this.provider);
                return ens;
            });
        }
        return this._ens;
    };
    ENS.prototype._getHashRegistrar = function (name) {
        var _this = this;
        var comps = name.toLowerCase().split('.');
        // Make sure it is a 2 component name
        if (comps.length < 2) {
            return Promise.reject('invalid name (must end have at least 2 components)');
        }
        var label = comps[0];
        var tld = comps[1];
        if (tld !== 'eth' || label.length < 7 || !label.match(/^[a-z0-9-]*$/)) {
            return Promise.reject('invalid name (must be 7 of more character)');
        }
        if (!this._hashRegistrar) {
            this._hashRegistrar = this._getEns().then(function (ens) {
                return ens.owner(utils.namehash(tld)).then(function (owner) {
                    var hashRegistrar = new ethers_1.ethers.Contract(owner, exports.interfaces.hashRegistrar, _this.provider);
                    return hashRegistrar;
                });
            });
        }
        return this._hashRegistrar.then(function (registrar) {
            return {
                registrar: registrar,
                labelHash: utils.keccak256(utils.toUtf8Bytes(label))
            };
        });
    };
    return ENS;
}());
exports.ENS = ENS;
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
var _e = global.ethers;
if (_e && _e.platform === 'browser' && !_e.ENS) {
    _e.ENS = ENS;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ethers":2}],2:[function(require,module,exports){
(function (global){
module.exports = global.ethers;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
