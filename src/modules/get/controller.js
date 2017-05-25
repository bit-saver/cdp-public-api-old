import client from '../../services/elasticsearch';
import * as validate from '../validate';

/**
 * Get a typed JSON document from the index based on its id.
 * @param {object} req
 * @param {object} res
 */
export const get = async (req, res) => {
  // initial configuration
  let data = { options: {}, error: {}, };

  // validate string or string arrays
  data = validate.stringOrStringArray({
    _sourceExclude: req.body.exclude,
    _sourceInclude: req.body.include,
    type: req.body.type || '_all',
  }, data);

  // validate string
  data = validate.string({
    index: req.body.index,
    id: req.body.id,
  }, data);

  // if there was any error during validation, throw
  if (Object.keys(data.error).length > 0) {
    return res.status(400).json({
      error: true,
      message: data.error
    });
  }

  console.log(JSON.stringify(data.options, null, 4));
  try {
    res.json(await client.get(data.options).then(esResponse => esResponse));
  } catch (err) {
    let message;
    try {
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
