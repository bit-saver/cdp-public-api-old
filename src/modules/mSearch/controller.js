import client from '../../services/elasticsearch';
import * as validate from '../validate';

/**
 * Get a typed JSON document from the index based on its id.
 * @param {object} req
 * @param {object} res
 */
export const mSearch = async (req, res) => {
  /* initial configuration */
  let data = { options: {}, error: {}, };

  /* validation of properties */
  data = validate.stringOrStringArray({
    index: req.body.index,
    type: req.body.type,
  }, data);

  data = validate.jsonString({
    body: req.body.body
  }, data);

  if (Object.keys(data.error).length > 0) {
    return res.status(400).json({
      error: true,
      message: data.error
    });
  }

  try {
    res.json(await client.msearch(data.options).then(esResponse => esResponse));
  } catch (err) {
    let message;
    try {
      console.log('\nERROR:\n', JSON.parse(err.response), '\n');
      message = JSON.parse(err.response).error.reason;
    } catch (e) {
      message = 'Not able to process the request';
    }
    return res.status(400).json({
      error: true,
      message
    });
  }
};
