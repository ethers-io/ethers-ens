'use strict';

var ethers = require('ethers');

// Debugging...
process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    console.log(p);
    console.log(reason);
});
var ZeroAddress = '0x0000000000000000000000000000000000000000';

var ensInterface = [
    {
        outputs: [ { name: "owner", type: "address" } ],
        type: "function",
        inputs : [ { name: "nodeHash", type: "bytes32" } ],
        name: "owner",
        constant: true
    },
    {
        outputs: [ { name: "resolver", type: "address" } ],
        type: "function",
        inputs : [ { name: "nodeHash", type: "bytes32" } ],
        name: "resolver",
        constant: true
    },
    {
        outputs: [ ],
        type: "function",
        inputs : [
            { name: "nodeHash", type: "bytes32" },
            { name: "resolver", type: "address" }
        ],
        name: "setResolver",
        constant: false
    },
    {
        name: "ttl",
        constant: true,
        inputs: [ { name: "nodeHash", type: "bytes32" } ],
        type: "function",
        outputs: [ { name: "ttl", type: "uint64" } ]
    },
];

var registrarTestInterface = [
    {
        name: "expiryTimes",
        constant: true,
        inputs: [ { name: "labelHash", type: "bytes32" } ],
        type: "function",
        outputs: [ { name: "expiry", type: "uint256" } ]
    },
    {
        name: "register",
        constant: false,
        inputs: [
            { name: "labelHash", type: "bytes32" },
            { name: "owner", type: "address" }
        ],
        type: "function",
        outputs: [ ]
    },
];

var registrarInterface = [
    {
        name: "entries",
        constant: true,
        inputs: [ { name: "labelHash", type: "bytes32" } ],
        type: "function",
        outputs: [
            { name: "_state", type: "uint8" },
            { name: "winningDeed", type: "address" },
            { name: "endDate", type: "uint256" },
            { name: "value", type: "uint256" },
            { name: "highestBid", type: "uint256" },
        ]
    },
    {
        name: "getAllowedTime",
        constant: true,
        inputs: [ { name: "labelHash", type: "bytes32" } ],
        type: "function",
        outputs: [ { name: "timestamp", type: "uint256" } ]
    },
    {
        name: "startAuction",
        constant: false,
        inputs: [ { name: "labelHash", type: "bytes32" } ],
        type: "function",
        outputs: [ ]
    },
    {
        name: "shaBid",
        constant: true,
        inputs: [
            { name: "labelHash", type: "bytes32" },
            { name: "owner", type: "address" },
            { name: "bidAmount", type: "uint256" },
            { name: "salt", type: "bytes32" }
        ],
        type: "function",
        outputs: [ { name: "sealedBid", type: "bytes32" } ]
    },
    {
        name: "newBid",
        constant: false,
        inputs: [ { name: "sealedBid", type: "bytes32" } ],
        type: "function",
        outputs: [ ]
    },
    {
        name: "unsealBid",
        constant: false,
        inputs: [
            { name: "labelHash", type: "bytes32" },
            { name: "bidAmount", type: "uint256" },
            { name: "salt", type: "bytes32" }
        ],
        type: "function",
        outputs: [ ]
    },
    {
        name: "finalizeAuction",
        constant: false,
        inputs: [ { name: "labelHash", type: "bytes32" } ],
        type: "function",
        outputs: [ ]
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "labelHash", type: "bytes32" },
            { indexed: false, name: "registrationDate", type: "uint256" }
        ],
        name: "AuctionStarted",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "sealedBid", type: "bytes32" },
            { indexed: true, name: "bidder", type: "address" },
            { indexed: false, name: "deposit", type: "uint256" }
        ],
        name: "NewBid",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "labelHash", type: "bytes32" },
            { indexed: true, name: "owner", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
            { indexed: false, name: "status", type: "uint8" }
        ],
        name: "BidRevealed",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "labelHash", type: "bytes32" },
            { indexed: true, name: "owner", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
            { indexed: false, name: "registrationDate", type: "uint256" }
        ],
        name: "HashRegistered",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "labelHash", type: "bytes32" },
            { indexed: false, name: "value", type: "uint256" }
        ],
        name: "HashReleased",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "labelHash", type: "bytes32" },
            { indexed: true, name: "name", type: "string" },
            { indexed: false, name: "value", type: "uint256" },
            { indexed: false, name: "registrationDate", type: "uint256" }
        ],
        name: "HashInvalidated",
        type: "event"
    }
];

