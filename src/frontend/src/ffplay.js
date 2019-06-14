const spawn = require('child_process').spawn;
const path = require('path')
const cp = require('child_process')
const os = require('os')
var parallel = require('run-parallel')

const embedVlcPath = 'VLC'
function playStream(url){
	return spawn(embedVlcPath, [url, '-Idummy','--dummy-quiet'])
}

//not used anymore but kept in case of revert and use of local vlc
function getVLCPath (cb) {
  if (process.platform === 'win32') {
    getVLCPathWindows(cb)
  } else if (process.platform === 'darwin') {
    getVLCPathDarwin(cb)
  } else {
    getVLCPathLinux(cb)
  }
}

function getVLCPathWindows (cb) {
  var Registry = require('winreg')

  getInstallDir(function (err, item) {
    if (!err) return cb(null, path.join(item.value, 'vlc.exe'))
    getInstallDirWow64(function (err, item) {
      if (err) return cb(new Error('VLC not found'))
      return cb(null, path.join(item.value, 'vlc.exe'))
    })
  })

  // 32-bit Windows with 32-bit VLC, and 64-bit Windows with 64-bit VLC
  function getInstallDir (cb) {
    var key = new Registry({
      hive: Registry.HKLM,
      key: '\\Software\\VideoLAN\\VLC'
    })
    key.get('InstallDir', cb)
  }

  // 64-bit Windows with 32-bit VLC (uses Wow64)
  function getInstallDirWow64 (cb) {
    var key = new Registry({
      hive: Registry.HKLM,
      key: '\\Software\\Wow6432Node\\VideoLAN\\VLC'
    })
    key.get('InstallDir', cb)
  }
}

function getVLCPathDarwin (cb) {
  var cmds = [
    path.join('/Applications', 'VLC.app', 'Contents', 'MacOS', 'VLC'),
    path.join(os.homedir(), 'Applications', 'VLC.app', 'Contents', 'MacOS', 'VLC'),
    '/usr/bin/vlc',
    '/usr/local/bin/vlc',
    'vlc'
  ]
  findCmd(cmds, cb)
}

function getVLCPathLinux (cb) {
  var cmds = [
    '/usr/bin/vlc',
    '/usr/local/bin/vlc',
    'vlc'
  ]
  findCmd(cmds, cb)
}

function findCmd (cmds, cb) {
  var foundIndex = -1

  var tasks = cmds.map(function (cmd, i) {
    return function (cb) {
      cp.exec(cmd + ' --version', function (err) {
        if (!err && (foundIndex === -1 || i < foundIndex)) {
          foundIndex = i
        }
        cb(null)
      })
    }
  })

  parallel(tasks, function () {
    if (foundIndex !== -1) {
      cb(null, cmds[foundIndex])
    } else {
      cb(new Error('VLC not found'))
    }
  })
}

exports.playStream = playStream;
exports.getVLCPath = getVLCPath;
