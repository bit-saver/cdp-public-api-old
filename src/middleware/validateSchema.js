const compileValidationErrors = errors =>
  `Validation errors: ${errors.map( error => `${error.dataPath} : ${error.message}` )}`;

export const validate = Model => async ( req, res, next ) => {
  const result = Model.validateSchema( req.body );
  if ( !result.valid ) {
    return next( new Error( compileValidationErrors( result.errors ) ) );
  }
  next();
};
