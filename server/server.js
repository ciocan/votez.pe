Kadira.connect('eYQm6ZmAZq6n6KrwQ', '8130e262-2ae1-4ea3-a7d9-2c93241c312a');

ServiceConfiguration.configurations.remove({
    service: "facebook"
});
ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "115517658476426",
    secret: "d87d2eb22adfb2356aa7f0ffc12b6e6c",
//    redirect_uri: "https://votez.pe/",
    requestPermissions: ['user_birthday','user_location','user_hometown']
});


Meteor.methods({
    vote: function(vote) {        
        //
        // o: owner
        // v: candidate._id
        // d: date
        // a: argument
        // 
        // f: facebook id
        // g: gender
        // l: city
        // ag: age
        // 
        // up: list thumbs up
        // dn: list thumbs down
        // cu: count up
        // cd: count down
        // 
        if(Meteor.user()) {
            var data = { 'v': vote, 'o': Meteor.user()._id, 'g': Meteor.user().services.facebook.gender.charAt(0), 'cu':0, cd:0, 'd': new Date().getTime() }
            // check for duplicate vote
            var v = Votes.find({o: this.userId}, {fields: {'v': 1}}).fetch();
            if(v.length == 0) {
                Votes.insert(data);
                TotalVotes.update({'c':vote}, { $inc: {'v':1}});
            }
        }
    },
    updateArgument: function(argument, anonim, vote) {
        if(Meteor.user()) {
            var fbid = '';
            if(!anonim) {
                fbid = Meteor.user().services.facebook.id;
            }
            Votes.update( {'o': this.userId}, {$set: {'a': argument.slice(0,139), 'f': fbid} } );
            TotalVotes.update({'c':vote}, { $inc: {'a':1}});
        }
    },
    thumbs: function(id, c) {
        //console.log(id, c);
        if(c == 1) {
            Votes.update({_id: id}, {$inc: {cu: 1}});
            Votes.update({'o': this.userId}, {$push: {'up': id}});
        } else {
            Votes.update({_id: id}, {$inc: {cd: -1}});
            Votes.update({'o': this.userId}, {$push: {'dn': id}});
        }

        
    },
    // add dumy data for testing purposes
    // dummy: function(n) {
    //     for(i=0;i<n;i++) {
    //         var result = Meteor.http.get('http://baconipsum.com/api/?type=meat-and-filler');
    //         //console.log(result.content.slice(2,141));
    //         var id = Math.floor(Math.random() * 15) + 11;
    //         //console.log(id);
    //         Votes.insert( {'v':id, 'a': result.content.slice(2,141), 'cu':Math.floor(Math.random() * 200) + 1, 'cd':-Math.floor(Math.random() * 200) + 1 } );
    //         TotalVotes.update({'c':id}, { $inc: {'v':1}});
    //     }        
    // }    

});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},{fields: {'services.facebook': 1}});
});

Meteor.publish("myVote", function() {
    return Votes.find({o: this.userId}, {fields: {'v': 1, 'o':1, 'a':1, 'u':1, 'd':1, 'f':1, 'up':1, 'dn':1, 'cu':1, "cd":1 }});
});

Meteor.publish("argumentsList", function(candidate, limit) {
    //console.log('argumentsList',candidate);
    return Votes.find({v: candidate, 'a':{$exists:true}}, {sort: {cu: -1}, limit: limit}, {fields: {'v':1, 'a':1, 'f':1, 'cu':1, "cd":1 }});
});

Meteor.publish("selectedArgument", function(voteId, candidateId) {
    return Votes.find({_id: voteId, v: candidateId}, {fields: {'v':1, 'a':1, 'f':1, 'cu':1, "cd":1 }});
});

Meteor.publish("totalVotes", function() {
    return TotalVotes.find();
})

// insert totals
Meteor.startup(function () {    

    Votes._ensureIndex({ "o":1 }); // user id
    Votes._ensureIndex({ "v":1 }); // candidate
    Votes._ensureIndex({ "cu":1 }); // counts up
    Votes._ensureIndex({ "a": 1 }, { sparse: true }); // argument
    TotalVotes._ensureIndex({ "c":1 }); // candidate

    
    if (TotalVotes.find().count() === 0) {
        // c:candidate, v:votes, a:arguments
        var data = [
            { c:11, v: 0, a:0 },
            { c:12, v: 0, a:0 },
            { c:13, v: 0, a:0 },
            { c:14, v: 0, a:0 },
            { c:15, v: 0, a:0 },
            { c:16, v: 0, a:0 },
            { c:17, v: 0, a:0 },
            { c:18, v: 0, a:0 },
            { c:19, v: 0, a:0 },
            { c:20, v: 0, a:0 },
            { c:21, v: 0, a:0 },
            { c:22, v: 0, a:0 },
            { c:23, v: 0, a:0 },
            { c:24, v: 0, a:0 },
            { c:25, v: 0, a:0 }
        ];
        _.each(data, function(candidate) {
            TotalVotes.insert(candidate);
        });
     }


});
