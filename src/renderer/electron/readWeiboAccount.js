import { remote, ipcRenderer } from 'electron'
const { dialog } = remote


export function readWeiboAccount ({ onWeiboAccountsParsed, onSingleWeiboAccountLoginExecuted, onAllWeiboAccountLoginExecuted }) {
  const openFileDialogOptions = {
    title: '导入文件',
    filters: [{
      name: '文本文件',
      extensions: 'txt'
    }]
  }

  dialog.showOpenDialog(openFileDialogOptions, openFileCallback)

  // 当主线程解析完成后，返回给渲染渲染线程账号信息
  ipcRenderer.once('weiboAccountFileParsed', (event, args) => {
    const weiboAccounts = args[0]
    onWeiboAccountsParsed({ weiboAccounts })
    // TODO: 对每一个微博账号执行自动登录，记录结果
  })
}


function openFileCallback(filename) {
  
  if (!filename || filename.length === 0) {
    // 如果没有打开文件，则什么都不干
    return
  }

  filename = filename[0]
  if (!filename.endsWith('.txt')) {
    // 如果不是以txt结尾，提示必须以txt结尾
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['确认'],
      defaultId: 0,
      title: '警告',
      message: '必须选择以txt为后缀的文本文件，格式为常见买号格式'
    })
  }
  // 向主线程发送消息，要求主线程解析微博账号文件
  ipcRenderer.send('parseWeiboAccountFile',[filename])
}

