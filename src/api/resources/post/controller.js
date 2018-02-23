import { generateControllers } from '../../modules/generateControllers';
import PostModel from './model';

export default generateControllers( new PostModel() );

/*
  NOTE: Generic controller methods can be overidden:
    const getDocumentById = ( req, res, next ) => {
    res.json( { prop: 'example' } );
  };
  export default generateControllers( new VideoModel(), { getDocumentById } );
*/
