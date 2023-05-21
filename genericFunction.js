// import crypto from "crypto-js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";
import memoryCache from 'memory-cache';
import dotenv from "dotenv"
dotenv.config()



const pbkdf2Async = promisify(crypto.pbkdf2);


const getDerivedKey = async (passphrase) => {
  const salt = crypto.randomBytes(16);

  /* Generate Secret Key */
  const derivedKey = await pbkdf2Async(passphrase, salt, 100000, 32, 'sha512');
  return derivedKey;
}

export const encryptedData = async (data, type) => {
  const algorithm = 'aes-256-cbc';
  let secretKey, iv;

  if (type) {
    secretKey = await getDerivedKey(process.env.SECRET_KEY);

    /* Generate IV */
    iv = crypto.randomBytes(16);

    memoryCache.put(type, {
      derivedKey: secretKey.toString('hex'),
      iv: iv.toString('hex')
    })

  }
  else {
    let storageData = memoryCache.get('email');
    console.log("storageData----", storageData);

    secretKey = Buffer.from(storageData.derivedKey, 'hex');
    iv = Buffer.from(storageData.iv, 'hex');

  }
  /* Generate Encrypted Data */
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;

  // encryptedEmail = Buffer.concat([encryptedEmail , cipher.final()])
  // const base64 = encryptedEmail.toString('base64')
  // console.log("encodedData------", encodedData);
}



export const decryptedData = async(data, type) => {
  const algorithm = 'aes-256-cbc';
  let secretKey, iv;

  if (type === 'name') {
    let storageData = memoryCache.get('name');

    /* Extract the fixed Key & IV */
    secretKey = Buffer.from(storageData.derivedKey, 'hex');
    iv = Buffer.from(storageData.iv, 'hex');
  }
  else if (type === 'email') {
    let storageData = memoryCache.get('email');

    secretKey = Buffer.from(storageData.derivedKey, 'hex');
    iv = Buffer.from(storageData.iv, 'hex');
  }
  else if (type === 'mobile') {
    let storageData = memoryCache.get('mobile');

    secretKey = Buffer.from(storageData.derivedKey, 'hex');
    iv = Buffer.from(storageData.iv, 'hex');
  }

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decryptedUserRecord = decipher.update(data, 'hex', 'utf8');
  decryptedUserRecord += decipher.final('utf8');
  return decryptedUserRecord;
}

export const generateToken = async (uId, email) => {
  try {
    const jwtToken = jwt.sign({ id: uId, email }, process.env.SECRET_JWT_KEY, {
      expiresIn: "2h",
    });
    return jwtToken;
  } catch (err) {
    return (err);
  }

}



// export const encryptedData = (name,email,mobileNum) =>{
//     const encryptedName = crypto.AES.encrypt(name, process.env.SECRET_KEY).toString()
//     const encryptedEmail = crypto.AES.encrypt(email, process.env.SECRET_KEY).toString()
//     const encryptedPhoneNo = crypto.AES.encrypt(mobileNum, process.env.SECRET_KEY).toString()
//     // console.log("encryptedName----",encryptedName);
//     // console.log("encryptedEmail----",encryptedEmail.toString());
//     // console.log("encryptedPhoneNo----",encryptedPhoneNo.toString());
//     return({encryptedName,encryptedEmail,encryptedPhoneNo})
// }