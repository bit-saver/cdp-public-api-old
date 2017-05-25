import client from '../../services/elasticsearch';
import * as validate from '../validate';

/**
 * Return documents matching a query, aggregations/facets, highlighted snippets,
 * suggestions, and more.
 * @param {object} req
 * @param {object} res
 */
export const search = async (req, res) => {
  /* initial configuration */
  let data = {
    options: {
      ignoreUnavailable: true,
      allowNoIndices: true,
      requestCache: true
    },
    error: {}
  };

  /* validate each field in the body */
  data = validate.stringOrStringArray({
    q: req.body.query,
    _sourceExclude: req.body.exclude,
    _sourceInclude: req.body.include,
    type: req.body.type,
    index: req.body.index || '*.gov',
    sort: req.body.sort,
  }, data);

  if (req.body.body) {
    data = validate.jsonString({
      body: req.body.body,
    }, data);
  }

  data = validate.number({
    from: req.body.from,
    size: req.body.size
  }, data);

  /* return error if any of the properties didn't check out */
  if (Object.keys(data.error).length > 0) {
    return res.status(400).json({
      error: true,
      message: data.error
    });
  }

  console.log('\n/v1/search:\n', JSON.stringify(data.options, null, 4), '\n');
  try {
    res.json(await client.search(data.options).then(esResponse => esResponse));
  } catch (err) {
    const message = JSON.parse(err.response).error.caused_by.reason;
    return res.status(400).json({
      error: true,
      message
    });
  }
};
