/**
 * --------------------------------------------------------
 *  https://github.com/neovim/node-client
 *  :UpdateRemotePlugins
 *  -- DEBUGGING --
 *  export NVIM_NODE_LOG_LEVEL=debug
 *  export NVIM_NODE_LOG_FILE=/home/jd/neo_dev_log/nvim.log
 *  --------------------------------------------------------
 */

const schema = require('./lib/schema.js');
const LINE_SEP = '\n';

const linesToString = (lines) => {
  return lines.join(LINE_SEP);
}

const stringToLines = (str) => {
  return str.split(LINE_SEP);
}

const jsonToJs = (str) => {
  return new Promise(resolve => {
    resolve(JSON.parse(str));
  })
};
const jsToJson = (str) => {
  return new Promise(resolve => {
    resolve(JSON.stringify(str, null, '  '));
  })
};

const writeOut = async (plugin, str) => {
  try {
    await plugin.nvim.outWrite(str + '\n');
  } catch (err) {
    console.error(err);
  }
};

module.exports = plugin => {
  plugin.setOptions({ dev: true, alwaysInit: true });

  plugin.registerCommand('JsonFormat', async function (){
    let buffer = plugin.nvim.buffer;
    buffer.lines.then((lines) => {
      if (lines.length === 0) {
        return;
      }
      let lines_length = lines.length;
      let s = linesToString(lines);
      let o = jsonToJs(s).then((o) => {
        let s = JSON.stringify(o, null, '  ')
        let lines = stringToLines(s);
        if (lines.length > 0) {
          buffer.remove(0, lines_length, true);
          buffer.insert(lines, 0);
        }
      }).catch((err) => {
        writeOut(plugin, 'invalid JSON');
      });
    });
  }, { sync: false, nargs: '*', range: ''});

  plugin.registerCommand('Json2Schema', async () => {
    let buffer = plugin.nvim.buffer;
    buffer.lines.then((lines) => {
      if (lines.length === 0) {
        return;
      }
      let lines_length = lines.length;
      let s = linesToString(lines);
      let o = jsonToJs(s).then((o) => {
        // Get an object name
        plugin.nvim.call('input', 'object name? ').then((xx) => {
          if (xx === '') {
            xx = 'JsonSchema';
          }
          writeOut(plugin, '');
          let a = schema.toSchema(xx ,o);
          if (a) {
            let lines = stringToLines(a);
            if (lines.length > 0) {
              buffer.remove(0, lines_length, true);
              buffer.insert(lines, 0);
            }
          }
        });
      }).catch((err) => {
        console.error(err);
        writeOut(plugin, 'invalid JSON');
      });
    });
  }, { sync: false });

  plugin.registerCommand('Json2Typedef', async () => {
    let buffer = plugin.nvim.buffer;
    buffer.lines.then((lines) => {
      if (lines.length === 0) {
        return;
      }
      let lines_length = lines.length;
      let s = linesToString(lines);
      let o = jsonToJs(s).then((o) => {
        plugin.nvim.call('input', 'object name? ').then((xx) => {
          if (xx === '') {
            xx = 'JsonSchema';
          }
          writeOut(plugin, '');
          let a = schema.toJsDoc(xx, o);
          if (a) {
            let lines = stringToLines(a);
            if (lines.length > 0) {
              buffer.remove(0, lines_length, true);
              buffer.insert(lines, 0);
            }
          }
        });
      }).catch((err) => {
        console.error(err);
        writeOut(plugin, 'invalid JSON');
      });
    });
  }, { sync: false });
};
// vim: set ts=2 sw=2 et :
