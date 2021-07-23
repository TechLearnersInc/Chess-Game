const cluster = require('cluster');
const numOfClusters = Number(process.env.NUM_OF_CLUSTERS);
const NODE_ENV = process.env.NODE_ENV;

if (cluster.isMaster) {
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  cluster.setupMaster({ serialization: 'advanced' });

  // Forking workers.
  for (let i = 0; i < numOfClusters; i++) {
    cluster.fork();
  }

  // Cluster on listening event
  cluster.on('listening', (worker, code, signal) => {
    // console.log(`Worker started, PID: ${worker.process.pid}`);
  });

  // Cluster on exit event
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker died, PID: ${worker.process.pid}`);

    // In production create new cluster if any die
    if (NODE_ENV === 'production') cluster.fork();
  });
} else {
  // Run App Server
  require('./www');
}
