import tmp from 'tmp';

tmp.setGracefulCleanup();

const files = [];

const createTempFile = () => {
  const tmpObj = tmp.fileSync( undefined );
  files.push( tmpObj );
  return tmpObj;
};

const deleteTempFiles = () => {
  while ( files.length > 0 ) {
    const tmpObj = files.pop();
    tmpObj.removeCallback();
  }
};

const tempFiles = {
  createTempFile,
  deleteTempFiles
};

export default tempFiles;
