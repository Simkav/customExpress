/* 
Реализовать роутер и валидатор на основании потоков
Пример использования:
async function baseController({route, data}) {
  return 'hello world';
}
async function baseValidator(context) {
  return {
    data: {
      params: context.req.params
    }
  };
}
const routes = [
  {
    method: 'GET', // ANY HTTP METHOD
    path: '/', // STRING OR REG
    controller: baseController,
    validator: baseValidator,
  },
  {
    method: 'GET', // ANY HTTP METHOD
    // path: /\/home.*/ /*, // STRING OR REG
    controller: baseController,
  }
]
const server = require('http').createServer((req, res) => {
  const context = {req, res};
  const router = new Router(routes, context);
  const validator = new Validator();
  const executor = new Executor();
  pipeline(router, validator, executor, res, (err) => {
    if(err) {
      console.log(err);
      sendError(err, res)
    }
  })
});
function sendError(err, res) {
  res.writeHead(err.code < 600 && err.code > 299 ? err.code : 500);
  res.end(err.message)
}
server.listen(8000);
*/
const options = { objectMode: true }
const { Readable, Duplex, Writable, Transform, pipeline } = require('stream')
const http = require('http')

const routes = [
  {
    method: 'GET', // ANY HTTP METHOD
    path: '/', // STRING OR REG
    controller: baseController,
    validator: baseValidator
  },
  {
    method: 'GET', // ANY HTTP METHOD
    path: /\/home.*/, // STRING OR REG
    controller: baseController
  }
]
async function baseController ({ route, data }) {
  return 'hello world'
}
async function baseValidator (context) {
  return {
    data: {
      params: context.req.params
    }
  }
}

function sendError (err, res) {
  res.writeHead(err.code < 600 && err.code > 299 ? err.code : 500)
  res.end(err.message)
}

class Router extends Readable {
  constructor (routes, context) {
    super(options)
    this._routes = routes
    this._context = context
  }
  _read () {
    const { url, method } = this._context.req
    const route = this._routes
      .filter(route => route.method === method)
      .find(({ path }) => {
        if (path instanceof RegExp) {
          return path.test(url)
        } else {
          return path === url
        }
      })
    if (!route) {
      this._context.res.writeHead(404).end('Not found \n')
    } else {
      this.push(route)
    }
  }
}

class Validator extends Transform {
  constructor () {
    super(options)
  }
  _transform (chunk, encoding, done) {
    
  }
}

const server = http.createServer((req, res) => {
  const context = { req, res }
  const router = new Router(routes, context)
  pipeline(router, res, err => {
    if (err) {
      console.log(err)
      sendError(err, res)
    }
  })
})

server.listen(8001)