var deedInterface = [
    {
        name: "owner",
        constant: true,
        inputs: [],
        outputs: [ { name: "owner", type: "address" } ],
        type: "function"
    }
];

var resolverInterface = [
    {
        name: "addr",
        constant: true,
        inputs: [ { name: "nodeHash", type: "bytes32" } ],
        type: "function",
        outputs: [ { name: "addr", type: "address" } ]
    },
    {
        name: "setAddr",
        constant: false,
        inputs: [
            { name: "nodeHash", type: "bytes32" },
            { name: "addr", type: "address" }
        ],
        type: "function",
        outputs: [ ]
    },
];


function Registrar(providerOrSigner) {
    if (!(this instanceof Registrar)) { throw new Error('missing new'); }

    // Passed in a boolean, indicating testnet if true (or mainnet if false)
    // without a signer (lookup only)
    if (typeof(providerOrSigner) === 'boolean') {
        providerOrSigner = ethers.providers.getDefaultProvider(providerOrSigner);
    }

    this.signer = null;

    // Default; no signer on mainnet (lookup only)
    if (!providerOrSigner) {
        this.provider = ethers.providers.getDefaultProvider();

    // Custom signer
    } else if (providerOrSigner.provider) {
        this.provider = providerOrSigner.provider;
        this.signer = providerOrSigner;

    // Custom provider, no signer (lookup only)
    } else {
        this.provider = providerOrSigner;
    }

    this.config = (this.provider.testnet ? Registrar.config.testnet: Registrar.config.mainnet);

    this._ensPromise = {};
}

Registrar.prototype._getEns = function(name) {

    var comps = name.toLowerCase().split('.');

    // Make sure it is a 2 component name
    if (comps.length !== 2) {
        return Promise.reject('invalid name (must end have exactly 1 period)');
    }

    var label = comps[0];
    var tld = comps[1];

    // Make sure it is a supported tld
    if (this.provider.testnet) {
        if (tld != 'eth' && tld != 'test') {
            return Promise.reject('invalid name (must end in .eth or .test)');
        }
    } else {
        if (tld != 'eth') {
            return Promise.reject('invalid name (must end in .eth)');
        }
    }

    // Must be 7 characters or longer and contain only a-z, 0-0 and the hyphen (-)
    if (comps[0].length < 7 || !comps[0].match(/^[a-z0-9-]*$/)) {
        return Promise.reject('invalid name (must be 7 of more character)');
    }

    // A promise (cached) that holds the registrarContract for a given tld
    var ensPromise = this._ensPromise[tld]
    if (!ensPromise) {
        var providerOrSigner = this.signer || this.provider;
        var ensContract = new ethers.Contract(this.config.ensAddress, ensInterface, providerOrSigner);

        ensPromise = ensContract.owner(ethers.utils.namehash(tld)).then(function(result) {
            return new ethers.Contract(
                result.owner,
                ((tld == 'test') ? registrarTestInterface: registrarInterface),
                providerOrSigner
            );
        });

        this._ensPromise[tld] = ensPromise;
    }

    return ensPromise.then(function(registrarContract) {
        return {
            registrarContract: registrarContract,
            labelHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label))
        }
    });
}

Registrar.config = {
    mainnet: {
        ensAddress: '0x314159265dd8dbb310642f98f50c066173c1259b',
        publicResolver: '0x1da022710df5002339274aadee8d58218e9d6ab5'
    },
    testnet: {
        ensAddress: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
        publicResolver: '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a'
    }
}

Registrar.prototype.isValidName = function(name) {

    var comps = name.toLowerCase().split('.');

    // Make sure it is a 2 component name
    if (comps.length !== 2) { return false; }

    // Make sure it is a supported tld
    //if (comps[1] != 'eth' || !(comps[1] == 'test' && this.provider.testnet)) {
    if (comps[1] != 'eth') {
        return false;
    }

    // Must be 7 characters or longer and contain only a-z, 0-0 and the hyphen (-)
    if (comps[0].length < 7 || !comps[0].match(/^[a-z0-9-]*$/)) { return false; }

    return true;
}

