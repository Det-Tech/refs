import { WS } from 'iso-websocket'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import pdefer from 'p-defer'
import { Agent } from '@fission-codes/ucan/agent'
import { Client, JsonError } from '../../../sdk/index'

const SERVER_URL = process.env.SERVER_URL || 'https://auth.etherland.world'

// http://82.165.140.143:3000

const resolveSigner = (
    /** @type {string | CryptoKeyPair | undefined} */ exported
  ) => {
    if (typeof exported === 'string') {
      return EdDSASigner.import(exported)
    }
  
    return EdDSASigner.generate()
}

interface iCreateAccount {
    username: string;
    email: string;
    code: string;
}
/**
 * Create an account
 */
export async function createAccount({username, email, code}: iCreateAccount) {
  
    const agent = await Agent.create({
      resolveSigner,
    })

    console.log("agent ", agent)
  
    const client = await Client.create({
      url: SERVER_URL,
      agent,
    })

    console.log("client ", client)
  
    // const out = await client.verifyEmail(email)
  
    const createAccount = await client.accountCreate({
      code,
      email,
      username,
    })

    console.log("createAccount ", createAccount)
    return createAccount
    // if (createAccount.error) {
  
    // return {
    //   client,
    //   account: createAccount.result,
    //   email,
    //   agent,
    // }
  }