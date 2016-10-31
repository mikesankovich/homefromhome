var User = require('../models/user');
var Message = require('../models/message');

exports.getMessage = (req, res) => {
  const messageChainId = req.params.id
  Message.findById(messageChainId, function(err, message){
    if(err) res.send(err)
    res.send(message)
  });
}

exports.newMessage = (req, res) => {
  var senderId = req.body.senderId;
  var sender = req.body.senderUsername;
  var recipientId = req.body.recipientId;
  var recipient = req.body.recipientUsername;
  Message.findOne(
    {userIds: { $all: [senderId, recipientId]}},
    function(err, message) {
      if (err) res.send(err)
      if (!message) {
        const newMessageChain = new Message({
          userIds: [senderId, recipientId],
          usernames: [sender, recipient],
          messages: [{
            senderId: senderId,
            senderUsername: sender,
            dateSent: Date.now(),
            message: req.body.message
          }]
        })
        newMessageChain.save(function(err) {
          if(err) res.send(err)
          console.log(newMessageChain._id, err)
          User.findByIdAndUpdate(senderId,
            {$push: {'messagesChainIds': newMessageChain._id}},
            {safe: true, upsert: true},
            function(err, user) {
              if (err) res.send(err)
              User.findByIdAndUpdate(recipientId,
                {$push: {'messagesChainIds': newMessageChain._id}},
                {safe: true, upsert: true},
                function(err, user) {
                  if (err) res.send(err)
                  res.send(newMessageChain);
                }
              )
            }
          )
        })
      }
      else if (message) {
        const newMessage = {
          senderId: senderId,
          senderUsername: sender,
          dateSent: Date.now(),
          message: req.body.message
        }
        message.messages.push(newMessage)
        message.lastMessage = Date.now()
        message.save()
        res.send(message)
      }
    }
  );
}