Registrar.prototype.getAuctionStartDate = function(name) {
    return this._getEns(name).then(function(results) {
        return results.registrarContract.getAllowedTime(results.labelHash).then(function(result) {
            return new Date(result.timestamp.toNumber() * 1000);
        });
    });
}

Registrar.States = [
    'open', 'auction', 'owned', 'forbidden', 'reveal', 'not-yet-available'
];

Registrar.prototype.getAuction = function(name) {
    return this._getEns(name).then(function(results) {
        return results.registrarContract.entries(results.labelHash);
    }).then(function(result) {
        result.state = Registrar.States[result._state];
        result.revealDate = new Date((result.endDate.toNumber() - (24 * 2 * 60 * 60)) * 1000);
        result.endDate = new Date(result.endDate.toNumber() * 1000);
        return result;
    });
}

Registrar.prototype.startAuction = function(name) {
    var options = {
        gasLimit: 300000
    };
    return this._getEns(name).then(function(results) {
        return results.registrarContract.startAuction(results.labelHash).then(function(transaction) {
            transaction.labelHash = results.labelHash;
            return transaction;
        });
    });
}

Registrar.prototype.finalizeAuction = function(name) {
    var options = {
        gasLimit: 200000
    };
    return this._getEns(name).then(function(result) {
        return result.registrarContract.finalizeAuction(result.labelHash, options).then(function(transaction) {
            transaction.labelHash = result.labelHash;
            transaction.name = name;
            return transaction;
        });
    });
}

Registrar.prototype._getBidHash = function(name, bidAmount, salt) {
    var addressPromise = this.signer.getAddress();
    if (!(addressPromise instanceof Promise)) {
        addressPromise = Promise.resolve(address);
    }

    if (!salt) {
        if (this.signer.getSalt) {
            salt = this.signer.getSalt([
                name,
                bidAmount.toHexString()
            ].join('-'));
        } else {
            throw new Error('missing salt');
        }
    }

    var saltPromise = salt;
    if (!(saltPromise instanceof Promise)) {
        saltPromise = Promise.resolve(salt);
    }

    return Promise.all([
        this._getEns(name),
        addressPromise,
        saltPromise
    ]).then(function(results) {
        var registrarContract = results[0].registrarContract;
        var labelHash = results[0].labelHash;
        var address = results[1];
        var salt = results[2];

        return registrarContract.shaBid(labelHash, address, bidAmount, salt).then(function(result) {
            return {
                address: address,
                bidAmount: bidAmount,
                salt: salt,
                sealedBid: result.sealedBid,
                registrarContract: registrarContract,
                name: name,
                labelHash: labelHash
            }
        });
    });
}

Registrar.prototype.placeBid = function(name, bidAmount, salt, extraAmount) {
    if (!extraAmount) { extraAmount = ethers.utils.bigNumberify(0); }

    return this._getBidHash(name, bidAmount, salt).then(function(result) {
        var options = {
            gasLimit: 500000,
            value: bidAmount.add(extraAmount)
        };
        return result.registrarContract.newBid(result.sealedBid, options).then(function(transaction) {
            transaction.bidAmount = result.bidAmount;
            transaction.extraAmount = extraAmount;
            transaction.name = result.name;
            transaction.labelHash = result.labelHash;
            transaction.salt = result.salt;
            transaction.sealedBid = result.sealedBid;
            return transaction;
        });
    });
}

var StringZeros = '0000000000000000000000000000000000000000000000000000000000000000';

function uintify(value) {
    value = ethers.utils.bigNumberify(value).toHexString().substring(2);
    value = '0x' + StringZeros.substring(value.length) + value;
    return value;
}

Registrar.prototype.getDeedAddress = function(address, bidHash) {
    var addressBytes32 = '0x000000000000000000000000' + address.substring(2);
    var position = ethers.utils.keccak256(ethers.utils.concat([
        bidHash,
        ethers.utils.keccak256(ethers.utils.concat([
            addressBytes32,
            uintify(3)
        ]))
    ]));

    var self = this;
    return this._getEns('nothing-important.eth').then(function(result) {
        return self.provider.getStorageAt(result.registrarContract.address, position).then(function(result) {
            return '0x' + result.substring(26);
        });
    });
}


