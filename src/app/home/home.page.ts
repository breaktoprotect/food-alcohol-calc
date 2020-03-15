import { Component } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  bill_total_amount: number;
  food_total_amount: number;
  alcohol_total_amount: number;
  num_of_eaters: number;
  num_of_drinkers: number;

  add_food_amount: number;

  food_per_pax: number;
  alcohol_per_pax: number;

  amount_per_non_drinker: number;
  amount_per_drinker: number;

  constructor(
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {
    // Initialize
    this.food_total_amount = 0.00;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async input_food_amount() {
    const alert = this.alertCtrl.create({
      header: "Add new food item $:",
      inputs: [
        {
          name: "food_amount",
          type: "number",
          min: 0,
          max: 9999999,
          placeholder: '5.99'
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Add",
          handler: data => {
            if (Number(data.food_amount) >= 0) {
              this.food_total_amount += Number(data.food_amount);
            }
            else {
              this.presentToast("Negative amount for food item? Check again.");
              return
            }            
          }
        }
      ]
    });
    (await alert).present();
  }

  calculate() {
    // Calculate 'Alcohol Total'
    if (this.bill_total_amount && this.food_total_amount) {
      this.alcohol_total_amount =
        this.bill_total_amount - this.food_total_amount;
    } else {
      this.presentToast("Please enter the 'Bill Total' and 'Food Total'!");
      return;
    }

    if (this.num_of_eaters && this.num_of_drinkers) {
      // Calculate food per pax
      this.food_per_pax = this.food_total_amount / this.num_of_eaters;

      // Calculate alcohol per pax
      this.alcohol_per_pax = this.alcohol_total_amount / this.num_of_drinkers;
    } else {
      this.presentToast(
        "Pleae enter the 'Food Split Pax' and 'Alcohol Split Pax'!"
      );
      return;
    }

    // Calculate each non-drinker to pay
    this.amount_per_non_drinker = this.food_per_pax;

    // Calculate each drinker to pay
    this.amount_per_drinker = this.food_per_pax + this.alcohol_per_pax;

    this.presentToast("Calculated!");
  }

  addFood() {
    this.food_total_amount += this.food_total_amount;
  }
}
