//Coding Steps: Create a full CRUD application of your choice using an API or JSON Server. Use JQuery/AJAX to interact with the API. Use a form to post new entities. Build a way for users to update or delete entities. Include a way to get entities from the API. Use Bootstrap and CSS to style your project.//

class House {
  constructor(name) {
    this.name = name;
    this.rooms = [];
  }

  addRoom(name, area) {
    this.rooms.push(new Room(name, area));
  }
}

class Room {
  constructor(name, area) {
    this.name = name;
    this.area = area;
  }
}
//Above are the two classes//
class HouseService {
  static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

  static getAllHouses() {
    return $.get(this.url);
  }

  static getHouse(id) {
    return $.get(this.url + `/${id}`);
  }
  static createHouse(house) {
    return $.post(this.url, house);
  }
  static updateHouse(house) {
    return $.ajax({
      url: this.url + `/${house._id}`,
      dataType: "json",
      data: JSON.stringify(house),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteHouse(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static houses;

  static getAllHouses() {
    HouseService.getAllHouses().then((houses) => this.render(houses));
  }
  //This makes the CREATE method//
  static createHouse(name) {
    HouseService.createHouse(new House(name))
      .then(() => {
        return HouseService.getAllHouses();
      })
      .then((houses) => this.render(houses));
  }
  //This makes the DELETE method//
  static deleteHouse(id) {
    HouseService.deleteHouse(id)
      .then(() => {
        return HouseService.getAllHouses();
      })
      .then((houses) => this.render(houses));
  }

  static addRoom(id) {
    for (let house of this.houses) {
      if (house._id == id) {
        house.rooms.push(
          new Room(
            $(`#${house._id}-room-name`).val(),
            $(`#${house._id}-room-area`).val()
          )
        );
        HouseService.updateHouse(house)
          .then(() => {
            return HouseService.getAllHouses();
          })
          .then((houses) => this.render(houses));
      }
    }
  }

  static deleteRoom(houseId, roomId) {
    for (let house of this.houses) {
      if (house._id == houseId) {
        for (let room of house.rooms) {
          if (room._id == roomId) {
            house.rooms.splice(house.rooms.indexOf(room), 1);
            HouseService.updateHouse(house)
              .then(() => {
                return HouseService.getAllHouses();
              })
              .then((houses) => this.render(houses));
          }
        }
      }
    }
  }

  static render(houses) {
    this.houses = houses;
    $("#app").empty();
    for (let house of houses) {
      $("#app").prepend(
        `<div id="${house._id}" class="card">
            <div class="card-header">
                <h2>${house.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
            </div>
            <div class="card-body">
              <div class="card">
                <div class="row">
                  <div class="col-sm">
                    <input type="text" id="${house._id}-room-name" class ="form-control" placeholder="Room Name">
                  </div>
                  <div class="col-sm">
                    <input type="text" id="${house._id}-room-area" class ="form-control" placeholder="Room Area">
                  </div>
              </div>
              <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
            </div>
        </div><br>`
      );
      for (let room of house.rooms) {
        $(`#${house._id}`).find(".card-body").append(`<p>
            <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
            <span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
            <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`);
      }
    }
  }
}

$("#create-new-house").click(() => {
  DOMManager.createHouse($("#new-house-name").val());
  $("#new-house-name").val("");
});

DOMManager.getAllHouses();
