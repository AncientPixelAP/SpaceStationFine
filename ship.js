class Ship{
    constructor(){
        this.position = {
            x: 178,
            y: 92,
            z: 190
        }
        this.warpcore = {
            health: 100,
            energy: 100
        }
        this.engines = {
            warpcore: {
                health: 100,
                energy: 100
            },
            impulse: {
                health: 100,
                energy: 100
            }
        }
        this.hull = 100;
        this.shields = {
            front: {
                health: 100,
                energy: 100
            },
            back: {
                health: 100,
                energy: 100
            },
            left: {
                health: 100,
                energy: 100
            },
            right: {
                health: 100,
                energy: 100
            },
            top: {
                health: 100,
                energy: 100
            },
            bottom: {
                health: 100,
                energy: 100
            }
        }
        this.weapons = [{
            type: "phaser",
            health: 100,
            energy: 100,
            damage: 10
        }, {
            type: "torpedo",
            health: 100,
            energy: 100,
            damage: 50,
            amount: 10
        }]
        this.astrometry = {
            health: 100,
            energy: 100
        }
        this.navigations = {
            health: 100,
            energy: 100
        }
        this.engineering = {
            health: 100,
            energy: 100
        }
        this.security = {
            health: 100,
            energy: 100
        }
        this.ressources = {
            deuterium: 100,
            crew: 80,
            food: 2000,
            inventory: []
        }
    }
}
module.exports = Ship;