const apiErrorHandler = ( err, req, res, next ) => {
  // Send different messages based on error type (err.status)
  console.error( err.stack );
  res.status( 500 ).send( err.message || err.toString() );
};

export default apiErrorHandler;
