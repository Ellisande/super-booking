'use strict';

function HomeCtrl($scope, $location, socket) {
    socket.connect();
    socket.emit('init', []);

    $scope.stealMouse = function(mousex, mousey){
        socket.emit('mouse:moved', {})
    };

    $scope.allSeats = [];


    socket.on('init', function(data){
        data.seats.forEach(function(row, index){
          $scope.allSeats[index] = [];
          row.forEach(function(seat, seatIndex){
            $scope.allSeats[index].push(seat);
          });
        });
    });

    socket.on('seat:update', function(data){
        var currentSeat = $scope.allSeats[data.row][data.column];
        currentSeat.price = data.seat.price;
        currentSeat.available = data.seat.available;
        // console.log("Updated: " + data.row + "-" + data.column);
    });

    $scope.toggle = function(seat){
        if(seat.available){
            seat.selected = !seat.selected;
        }
    }

    $scope.$watch('allSeats', function(){
      var total = 0;
      $scope.allSeats.forEach(function(row){
        row.forEach(function(seat){
          if(seat.selected){
            total += seat.price;
          }
        });
      });
      if(total != $scope.total){
        $scope.total = total;
      }
    }, true);
}

function AnalyticsCtrl($scope, socket){
    socket.connect();
    socket.emit('init:admin', {});
    $scope.seats = [];

    var flattenSeats = function(seats){
        var allSeats = [];
        seats.forEach(function(row){
            row.forEach(function(seat){
                allSeats.push(seat);
            });
        });

        return allSeats;
    };

    socket.on('init:admin', function(data){
        $scope.allUsers = data.users;
        $scope.seats = flattenSeats(data.seats);
    })

    socket.on('seat:considered', function(data){
        $scope.seats = flattenSeats(data.seats);
    });

    socket.on('user:add', function(data){
        $scope.allUsers = data.users;
    });

    socket.on('user:update', function(data){
        $scope.allUsers = data.users;
    });

    socket.on('user:confused', function(data){
        $scope.allUsers = data.users;
    });
}
