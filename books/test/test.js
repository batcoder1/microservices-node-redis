var assert = require('assert');
const controller = require('../controller/books');
const ioClient = require('socket.io-client')

const Book = require('../model/Book')
const nodeIP = process.env.NODE_IP || 'localhost'
const host = `http://${nodeIP}`
const port = process.env.SERVER_PORT || 5544
const hostName = `http://${nodeIP}:${port}`
 

let client, receiver;
var options = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
};

const order = {
    "_id": "5c94f6c8d4a362415bd8cd7e",
    "status": "open",
    "bookID": "5c923eb07e65163e95ec1742",
    "customerID": "5c925ddaab609d5eea16855e",
    "initialDate": "2019-03-22T14:52:56.839Z",
    "deliveryDate": "2019-03-29T14:52:56.839Z"
}
describe("Books Tests", () => {

    let server;
    const options = {
        'forceNew': true
    };

    beforeEach(function (done) {
        // start the server
        server = require('../server').server;
        client = ioClient(hostName, options);
        receiver = ioClient(hostName, options)

        done();
    });
    afterEach(function (done) {
        // disconnect io clients after each test
        client.disconnect()
        receiver.disconnect()

        done()
    })
    

    it("should connect socket", (done) => {

        client.once("connect", () => {
            assert.equal(client.connected, true);
            done();
        });
    });

    it('Should broadcast new order and update book stock', async () => {
        const book = await Book.findById(order.bookID)
        await controller.updateStock(order)
        const bookUpdated = await Book.findById(order.bookID)
        assert(book.stock > bookUpdated.stock)
           

    });
  
});