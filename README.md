ethers-ens
==========

A simple library and command-line interface to manage Ethereum Name Service (ENS) auctions,
resolvers and associated date.

**NOTE:** This tool should be considered highly experimental.


Practice Practice Practice!
---------------------------

Try this out on **testnet** first, until you are comfortable using the tool and are
confident you won't forget to reveal.


Installing
----------

```
/Users/ethers> sudo npm install -g ethers-ens
```


Command-Line Interface
----------------------

```
Command Line Interface - ethers-ens/0.0.1

Usage:

    ethers-ens init FILENAME
    ethers-ens info FILENAME [--check-password]

    ethers-ens lookup NAME [ NAME ... ]
    ethers-ens scan-log
    ethers-ens watch NAME [ NAME ... ]
    ethers-ens ignore NAME [ NAME ... ]

    ethers-ens start-auction NAME
    ethers-ens bid NAME AMOUNT [--extra AMOUNT] [--salt SALT | --secret SECRET]
    ethers-ens reveal-bid NAME AMOUNT [--salt SALT | --secret SECRET]
    ethers-ens finalize-auction NAME

    ethers-ens set-resolver NAME [--resolver ADDRESS]
    ethers-ens set-address NAME ADDRESS
    ethers-ens set-email NAME EMAIL
    ethers-ens set-publickey NAME KEY
    ethers-ens set-url NAME URL

    ethers-ens set-subnode LABEL.NAME [--owner OWNER]

Options
    --help             Show this help screen
    --rpc NODE         Use the JSON-RPC node
    --testnet          Use the ropsten test network
    --account ACCOUNT  The JSON wallet to use
    --check-password   Require the password to check JSON wallet
    --extra            Send extra ether to mask the bid value
    --salt             The salt to use (otherwise compute; recommended)
    --secret           Use keccak256(secret) as the salt
    --cheap            Use low (but safe) 2.1 GWei gas price
    --nolog            Do not log activity to ens-log.txt
```


**Salt**

It is recommended to omit salt from `bid`.

The salt will be deterministically calculated from the account and bid parameters,
so it does not need to be remembered later during the `reveal-bid`.


**Logs**

All operations which require transactions on the network have all useful information dumped
to *ens-log.txt*.

Please do not delete or modify this file; if something goes wrong it may be able to help
recover or determine your state.

Logs can currently help detect:

- Bids that were (for whatver reason) not successfully mined on the blockchain
- Bids that require revealing

Future Warnings: (@TODO)

- Auctions which you won, but have not been finalized
- Auctions that have been started for "watch" name, which have not been bid on


### Create a new JSON Wallet

To operate on the Ethereum blockchain, you first require an account. This will create a new
account for you.

You may also use any standard JSON wallet from Geth or Parity.

```
/Users/ethers> ethers-ens init account.json
Initializing a new JSON wallet - account.json
Keep this password and file SAFE!! If lost or forgotten
it CANNOT be recovered, by ANYone, EVER.
Account Password: ******
Confirm Password: ******
New account address: 0x3A9ffB4E5A9C0226ac28B18A9F419C033aD9f0A7
```


### Check a JSON Wallet

This can be used to check the address and current balance of an account, as well as
optionally check the password to make sure the file has not been tampered with.

```
/Users/ethers> ethers-ens --testnet info account.json
Network: testnet
Address: 0x3a9ffb4e5a9c0226ac28b18a9f419c033ad9f0a7
Balance: 1.23456

/Users/ethers> ethers-ens --testnet info account.json --check-pasword
Network: testnet
Account Password: ******
Password OK!
Address: 0x0x3A9ffB4E5A9C0226ac28B18A9F419C033aD9f0A7
Balance: 1.23456 
```


### Lookup an ENS Name

Before starting an auction or bidding, you should check its current status.

Once a domain is owned, this can also be used to inspect it.

```
/Users/ethers> ethers-ens --testnet lookup ricmoose.eth
Network: testnet
ricmoose.eth
  State:                owned
  Available Start Date: 2017-04-22 07:06:06 (18:08:12:44 ago)
  Winning Deed:         0x87D2BE74Ce665dB345fF46Bf5e4ed8274FBEAF41
  Winning Bidder:       0xf770358c6F29FAA38186E49c149C87968775B228
  Value:                0.01
  Highest Bid:          0.02
  Owner:                0xf770358c6F29FAA38186E49c149C87968775B228
  Resolver:             0x4C641FB9BAd9b60EF180c31F56051cE826d21A9A
  Address:              0xf770358c6F29FAA38186E49c149C87968775B228

/Users/ethers> ethers-ens --testnet lookup testing.eth
Network: testnet
testing.eth
  State:                open
  Available Start Date: 2017-04-28 22:28:48 (11:16:55:00 ago)
```


### Watching Names

To keep an eye on names (during `scan-log`), add the name to the watch list.

```
/Users/ethers> ethers-ens --testnet watch pokemoose.eth
Network: testnet
@TODO
```

### Ignoring Names

Once you are no longer interested in tracking a name (during `scan-log`), remove the
name from the watch list.

```
/Users/ethers> ethers-ens --testnet ignore pokemoose.eth
Network: testnet
@TODO
```


### Checking Status

Dump a summary of all domains being watched (any name which you have started an auction
for, bid on or are watching), the current status, your bid, highest bid and value.

```
/Users/ethers> ethers-ens --testnet scan-log
Network: testnet
@TODO
```


### Starting an Auction

Once an auction has begun, there are two important periods over the next 5 days:

- A **72 hours** Period - The bidding period, where anyone can place blinded bids
- A **48 hours** Period - The reveal period, where anyone who bid reveals their bid

