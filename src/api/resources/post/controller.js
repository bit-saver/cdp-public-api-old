import { generateControllers } from '../../modules/dataAccessLayer';
import PostModel from './post.model';

export default generateControllers( new PostModel() );

/*
  NOTE: Generic controller methods can be overidden:
    const getDocument = ( req, res, next ) => {
    res.json( { prop: 'example' } );
  };
  export default generateControllers( new VideoModel(), { getDocument } );
*/
