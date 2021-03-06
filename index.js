// require socket.io
const SocketIO = require('socket.io');
const BdsdClient = require('bdsd.client');

const BdsdIO = function (params) {
  let io, bdsd;
  let port, sockFile;
  if (typeof params.port !== "undefined") {
    port = params.port;
  }
  if (typeof params.sockFile !== "undefined") {
    sockFile = params.sockFile;
  }
  io = SocketIO(port);
  bdsd = BdsdClient(sockFile);
  console.log(`Using following UDS path: ${sockFile}`);
  console.log(`Socket.IO listening on port ${port}`);
  
  io.on('connection', socket => {
    console.log('client connected');
    // register socket.io events
    socket.on('get datapoints', callback => {
      bdsd
        .getDatapoints()
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
    socket.on('get description', (id, callback) => {
      bdsd
        .getDescription(id)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        })
    });
    socket.on('get value', (id, callback) => {
      bdsd
        .getValue(id)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
    socket.on('set value', (id, value, callback) => {
      bdsd
        .setValue(id, value)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
    socket.on('read value', (id, callback) => {
      bdsd
        .readValue(id)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        })
    });
    socket.on('get stored value', (id, callback) => {
      bdsd
        .getStoredValue(id)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
    socket.on('read values', (ids, callback) => {
      bdsd
        .readValues(ids)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
    socket.on('set values', (values, callback) => {
      bdsd
        .setValues(values)
        .then(payload => {
          callback(null, payload);
        })
        .catch(e => {
          callback(e);
        });
    });
  });

  // broadcast value indication
  bdsd.on('value', data => {
    io.emit('value', data);
  });

  bdsd.on('error', e => {
    console.log(`Error while connecting to ${sockFile}. Reconnecting`)
  });
  return io;
};

module.exports = BdsdIO;