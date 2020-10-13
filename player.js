class Player {
    constructor(_id) {
        this.id = _id;
        this.locationId = "";
        this.location = null;

        this.passkeys = ["alpha"];
        this.inventory = [];
    }

    setLocation(_location){
        this.location = _location;
        this.locationId = _location.id;
    }
}
module.exports = Player;