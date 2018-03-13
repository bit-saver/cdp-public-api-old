import tempFiles from '../services/tempfiles';

const cleanTempFilesCtrl = ( req, res, next ) => {
  tempFiles.deleteTempFiles();
  next();
};

export default cleanTempFilesCtrl;
