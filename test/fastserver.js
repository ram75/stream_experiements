const fastify = require('fastify')({
    logger: true
  })
  
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
  
  fastify.post('/upload', async (request, reply) => {
    return { hello: 'world from POST' }
  })
  



  fastify.listen(3000, '0.0.0.0', function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })



