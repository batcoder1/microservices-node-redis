
echo 'starting book server...'
nodemon ./books/server.js &
echo 'starting order server...'
nodemon ./orders/server.js &
echo 'starting customer server...'
nodemon ./customers/server.js 