/** Administration of input symbols. Sets stroke of type image_data and the respective coordinates. Alpha channel of the stroke is saved as a tensor*/
class InputSymbol {
    /**
      @param {list} args: list of arguments:
                    Either a generic {object}, that will then be converted to an input symbol (copy constructor)
                    Or an input stroke {ImageData}, and  {list}, of coordinates i.e. four intergers for upper left an lower right point (x,y,x,y)
    */
    constructor(args) {
      console.log("creating new Symbol");
        if(args === null)return;
        if(args.length > 2)return;
        if(args.constructor.name == "Array" && args.length === 2){//Initializing via {ImageData} Stroke and {list} coordinates
          //console.log("init from scratch");
          if(args[0].constructor.name  !== "ImageData") return;
          if(args[1].constructor.name !== "Array")return;
          var stroke = args[0];
          var coordinates = args[1];
          this.input_strokes = [];
          this.coords = [];
          this.merged = null;
          this.is_alive = true;
          this.symbol_name = "";
          this.combined_coords = null;
          this.add_stroke(stroke, coordinates);
          this.merged = this.input_strokes[0];//does this have side effects???
          //always the current coordinates; They may grow when another stroke is added
        }
        //console.log(args.constructor.name);
        if(args.constructor.name === "Object" || args.constructor.name === "InputSymbol"){//Initializing via generic object: Copy constructor
          var symbol1 = args;
          for (var key in symbol1) {
            if (symbol1.hasOwnProperty(key)) {
                this[key] = symbol1[key];
            }
          }
        }

    }

    /*Adds a stroke i.e. an image_data to this.input_stokes as well coordinates i.e. a list of coordinates.
      Updates the combined coordinates
    */
    add_stroke(image_data, coordinates){
        image_data = tf.tensor(Uint8Array.from(image_data.data),[image_data.height,image_data.width,4]);
        var alpha = tf.squeeze(tf.slice(image_data,[0,0,3],[-1,-1,1]),[2]);//only alpha channel is different hence slice [:,:,3:4]

        //share_tensor("alpha",alpha);

        this.input_strokes.push(alpha);//we only save the alpha channels
        this.coords.push(coordinates);

        if(this.combined_coords){
            this.combined_coords = [Math.min(this.combined_coords[0],coordinates[0]),
                                    Math.min(this.combined_coords[1],coordinates[1]),
                                    Math.max(this.combined_coords[2],coordinates[2]),
                                    Math.max(this.combined_coords[3],coordinates[3])]
        } else this.combined_coords = coordinates;

    }

    get coordinates(){
        return this.combined_coords;
    }
}
