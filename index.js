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
  static url = "https://ancient-taiga-31359.herokupp.com/api/houses";

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