Registrar.prototype.revealBid = function(name, bidAmount, salt) {
    if (!this.signer) {
        return Promise.reject(new Error('no signer'));
    }

    var self = this;

    return this._getBidHash(name, bidAmount, salt).then(function(result) {
        return self.signer.getAddress().then(function(address) {
            return self.getDeedAddress(address, result.sealedBid).then(function(deedAddress) {
                if (deedAddress == ZeroAddress) {
                    var error = new Error('bid not found');
                    error.address = address;
                    error.bidAmount = bidAmount;
                    error.name = name;
                    error.salt = salt;
                    error.sealedBid = result.sealedBid;
                    return Promise.reject(error);
                }
                console.log(address, result.sealedBid, deedAddress);
                return result;
            });
        });
    }).then(function(result) {
        var options = {
            gasLimit: 200000
        };
        return result.registrarContract.unsealBid(
            result.labelHash,
            bidAmount,
            result.salt,
            options
        ).then(function(transaction) {
            transaction.name = name;
            transaction.labelHash = result.labelHash;
            transaction.salt = result.salt;
            transaction.sealedBid = result.sealedBid;
            transaction.bidAmount = bidAmount;
            return transaction;
        });
    });
}

Registrar.prototype.getResolver = function(name) {
    var providerOrSigner = this.signer || this.provider;
    var ensContract = new ethers.Contract(this.config.ensAddress, ensInterface, providerOrSigner);
    return ensContract.resolver(ethers.utils.namehash(name)).then(function(result) {
        return result.resolver;
    });
}

Registrar.prototype.setResolver = function(name, address) {
    var options = {
        gasLimit: 100000
    };

    var providerOrSigner = this.signer || this.provider;
    var ensContract = new ethers.Contract(this.config.ensAddress, ensInterface, providerOrSigner);
    var nodeHash = ethers.utils.namehash(name);
    return ensContract.setResolver(nodeHash, address, options).then(function(result) {
        result.nodeHash = nodeHash;
        return result;
    });
}

Registrar.prototype.getOwner = function(name) {
    var providerOrSigner = this.signer || this.provider;
    var ensContract = new ethers.Contract(this.config.ensAddress, ensInterface, providerOrSigner);
    var nodeHash = ethers.utils.namehash(name);
    return ensContract.owner(nodeHash).then(function(result) {
        return result.owner;
    });
}

Registrar.prototype.getDeedOwner = function(address) {
    var deedContract = new ethers.Contract(address, deedInterface, this.provider);
    return deedContract.owner().then(function(result) {
        return result.owner;
    }, function (error) {
        return null;
    });
}

Registrar.prototype.setAddress = function(name, addr) {
    var options = {
        gasLimit: 150000
    };
    var nodeHash = ethers.utils.namehash(name);
    var self = this;
    return this.getResolver(name).then(function(resolver) {
        var resolverContract = new ethers.Contract(resolver, resolverInterface, self.signer);
        return resolverContract.setAddr(nodeHash, addr, options).then(function(transaction) {
            transaction.addr = addr;
            transaction.name = name;
            transaction.nodeHash = nodeHash;
            transaction.resolver = resolver;
            return transaction;
        });
    });
}

Registrar.prototype.getAddress = function(name) {
    var nodeHash = ethers.utils.namehash(name);
    var self = this;
    return this.getResolver(name).then(function(resolver) {
        if (resolver === ZeroAddress) {
            return Promise.resolve(null);
        }

        var resolverContract = new ethers.Contract(resolver, resolverInterface, self.provider);
        return resolverContract.addr(nodeHash).then(function(result) {
            return result.addr;
        }, function (error) {
            return null;
        });
    });
}

Registrar.prototype.on = function(event, callback) {
    this._getEns('nothing-important.eth').then(function(result) {
        result.registrarContract['on' + event.toLowerCase()] = callback;
    });
}

module.exports = Registrar;
