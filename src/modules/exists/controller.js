import client from '../../services/elasticsearch';
import * as validate from '../validate';

/**
 * Get a typed JSON document from the index based on its id.
 * @param {object} req
 * @param {object} res
 */
export const exists = async (req, res) => {
  // initial configuration
  let data = { options: {}, error: {}, };

  data = validate.string({
    index: req.body.index,
    type: req.body.type,
    id: req.body.id
  }, data);

  data = validate.jsonString({
    body: req.body.body
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
    res.json(await client.exists(data.options).then(esResponse => esResponse));
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
