import { generateControllers } from '../../modules/generateControllers';
import VideoModel from './videoModel';

export default generateControllers( new VideoModel() );

/*
  NOTE: Generic controller methods can be overidden:
    const getDocumentById = ( req, res, next ) => {
    res.json( { prop: 'example' } );
  };
  export default generateControllers( new VideoModel(), { getDocumentById } );
*/
