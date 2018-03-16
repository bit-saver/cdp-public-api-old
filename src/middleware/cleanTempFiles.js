import tempFiles from '../services/tempfiles';

const cleanTempFilesCtrl = ( err, req, res, next ) => {
  tempFiles.deleteTempFiles( req.requestId );
  if ( err ) return next( err );
  next();
};

export default cleanTempFilesCtrl;
