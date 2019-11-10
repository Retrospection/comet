
import { ipcMain } from 'electron'
import fs from 'fs'
import readline from 'readline'

export function prepareIpcMain() {
  ipcMain.on('parseWeiboAccountFile', (event, filename) => {
    console.log(filename[0])
    const inputStream = fs.createReadStream(filename[0])
    const readlineInstance = readline.createInterface({
      input: inputStream
    })

    let weiboAccounts = []
    const parseLine = line => {
      const splitedLine = line.split('----')
      if (splitedLine.length !== 2) {
        console.log('行读取错误')
      }
      const [username, password] = splitedLine
      weiboAccounts.push({
        username,
        password
      })
    }
  
    const onFileReadComplete = () => {
      event.sender.send('weiboAccountFileParsed', weiboAccounts)
    }
  
    readlineInstance.on('line', parseLine)
    readlineInstance.on('close', onFileReadComplete)
  })
}