var uid = null;

AFRAME.registerComponent("markerhandler", {
  init: async function() {

    if (uid === null) {
      this.askuid();
    }

    var toys = await this.gettoys();

    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;
      this.handleMarkerFound(toys, markerId);
    });

    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },

  askuid: function() {
    var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
    swal({
      icon:iconUrl,
      title:"WELCOME NO TOYS ON SUNDAY AND SATURDAY",
      content:{
        element:"input",
        attributes:{
          min:1,
          placeholder:"NO NEED FOR YOUR UID IF YOU WANT TO GO HOME",
          type:"number"
        }
      },
      closeOnClickOutside:"false",
    }).then(inputvalue => {
      uid=inputvalue
    })
  },

  handleMarkerFound: function(toys, markerId) {

    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();
    
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    var toy = toys.filter(toy => toy.id === markerId)[0];

    if (toy.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      model.setAttribute(visible="true")

      var ingredientsCointainer=document.querySelector(`main-plane-${toy.id}`)
      var priceplane =document.querySelector(`price-plane-${toy.id}`)

      ingredientsCointainer.setAttribute(visible="true")
      priceplane.setAttribute(visible="true")

      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");

      ratingButton.addEventListener("click", function() {
        swal({
          icon: "warning",
          title: "Rate toy",
          text: "Work In Progress"
        });
      });

      orderButtton.addEventListener("click", () => {
        
        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order !",
          text: "Your order will never be given to you",
          timer: 2000,
          buttons: false
        });
      });
    }
  },
  handleOrder: function(uid, dish) {
    firebase.firestore().collection("uids").doc(uid).get().then(doc => {
      var details = doc.data()
      if(details[current_orders][toy.id]){
        details[current_orders][toy.id]["quantity"]  += 1
        var currentQuantity = details[current_orders][toy.id]["quantity"]

        details[current_orders][toy.id]["subTotal"] = currentQuantity*toy.price
      }else{
        details[current_orders][toy.id]={
          item:toy.toy_name,
          price:toy.price,
          quantity:1,
          subTotal:toy.price*1
        }
      }

      details.total_bill += toy.price

      firebase.firestore().collection("uids").doc(doc.id).update(details)
    })
  },

  getDishes: async function() {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  handleMarkerLost: function() {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});