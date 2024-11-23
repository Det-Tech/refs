import { WS } from 'iso-websocket'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import pdefer from 'p-defer'
import { Agent } from '@fission-codes/ucan/agent'
import { Client, JsonError } from '../../../sdk/index'
import { decodeCID } from './cid'

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
  // try{
  //   const s = {"did":"did:key:z6Mkf4S9TrvLKZiGezu8TD73ChZc8FNqXPagx4aTsFsmJtFj","username":"acco.localhost","email":"acco@gmail.com"}
  //   const data  = await decodeCID(s);
  //   console.log(data)
  // }catch(e){
  //   console.log(e)
  // }
  // return
  
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
    console.log("client ", client)

    console.log("accountInfo ", client)

    const accountInfo = await client.accountInfo(createAccount.result.did)
    console.log("accountInfo ", accountInfo)

    return createAccount
    // if (createAccount.error) {
  
    // return {
    //   client,
    //   account: createAccount.result,
    //   email,
    //   agent,
    // }
  }

  /**
 * getAccountInfo
 */
export async function getAccountInfo(did) {
  
  const agent = await Agent.create({
    resolveSigner,
  })

  console.log("getAccountInfo agent ", agent)

  const client = await Client.create({
    url: SERVER_URL,
    agent,
  })

  console.log("getAccountInfo client ", client)
  console.log("getAccountInfo did ", did)

  const accountInfo = await client.accountInfo(did)

  console.log("getAccountInfo accountInfo ", accountInfo)
  return accountInfo
}
