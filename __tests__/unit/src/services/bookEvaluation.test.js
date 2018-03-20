import AmazonClient from '../../../../src/services/amazon'
import amazonLookupByISBN from '../../../fixture/amazonLookup/amazonLookupByISBN'
import { evaluateBook } from '../../../../src/services/evaluation'
import { ServiceError } from '../../../../src/services/serviceError'
jest.mock('../../../../src/services/amazon')

const bookUnderSalesRankThreshold = 0

describe('Amazon API Service', () => {
  beforeAll(() => {
    AmazonClient.lookupByISBN = jest.fn()
  })

  it("should return all book's information", async () => {
    AmazonClient.lookupByISBN.mockReturnValue(
      Promise.resolve(amazonLookupByISBN)
    )
    const isbn = '9781483358505'

    const book = await evaluateBook(isbn)

    expect(book.title).toEqual(
      'Fundamentals of Human Resource Management: Functions, Applications, Skill Development'
    )
    expect(book.authors).toEqual(['Robert N. Lussier', 'John R. Hendon'])
    expect(book.edition).toEqual('1')
    expect(book.id).toEqual(isbn)
    expect(book.price.sell).toEqual('16.89')
    expect(book.images.small).toEqual(
      'https://images-na.ssl-images-amazon.com/images/I/51uSvYiXgyL._SL75_.jpg'
    )
    expect(book.images.medium).toEqual(
      'https://images-na.ssl-images-amazon.com/images/I/51uSvYiXgyL._SL160_.jpg'
    )
    expect(book.images.large).toEqual(
      'https://images-na.ssl-images-amazon.com/images/I/51uSvYiXgyL.jpg'
    )
    expect(book.dimensions.height).toEqual(10.5)
    expect(book.dimensions.length).toEqual(8.25)
    expect(book.dimensions.width).toEqual(0.5)
    expect(book.dimensions.weight).toEqual(0)
  })

  it('should evaluate only chepeast used paperback book', async () => {
    AmazonClient.lookupByISBN.mockReturnValue(
      Promise.resolve(amazonLookupByISBN)
    )

    const book = await evaluateBook('9781483358505')
    expect(book).toEqual(null)
  })

  it.skip('should throw ISBN not found when amazon return empty array', async () => {
    AmazonClient.lookupByISBN.mockReturnValue(Promise.resolve([]))

    expect(async () => {
      await evaluateBook('9781483358505')
    }).toThrow(new ServiceError(new Error('ISBN Not Found')))
  })

  it('should calculate ballard price if book is above 900 000 on amazon sales rank', async () => {
    AmazonClient.lookupByISBN.mockReturnValue(
      Promise.resolve([amazonLookupByISBN[bookUnderSalesRankThreshold]])
    )

    const book = await evaluateBook('9781483358505')
    expect(book.price.sell).toEqual('16.89')
  })
})
