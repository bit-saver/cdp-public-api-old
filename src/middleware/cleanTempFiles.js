import tempFiles from '../services/tempfiles';

const cleanTempFilesCtrl = ( req, res, next ) => {
  tempFiles.deleteTempFiles( req.requestId );
  next();
};

export default cleanTempFilesCtrl;
