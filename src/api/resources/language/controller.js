import LanguageModel from './model';
import { generateControllers } from '../../modules/controllers/generateList';

export default generateControllers( new LanguageModel() );
