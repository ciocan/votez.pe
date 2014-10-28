Votes = new Mongo.Collection("votes");

Votes.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    // return (userId && doc.owner === userId);
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents    
    //return doc.owner === userId;
    return false;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    //return doc.owner === userId;
    return false;
  },
  fetch: ['owner']
});

Votes.deny({
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'o');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return doc.locked;
  },
  fetch: ['locked'] // no need to fetch 'owner'
});


// -----------------------------------------------------------

TotalVotes = new Mongo.Collection("totalvotes");

