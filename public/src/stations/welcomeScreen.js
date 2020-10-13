export default class Welcome {
    constructor(_scene){
        this.scene = _scene;

        this.dismissed = false;
        this.title = this.scene.add.bitmapText(this.scene.left + 43, this.scene.top + 13, "pixelmix", "Welcome!", 8, 1).setOrigin(0, 0.5);

        let txt = "Welcome!\n";
        txt += "\nYour are on the " + this.scene.locationData.type + " " + this.scene.locationData.id + " in sector " + this.scene.locationData.sector.x + "," + this.scene.locationData.sector.y + "," + this.scene.locationData.sector.z + "\n";
        txt += "\nClick on any of the stations on the left side of the screen to get started!";
        this.description = this.scene.add.bitmapText(0, 0, "pixelmix", txt, 8, 1).setOrigin(0.5);
        this.description.maxWidth = 180;
        
    }

    update(){

    }

    move(){

    }

    synchronize(){

    }

    dismiss(){
        if(this.dismissed === false){
            this.dismissed = true;
            this.title.destroy();
            this.description.destroy();
        }
    }
}