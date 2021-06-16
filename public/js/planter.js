
    const Modes = {
        viewing: "viewing",
        planting: "planting",
    }

    var currentMode = Modes.viewing;
    console.log(currentMode)



    $(()=>{

        var seedBed = {};

        $('#plantseedling').on('click', ()=> {
            if($('#plantseedling').html()==('Cancel')) {
                currentMode = Modes.viewing;
                $('#plantseedling').html('Plant a seedling');
            }
            else {
                currentMode = Modes.planting;
                $('#plantseedling').html('Cancel')
            }
        })

        $('#cancel').on('click', ()=>{
            currentMode = Modes.none;
            $('#cancel').hide();
        })

        const dice = () => {
            return Math.floor(1000000*Math.random());
        }

        class Seedling {
            constructor(latlng) {
                this.marker = L.marker(latlng, {
                    draggable: true
                });
                this.id  = dice();
                this.name = "New seedling";

                this.marker.on('click', ()=>{
                    let details = "<b>"+this.name+"</b> (#"+this.id+")<br/>";
                        details = details + "This is just a baby seedling."
                    $('#detailpanel').html(details);
                });

            }
        }

        $('#mymap').on('click', ()=>{
            console.log(currentMode)
            // switch(currentMode) {
            //     case Modes.planting:
            //         let seed = new Seedling(event.latlng);
            //         seedBed[seed.id]=seed;
            //         seed.marker.addTo(mymap);
            //         currentMode = Modes.viewing;
            //         $('#plantseedling').html('Plant a seedling')
            //         break;
            //     default:
            //         break;
            // }
        })

    });