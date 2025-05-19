import { Web3Storage } from 'web3.storage';

class MyWeb3Storage {
  constructor() { }

  async getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    return ''
    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    //return process.env.WEB3STORAGE_TOKEN
  }

  async makeStorageClient() {
    return new Web3Storage({ token: await this.getAccessToken() })
  }

  async storeFiles(files) {
    const client = await this.makeStorageClient()
    const cid = await client.put([files])
    console.log('stored files with cid:', cid)
    return cid
  }

  async retrieveFiles(cid) {
    const client = await this.makeStorageClient()
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }

    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
      console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
    }
    return files[0]
  }
}


export default MyWeb3Storage;
