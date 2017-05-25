import client from '../../services/elasticsearch';
import * as validate from '../validate';

/**
 * Get a typed JSON document from the index based on its id.
 * @param {object} req
 * @param {object} res
 */
export const mGet = async (req, res) => {
  // initial configuration
  let data = { options: {}, error: {}, };

  // validate string or string arrays
  data = validate.stringOrStringArray({
    _sourceExclude: req.body.exclude,
    _sourceInclude: req.body.include,
    type: req.body.type,
    index: req.body.index,
  }, data);

  data = validate.array({ ids: req.body.ids, }, data);

  if (data.options.ids) {
    data.options.body = {
      ids: data.options.ids
    };
  }

  data = validate.jsonString({
    docs: req.body.docs
  }, data);

  if (data.options.docs) {
    data.options.body = {
      docs: data.options.docs,
    };
  }

  // remove the ids data option. It was just a place holder
  delete data.options.ids;
  delete data.options.docs;

  if (Object.keys(data.error).length > 0) {
    return res.status(400).json({
      error: true,
      message: data.error
    });
  }

  console.log(JSON.stringify(data.options, null, 4));
  try {
    res.json(await client.mget(data.options).then(esResponse => esResponse));
  } catch (err) {
    let message;
    try {
      console.log(err);
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
