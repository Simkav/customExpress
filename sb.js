const routes = [
  {
    method: 'GET', // ANY HTTP METHOD
    path: '/' // STRING OR REG
  },
  {
    method: 'GET', // ANY HTTP METHOD
    path: /\/home.*/ // STRING OR REG
  }
]

const url = '/home.asdsad/'

const method = 'GET'
// instanceof RegExp
a = routes
  .filter(v => v.method === method)
  .find(({ path }) => {
    if (path instanceof RegExp) {
      return path.test(url)
    } else {
      return path === url
    }
  })

console.log(a)
