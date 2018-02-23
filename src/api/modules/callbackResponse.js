import Request from 'request';

const callback = ( req, data ) => {
  if ( req.headers.callback ) {
    console.log( 'sending callback', req.headers.callback );
    Request.post(
      {
        url: req.headers.callback,
        json: true,
        form: {
          error: 0,
          ...data
        }
      },
      () => {}
    );
    return true;
  }
  return false;
};

export default callback;