```
/Users/ethers> ethers-ens --testnet --account account.json start-auction testing.eth
Network: testnet
Account Password: ******
  Label Hash:           0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02
  Transaction Hash:     0x5e4eb5c9a598be528c2a0b385a32da868262e25395635a0a14be8b4fa78478eb
```

### Placing a Bid

When placing a bid, it is blinded; nobody can see what name the bid was made for, nor can they
determine the exact amount the bid was for (since additional funds can be added to mask
the true bid amount).

If a bid is not revealed during the *reveal period*, **ALL FUNDS ARE DESTROYED**. Make sure
if you bid, that you call `reveal-bid` during the reveal period, even if you lost, to get
your funds back.

```
/Users/ethers> ethers-ens --testnet --account account.json bid testing.eth 0.01 --extra 1.0
Network: testnet
Account Password: ******
  Label Hash            0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02
  Salt:                 0x0fa811800a025edf58caf38f5a22c8888a7776f67b5da3b1de506ac365201102
  Sealed Bid:           0x1778a8db6855506c49f1bd1477ca17ce89963fafc0cdd68adfa1210d0291c302
  Transaction Hash:     0x48f80359f8237c66be15cc90372735b4b64f2333dd27a4f88360d61dae133a47
```

### Revealing a Bid

During the *reveal period*, everyone who placed a bid **MUST** reveal their bid, regardless
of whether they won or lost. Faiure to do so will **DESTROY THEIR FUNDS**.

```
/Users/ethers> ethers-ens --testnet --account account.json reveal-bid ricmoose.eth 0.02
Network: testnet
Account Password: ******
  Label Hash            0x225fc58fd958ebe1205a9eb9a23c6fdb031e1d4fbfeba26468da16988e5ebf55
  Salt:                 0xa770059ab96c8810ad12ef3b27ebe9a37bb491e58c05845ca8aff6c234c4ff6d
  Sealed Bid:           0x5cc1bbfc5e508d7cd93808566430a5f2e8875a5f5ae884419edfc0f3712f8b6f
  Transaction Hash:     0xc3820b28d1ed2a9d7e3be90d4e9aaa8da57e60de9299489c09b9eb03290cac5f
```

### Finalizing an Auction

Once the auction has ended, anyone can call finalize. This will perform the final assignment
of the domain oner to the winning bidder. Usually the winner would be the one that would call
this.

```
/Users/ethers> ethers-ens --testnet --account account.json finalize-auction ricmoose.eth
Network: testnet
Account Password: ******
  Label Hash            0x225fc58fd958ebe1205a9eb9a23c6fdb031e1d4fbfeba26468da16988e5ebf55
  Transaction Hash:     0x5c91c8c64fa9bad8668a5e2d0b7ae176d08654f928b647cdeb32cb40496620a7
```

### Setting a Resolver

Once you have won the auction, you must assign a contract which will resolve addresses and
other queries made against your name.

The default public resolver can be set up using:

```
/Users/ethers> ethers-ens --testnet --account account.json set-resolver testing.eth
Network: testnet
Account Password: ******
  Node Hash:            0xb52c4744695ed3be701ccef35d5901de3aaf7294245966ef16617c30aab7b626
  Transaction Hash:     0x6cd76e91045d9cf8c27efa572c1e8d07887f91ea65ce21a53ccd4081df0c6463
```

### Setting an Address

If you have used the default public resolver (or a compatible resolver) the address your
name should resolve to can be set using:

```
/Users/ethers> ethers-ens --testnet --account account.json set-address testing.eth 0x3A9ffB4E5A9C0226ac28B18A9F419C033aD9f0A7
Network: testnet
Account Password: ******
  Node Hash:            0xb52c4744695ed3be701ccef35d5901de3aaf7294245966ef16617c30aab7b626
  Transaction Hash:     0x9fbb6f327621070a6f2d604927283383da53df2e989216fe3b2319ec8b53c485
```


API
---

More details coming soon. These API calls *may* change.

```javascript
var ethers = require('ethers');
var Registrar = require('ethers-ens');

var provider = ethers.providers.getDefaultProvider();

// Read-only
var registrar = new Registrar(provider);

// Read/Write
var privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123'
var wallet = new ethers.Wallet(privateKey, provider);
var registrar = new Registrar(wallet);
```

### Registrar(providerOrSigner)

### Registrar.prototype.isValidName(name)

### Registrar.prototype.getAuctionStartDate(name)

### Registrar.prototype.getAuction(name)

### Registrar.prototype.startAuction(name)

### Registrar.prototype.finalizeAuction(name)

### Registrar.prototype.placeBid(name, bidAmount, salt, extraAmount)

### Registrar.prototype.getDeedAddress(address, sealedBid)

### Registrar.prototype.revealBid(name, bidAmount, salt)

### Registrar.prototype.getResolver(name)

### Registrar.prototype.setResolver(name)

### Registrar.prototype.getOwner(name)

### Registrar.prototype.getDeedOwner(name)

### Registrar.prototype.setAddress(name)

### Registrar.prototype.getAddress(name)

### Registrar.prototype.on(eventName, callback)


Coming Soon (@TODO)
-------------------

A nanny (daemon) mode, which will watch for names to become avaiable, bid and reveal for you.

More (and better) documentation.

Testing!

More concise gasLimits (so if there is a throw, less is at stake).

Dist files for the browser (and a demo ethers.io app).

Donations
---------

Starbucks Frappuccinos were half price this week, so my out-of-pocket expenses were
pretty low for this, but if you'd like to buy me a coffee anyway, I won't say no. :)

Ethereum: `0x1691be58E417056712a9a81A5adB22609651c9Fe`


License
-------

MIT License
