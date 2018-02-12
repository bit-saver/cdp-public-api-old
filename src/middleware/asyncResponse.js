/** If there is a callback URL then we want to send a response immediately
 *  and handle any errors in a separate callback further down the line.
 */
const asyncResponse = ( req, res, next ) => {
  if ( req.headers.callback ) {
    console.log( 'sending async response' );
    res.json( { message: 'Sync in progress.', req: req.body } );
  }
  next();
};
export default asyncResponse;
