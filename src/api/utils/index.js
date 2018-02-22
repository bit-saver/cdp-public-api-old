export const getQueryFromUuid = ( uuid = '' ) => {
  let obj = {};
  const args = uuid.split( '_' );
  if ( args.length === 2 ) {
    obj = {
      site: args[0],
      post_id: args[1]
    };
  }
  return obj;
};
