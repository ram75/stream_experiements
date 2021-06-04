

const fastify = require('fastify')({
    ignoreTrailingSlash: true
  })

const fileUpload = require('fastify-file-upload')
 
fastify.register(fileUpload)

fastify.get('/bar', function (req, reply) {
    reply.send('bar')
  })

fastify.post('/upload', function (req, reply) {
  // some code to handle file
  console.log('in upload listening');
  const files = req.raw.files
  console.log(files)
  let fileArr = []
  for(let key in files){
    fileArr.push({
      name: files[key].name,
      mimetype: files[key].mimetype
    })
  }
  reply.send(fileArr)
})
 
fastify.post('/uploadSchema', {
    schema: {
      summary: 'upload file',
      body: {
        type: 'object',
        properties: {
          file: { type: 'object' }
        },
        required: ['file']
      }
    },
    handler: (request, reply) => {
      const file = request.body.file
      console.log(file)
      reply.send({ file })
    }
  })



fastify.post('/', function (req, reply) {
    // some code to handle file
    console.log('in / listening');
    reply.send('HELLO WORLD!!')
  })
  fastify.listen(5000, '0.0.0.0')
fastify.listen(5000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
  console.log(`server listening on ${fastify.server.address().port}`)

})
