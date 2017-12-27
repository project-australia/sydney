const amazon = require('amazon-product-api')
const { ClientError } = require('./clientError')

const client = () => {
  const { AWS_ID, AWS_SECRET, AWS_TAG } = process.env
  return amazon.createClient({
    awsId: AWS_ID,
    awsSecret: AWS_SECRET,
    awsTag: AWS_TAG
  })
}

async function lookupByISBN (isbn) {
  const formattedIsbn = isbn.replace(/-/, '')
  try {
    const salesRankInfo = await client().itemLookup({
      idType: 'ISBN',
      itemId: formattedIsbn,
      ResponseGroup: 'SalesRank,Offers,ItemAttributes'
    })
    return salesRankInfo
  } catch (error) {
    console.error(JSON.stringify(error))
    throw new ClientError(error)
  }
}

module.exports = { lookupByISBN }