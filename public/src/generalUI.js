import OverlayMessage from "./lcars/overlayMessage.js";

export default class GeneralUI{
    constructor(_scene){
        this.scene = _scene;

        this.overlayMessage = new OverlayMessage(this.scene, { x: 0, y: 0 }, "");
        
        this.quickTxt = this.scene.add.bitmapText(this.scene.right - 40, this.scene.top + 13, "pixelmix", "", 8, 1).setOrigin(1, 0.5);
        this.quickTextCleaner = setTimeout(() => {
            this.quickTxt.setText("");
        }, 1);

        socket.on("quickMessage", (_data) => {
            this.quickTxt.setText(_data.txt);

            this.quickTextCleaner = setTimeout(() => {
                this.quickTxt.setText("");
            }, this.quickTxt.getTextBounds().local.width * 20);
        });
        
        this.overlayMessage.move(3000, 0);
    }

    update(){
        this.overlayMessage.update();
    }

    showOverlayMessage(_txt) {
        this.overlayMessage.move(0, 0);
    }

    destroy(){
        this.overlayMessage.destroy();
        this.quickTxt.destroy();

        clearTimeout(this.quickTextCleaner);
        socket.off("quickMessage");
    }
}