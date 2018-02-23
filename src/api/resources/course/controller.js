import { generateControllers } from '../../modules/generateControllers';
import CourseModel from './courseModel';

export default generateControllers( new CourseModel() );

/*
  NOTE: Generic controller methods can be overidden:
    const getDocumentById = ( req, res, next ) => {
    res.json( { prop: 'example' } );
  };
  export default generateControllers( new VideoModel(), { getDocumentById } );
*/
