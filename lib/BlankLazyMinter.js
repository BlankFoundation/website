import ethers from 'ethers'

// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "BlankNFT"
const SIGNING_DOMAIN_VERSION = "1"

/**
 * JSDoc typedefs.
 *
 * @typedef {object} BlankNFTVoucher
 * @property {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the NFTVoucher, apart from signature itself.
 */

/**
 * LazyMinter is a helper class that creates BlankNFTVoucher objects and signs them, to be redeemed later by the BlankArt contract.
 */
class BlankLazyMinter {

  /**
   * Create a new LazyMinter targeting a deployed instance of the LazyNFT contract.
   *
   * @param {Object} options
   * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
   * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
   */
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  /**
   * Creates a new BlankNFTVoucher object and signs it using this LazyMinter's signing key.
   *
   * @param {address} redeemerAddress the address authorized to redeem the voucher
   * @param {ethers.BigNumber | number} expiration expiration date for the voucher, expressed in seconds since the Unix epoch
   * @param {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT. defaults to zero
   * @param {ethers.BigNumber | number} tokenCount the max number of tokens a voucher may redeem. defaults to five (5)
   *
   * @returns {BlankNFTVoucher}
   */
  async createVoucher(redeemerAddress, expiration, minPrice = 0, tokenCount = 5) {
    const voucher = { redeemerAddress, expiration, minPrice, tokenCount }
    const domain = await this._signingDomain()
    const types = {
      BlankNFTVoucher: [
        {name: "redeemerAddress", type: "address"},
        {name: "expiration", type: "uint256"},
        {name: "minPrice", type: "uint256"},
        {name: "tokenCount", type: "uint16"},        
      ]
    }
    const signature = await this.signer._signTypedData(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
  }

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.contract.getChainID()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

export default BlankLazyMinter;