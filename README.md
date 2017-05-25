# cdp-public-api

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Configuration](#configuration)
  - [Scripts](#scripts)
- [Routes](#routes)
  - [`/v1/search`](#v1search)
    - [Request](#request)
    - [Response](#response)
    - [API Properties](#api-properties)
  - [`/v1/msearch`](#v1msearch)
    - [Request](#request-1)
    - [Response](#response-1)
    - [API Properties](#api-properties-1)
  - [`/v1/get`](#v1get)
    - [Request](#request-2)
    - [Response](#response-2)
    - [API Properties](#api-properties-2)
  - [`/v1/mget`](#v1mget)
    - [Request](#request-3)
    - [Response](#response-3)
    - [API Properties](#api-properties-3)
  - [`/v1/getsource`](#v1getsource)
    - [Request](#request-4)
    - [Response](#response-4)
    - [API Properties](#api-properties-4)
  - [`/v1/count`](#v1count)
    - [Request](#request-5)
    - [Response](#response-5)
    - [API Properties](#api-properties-5)
  - [`/v1/exists`](#v1exists)
    - [Request](#request-6)
    - [Response](#response-6)
    - [API Properties](#api-properties-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

`nodemon` is a dependency for starting up the development server.

`npm install -g nodemon`

Within the root directory, run the following:

* `yarn install`
* `npm install`

### Configuration

Configuration file can be found at `./src/config.index.js`

```js
{
  port: 3000,
  host: '',
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
  environment: 'development'
}
```

**Important**: If you are connecting to AWS Elasticsearch, set the environment field to `production`. By default, the environment is set to `development`.

### Scripts

* `yarn start`: Starts the web server normally
* `yarn clear:build`: Removes the build directory.
* `yarn build`: Generates build folder/files.
* `yarn watch:build`: Re-compiles the `build` folder after every change.
* `yarn watch:server`: Re-starts the server after every change.

## Routes

### `/v1/search`

Search request to elasticsearch [`AWS`|`localhost`] instance.

#### Request

```http
POST /v1/search HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "body": "",
  "defaultField": "",
  "exclude": "",
  "from": "",
  "include": ["published", "title", "excerpt", "link"],
  "index": "",
  "query": "language.locale:en-US",
  "size": "5",
  "sort": "",
  "type": "posts"
}
```

#### Response

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 16016,
    "max_score": 1,
    "hits": [
      {},
      {},
      {}
    ]
  }
}
```

#### API Properties

| Params  | Description                                                                                                                          |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| body    | `JSON string, Object{}` - An optional request body, as either JSON or a JSON serializable object.                                                   |
| exlcude | `String, String[]` -  A list of fields to exclude from the returned _source field                                                     |
| from    | `number` — Starting offset (default: 0)                                                                                               |
| include | `String, String[]` - A list of fields to extract and return from the _source field                                                     |
| index   | `String, String[]` - A comma-separated list of index names to search; use _all or empty string to perform the operation on all indices  |
| query   | `String, String[]` - A comma-separated list of specific routing values                                                                 |
| size    | `Number` - Number of hits to return (default: 10)                                                                                      |
| sort    | `String, String[]` - A comma-separated list of : pairs                                                                                 |
| type    | `String, String[]` - A comma-separated list of document types to search; leave empty to perform the operation on all types             |

### `/v1/msearch`

Execute several search requests within the same request.

#### Request

```http
POST /v1/msearch HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "docs": [
    { "index": "share.america.gov", "type": "post" },
    { "query": { "match_all": {} } },
    { "index": "ylai.state.gov", "type": "post" },
    { "query": { "query_string": { "query": "ylai"} } }
  ]
}
```

#### Response

```json
{
  "responses": [
    {},
    {}
  ]
}
```

#### API Properties

| Params  | Description                                                                                                                          |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| docs    | `Object[]` -  The request docs, as either an array of objects.                        |
| index   | `String, String[]` - A comma-separated list of index names to search; use _all or empty string to perform the operation on all indices|
| type    | `String, String[]` - A comma-separated list of document types to search; leave empty to perform the operation on all types             |

### `/v1/get`

Get a typed JSON document from the index based on its id.

#### Request

```http
POST /v1/get HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "include": "",
  "exclude": "",
  "index": "share.america.gov",
  "id": "AVvaUp3b7IRpFeXBlfMX",
  "type": "post"
}
```

#### Response

```json
{
  "_index": "share.america.gov",
  "_type": "post",
  "_id": "AVvaUp3b7IRpFeXBlfMX",
  "_version": 1,
  "found": true,
  "_source": {}
}
```
#### API Properties

| Params  | Description                                                                                                                          |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| exlcude | `String, String[]` -  A list of fields to exclude from the returned _source field                                                     |
| include | `String, String[]` -  A list of fields to extract and return from the _source field                                                    |
| index   | `String` - The name of the index                                                                                                      |
| type    | `String` -  The type of the document (use _all to fetch the first document matching the ID across all types)                           |
| id      | `String` -  The document ID

### `/v1/mget`

Get multiple documents based on an index, type (optional) and ids. The body required by mget can take two forms: an array of document locations, or an array of document ids.

#### Request

```http
POST /v1/mget HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "docs": [
    { "_index": "indexA", "_type": "typeA", "_id": "1" },
    { "_index": "indexB", "_type": "typeB", "_id": "2" }
  ]
}
```

An alternative way to make the request for multiple documents within a single is shown below.

```js
{
  "index": "share.edit.staging.america.gov",
  "type": "post",
  "ids": ["AVvaRlI57IRpFeXBle3J", "AVvaRsfdkIRpFeXBle3J"]
}
```

#### Response

```json
{
  "docs": [
    {},
    {}
  ]
}

```
#### API Properties

### `/v1/getsource`

Get the source of a document by its index, type and id.

#### Request

```http
POST /v1/getSource HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "index": "share.edit.staging.america.gov",
  "type": "post",
  "id": "AVvaRlI57IRpFeXBle3J"
}
```

#### Response

```json
{}
// object only contains source fields
```
#### API Properties

| Params  | Description                                                                                                                          |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| exlcude | `String, String[]` -  A list of fields to exclude from the returned _source field                                                     |
| include | `String, String[]` -  A list of fields to extract and return from the _source field                                                    |
| index   | `String` - The name of the index                                                                                                      |
| type    | `String` -  The type of the document (use _all to fetch the first document matching the ID across all types)                           |
| id      | `String` -  The document ID

### `/v1/count`

Get the number of documents for the cluster, index, type, or a query.

#### Request

```http
POST /v1/count HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "index": "share.edit.staging.america.gov",
  "type": "post",
  "query": "title: trump"
}
```
#### Response

```json
{
  "count": 16014,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  }
}
```

#### API Properties

| Params  | Description                                                                                                               |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| index   | `String` - The name of the index                                                                                          |
| type    | `String` -  The type of the document (use _all to fetch the first document matching the ID across all types)               |
| body    | `JSON string or Object{}` -  An optional request body, as either JSON or a JSON serializable object.                       |
| query   | `String, String[]` - A comma-separated list of specific routing values                                                      |

### `/v1/exists`

Returns a boolean indicating whether or not a given document exists.

#### Request

```http
POST /v1/exists HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
  "index": "share.edit.staging.america.gov",
  "type": "post",
  "id": "AVvaRlI57IRpFeXBle3J"
}
```

#### Response

```
true
```

#### API Properties

| Params  | Description                                                                                                               |
|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| index   | `String` - The name of the index                                                                                          |
| type    | `String` -  The type of the document (use _all to fetch the first document matching the ID across all types)               |
| id      | `String` -  The document ID                                                                                                |
| body      | `JSON string or Object{}` -  An optional request body, as either JSON or a JSON serializable object.                     |
