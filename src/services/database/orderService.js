const { saveBooks, changeAvailability } = require('./bookService')
const { OrderModel } = require('./models/orderModel')

const createBuyOrder = async (
  customerId,
  items,
  shippingMethod,
  shippingAddress
) => {
  const rentingBooks = items
    .filter(item => item.type === 'RENT')
    .map(item => changeAvailability(item.book.id, 'RENTED'))
  const buyingBooks = items
    .filter(item => item.type === 'BUY')
    .map(item => changeAvailability(item.book.id, 'SOLD'))
  const orderItems = await Promise.all([...buyingBooks, ...rentingBooks])

  const savedOrder = await saveOrder(
    customerId,
    orderItems,
    shippingMethod,
    shippingAddress,
    'BUY'
  )

  // TODO: HEBERT AJUDA EU
  // MANDAR EMAIL DE CONFIRMACAO DE ORDER

  return savedOrder
}

const createSellOrder = async (
  customerId,
  items,
  shippingMethod,
  shippingAddress
) => {
  const booksFromItem = items.map(item => item.book)
  const books = await saveBooks(booksFromItem)

  if (shippingMethod === 'SHIPPO') {
    // TODO: HEBERT AJUDA EU
    // CRIAR O LABEL
    // ENVIAR O LABEL POR EMAIL
  }

  return saveOrder(customerId, books, shippingMethod, shippingAddress, 'SELL')
}

const saveOrder = async (
  customerId,
  items,
  shippingMethod,
  shippingAddress,
  orderType
) => {
  const order = {
    customerId,
    items: items.map(book => book.id),
    shippingMethod,
    shippingAddress,
    orderType
  }

  return new OrderModel(order).save()
}

const updateOrder = async (id, status, transactionId) => {
  return OrderModel.findOneAndUpdate(
    { _id: id },
    { $set: { status, transactionId } },
    { new: true }
  )
}

const findAll = async () => {
  return OrderModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'customerId',
        foreignField: '_id',
        as: 'user'
      }
    }
    // {
    //   $lookup: {
    //     from: 'books',
    //     let: {'items': '$items'},
    //     pipeline: [
    //       {$match: {
    //         $expr: {
    //           $in: ['$_id', '$$items']
    //         }
    //       }}
    //     ],
    //     as: 'booksList'
    //   }
    // }
    // {
    //   $unwind: '$items'
    // },
    // {
    //   $lookup:
    //     {
    //       from: 'books',
    //       localField: 'items',
    //       foreignField: '_id',
    //       as: 'booksOrdered'
    //     }
    // },
    // {
    //   $match: { 'booksOrdered': { $ne: [] } }
    // }
  ])
}

module.exports = {
  updateOrder,
  createBuyOrder,
  createSellOrder,
  findAll
}

// db.grupos.aggregate([
//   {$lookup:{
//     from:'times'
//    , let:{times:'$times'}
//    , pipeline:[
//     {$match:{
//      $expr:{
//       $in:['$nome','$$times']
//      }
//     }}
//    ]
//    , as: 'times'
//   }}
//  ])
