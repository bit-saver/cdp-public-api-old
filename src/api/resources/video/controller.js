import { generateControllers } from '../../modules/dataAccessLayer';
import VideoModel from './video.model';

export default generateControllers( new VideoModel() );

/*
  NOTE: Generic controller methods can be overidden:
    const getDocument = ( req, res, next ) => {
    res.json( { prop: 'example' } );
  };
  export default generateControllers( new VideoModel(), { getDocument } );
*/
