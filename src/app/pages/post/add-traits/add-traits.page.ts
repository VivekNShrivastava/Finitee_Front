import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import _lodash from 'lodash';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'app-add-traits',
  templateUrl: './add-traits.page.html',
  styleUrls: ['./add-traits.page.scss'],
})
export class AddTraitsPage implements OnInit {

  selectedTraits: any = [];
  traitsData: any = [{
    default: 5,
    category: "Fashion & beauty",
    subCategory: ["Styles & trends",
      "Clothing and accessories",
      "Make-up",
      "Hair care",
      "Skincare",
      "Jewelry",
      "Dresses & skirts",
      "Hairstyles",
      "Footwear",
      "Shirts and tops",
      "Accessories",
      "Nail care",
      "Body art",
      "Costumes",
      "Face care products",
      "Trousers and bottoms",
      "Outerwear",
      "Activewear",
      "Swimwear",
      "Hats"]
  }, {
    default: 5,
    category: "Animals",
    subCategory: ["Cute animals",
      "Dogs",
      "Funny animals",
      "Animal- human bonding",
      "Pet care",
      "Cats",
      "Animal encounters",
      "Birds",
      "Cows and bulls",
      "Wildlife",
      "Horses",
      "Aquatic",
      "Goats",
      "Aquariums and zoos",
      "Reptiles",
      "Rabbits",
      "Bugs and worms",
      "Primates",
      "Farm animals"]
  },
  {
    default: 5,
    category: "Transportation",
    subCategory: ["Car culture",
      "Cars and trucks",
      "Motorcycles",
      "Heavy machinery",
      "Motorsports",
      "SUVs",
      "Sports cars",
      "Bicycles",
      "Car racing",
      "Automotive tech",
      "Repairs and maintenance",
      "Vintage and classic"]
  },
  {
    default: 5,
    category: "Food and drink",
    subCategory: ["Recipes",
      "Desserts",
      "Baking",
      "Cakes",
      "Restaurants",
      "Alcoholic beverages",
      "Coffee",
      "Rice grains and noodles",
      "Fruits",
      "Chocolate",
      "Snacks",
      "Meat",
      "Juices and smoothies",
      "Vegetables",
      "Breads",
      "Dairy",
      "Breakfast and brunch",
      "Seafood",
      "Kitchen accessories",
      "Ice cream",
      "Cookies",
      "Street food",
      "Pizza",
      "Beer",
      "Cocktails",
      "Cupcakes",
      "Barbecue and grilling",
      "Veganism",
      "Wine",
      "Cheese"]
  }, {
    default: 5,
    category: "Visual arts",
    subCategory: ["Visual arts",
      "Photography",
      "Crafts",
      "Painting",
      "Drawing",
      "Digital art",
      "Textile arts"]
  }, {
    default: 5,
    category: " Travel",
    subCategory: ["Holiday activities",
      "Destinations",
      "Landmarks and destinations",
      "Outdoors",
      "Tourist attractions",
      "Water activities",
      "Beaches",
      "Hotels & lodging",
      "Jungle and rainforest",
      "Amusement parks"]
  }, {
    default: 5,
    category: "Sports",
    subCategory: ["Gym workouts",
      "Strength training",
      "Football",
      "Cricket",
      "Tips",
      "Bodyweight workouts",
      "Basketball",
      "Water sports",
      "Weightlifting",
      "Cycling",
      "Home workouts",
      "Running",
      "Yoga",
      "American football",
      "Wrestling",
      "Boxing",
      "Baseball",
      "Winter sports",
      "Volleyball",
      "Golf"]
  }, {
    default: 5,
    category: "Science and tech",
    subCategory: ["Technology",
      "Consumer tech",
      "Audio electronics",
      "Phones and accessories",
      "Disciplines"]
  }, {
    default: 5,
    category: "Relationships",
    subCategory: ["Friendships",
      "Birthdays",
      "Friendship humor",
      "Relationships to Self"]
  }, {
    default: 5,
    category: "Performing arts",
    subCategory: ["Dance",
      "Lip synching",
      "Performances",
      "Instruments",
      "Singers",
      "Comedy"]
  }, {
    default: 5,
    category: "Games",
    subCategory: ["Video games", "Toys"]
  }, {
    default: 5,
    category: "TV and films",
    subCategory: ["Celebrities",
      "Animation",
      "Bollywood",
      "Anime",
      "American",
      "Comedy",
      "Romance",
      "Fantasy"]
  }, {
    default: 5,
    category: "Home and garden",
    subCategory: ["Gardening and landscaping",
      "Plants and trees",
      "Interior design",
      "Home furnishings",
      "Construction and renovation",
      "Urban farming",
      "Home and garden hacks"]
  }, {
    default: 5,
    category: "Business",
    subCategory: ["Small businesses",
      "Entrepreneurship",
      "Career development",
      "Commerce",
      "Financial markets"]
  }, {
    default: 5,
    category: "Education",
    subCategory: ["Teaching materials"]
  }]

  constructor(private postService: PostService, private navCtrl: NavController) { }

  ngOnInit() { }

  selectTrait(trait: any) {
    let index = _lodash.findIndex(this.selectedTraits, (e) => {
      return e == trait;
    }, 0);
    if (index != -1) {
      this.selectedTraits.splice(index, 1);
    }
    else {
      this.selectedTraits.push(trait);
    }
  }


  getColor(trait: any) {
    let index = _lodash.findIndex(this.selectedTraits, (e) => {
      return e == trait;
    }, 0);
    if (index != -1)
      return 'primary';
    else
      return 'medium';
  }

  saveTraits() {
    this.navCtrl.pop();
  }

  seeMore(trait: any) {
    trait.default = trait.subCategory.length;
  }

  ngOnDestroy() {
    this.postService.postTraits.next(this.selectedTraits);
  }
}
