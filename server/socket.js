var moment = require('moment');
var seats = function(){
    var newSeats = [];
    for(var i = 0; i < 5; i++){
        newSeats[i] = [];
        for(var j = 0; j < (i+1) * 2; j++){
            newSeats[i][j] = {
                id: {
                    row: i,
                    seat: j
                },
                available: true,
                consideration: [],
                basePrice: 5.00,
                price: 5.00,
            };
        }
    }

    return newSeats;
}();

var users = [];
var socket = function (socket) {
    var user = {
      id: socket.id,
      confusion: 1
    };

    socket.on('init', function(){
        users.push(user);
        user.index = users.indexOf(user);
        socket.emit('init', {
            user: user,
            seats: seats
        });

        socket.broadcast.emit('user:add', {
            users: users
        });
    });

    socket.on('init:admin', function(){
        socket.emit('init:admin', {
            users: users,
            seats: seats
        });
    });

    socket.on('seat:considered', function(data){
        var currentSeat = seats[data.id.row][data.id.seat];
        currentSeat.consideration.push(new moment());
        var recentConsideration = 0;
        currentSeat.consideration.forEach(function(time){
          if(time.diff(moment().subtract(1, 'minute')) < 60000){
            recentConsideration++;
          }
        });

        currentSeat.price = currentSeat.basePrice + (0.50 * recentConsideration);
        if(recentConsideration < 3){
          currentSeat.price = currentSeat.price / 2;
        }
        socket.broadcast.emit('seat:considered', {
            seats: seats
        });
        var data = {
          row: data.id.row,
          column: data.id.seat,
          seat: currentSeat
        };
        socket.emit('seat:update', data);
        socket.broadcast.emit('seat:update', data);
    });

    socket.on('mouse:moved', function(){
        user.confusion++;
        socket.broadcast.emit('user:confused', {
            users: users
        })
    });

    socket.on('disconnect', function(){
        users.some(function(currentUser, index){
            if(currentUser.id == user.id){
                users.splice(index, 1);
                return true;
            }
            return false;
        });
        socket.broadcast.emit('user:update', {
            users: users
        });
    });

};

module.exports = socket;
