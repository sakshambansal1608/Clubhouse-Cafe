(function(){
'use strict';
/* ---------------- utilities ---------------- */
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var root=document.documentElement;
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
var touch=matchMedia('(hover: none), (pointer: coarse)').matches;
var hasGsap=!!(window.gsap&&window.ScrollTrigger);
root.classList.add('js');
if(hasGsap) gsap.registerPlugin(ScrollTrigger);
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
var lerp=function(a,b,t){return a+(b-a)*t};
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var ADDRESS='Clubhouse Cafe, Ground Floor, The Elite City Center, Model Town Rd, Abadpura, Model Town, Jalandhar, Punjab 144001';
var DIR_URL='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(ADDRESS);
var MAP_URL='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(ADDRESS);
['dirBtn','fabDir'].forEach(function(id){$('#'+id).href=DIR_URL;});
$('#mapBtn').href=MAP_URL;
function announce(msg){var l=$('#srLive');l.textContent='';setTimeout(function(){l.textContent=msg;},50);}
function focusables(el){return $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',el).filter(function(n){return n.offsetParent!==null||n===document.activeElement;});}
function trapTab(e,container){
  if(e.key!=='Tab') return;
  var f=focusables(container); if(!f.length) return;
  var first=f[0], last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
function setOpenState(el,open){el.classList.toggle('open',open);el.setAttribute('aria-hidden',String(!open));el.inert=!open;}
var locks=0;
function lockScroll(on){locks=Math.max(0,locks+(on?1:-1));document.body.classList.toggle('lock',locks>0);}

/* ---------------- data ---------------- */
var DISHES=[
  {key:'dimsum',photo:'dimsums',name:'Cream Cheese Dimsums',cat:'Dim Sums',price:675,desc:'Steamed dimsums with a cream cheese filling, finished with carrot and crispy chilli.'},
  {key:'tacos',photo:'tacos',name:'Spicy Chicken Tacos',cat:'Crispy Tacos',price:700,desc:'Crisp tacos with spicy chicken, hot sauce and avocado.'},
  {key:'frappe',photo:'frappe-photo',name:'Brownie Frappe',cat:'Frappe',price:425,desc:'Coffee blended with rich chocolate, espresso and chunks of brownie.'},
  {key:'fondue',name:'Pav Bhaji Fondue',cat:'First Things First',price:550,desc:'Loaded vegetable bhaji served fondue-style with butter buns for dipping.'},
  {key:'galouti',name:'Mushroom Galouti with Ulta Tawa Parantha',cat:'Indian Appetizers',price:700,desc:'A royal Awadhi delicacy — soft kebabs with buttery parantha.'}
];
var MENU_GROUPS=[{"id": "coffee", "name": "Coffee", "blurb": "Espresso bar, house originals, cold brew and matcha", "visual": {"photo": "cappuccino"}, "cats": [{"t": "Hot & Iced Coffee", "i": [["Espresso", 210, "Single origin espresso served with soda"], ["Piccolo", 210, "Single shot espresso with milk of choice"], ["Americano", 285, "Double espresso shot with hot water"], ["Irish Coffee (Non-Alcoholic)", 305, "Hot coffee topped with lightly whipped cream"], ["Flat White", 310, "Espresso topped with a thin creamy layer of milk of choice"], ["Cortado", 310, "Double espresso with equal parts of milk of choice"], ["Latte", 325, "Equal parts espresso & steamed milk of choice with thick creamy milk foam"], ["Cappuccino", 325, "Equal parts espresso & steamed milk of choice with thick creamy milk foam"], ["Macchiato", 325, "Bold shot of espresso topped with milk foam"], ["Jaggery Turmeric Latte", 325, "Coffee blended with jaggery and turmeric milk, topped with cinnamon"], ["Classic Iced Latte", 365, "Espresso & iced milk of choice, add flavour"], ["Spiced Cappuccino", 365, "Cappuccino infused with warm spices like cinnamon, nutmeg and cardamom"], ["Roasted Almond Latte", 375, "Creamy coffee with roasted almonds"], ["Roasted Hazelnut Latte", 375, "Creamy coffee with roasted hazelnuts"], ["Cafe Mocha", 390, "Dessert-like café latte flavoured with couverture chocolate and milk"], ["Iced Mocha", 390, "Dessert-like café latte flavoured with couverture chocolate and milk"], ["White Vietnamese Latte", 465, "White or black Vietnamese latte / cappuccino (hot or cold)"], ["Black Vietnamese Latte", 465, "White or black Vietnamese latte / cappuccino (hot or cold)"]]}, {"t": "Clubhouse Originals", "i": [["Lotus Biscoff Latte", 430, "Creamy coffee with Lotus Biscoff flavour & biscuit"], ["Dalgona Iced Latte", 440, "Creamy coffee foam on iced chilled milk (choice of milk or coconut water)"], ["Coffee Affogato", 440, "Hot espresso poured over a scoop of gelato, topped with toasted pistachio"], ["Pistachio Affogato", 440, "Hot espresso poured over a scoop of gelato, topped with toasted pistachio"], ["Sweet Talk Spanish Latte", 440, "Espresso, chilled milk and sweetened condensed milk"], ["Thai Coconut", 465, "Espresso blended with creamy coconut milk over ice, with a hint of sweetness"], ["Arabic Pistachio Coffee", 585, "A smooth, nutty latte infused with real pistachios (hot or cold)"], ["Tiramisu Latte", 590, "Coffee topped with a tiramisu chunk, iced milk"]]}, {"t": "Frappe", "i": [["Caramel Frappe", 400, "A rich caramel coffee frappe with a smooth, icy texture"], ["Mocha Frappe", 400, "A rich, chocolate-infused coffee frappe with a smooth, icy texture"], ["House Cold Coffee", 400, "A smooth and creamy iced coffee blended to perfection"], ["Brownie Frappe", 425, "Coffee blended with rich chocolate, espresso and chunks of brownie"]]}, {"t": "Cold Brew", "i": [["Regular Cold Brew", 400, ""], ["Cranberry Cold Brew", 400, ""], ["Orange Cold Brew", 400, ""], ["Coconut Cold Brew", 465, ""]]}, {"t": "Matcha", "i": [["Hot Boy Matcha Latte (Hot)", 440, "Matcha with hot milk"], ["Iced Matcha Latte", 453, "Vanilla / strawberry / coconut / mango"], ["Iced Hojicha Latte", 453, "Vanilla / strawberry / coconut / mango"], ["Biscoff Matcha", 550, "Topped with matcha foam and Biscoff"], ["Biscoff Hojicha", 550, "Topped with matcha foam and Biscoff"], ["Cold Foam Hojicha", 555, "Topped with homemade foam"], ["Clubhouse Matcha Colada", 565, "Matcha with pineapple and coconut milk"], ["Pistachio Berry Matcha", 580, "Pistachio sauce with berry compote"], ["Pistachio Berry Hojicha", 580, "Pistachio sauce with berry compote"]]}, {"t": "Chocolate", "i": [["Classic Hot Chocolate", 465, "Only couverture chocolate & milk, no nasty ingredients"], ["Caramel Hot Chocolate", 480, "Blend of caramel and 55% dark chocolate"], ["Iced Chocolate Therapy", 480, "Hot couverture chocolate cooled on ice, orange zest"]]}, {"t": "Protein Max", "i": [["Mocha Muscle", 555, "Espresso, chocolate, whey protein, milk"], ["Nutty Gains", 555, "Peanut butter, banana, whey protein"], ["Muscle Berry Banana", 555, "Fresh banana and blueberry blended with whey protein"]]}]}, {"id": "drinks", "name": "Drinks", "blurb": "Teas, coolers, mocktails, smoothies and thick shakes", "visual": {"photo": "matcha-tray"}, "cats": [{"t": "Hot Tea", "i": [["Green Tea", 175, "A soothing, antioxidant-rich tea"], ["Karak Chai", 250, "Cardamom / ginger / fennel seeds"], ["Honey Ginger Lemon Tea", 250, "Straight from the mountains"], ["Chamomile Tea", 275, "A relaxing tea (hot or iced)"], ["Hibiscus Tea", 275, "A red floral tea (hot or iced)"], ["Blue Pea Tea", 275, "A vibrant, naturally blue herbal tea with floral notes (hot or iced)"], ["Kashmiri Kahwa", 380, "Kashmiri dry fruit and spices infused in green tea"]]}, {"t": "Coolers", "i": [["Jaggery Lemonade", 310, "Jaggery with lemon & sparkling water"], ["Hibiscus Iced Tea", 340, "Brewed hibiscus tea served over ice"], ["Blue Pea Iced Tea", 340, "Brewed blue pea tea served over ice"], ["Peach Please Iced Tea", 364, "A sweet and fruity peach-flavoured iced tea"], ["Sangria Iced Tea", 364, "Tea infused with mixed fruits and citrus"], ["Lemon Iced Tea", 364, "A refreshing citrus-infused tea"]]}, {"t": "Mocktails", "i": [["Hara Bhara High", 400, "Cucumber, basil, lemon and ginger ale"], ["So-Much Passion", 400, "Passion fruit, kaffir lime & orange"], ["Vibe Hai", 400, "Muddled ginger and apple juice"], ["Zingy Pudina (Mojito)", 400, "Muddled mint, lemon, caster sugar and soda"], ["Sunset Serenade", 400, "A citrusy tropical blend of peach, orange juice, kaffir lime leaves and lemon"], ["Berry Bawaal", 400, "Bold berry fusion with chaat masala, pineapple and lemon juice"], ["Jhatak Kiwi", 400, "Spicy blend with kiwi, masala & cranberry"], ["Clubhouse Colada", 440, "Pineapple & coconut"]]}, {"t": "Smoothies", "i": [["Choco Nana Banana", 490, "A blend of banana, chocolate and yoghurt"], ["Berry Nice", 490, "A tropical blend of berries and yoghurt"], ["Spirulina Blue Smoothie", 505, "A tropical blend of fruits, yoghurt and spirulina"]]}, {"t": "Thick Shakes", "i": [["Choco Brownie Shake", 450, "Rich chocolate shake blended with brownie chunks"], ["Strawberry Shake", 450, "Fresh strawberry or mango blended with ice cream"], ["Oreo Shake", 450, "Creamy & crunchy shake made with Oreo cookies"], ["Kitkat Shake", 465, "A crunchy shake infused with KitKat bars"], ["Ferrero Rocher Shake", 490, "A creamy blend of Ferrero Rocher, chocolate and hazelnut"], ["Cookie Monster Shake", 500, "Melted chocolate, blended cookie chunks with ice cream"], ["Biscoff Cheesecake Shake", 500, "Biscoff cookies blended with ice cream"], ["Nutella Almond Shake", 500, "Nutty almond and Nutella indulgence"]]}, {"t": "Soft Beverages", "i": [["Coke", 85, ""], ["Diet Coke", 100, ""], ["Tonic Water", 120, ""], ["Ginger Ale", 120, ""], ["Buttermilk", 174, ""], ["Mineral Water", 174, ""], ["Fresh Lime", 205, ""], ["Masala Coke", 215, ""], ["Masala Sprite", 215, ""], ["Red Bull", 290, ""]]}]}, {"id": "breakfast", "name": "Breakfast & Bakery", "blurb": "Eggs, pancakes, croissants, toasties and fresh bakes", "visual": {"photo": "dalgona"}, "cats": [{"t": "First Things First: Eggs", "i": [["Ande Ka Funda", 423, "Eggs of your choice, served with toasted bread & potato wedges"], ["Bhurji", 460, "3 eggs / tofu / paneer, bread toast, salad"], ["Kejriwal Omelette", 461, ""], ["Turkish Eggs", 525, "Poached or boiled eggs, garlic-infused yogurt base, topped with chilli oil"], ["Pav Bhaji Fondue", 550, "Butter buns, loaded vegetables"], ["Clubhouse Breakfast Bowl", 625, "Eggs, sausages, mushrooms, beans, guac, toast"], ["Keema Pav", 690, "Butter buns, mutton keema"]]}, {"t": "Pancake & French Toast", "i": [["High Protein Pancake", 550, "25 g protein, oatmeal, banana, add ice cream"], ["French Toast", 575, "Tiramisu toast"]]}, {"t": "Croissants", "i": [["Cookie Dough Croissant", 445, "Buttery croissant stuffed with cookie"], ["Pistachio Croissant", 445, "Pista cream filling"], ["Nutella Croissant", 448, "Buttery croissant stuffed with Nutella"], ["Almond Croissant", 450, "Almond cream filling"], ["Creamy Mushroom Croissant", 550, "Garlic mushrooms, topped with cheese"], ["Paneer Tikka Croissant", 575, "Paneer tikka, topped with cheese"], ["Chicken Tikka Croissant", 640, "Chicken tikka, topped with cheese"]]}, {"t": "Toasties", "i": [["Korean Bun", 372, "Garlic cream cheese / paneer tikka / chicken tikka"], ["Mushroom Toast", 640, "Crispy bread topped with garlic-infused mushrooms"], ["Paneer Chilli Toast", 650, ""], ["Smashed Avocado Toast", 680, "Loaded guacamole, feta, nuts"], ["Three Musketeers Toast", 689, "Avocado, tomato, mushroom toast"], ["Chicken Chilli Toast", 715, ""]]}, {"t": "Viennoiserie", "i": [["Butter Croissant", 335, "Buttery & flaky croissant"], ["Almond Croissant", 450, "Stuffed with almond cream"], ["Pistachio Croissant", 450, "Stuffed with pistachio cream"], ["Nutella Croissant", 450, "Stuffed with Nutella cream"], ["Cookie Dough Croissant", 450, "Stuffed with fresh cookie dough"], ["Cheddar Cheese Sourdough", 335, ""], ["Whole Wheat Sourdough Bread", 335, ""], ["Multigrain Sandwich Bread", 335, ""], ["Whole Wheat Burger Buns (Pack of 4)", 80, ""], ["Butter Cookies (250 g)", 295, ""], ["Oat Cookies (250 g)", 295, ""], ["Cheese Straw (250 g)", 310, ""], ["Lavash Box (Pack of 1)", 80, ""], ["Rusk Box (250 g)", 70, ""]]}]}, {"id": "small", "name": "Small Plates", "blurb": "Dim sums, sushi, tacos, sharing boards and soups", "visual": {"photo": "dimsums"}, "cats": [{"t": "Dim Sums", "i": [["Cream Cheese Dimsums", 675, "Carrot, crispy chilli"], ["Mushroom Gyoza Dimsums", 675, "Cream cheese, truffle oil"], ["Spinach Corn & Water Chestnut", 675, "With yellow curry gravy"], ["Ragi Dimsums", 690, "Veggies, tofu wrapped in ragi"], ["Chicken Chilli Oil Dimsums", 710, "Garlic seasoning, chilli oil"], ["Ragi Chicken Dimsums", 710, "Keema wrapped in ragi"], ["Chicken Gyoza Dimsums", 710, "Pan-fried dimsums"]]}, {"t": "Sushi Rolls", "i": [["Nutcracker", 626, "Crispy nutcracker, cream cheese, spicy mayo"], ["Avocado Tempura", 626, "Tempura-fried avocado, spicy mayo, shichimi powder"], ["Spiced Asparagus", 626, "Avocado, crispy kale, black sesame, soy mirin reduction"], ["Truffle Chicken", 676, "Chicken tempura, avocado, sesame seeds, tartu mayo"], ["Bombay Chicken", 676, "Chicken tempura, spicy mayo, cucumber"], ["Prawn Tempura", 714, "Fried prawn, tempura flake, rice cracker, micro greens"]]}, {"t": "Crispy Tacos", "i": [["Mushroom & Cheese Tacos", 650, "Truffle oil, cheddar cheese"], ["Spicy Chicken Tacos", 700, "Hot sauce, avocado"], ["Veg Malabar Parantha Tacos", 800, "Tawa paneer served in a laccha paratha taco"], ["Veg Chilly Malabar Tacos", 800, "Tawa paneer served in a laccha paratha taco"], ["Non Veg Malabar Parantha Tacos", 830, "Tawa chicken served in a laccha paratha taco"], ["Non Veg Chilly Malabar Tacos", 830, "Tawa chicken served in a laccha paratha taco"]]}, {"t": "Veg Plates", "i": [["Palak Patta Chaat", 590, "Crispy spinach, sweet yogurt, chutneys"], ["Honey Chilli Potato", 650, "Sweet, spicy honey chilli glaze"], ["Falafel Hummus", 650, "Chickpea falafels served with silky hummus"], ["Chilli Paneer", 680, "Glazed savoury chilli garlic sauce"], ["Crispy Corn", 680, "Sweet corn tossed in spices and herbs"], ["Pocket Spring Roll", 680, "Golden-fried pockets with veggies"], ["Cheesy Corn Roll", 689, "Crispy golden rolls with corn & cheese"], ["Paneer 65 Popcorn", 690, "Crispy, spicy paneer bites"], ["Thecha Chilli Tandoori Paneer", 700, "Coated in spicy thecha masala"], ["Mandarin Tofu", 700, "Tossed in a tangy mandarin-style sauce"]]}, {"t": "Non-veg Plates", "i": [["Chilli Chicken", 750, "Spicy-tangy sauce with garlic & peppers"], ["Honey Chilli Chicken", 750, "Crowd favourite, honey glazed"], ["Malaysian Chicken Satay", 750, "Served with peanut sauce"], ["Chicken 65 Popcorn", 750, "Crispy chicken, spicy mayo, podi butter"], ["Corn Flakes Coated Chicken Fingers", 780, "Chicken fingers coated in crispy corn flakes"], ["Chicken Seekh Kebab", 780, "Minced meat, burnt butter"], ["Chicken Malai Kebab", 780, "Juicy & tender malai chicken"], ["Kefta Kebab", 800, "Mouth-melting Turkish kebab with hummus"], ["Mutton Seekh Kebab Plate", 800, "Minced meat, burnt butter"], ["Hummus with Lamb", 815, "Keema served with hummus"]]}, {"t": "Sidekicks", "i": [["French Fries", 360, ""], ["Peri Peri Fries", 360, ""], ["Garlic Bread", 370, ""], ["Truffle Cheese Fries", 440, ""], ["Cheese Garlic Bread", 450, ""], ["Hummus & Homemade Pita", 500, ""], ["Hummus Roasted Chickpeas", 550, ""], ["Loaded Nachos", 550, ""]]}, {"t": "Soups", "i": [["Truffle Mushroom", 395, "Brie cheese toast, truffle oil"], ["Manchow", 395, "Light soy, crispy noodles"], ["Lemon Coriander", 395, "Ginger, garlic, green chilli"], ["Hot & Sour", 395, "Chilli garlic with bao"], ["Roasted Tomato & Basil", 395, "Feta, pumpkin seed, tomatoes"], ["High Protein Chicken Soup", 395, "Winter special / seasonal"]]}, {"t": "Sharing Boards", "i": [["Tandoori Veg Platter", 1795, "Mushroom galouti kabab, dahi ke shole, mushroom tikka, paneer tikka, grilled pineapple"], ["Delhi Momo Platter", 1800, "Afghani malai momos, tandoori momos, kurkure momos, classic steamed momos"], ["Non Veg Platter", 1920, "Chicken tikka, chicken malai tikka, mutton seekh, fish tikka, grilled pineapple"]]}]}, {"id": "asian", "name": "Asian", "blurb": "Asian bowls, ramen, wok noodles and rice", "visual": {"photo": "ramen"}, "cats": [{"t": "Asian Bowls", "i": [["Veg Thai Green Curry", 750, "With jasmine rice"], ["Nonveg Thai Green Curry", 840, "With jasmine rice"], ["Veg Nasi Goreng", 750, "Indonesian fried rice, paneer skewers, fried egg"], ["Nonveg Nasi Goreng", 800, "Indonesian fried rice, chicken skewers, fried egg"], ["Kung Pao Tofu", 760, "With noodles or rice"], ["Kung Pao Chicken", 790, "With noodles or rice"], ["Hunan Pot", 760, "Chinese pot served with rice"], ["Veg High Protein Curry Bowl", 815, "Jasmine rice, coconut curry, grilled paneer, salsa & avocado"], ["Nonveg High Protein Curry Bowl", 840, "Jasmine rice, coconut curry, chicken & egg, salsa & avocado"], ["Chicken Kra Pao Bowl", 840, "With noodles or rice"]]}, {"t": "Ramen Noodle Bowl", "i": [["Veg Korean Cheese & Corn", 650, "Noodles, gourmet toppings"], ["Nonveg Korean Cheese & Corn", 715, "Noodles, gourmet toppings"], ["Veg Spicy Gochujang", 650, "Noodles, gourmet toppings"], ["Nonveg Spicy Gochujang", 715, "Noodles, gourmet toppings"], ["Veg Thukpa Soup", 650, "A hearty, comforting Tibetan noodle soup"], ["Nonveg Thukpa Soup", 710, "A hearty, comforting Tibetan noodle soup"], ["Veg Clubhouse Khao Suey", 710, "Noodles in coconut gravy, onions, peanuts, spring onions, burnt garlic"], ["Nonveg Clubhouse Khao Suey", 840, "Noodles in coconut gravy, onions, peanuts, spring onions, burnt garlic"]]}, {"t": "Noodles", "i": [["Veg Hawker Style Hakka Noodles", 585, "Assorted veggies, green onion, chilli"], ["Nonveg Hawker Style Hakka Noodles", 700, "Assorted veggies, green onion, chilli"], ["Veg Chilli Garlic Noodles", 650, "Assorted veggies, chilli garlic sauce"], ["Nonveg Chilli Garlic Noodles", 700, "Assorted veggies, chilli garlic sauce"], ["Veg Truffle Noodles", 650, "Assorted mushrooms, truffle oil"], ["Nonveg Truffle Noodles", 700, "Assorted mushrooms, truffle oil"], ["Veg Dan Dan Noodles", 650, "Minced protein, pak choi"], ["Nonveg Dan Dan Noodles", 700, "Minced protein, pak choi"], ["Veg Pan Fried Noodles", 675, "Crispy noodles, hot garlic sauce"], ["Nonveg Pan Fried Noodles", 710, "Crispy noodles, hot garlic sauce"]]}, {"t": "Fried Rice", "i": [["Veg Fried Rice", 625, "Wok-tossed rice with fresh veggies and aromatic spices"], ["Egg Fried Rice", 650, "Wok-tossed rice with fresh veggies, aromatic spices and egg"], ["Chicken Fried Rice", 700, "Wok-tossed rice with chicken and aromatic spices"]]}]}, {"id": "continental", "name": "Continental", "blurb": "Pizza, pasta, risotto, large plates, salads and sandwiches", "visual": {"photo": "samak"}, "cats": [{"t": "Neapolitan Pizza", "i": [["Mama Margherita Pizza", 780, "House tomato blend, basil, mozzarella"], ["Pepperoni Pizza", 880, "Tomato blend, pepperoni, cheese, olive oil"]]}, {"t": "Thin Crust Pizza · 12 inch", "i": [["Mama Margherita", 750, "Homemade tomato blend, basil, mozzarella"], ["Veg Farm to Oven Vegetable", 775, "Tomato sauce, corn, onion, bell pepper"], ["Pesto Paneer Pizza", 775, "Homemade pesto sauce with feta cheese"], ["Paneer Tikka Pizza", 775, "Loaded paneer tikka, veggies, mozzarella"], ["Spicy Paneer Pizza", 775, "Spiced paneer, red pepper, onion, mozzarella"], ["Dirty Truffle Mushroom Pizza", 775, "Truffle-infused garlic mushroom, parmesan cheese"], ["BBQ Paneer Pizza", 780, "Loaded barbecue paneer with tomato blend"], ["Non Veg Farm to Oven Vegetable", 810, "Tomato sauce, corn, onion, bell pepper"], ["BBQ Chicken Pizza", 825, "Loaded barbecue chicken with tomato blend"], ["Pesto Chicken Pizza", 830, "Homemade pesto sauce with feta cheese"], ["Chicken Tikka Pizza", 830, "Loaded chicken tikka, veggies, mozzarella"], ["Spicy Chicken Pizza", 830, "Spiced chicken, red pepper, onion, mozzarella"]]}, {"t": "Pastas", "i": [["Veg Tangy Tomato Arrabiata", 675, "Spicy Italian tomato sauce"], ["Nonveg Tangy Tomato Arrabiata", 700, "Spicy Italian tomato sauce"], ["Veg Creamy Pesto Spaghetti", 675, "Fresh pesto, cherry tomatoes"], ["Nonveg Creamy Pesto Spaghetti", 700, "Fresh pesto, cherry tomatoes"], ["Veg Creamy Penne Alfredo", 675, "Cheese sauce, chilli flakes, pepper, fresh basil"], ["Nonveg Creamy Penne Alfredo", 700, "Cheese sauce, chilli flakes, pepper, fresh basil"], ["Veg Hot Girl Spaghetti Aglio-e-Olio", 680, "Jalapeños, green chilli, burnt chilli, olive oil"], ["Nonveg Hot Girl Spaghetti Aglio-e-Olio", 700, "Jalapeños, green chilli, burnt chilli, olive oil"], ["Veg Mamma Rossa Mix Sauce", 680, "Sun-dried tomato, veggies, parmesan"], ["Nonveg Mamma Rossa Mix Sauce", 700, "Sun-dried tomato, veggies, parmesan"], ["Veg Dirty Truffle Mushroom Pasta", 700, "Truffle-infused garlic mushroom, parmesan"], ["Nonveg Dirty Truffle Mushroom Pasta", 750, "Truffle-infused garlic mushroom, parmesan"]]}, {"t": "Risotto", "i": [["Veg Sundried Tomato Risotto", 680, "Bold, aromatic, slow-cooked"], ["Nonveg Sundried Tomato Risotto", 710, "Bold, aromatic, slow-cooked"], ["Veg Mushroom Risotto", 680, "Velvety, savoury, truffle-kissed"], ["Nonveg Mushroom Risotto", 710, "Velvety, savoury, truffle-kissed"]]}, {"t": "Large Plates", "i": [["Grilled Paneer", 750, "With mashed potato, sautéed veggies"], ["Californian Burrito Bowl", 750, "Charred paneer with crispy pita, guac, cheese and Mexican rice"], ["Stuffed Chicken", 780, "Stuffed chicken, corn purée, garlic aioli"], ["Grilled Chicken", 800, "Served with mashed potatoes, veggies"], ["Chicken Burrito Bowl", 800, "Charred chicken with crispy pita, guac, cheese and rice"], ["Chicken Stroganoff", 800, "Herbed rice, mushroom sauce"], ["Grilled Fish", 1130, "Served with mashed potatoes, veggies"]]}, {"t": "Fish & Prawns", "i": [["Amritsar Fish Fry", 1145, "Tartare sauce"], ["Fish & Chips", 1145, "Tartare sauce"], ["Butter Chilli Garlic Fish", 1145, "Onion, bell pepper"], ["Butter Chilli Garlic Prawns", 1180, "Onion, bell pepper"], ["Peri Peri Tandoori Prawn", 1195, "Fiery tandoori prawns"]]}, {"t": "Salad Bowls", "i": [["Amaranth Barley", 685, "Hummus, pomegranate, veggies, pecan nuts"], ["House Salad with Berries & Nuts", 690, "Lettuce, avocado, mixed berries, mixed seeds & honey lemon vinaigrette"], ["Mexican Quinoa", 690, "Guac, beans, corn, tomato, soft cheese, vinaigrette"], ["Roasted Vegetable & Hummus", 690, "Roasted carrots, beetroot, pumpkin with hummus & toasted chickpea"], ["Caesar Salad", 700, "Croutons, parmesan, lettuce, candied walnuts, Caesar dressing"], ["Indian Millet Chickpea Salad", 700, "Millets, chickpea, seeds, greens, dressing"], ["Paneer Tikka Bowl", 765, "House salad with paneer, guacamole"], ["Chicken Tikka Bowl", 790, "House salad with chicken, guacamole"], ["Guiltfree Protein", 790, "Roasted chicken, boiled egg, avocado, broccoli, brown rice, BBQ dressing"]]}, {"t": "Sandwiches", "i": [["BBQ Paneer Sandwich", 650, "BBQ paneer, focaccia bread"], ["Bombay Masti Sandwich", 650, "Aloo bonda, chutney, cucumber & tomato, cheese"], ["Crispy Paneer Sando", 650, "Fried paneer, spiced greens, sandwich bread"], ["Creamy Mushroom Sandwich", 650, "Caramelised onions, sourdough bread"], ["Peppy Pesto Paneer Sandwich", 650, "Homemade pesto, sourdough bread"], ["Amritsari Chole Paneer Sandwich", 650, "Chole paneer blend with cheese, sandwich bread"], ["Dirty Paneer Tikka Sandwich", 650, "Paneer tikka, focaccia bread"], ["Peppy Pesto Chicken Sandwich", 710, "Homemade pesto, sourdough bread"], ["BBQ Chicken Sandwich", 715, "BBQ chicken, focaccia bread"], ["Crispy Chicken Sando", 715, "Fried chicken, spiced greens, sandwich bread"], ["Creamy Chicken Sandwich", 715, "Caramelised onions, sourdough bread"], ["Avocado Egg Sandwich", 715, "Avocado, sunny side egg, cheese, multigrain bread"], ["Dirty Chicken Tikka Sandwich", 715, "Chicken tikka, focaccia bread"]]}, {"t": "Wrap & Roll", "i": [["Falafel Wrap", 575, "Falafel, lettuce, hummus, chilli oil in tortilla bread"], ["Paneer Tikka Ragi Wrap", 640, "Paneer tikka, onions, green chutney"], ["Crispy Paneer Wrap", 640, "Spicy fried paneer, cheese & veggies"], ["Whole Protein Pro Max Wrap", 675, "Chilli scrambled eggs, avocado, cheese, veggies, beans"], ["Chicken Tikka Ragi Wrap", 680, "Chicken tikka, onions, green chutney"], ["Crispy Chicken Wrap", 680, "Spicy fried chicken, cheese & veggies"], ["Juicy Mutton Wrap", 780, "Soft onion, juicy mutton, pickle"]]}, {"t": "Burgers", "i": [["Crispy Paneer Burger", 630, "Crunchy paneer, caramelised onions, veggies, cheddar cheese, fries"], ["American Smash Chicken Burger", 690, "Chicken patty, cheese slice, caramelised onions, lettuce, home sauce, fries"], ["American Lamb Smash Burger", 750, "Lamb patty, caramelised onions, cheese slice"]]}]}, {"id": "indian", "name": "Indian", "blurb": "Tandoor appetizers, curries, breads and biryani", "visual": {"shot": "galouti"}, "cats": [{"t": "Appetizers", "i": [["Mushroom Bharwan Tikka", 650, "Tender mushrooms stuffed with a flavourful mix"], ["Dahi Ke Sholey", 675, "Soft, mouthwatering dahi kebab"], ["Paneer Tikka", 685, "Marinated, grilled and bursting with flavour"], ["Mushroom Galouti with Ulta Tawa Parantha", 700, "A royal Awadhi delicacy — soft kebabs with buttery parantha"], ["Chicken Tikka", 715, "Juicy, spiced, tandoor-grilled"], ["Chicken Malai Tikka", 715, "Juicy, creamy and perfectly grilled chicken"], ["Mutton Seekh Kebab", 840, "Minced mutton blended with aromatic spices"], ["Saffron Afghani Tikka", 840, "Juicy, saffron tandoor-grilled"], ["Fish Tikka", 1145, "Juicy, spiced, tandoor-grilled"]]}, {"t": "Indian Mains", "i": [["Yellow Dal", 675, ""], ["Mushroom Do Pyaaza", 675, ""], ["Subz Miloni", 675, ""], ["Dal Makhani", 690, ""], ["Paneer Lababdar", 690, ""], ["Kadhai Paneer", 690, "Spicy, flavourful dish with paneer, bell peppers and spices"], ["Double Cheese Kofta", 690, ""], ["Kadhai Chicken", 740, ""], ["Butter Chicken", 740, ""], ["Mutton Rara", 800, ""], ["Mutton Rogan Josh", 800, ""], ["Goan Fish Curry", 1160, ""], ["Coastal Prawn Curry", 1205, ""]]}, {"t": "Breads", "i": [["Roti", 55, "Soft, whole wheat flatbread"], ["Lachha Paratha", 80, ""], ["Butter Naan", 80, "Naan brushed with rich butter"], ["Mirchi Paratha", 80, "Paratha with rich butter and green chillies"], ["Garlic Naan", 115, "Soft, buttery naan infused with garlic and herbs"], ["Stuffed Kulcha with Gravy", 305, "Stuffed with potato filling, served with gravy"], ["Cheese Naan", 335, "Stuffed with mozzarella cheese"], ["Khoya Saunf Parantha", 395, "Whole wheat flatbread filled with a secret blend of saunf, sugar, khoya & almond"]]}, {"t": "Rice & Biryani", "i": [["Steamed Rice", 375, "Fragrant basmati rice"], ["Zeera Rice", 375, "Fragrant basmati rice tempered with cumin and ghee"], ["Veg Biryani", 715, "Fragrant rice layered with spiced veggies, served with raita"], ["Chicken Biryani", 750, "Fragrant rice layered with tender chicken, served with raita"], ["Mutton Biryani", 815, "Fragrant rice layered with tender mutton, served with raita"]]}]}, {"id": "desserts", "name": "Desserts", "blurb": "The ultimate mood lifter — sweet treats and belly laughs", "visual": {"photo": "tiramisu"}, "photos": [{"k": "tiramisu", "label": "Tiramisu"}, {"k": "m-tresleches", "label": "Classic Tres Leches"}, {"k": "m-cheesecake", "label": "Cheesecake"}], "cats": [{"t": "Desserts", "i": [["Cookie Snookie Brownie", 495, "Warm, gooey cookie dough brownie"], ["Homemade Walnut Brownie", 495, "Walnuts, freshly baked, with ice cream"], ["Classic Tres Leches", 520, "Alia Bhatt’s favourite melt-in-mouth milk cake"], ["Dates & Almond Cake", 525, "Healthy dates, almond sponge cake slice"], ["Tiramisu", 530, "Rich, mouth melting, heavenly"], ["Flourless Almond Cake", 560, "Rich, gluten-free chocolate cake"], ["Blueberry Cheesecake Mini", 585, "Blueberry filling with biscuit base"], ["Biscoff Cheesecake Mini", 585, "Biscoff filling with Biscoff biscuit base"], ["Viral Bangkok Crème Brûlée", 585, "Crumble, homemade custard"], ["Baked Cheesecake Slice", 625, "Baked cheesecake"], ["Teddy Bear Chocolate Mousse", 675, "Belgian chocolate mousse served with crumble"], ["Matilda Cake Slice", 675, "Mouth-melting viral chocolate cake"]]}]}];
var PHOTOS={"hero-coffee": "assets/img/hero-coffee.webp","latte-hero": "assets/img/latte-hero.webp","m-tresleches": "assets/img/m-tresleches.webp","m-cheesecake": "assets/img/m-cheesecake.webp","cappuccino": "assets/img/cappuccino.webp","tiramisu": "assets/img/tiramisu.webp","samak": "assets/img/samak.webp","matcha-tray": "assets/img/matcha-tray.webp","friends-drinks": "assets/img/friends-drinks.webp","dalgona": "assets/img/dalgona.webp","interior-lamps": "assets/img/interior-lamps.webp","interior-chairs": "assets/img/interior-chairs.webp","interior-skylight": "assets/img/interior-skylight.webp","interior-arch": "assets/img/interior-arch.webp","ramen": "assets/img/ramen.webp","frappe-photo": "assets/img/frappe-photo.webp","tacos": "assets/img/tacos.webp","dimsums": "assets/img/dimsums.webp"};
var POPULAR=['Cream Cheese Dimsums','Spicy Chicken Tacos','Brownie Frappe','Pav Bhaji Fondue','Mushroom Galouti with Ulta Tawa Parantha'];
var GALLERY=[
  {photo:'interior-lamps',label:'The dining room',size:'wide'},
  {photo:'cappuccino',label:'Cappuccino',size:'tall'},
  {photo:'dimsums',label:'Cream Cheese Dimsums',size:'tall'},
  {photo:'interior-skylight',label:'Skylight seating',size:'tall'},
  {photo:'tacos',label:'Spicy Chicken Tacos',size:'sq'},
  {photo:'dalgona',label:'Dalgona iced lattes',size:'tall'},
  {photo:'interior-chairs',label:'Café interior',size:'wide'},
  {photo:'tiramisu',label:'Tiramisu',size:'tall'},
  {photo:'ramen',label:'Spicy Gochujang Ramen',size:'sq'},
  {photo:'matcha-tray',label:'Matcha & coffee, to go',size:'tall'},
  {photo:'samak',label:'Samak Rice Bowl',size:'tall'},
  {photo:'interior-arch',label:'Arches & greenery',size:'tall'},
  {photo:'frappe-photo',label:'Brownie Frappe',size:'tall'},
  {photo:'friends-drinks',label:'Coffee with friends',size:'tall'}
];
function initHeroPhoto(){
  var photo=$('.hero-photo'), hero=$('#home'); if(!photo||!hero) return;
  if(reduced) return;
  var mx=0,my=0,tx=0,ty=0,run=false,raf=0;
  addEventListener('pointermove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2;},{passive:true});
  function frame(){
    tx=lerp(tx,mx,.055); ty=lerp(ty,my,.055);
    var sp=clamp(scrollY/innerHeight,0,1.25), s2=sp*sp*(3-2*sp);
    photo.style.transform='translate3d('+(-tx*16)+'px,'+(-ty*11-s2*46)+'px,0) scale('+(1.04+s2*.09)+')';
    photo.style.opacity=String(1-s2*.32);
    if(run) raf=requestAnimationFrame(frame);
  }
  function start(){if(run)return;run=true;raf=requestAnimationFrame(frame);}
  function stop(){run=false;cancelAnimationFrame(raf);}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?start():stop();});},{rootMargin:'40px'}).observe(hero);}
  else start();
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
}
function applyPhotos(){$$('[data-photo]').forEach(function(el){var u=PHOTOS[el.dataset.photo];if(u){el.style.backgroundImage='url('+u+')';el.classList.add('ready');}});}

/* ---------------- illustrations ---------------- */
var ART={
interior:function(u){return '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a warm café interior"><defs><linearGradient id="w'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d1f16"/><stop offset="1" stop-color="#140d09"/></linearGradient><radialGradient id="win'+u+'" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#f5dcaa"/><stop offset=".45" stop-color="#bf8f58"/><stop offset="1" stop-color="#3f2a1d"/></radialGradient><radialGradient id="g'+u+'" r=".5"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient><linearGradient id="f'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3323"/><stop offset="1" stop-color="#110b07"/></linearGradient></defs><rect width="400" height="500" fill="url(#w'+u+')"/><g opacity=".35" stroke="#5b402f" stroke-width="1">'+Array.from({length:18},function(_,i){return '<line x1="'+(i*24)+'" y1="0" x2="'+(i*24)+'" y2="380"/>';}).join('')+'</g><path d="M118 382V178a82 82 0 0 1 164 0V382Z" fill="url(#win'+u+')"/><path d="M200 96V382M118 262H282M118 190H282" stroke="#23180f" stroke-width="3"/><rect y="380" width="400" height="120" fill="url(#f'+u+')"/><g stroke="#b8925a" stroke-width="1.2"><line x1="70" y1="0" x2="70" y2="112"/><line x1="330" y1="0" x2="330" y2="132"/></g><g fill="#c49a62"><path d="M46 136Q70 100 94 136Z"/><path d="M306 156Q330 120 354 156Z"/></g><circle cx="70" cy="150" r="70" fill="url(#g'+u+')"/><circle cx="330" cy="170" r="70" fill="url(#g'+u+')"/><path d="M40 330c10-40 40-60 60-40s-10 60-10 90H40Z" fill="#2f3a24" opacity=".85"/><path d="M60 300c-6-30 10-50 24-30" stroke="#3d4a2e" stroke-width="6" fill="none"/><ellipse cx="200" cy="420" rx="126" ry="15" fill="#6b4a33"/><rect x="194" y="424" width="12" height="60" fill="#23180f"/><path d="M58 470V402q0-22 24-22h14v90M96 430H58" stroke="#8a6a4d" stroke-width="5" fill="none"/><path d="M342 470V402q0-22-24-22h-14v90M304 430H342" stroke="#8a6a4d" stroke-width="5" fill="none"/><ellipse cx="170" cy="412" rx="18" ry="5" fill="#efe6d6"/><ellipse cx="232" cy="412" rx="18" ry="5" fill="#efe6d6"/></svg>';},
table:function(u){return '<svg viewBox="0 0 500 380" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a dining table set for two"><defs><radialGradient id="t'+u+'" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#7a5539"/><stop offset="1" stop-color="#3a281c"/></radialGradient><radialGradient id="p'+u+'" r=".5"><stop offset=".6" stop-color="#f3ece0"/><stop offset="1" stop-color="#d8ccb9"/></radialGradient></defs><rect width="500" height="380" fill="#1c130d"/><circle cx="250" cy="190" r="230" fill="url(#t'+u+')"/><g opacity=".22" stroke="#2a1c12">'+Array.from({length:14},function(_,i){return '<path d="M20 '+(40+i*24)+' Q250 '+(30+i*24)+' 480 '+(46+i*24)+'" fill="none"/>';}).join('')+'</g><circle cx="165" cy="190" r="62" fill="url(#p'+u+')"/><circle cx="165" cy="190" r="40" fill="none" stroke="#d8ccb9"/><circle cx="335" cy="190" r="62" fill="url(#p'+u+')"/><circle cx="335" cy="190" r="40" fill="none" stroke="#d8ccb9"/><g stroke="#b8925a" stroke-width="4" stroke-linecap="round"><path d="M88 150V230M242 150V230M258 150V230M412 150V230"/></g><circle cx="250" cy="96" r="22" fill="#efe6d6"/><circle cx="250" cy="96" r="15" fill="#6b4426"/><circle cx="250" cy="286" r="12" fill="#c49a62"/><circle cx="250" cy="286" r="26" fill="none" stroke="#c49a62" opacity=".4"/></svg>';},
detail:function(u){return '<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a brass pendant lamp and fluted wall"><defs><radialGradient id="dg'+u+'" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></radialGradient><linearGradient id="db'+u+'" x1="0" x2="1"><stop offset="0" stop-color="#8a6538"/><stop offset=".45" stop-color="#e0bd85"/><stop offset="1" stop-color="#7a5630"/></linearGradient></defs><rect width="400" height="520" fill="#1f1510"/><g>'+Array.from({length:20},function(_,i){return '<rect x="'+(i*20)+'" y="0" width="20" height="520" fill="'+(i%2?'#2a1d15':'#241911')+'"/><line x1="'+(i*20+10)+'" y1="0" x2="'+(i*20+10)+'" y2="520" stroke="#3a281c" stroke-width="1"/>';}).join('')+'</g><circle cx="200" cy="300" r="190" fill="url(#dg'+u+')"/><line x1="200" y1="0" x2="200" y2="200" stroke="#b8925a" stroke-width="2"/><path d="M120 290Q120 200 200 196Q280 200 280 290Z" fill="url(#db'+u+')"/><ellipse cx="200" cy="290" rx="80" ry="10" fill="#fff1d6"/><circle cx="200" cy="302" r="18" fill="#fff7e6"/></svg>';},
music:function(u){return '<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a record and soft sound waves"><defs><radialGradient id="mg'+u+'" r=".6"><stop offset="0" stop-color="#4a3424"/><stop offset="1" stop-color="#150e0a"/></radialGradient></defs><rect width="400" height="520" fill="url(#mg'+u+')"/><g transform="translate(200 240)"><circle r="150" fill="#0f0a07"/>'+Array.from({length:16},function(_,i){return '<circle r="'+(62+i*5.6)+'" fill="none" stroke="#2a1f18" stroke-width="1"/>';}).join('')+'<circle r="56" fill="#b8925a"/><circle r="52" fill="none" stroke="#8a6538"/><circle r="5" fill="#0f0a07"/><path d="M-110-60A130 130 0 0 1-30-126" stroke="rgba(255,240,220,.18)" stroke-width="8" fill="none" stroke-linecap="round"/></g><g stroke="#d8b77f" stroke-width="1.5" fill="none" opacity=".55"><path d="M40 450q20-20 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0"/><path d="M40 470q20-12 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0" opacity=".5"/></g></svg>';}
};
var artUid=0;
function fillArt(el){var k=el.getAttribute('data-art'); if(ART[k]) el.innerHTML=ART[k]('a'+(artUid++));}
$$('[data-art]').forEach(fillArt);
$('#stars').innerHTML=Array.from({length:5},function(_,i){return '<svg viewBox="0 0 24 24" fill="'+(i<4?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.2"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';}).join('');

/* ---------------- shots registry ---------------- */
var SHOTS={};
applyPhotos();
initHeroPhoto();
function applyShot(key,url){
  SHOTS[key]=url;
  $$('[data-shot="'+key+'"]').forEach(function(el){el.style.backgroundImage='url('+url+')';el.classList.add('ready');});
}

/* ---------------- loader ---------------- */
var t0=performance.now();
function finishLoad(){
  var wait=reduced?0:Math.max(0,1700-(performance.now()-t0));
  setTimeout(function(){
    var ld=$('#loader'); ld.classList.add('out'); root.classList.add('ready'); lockScroll(false);
    setTimeout(function(){ld.remove(); if(hasGsap) ScrollTrigger.refresh();},1000);
  },wait);
}
locks=1;
Promise.race([document.fonts?document.fonts.ready:Promise.resolve(),new Promise(function(r){setTimeout(r,2500);})]).then(finishLoad);

/* ---------------- nav + progress ---------------- */
var nav=$('#nav'), bar=$('#progressBar'), fab=$('#fab');
function onScroll(){
  var y=scrollY; nav.classList.toggle('scrolled',y>40);
  var h=root.scrollHeight-innerHeight; bar.style.transform='scaleX('+(h>0?y/h:0)+')';
  fab.classList.toggle('show',y>innerHeight*.6);
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

var burger=$('.burger'), mnav=$('#mnav');
function setMnav(open){
  if(mnav.classList.contains('open')===open) return;
  burger.setAttribute('aria-expanded',String(open)); burger.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  setOpenState(mnav,open); lockScroll(open);
  if(open) setTimeout(function(){var a=$('a',mnav); if(a) a.focus({preventScroll:true});},350);
}
burger.addEventListener('click',function(){setMnav(burger.getAttribute('aria-expanded')!=='true');});

/* page transition */
var curtain=$('#curtain'), busy=false;
function transition(fn){
  if(reduced){fn();return;}
  if(busy) return; busy=true;
  curtain.classList.add('cover');
  setTimeout(function(){
    fn();
    requestAnimationFrame(function(){
      curtain.classList.add('leave'); curtain.classList.remove('cover');
      setTimeout(function(){curtain.style.transition='none';curtain.classList.remove('leave');void curtain.offsetWidth;curtain.style.transition='';busy=false;},650);
    });
  },620);
}
function sectionTop(id){var el=document.getElementById(id); return el?el.getBoundingClientRect().top+scrollY:0;}
$$('[data-nav]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=a.getAttribute('href').slice(1), target=document.getElementById(id); if(!target) return;
    e.preventDefault();
    var go=function(){
      setMnav(false); if(menuOpen) closeMenu(true);
      window.scrollTo(0,sectionTop(id));
      target.setAttribute('tabindex','-1'); target.focus({preventScroll:true});
    };
    var dist=Math.abs(target.getBoundingClientRect().top);
    if(dist<innerHeight*1.3&&!menuOpen){setMnav(false);window.scrollTo({top:sectionTop(id),behavior:reduced?'auto':'smooth'});}
    else transition(go);
  });
});

/* ---------------- reveal + counters ---------------- */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -5% 0px'});
  $$('[data-reveal],.clip,.clip-photo').forEach(function(el){io.observe(el);});
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; cio.unobserve(e.target);
    var el=e.target,to=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0);
    if(reduced){el.textContent=to.toFixed(dec);return;}
    var s=performance.now();
    (function tick(t){var p=clamp((t-s)/1600,0,1);el.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(tick);})(s);
  });},{threshold:.6});
  $$('[data-count]').forEach(function(el){cio.observe(el);});
}else{$$('[data-reveal],.clip,.clip-photo').forEach(function(el){el.classList.add('in');});$$('[data-count]').forEach(function(el){el.textContent=el.dataset.count;});}

/* ---------------- cursor + magnetic ---------------- */
if(!touch&&!reduced){
  root.classList.add('has-cursor');
  var cur=$('.cursor'),dot=$('.c-dot'),ring=$('.c-ring'),label=$('.c-label');
  var mx=-100,my=-100,rx=-100,ry=-100,raf=0;
  var loop=function(){rx=lerp(rx,mx,.2);ry=lerp(ry,my,.2);ring.style.transform='translate('+rx+'px,'+ry+'px)';raf=(Math.abs(rx-mx)+Math.abs(ry-my)>.2)?requestAnimationFrame(loop):0;};
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;dot.style.transform='translate('+mx+'px,'+my+'px)';cur.classList.remove('hide');if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
  document.addEventListener('mouseleave',function(){cur.classList.add('hide');});
  document.addEventListener('pointerover',function(e){
    var t=e.target.closest('[data-cursor],a,button,[role="tab"],input,textarea');
    cur.classList.remove('is-btn','is-label'); label.textContent='';
    if(!t) return;
    if(t.matches('input,textarea')) return;
    var k=t.getAttribute('data-cursor');
    if(k&&!t.matches('a,button')){cur.classList.add('is-label');label.textContent=k.toUpperCase();}
    else cur.classList.add('is-btn');
  });
  $$('.magnetic').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.22)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)';});
    el.addEventListener('pointerleave',function(){el.style.transform='';});
  });
}

/* ---------------- signatures list ---------------- */
var sigList=$('#sigList'), sigInfo=$('#sigInfo'), curDish=-1, stageApi=null, sigTrigger=null;
DISHES.forEach(function(d,i){
  var li=document.createElement('li');
  li.innerHTML='<button type="button" aria-pressed="false"><span class="n">0'+(i+1)+'</span><span>'+d.name+'</span><span class="arr" aria-hidden="true">●</span></button>';
  li.firstChild.addEventListener('click',function(){
    if(sigTrigger&&sigTrigger.isActive!==undefined&&innerWidth>=1024&&!reduced){
      var y=sigTrigger.start+(sigTrigger.end-sigTrigger.start)*((i+.5)/DISHES.length);
      window.scrollTo({top:y,behavior:'smooth'});
    } else setDish(i);
  });
  sigList.appendChild(li);
});
function setDish(i){
  if(i===curDish) return; var first=curDish<0; curDish=i; var d=DISHES[i];
  $$('button',sigList).forEach(function(b,j){b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i));});
  $('#sigNum').textContent='0'+(i+1);
  $('#sigFallback').textContent=d.name;
  var write=function(){$('#sigCat').textContent=d.cat;$('#sigName').textContent=d.name;$('#sigDesc').textContent=d.desc;$('#sigPrice').textContent=inr(d.price);sigInfo.classList.remove('swap');};
  if(first||reduced) write(); else {sigInfo.classList.add('swap');setTimeout(write,280);}
  var stage=$('.sig-stage'), sp=$('#sigPhoto'), url=d.photo?PHOTOS[d.photo]:null;
  sp.classList.remove('on');
  if(url){
    stage.classList.add('has-photo');
    setTimeout(function(){if(curDish!==i)return;sp.style.backgroundImage='url('+url+')';sp.classList.add('on');},first||reduced?0:160);
  } else {
    stage.classList.remove('has-photo');
    if(stageApi) stageApi.show(i);
  }
  if(innerWidth<1024&&!first){var btn=$$('button',sigList)[i];btn.scrollIntoView({behavior:reduced?'auto':'smooth',inline:'center',block:'nearest'});}
}
setDish(0);

/* ---------------- menu preview + page ---------------- */
function inr(n){return '₹'+Number(n).toLocaleString('en-IN');}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var MENU_TOTAL=0;
MENU_GROUPS.forEach(function(g){g.count=0;g.min=Infinity;g.cats.forEach(function(c){c.i.forEach(function(it){g.count++;g.min=Math.min(g.min,it[1]);});});MENU_TOTAL+=g.count;});
function visualURL(v){return v.photo?PHOTOS[v.photo]:SHOTS[v.shot];}
var catList=$('#catList'), hoverPrev=$('#hoverPrev'), hoverShot=$('#hoverShot');
MENU_GROUPS.forEach(function(g){
  var li=document.createElement('li');
  li.innerHTML='<button type="button"><span class="cn">'+esc(g.name)+'</span><span class="cd">'+g.count+' items · from '+inr(g.min)+'</span></button>';
  var b=li.firstChild;
  b.setAttribute('aria-label',g.name+' menu, '+g.count+' items from '+inr(g.min));
  b.addEventListener('click',function(){openMenu(g.id);});
  if(!touch){
    b.addEventListener('pointerenter',function(){var u=visualURL(g.visual); if(u){hoverShot.style.backgroundImage='url('+u+')';hoverShot.style.backgroundColor=g.visual.photo?'#efe7db':'';hoverShot.classList.add('ready');hoverPrev.classList.add('on');}});
    b.addEventListener('pointerleave',function(){hoverPrev.classList.remove('on');});
  }
  catList.appendChild(li);
});
if(!touch){catList.addEventListener('pointermove',function(e){hoverPrev.style.left=(e.clientX+28)+'px';hoverPrev.style.top=(e.clientY-150)+'px';});}

var mpage=$('#menuPage'), mpTabs=$('#mpTabs'), mpPanel=$('#mpPanel'), mpSearch=$('#mpSearch'), menuOpen=false, lastFocus=null, curGroup=MENU_GROUPS[0].id;
mpSearch.placeholder='Search '+MENU_TOTAL+' dishes, drinks or ingredients';
MENU_GROUPS.forEach(function(g){
  var b=document.createElement('button'); b.type='button'; b.setAttribute('role','tab'); b.id='tab-'+g.id; b.dataset.cat=g.id;
  b.setAttribute('aria-controls','mpPanel'); b.textContent=g.name; b.addEventListener('click',function(){selectCat(g.id,true);});
  mpTabs.appendChild(b);
});
mpTabs.addEventListener('keydown',function(e){
  var tabs=$$('[role="tab"]',mpTabs), idx=tabs.indexOf(document.activeElement); if(idx<0) return;
  var n=null; if(e.key==='ArrowRight') n=(idx+1)%tabs.length; if(e.key==='ArrowLeft') n=(idx-1+tabs.length)%tabs.length; if(e.key==='Home') n=0; if(e.key==='End') n=tabs.length-1;
  if(n!==null){e.preventDefault();tabs[n].focus();selectCat(tabs[n].dataset.cat,false);}
});
function hl(text,q){var t=esc(text);if(!q)return t;var i=text.toLowerCase().indexOf(q);if(i<0)return t;return esc(text.slice(0,i))+'<mark>'+esc(text.slice(i,i+q.length))+'</mark>'+esc(text.slice(i+q.length));}
var ITEM_PHOTOS={'Cappuccino':'cappuccino','Latte':'cappuccino','Tiramisu':'tiramisu','Spicy Chicken Tacos':'tacos','Cream Cheese Dimsums':'dimsums','Brownie Frappe':'frappe-photo','Veg Spicy Gochujang':'ramen','Nonveg Spicy Gochujang':'ramen','Dalgona Iced Latte':'dalgona','Iced Matcha Latte':'matcha-tray','Classic Tres Leches':'m-tresleches','Baked Cheesecake Slice':'m-cheesecake'};
function itemHTML(it,q){
  var pop=POPULAR.indexOf(it[0])>-1, ph=ITEM_PHOTOS[it[0]];
  return '<li class="mp-item"><div class="mp-row">'+(ph?'<span class="mp-thumb" aria-hidden="true" style="background-image:url('+PHOTOS[ph]+')"></span>':'')+'<h4>'+hl(it[0],q)+(pop?' <span class="fav">Popular</span>':'')+'</h4><span class="dots" aria-hidden="true"></span><span class="price">'+inr(it[1])+'</span></div>'+(it[2]?'<p>'+hl(it[2],q)+'</p>':'')+'</li>';
}
function secHTML(id,title,items,q){
  return '<section class="mp-sec" id="'+id+'" aria-labelledby="'+id+'-h"><h3 class="mp-sec-title" id="'+id+'-h">'+esc(title)+' <span>'+items.length+(items.length===1?' item':' items')+'</span></h3><ul class="mp-items">'+items.map(function(it){return itemHTML(it,q);}).join('')+'</ul></section>';
}
function paint(h){mpPanel.classList.remove('show'); mpPanel.innerHTML=h; void mpPanel.offsetWidth; mpPanel.classList.add('show');}
function selectCat(id,focusTab){
  var g=MENU_GROUPS.filter(function(x){return x.id===id;})[0]||MENU_GROUPS[0]; curGroup=g.id;
  if(focusTab!==undefined&&mpSearch.value){mpSearch.value='';$('#mpCount').textContent='';}
  mpTabs.classList.remove('dim');
  $$('[role="tab"]',mpTabs).forEach(function(b){var on=b.dataset.cat===g.id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;if(on) b.scrollIntoView({inline:'center',block:'nearest'});});
  mpPanel.setAttribute('aria-labelledby','tab-'+g.id);
  var h='<div><h2 class="mp-cat-title">'+esc(g.name)+'</h2><p class="mp-note">'+esc(g.blurb)+'</p></div>';
  if(g.photos) h+='<div class="mp-photos">'+g.photos.map(function(p){return '<figure><div class="ph" role="img" aria-label="'+esc(p.label)+'" style="background-image:url('+PHOTOS[p.k]+')"></div><figcaption>'+esc(p.label)+'</figcaption></figure>';}).join('')+'</div><p class="mp-photo-note">Photos from the Clubhouse Cafe menu.</p>';
  if(g.cats.length>1) h+='<nav class="mp-jump" aria-label="'+esc(g.name)+' sections">'+g.cats.map(function(c,i){return '<a href="#sec-'+g.id+'-'+i+'">'+esc(c.t)+'</a>';}).join('')+'</nav>';
  h+=g.cats.map(function(c,i){return secHTML('sec-'+g.id+'-'+i,c.t,c.i,'');}).join('');
  h+='<p class="mp-fine">Prices in ₹ as listed on the Clubhouse menu and may change. Please check with the café when ordering.</p>';
  paint(h);
  if(focusTab!==undefined){var top=$('.mp-tabs').offsetTop-70; if(mpage.scrollTop>top) mpage.scrollTop=top;}
}
mpPanel.addEventListener('click',function(e){
  var a=e.target.closest('.mp-jump a'); if(!a) return; e.preventDefault();
  var t=document.getElementById(a.getAttribute('href').slice(1)); if(!t) return;
  mpage.scrollTo({top:t.getBoundingClientRect().top-mpage.getBoundingClientRect().top+mpage.scrollTop-140,behavior:reduced?'auto':'smooth'});
  t.setAttribute('tabindex','-1'); t.focus({preventScroll:true});
});
var searchTimer=0;
mpSearch.addEventListener('input',function(){clearTimeout(searchTimer);searchTimer=setTimeout(runSearch,120);});
mpSearch.addEventListener('keydown',function(e){if(e.key==='Escape'&&mpSearch.value){e.stopPropagation();mpSearch.value='';runSearch();}});
function runSearch(){
  var q=mpSearch.value.trim().toLowerCase();
  if(q.length<2){$('#mpCount').textContent='';if(mpTabs.classList.contains('dim')){mpTabs.classList.remove('dim');selectCat(curGroup);}return;}
  mpTabs.classList.add('dim');
  var h='', total=0, n=0;
  MENU_GROUPS.forEach(function(g){g.cats.forEach(function(c){
    var hits=c.i.filter(function(it){return (it[0]+' '+it[2]).toLowerCase().indexOf(q)>-1;});
    if(hits.length){total+=hits.length;h+=secHTML('res-'+(n++),g.name+' · '+c.t,hits,q);}
  });});
  $('#mpCount').textContent=total?total+(total===1?' match':' matches'):'';
  if(!total) h='<div class="mp-empty"><p>Nothing matches “'+esc(mpSearch.value.trim())+'”</p><span>Try another word, like paneer, latte or pizza.</span></div>';
  paint(h);
}
function openMenu(cat){
  lastFocus=document.activeElement;
  transition(function(){
    setMnav(false); setOpenState(mpage,true); lockScroll(true); menuOpen=true; mpage.scrollTop=0; mpSearch.value=''; $('#mpCount').textContent='';
    selectCat(cat||MENU_GROUPS[0].id); $('#mpClose').focus({preventScroll:true});
  });
}
function closeMenu(instant){
  var f=function(){setOpenState(mpage,false);lockScroll(false);menuOpen=false;if(!instant&&lastFocus&&lastFocus.focus) lastFocus.focus({preventScroll:true});};
  instant?f():transition(f);
}
$$('[data-open-menu]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();openMenu(el.dataset.cat);});});
$('#mpClose').addEventListener('click',function(){closeMenu(false);});
mpage.addEventListener('keydown',function(e){if(rsvOpen) return; if(e.key==='Escape') closeMenu(false); trapTab(e,mpage);});

/* ---------------- gallery + lightbox ---------------- */
var galGrid=$('#galGrid'), lb=$('#lightbox'), lbIdx=0, lbReturn=null;
GALLERY.forEach(function(g,i){
  var b=document.createElement('button'); b.type='button'; b.className='gal-item '+g.size; b.setAttribute('data-cursor','view');
  b.setAttribute('aria-label','Open image: '+g.label);
  b.innerHTML='<div class="vis">'+(g.art?'<div class="art" data-art="'+g.art+'"></div>':g.photo?'<div class="photo" role="img" aria-label="'+g.label+'" style="background-image:url('+PHOTOS[g.photo]+')"></div>':'<div class="shot" data-shot="'+g.shot+'" data-label="'+g.label+'"></div>')+'</div><figcaption>'+g.label+'</figcaption>';
  b.setAttribute('data-reveal',''); b.style.setProperty('--d',(i%3*.08)+'s');
  b.addEventListener('click',function(){openLb(i);});
  galGrid.appendChild(b);
  var a=$('[data-art]',b); if(a) fillArt(a);
  if(io) io.observe(b);
});
function renderLb(){
  var g=GALLERY[lbIdx], fr=$('#lbFrame');
  fr.style.setProperty('--ar',g.size==='tall'?'3/4':g.size==='sq'?'1/1':'4/3');
  if(g.art){fr.innerHTML='<div class="art" data-art="'+g.art+'"></div>';fillArt($('[data-art]',fr));}
  else if(g.photo){fr.innerHTML='<div class="photo" role="img" aria-label="'+g.label+'" style="background-image:url('+PHOTOS[g.photo]+')"></div>';}
  else{fr.innerHTML='<div class="shot" role="img" aria-label="'+g.label+' (3D render)" data-label="'+g.label+'"></div>';var s=$('.shot',fr);if(SHOTS[g.shot]){s.style.backgroundImage='url('+SHOTS[g.shot]+')';s.classList.add('ready');}}
  $('#lbCap').textContent=g.label; $('#lbCount').textContent=(lbIdx+1)+' / '+GALLERY.length;
}
function openLb(i){lbReturn=document.activeElement;lbIdx=i;renderLb();setOpenState(lb,true);lockScroll(true);$('#lbClose').focus();}
function closeLb(){setOpenState(lb,false);lockScroll(false);if(lbReturn) lbReturn.focus({preventScroll:true});}
function stepLb(d){lbIdx=(lbIdx+d+GALLERY.length)%GALLERY.length;renderLb();}
$('#lbClose').addEventListener('click',closeLb);$('#lbPrev').addEventListener('click',function(){stepLb(-1);});$('#lbNext').addEventListener('click',function(){stepLb(1);});
lb.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')stepLb(1);if(e.key==='ArrowLeft')stepLb(-1);trapTab(e,lb);});
var tsx=0; lb.addEventListener('touchstart',function(e){tsx=e.touches[0].clientX;},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tsx;if(Math.abs(dx)>50)stepLb(dx<0?1:-1);});

/* ---------------- reviews ---------------- */
(function(){
  var qs=$$('.quote'), dots=$('#rvDots'), i=0, timer=null;
  qs.forEach(function(_,j){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show review '+(j+1));b.addEventListener('click',function(){go(j);restart();});dots.appendChild(b);});
  function go(j){i=(j+qs.length)%qs.length;qs.forEach(function(q,k){q.classList.toggle('on',k===i);q.setAttribute('aria-hidden',String(k!==i));});$$('button',dots).forEach(function(b,k){b.setAttribute('aria-current',String(k===i));});}
  function restart(){clearInterval(timer);if(!reduced)timer=setInterval(function(){go(i+1);},6500);}
  $('#rvPrev').addEventListener('click',function(){go(i-1);restart();});$('#rvNext').addEventListener('click',function(){go(i+1);restart();});
  var s=$('#rvSlider');s.addEventListener('pointerenter',function(){clearInterval(timer);});s.addEventListener('pointerleave',restart);
  go(0);restart();
})();

/* ---------------- FAB ---------------- */
var fabBtn=$('#fabBtn'), fabMenu=$('#fabMenu');
function setFab(open){fab.classList.toggle('open',open);fabBtn.setAttribute('aria-expanded',String(open));fabMenu.setAttribute('aria-hidden',String(!open));fabMenu.inert=!open;}
fabBtn.addEventListener('click',function(){setFab(!fab.classList.contains('open'));});
document.addEventListener('click',function(e){if(!fab.contains(e.target))setFab(false);});
$$('a,button',fabMenu).forEach(function(el){el.addEventListener('click',function(){setFab(false);});});

/* =====================================================================
   RESERVATION REQUEST
   ===================================================================== */

/* Availability service — DEMO data only.
   Replace getSlots() with a real call, e.g.
     return fetch('/api/availability?date='+dateISO).then(r=>r.json())
   It must resolve to [{ time:'19:30', label:'7:30 PM', status:'available'|'unavailable' }]. */
var AvailabilityService={
  OPEN_MIN:9*60+30, LAST_SEATING_MIN:23*60, STEP:30,
  getSlots:function(dateISO){
    var self=this, now=new Date(), todayISO=toISO(now), nowMin=now.getHours()*60+now.getMinutes();
    var seed=dateISO.split('-').reduce(function(a,b){return a*31+(+b);},7), r=rng(seed), out=[];
    for(var m=self.OPEN_MIN;m<=self.LAST_SEATING_MIN;m+=self.STEP){
      var past=dateISO===todayISO&&m<=nowMin+30;
      var busy=r()<.22;
      out.push({time:pad(Math.floor(m/60))+':'+pad(m%60),label:fmtTime(m),status:(past||busy)?'unavailable':'available'});
    }
    return new Promise(function(res){setTimeout(function(){res(out);},reduced?0:160);});
  }
};
/* Reservation service — simulated until a backend exists.
   Swap submit() for Firebase / Supabase / REST; keep the returned shape. */
var ReservationService={
  submit:function(reservation){
    return new Promise(function(res){setTimeout(function(){res(Object.assign({},reservation,{id:'req_'+Date.now().toString(36),status:'pending',createdAt:new Date().toISOString()}));},1400);});
  }
};
function createReservation(fields){
  return {date:fields.date||null,time:fields.time||null,guests:fields.guests||2,name:fields.name||'',phone:fields.phone||'',specialRequest:fields.specialRequest||'',status:'pending'};
}

function pad(n){return String(n).padStart(2,'0');}
function toISO(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function fromISO(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function fmtTime(m){var h=Math.floor(m/60),mm=m%60,h12=((h+11)%12)+1;return h12+':'+pad(mm)+' '+(h<12?'AM':'PM');}
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function prettyDate(iso,long){var d=fromISO(iso);return d.toLocaleDateString('en-IN',long?{weekday:'long',day:'numeric',month:'long',year:'numeric'}:{weekday:'short',day:'numeric',month:'short'});}

var rsv=$('#rsv'), rsvPanel=$('#rsvPanel'), rsvForm=$('#rsvForm'), rsvDone=$('#rsvDone'), rsvOpen=false, rsvReturn=null, submitting=false;
var state=createReservation({});
var slotsCache=[];
var today=new Date(); today.setHours(0,0,0,0);
var maxDate=new Date(today); maxDate.setDate(maxDate.getDate()+90);
var view=new Date(today.getFullYear(),today.getMonth(),1);
var calFocusISO=toISO(today);

$('#calDow').innerHTML=DOW.map(function(d){return '<span class="cal-dow">'+d+'</span>';}).join('');

function renderCal(focus){
  var y=view.getFullYear(), m=view.getMonth();
  $('#calMonth').textContent=MONTHS[m]+' '+y;
  var first=new Date(y,m,1), offset=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate(), h='';
  for(var i=0;i<offset;i++) h+='<span class="cal-day blank" aria-hidden="true"></span>';
  for(var d=1;d<=days;d++){
    var dt=new Date(y,m,d), iso=toISO(dt), dis=dt<today||dt>maxDate, sel=state.date===iso;
    h+='<button type="button" class="cal-day'+(dt.getTime()===today.getTime()?' today':'')+'" data-iso="'+iso+'" aria-pressed="'+sel+'" aria-label="'+prettyDate(iso,true)+(dis?', unavailable':'')+'"'+(dis?' disabled':'')+' tabindex="-1">'+d+'</button>';
  }
  $('#calGrid').innerHTML=h;
  $('#calPrev').disabled=(y===today.getFullYear()&&m===today.getMonth());
  $('#calNext').disabled=(new Date(y,m+1,1)>maxDate);
  var btns=$$('.cal-day:not([disabled])',$('#calGrid'));
  var target=$('.cal-day[data-iso="'+calFocusISO+'"]:not([disabled])',$('#calGrid'))||$('.cal-day[aria-pressed="true"]',$('#calGrid'))||btns[0];
  if(target){target.tabIndex=0; calFocusISO=target.dataset.iso; if(focus) target.focus();}
}
$('#calPrev').addEventListener('click',function(){view.setMonth(view.getMonth()-1);calFocusISO=toISO(new Date(view.getFullYear(),view.getMonth(),1));renderCal();});
$('#calNext').addEventListener('click',function(){view.setMonth(view.getMonth()+1);calFocusISO=toISO(new Date(view.getFullYear(),view.getMonth(),1));renderCal();});
$('#calGrid').addEventListener('click',function(e){var b=e.target.closest('.cal-day');if(!b||b.disabled)return;chooseDate(b.dataset.iso,true);});
$('#calGrid').addEventListener('keydown',function(e){
  var map={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}; if(!(e.key in map)&&e.key!=='Home'&&e.key!=='End') return;
  e.preventDefault();
  var cur=fromISO(calFocusISO);
  if(e.key==='Home') cur.setDate(cur.getDate()-((cur.getDay()+6)%7));
  else if(e.key==='End') cur.setDate(cur.getDate()+(6-(cur.getDay()+6)%7));
  else cur.setDate(cur.getDate()+map[e.key]);
  if(cur<today) cur=new Date(today); if(cur>maxDate) cur=new Date(maxDate);
  calFocusISO=toISO(cur);
  if(cur.getMonth()!==view.getMonth()||cur.getFullYear()!==view.getFullYear()) view=new Date(cur.getFullYear(),cur.getMonth(),1);
  renderCal(true);
});
function chooseDate(iso,focusBack){
  state.date=iso; calFocusISO=iso; clearErr('fDate');
  if(state.time) state.time=null;
  renderCal(focusBack); loadSlots(); updateSummary();
}

function loadSlots(){
  var wrap=$('#slotGroups');
  if(!state.date){wrap.innerHTML='<p class="slot-empty">Choose a date to see times.</p>';return;}
  wrap.setAttribute('aria-busy','true');
  var reqDate=state.date;
  AvailabilityService.getSlots(reqDate).then(function(slots){
    if(reqDate!==state.date) return;
    slotsCache=slots; wrap.removeAttribute('aria-busy');
    var groups=[['Morning',0,12*60],['Afternoon',12*60,17*60],['Evening',17*60,24*60]], html='', any=false;
    groups.forEach(function(g){
      var list=slots.filter(function(s){var p=s.time.split(':');var m=+p[0]*60+ +p[1];return m>=g[1]&&m<g[2];});
      if(!list.length) return;
      html+='<div class="slot-group"><h4>'+g[0]+'</h4><div class="slots">'+list.map(function(s){
        if(s.status==='available') any=true;
        var sel=state.time===s.time;
        return '<button type="button" class="slot" role="radio" data-time="'+s.time+'" data-status="'+s.status+'" aria-checked="'+sel+'"'+(s.status!=='available'?' aria-disabled="true"':'')+' aria-label="'+s.label+(s.status!=='available'?', unavailable':'')+'" tabindex="-1">'+s.label+'</button>';
      }).join('')+'</div></div>';
    });
    wrap.innerHTML=any?html:'<p class="slot-empty">No demo times left for this day. Try another date or call the café.</p>';
    var focusable=$('.slot[aria-checked="true"]',wrap)||$('.slot[data-status="available"]',wrap); if(focusable) focusable.tabIndex=0;
  });
}
$('#slotGroups').addEventListener('click',function(e){
  var b=e.target.closest('.slot'); if(!b) return;
  if(b.dataset.status!=='available'){announce(b.textContent+' is unavailable. Please choose another time.');return;}
  selectSlot(b);
});
$('#slotGroups').addEventListener('keydown',function(e){
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)<0) return; e.preventDefault();
  var av=$$('.slot[data-status="available"]',this), i=av.indexOf(document.activeElement); if(!av.length) return;
  var n=(e.key==='ArrowLeft'||e.key==='ArrowUp')?i-1:i+1; n=(n+av.length)%av.length; selectSlot(av[n]); av[n].focus();
});
function selectSlot(b){
  state.time=b.dataset.time;
  $$('.slot',$('#slotGroups')).forEach(function(s){var on=s===b;s.setAttribute('aria-checked',String(on));s.tabIndex=on?0:-1;});
  clearErr('fTime'); updateSummary();
}

var GMIN=1,GMAX=12;
function setGuests(n){
  state.guests=clamp(n,GMIN,GMAX);
  var num=$('#gNum'); num.textContent=state.guests; $('#gWord').textContent=state.guests===1?'Guest':'Guests';
  $('#gMinus').disabled=state.guests<=GMIN; $('#gPlus').disabled=state.guests>=GMAX;
  if(!reduced){num.classList.add('bump');setTimeout(function(){num.classList.remove('bump');},180);}
  clearErr('fGuests'); updateSummary();
}
$('#gMinus').addEventListener('click',function(){setGuests(state.guests-1);if(this.disabled)$('#gPlus').focus();});
$('#gPlus').addEventListener('click',function(){setGuests(state.guests+1);if(this.disabled)$('#gMinus').focus();});

var rName=$('#rName'), rPhone=$('#rPhone'), rNote=$('#rNote');
rName.addEventListener('input',function(){state.name=rName.value;if(rName.value.trim())clearErr('fName');});
rPhone.addEventListener('input',function(){state.phone=rPhone.value;if(validPhone(rPhone.value))clearErr('fPhone');});
rPhone.addEventListener('blur',function(){if(rPhone.value&&!validPhone(rPhone.value))setErr('fPhone','ePhone','Enter a valid 10-digit phone number.');});
rNote.addEventListener('input',function(){state.specialRequest=rNote.value;$('#noteCount').textContent=rNote.value.length+' / 300';});

function validPhone(v){var d=String(v).replace(/[^\d]/g,'');return /^(?:91)?0?[1-9]\d{9}$/.test(d);}
function setErr(fid,eid,msg){var f=$('#'+fid);f.classList.add('invalid');$('#'+eid).textContent=msg;var inp=$('input',f);if(inp)inp.setAttribute('aria-invalid','true');}
function clearErr(fid){var f=$('#'+fid);if(!f.classList.contains('invalid'))return;f.classList.remove('invalid');var inp=$('input',f);if(inp)inp.removeAttribute('aria-invalid');if(!$$('.field.invalid',rsvForm).length)$('#formErr').classList.remove('on');}

function updateSummary(){
  var parts=[];
  if(state.date) parts.push('<strong>'+prettyDate(state.date)+'</strong>');
  if(state.time){var s=slotsCache.filter(function(x){return x.time===state.time;})[0];parts.push('<strong>'+(s?s.label:state.time)+'</strong>');}
  parts.push('<strong>'+state.guests+' '+(state.guests===1?'guest':'guests')+'</strong>');
  $('#rsvSummary').innerHTML=(state.date||state.time)?parts.join(' · ')+'<br>Sent as a reservation request for the café to confirm.':'This sends a <strong>reservation request</strong> — the café will confirm your table.';
  $('#bsDate').textContent=state.date?prettyDate(state.date):'Choose a day';
  var sl=slotsCache.filter(function(x){return x.time===state.time;})[0];
  $('#bsTime').textContent=sl?sl.label:'Pick a time';
  $('#bsGuests').textContent=state.guests+' '+(state.guests===1?'Guest':'Guests');
}

function validate(){
  var ok=true, firstBad=null;
  var mark=function(fid,eid,msg,el){setErr(fid,eid,msg);ok=false;if(!firstBad)firstBad=el;};
  if(!state.date||fromISO(state.date)<today) mark('fDate','eDate','Please choose a date.',$('.cal-day[tabindex="0"]')||$('#calNext'));
  if(!state.time) mark('fTime','eTime',state.date?'Please choose an available time.':'Choose a date first, then a time.',$('.slot[tabindex="0"]')||$('#calGrid'));
  else{var s=slotsCache.filter(function(x){return x.time===state.time;})[0];if(!s||s.status!=='available')mark('fTime','eTime','That time is no longer open. Please pick another.',$('.slot[data-status="available"]'));}
  if(!(state.guests>=GMIN&&state.guests<=GMAX)) mark('fGuests','eGuests','Guests must be between 1 and 12.',$('#gPlus'));
  state.name=rName.value.trim(); if(state.name.length<2) mark('fName','eName','Please enter your full name.',rName);
  state.phone=rPhone.value.trim(); if(!state.phone) mark('fPhone','ePhone','Please enter a phone number.',rPhone); else if(!validPhone(state.phone)) mark('fPhone','ePhone','Enter a valid 10-digit phone number.',rPhone);
  var fe=$('#formErr');
  if(!ok){var n=$$('.field.invalid',rsvForm).length;fe.textContent=n===1?'One detail needs attention before sending.':n+' details need attention before sending.';fe.classList.add('on');if(firstBad){firstBad.focus({preventScroll:true});firstBad.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'});}}
  return ok;
}

rsvForm.addEventListener('submit',function(e){
  e.preventDefault(); if(submitting) return;
  if(!validate()) return;
  submitting=true;
  var btn=$('#rsvSubmit'); btn.classList.add('loading'); btn.setAttribute('aria-busy','true'); btn.disabled=true; $('.txt',btn).textContent='Sending request';
  announce('Sending your reservation request');
  var reservation=createReservation({date:state.date,time:state.time,guests:state.guests,name:state.name,phone:state.phone,specialRequest:state.specialRequest.trim()});
  ReservationService.submit(reservation).then(function(saved){
    submitting=false; btn.classList.remove('loading'); btn.removeAttribute('aria-busy'); btn.disabled=false; $('.txt',btn).textContent='Request Reservation';
    showDone(saved);
  });
});

function showDone(r){
  var sl=slotsCache.filter(function(x){return x.time===r.time;})[0];
  var rows=[['Date',prettyDate(r.date)],['Time',sl?sl.label:r.time],['Guests',String(r.guests)],['Name',r.name],['Phone',r.phone]];
  $('#doneSum').innerHTML=rows.map(function(x){var d=document.createElement('div');var dt=document.createElement('dt');dt.textContent=x[0];var dd=document.createElement('dd');dd.textContent=x[1];d.appendChild(dt);d.appendChild(dd);return d.outerHTML;}).join('');
  rsvForm.hidden=true; rsvForm.style.display='none';
  rsvDone.hidden=false; rsvDone.classList.remove('play'); void rsvDone.offsetWidth; rsvDone.classList.add('play');
  $('#rsvTitle').textContent='Request received';
  rsvDone.focus();
  announce('Table request received. Clubhouse Cafe will confirm your table shortly.');
}
function resetForm(){
  state=createReservation({}); slotsCache=[];
  rName.value='';rPhone.value='';rNote.value='';$('#noteCount').textContent='0 / 300';
  $$('.field.invalid',rsvForm).forEach(function(f){f.classList.remove('invalid');});$('#formErr').classList.remove('on');
  view=new Date(today.getFullYear(),today.getMonth(),1); calFocusISO=toISO(today);
  rsvForm.hidden=false; rsvForm.style.display='flex'; rsvDone.hidden=true; rsvDone.classList.remove('play');
  $('#rsvTitle').textContent='Reserve a table';
  setGuests(2); renderCal(); loadSlots(); updateSummary();
}

function openRsv(focusOn){
  if(rsvOpen) return;
  rsvReturn=document.activeElement; setMnav(false); setFab(false);
  if(!rsvDone.hidden) resetForm();
  rsvOpen=true; setOpenState(rsv,true); lockScroll(true);
  var scroller=$('.rsv-scroll',rsv); if(scroller) scroller.scrollTop=0;
  setTimeout(function(){
    var el;
    if(focusOn==='time'){ el=state.date?($('.slot[tabindex="0"]')||$('#slotGroups')):$('.cal-day[tabindex="0"]'); if(!state.date) announce('Choose a date first, then a time.'); if(state.date&&el) el.scrollIntoView({block:'center'});}
    else if(focusOn==='guests'){ el=$('#gPlus'); el.scrollIntoView({block:'center'}); }
    else el=$('.cal-day[tabindex="0"]')||$('.rsv-x',rsv);
    if(el&&el.focus) el.focus({preventScroll:focusOn!=='guests'&&focusOn!=='time'});
  },reduced?0:420);
}
function closeRsv(){
  if(!rsvOpen) return; rsvOpen=false; setOpenState(rsv,false); lockScroll(false);
  if(!rsvDone.hidden) setTimeout(resetForm,650);
  if(rsvReturn&&rsvReturn.focus&&document.contains(rsvReturn)) rsvReturn.focus({preventScroll:true});
}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-reserve]'); if(!t) return; e.preventDefault(); openRsv(t.getAttribute('data-reserve'));
});
$$('[data-rsv-close]',rsv).forEach(function(el){el.addEventListener('click',closeRsv);});
$('#doneBtn').addEventListener('click',closeRsv);
rsv.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();closeRsv();return;}trapTab(e,rsvPanel);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(mnav.classList.contains('open'))setMnav(false);setFab(false);}});
/* swipe down to close on mobile */
(function(){var sy=0,dy=0,drag=false;var h=$('.rsv-head',rsv);
  h.addEventListener('touchstart',function(e){sy=e.touches[0].clientY;dy=0;drag=innerWidth<=860;},{passive:true});
  h.addEventListener('touchmove',function(e){if(!drag)return;dy=Math.max(0,e.touches[0].clientY-sy);rsvPanel.style.transition='none';rsvPanel.style.transform='translateY('+dy+'px)';},{passive:true});
  h.addEventListener('touchend',function(){if(!drag)return;rsvPanel.style.transition='';rsvPanel.style.transform='';if(dy>110)closeRsv();drag=false;});
})();
resetForm();

/* =====================================================================
   THREE.JS — hero cup, signature stage, rendered "photography"
   ===================================================================== */
var T=window.THREE, webgl=false;
try{var tc=document.createElement('canvas');webgl=!!(T&&window.WebGLRenderingContext&&(tc.getContext('webgl')||tc.getContext('experimental-webgl')));}catch(err){webgl=false;}
if(!webgl){root.classList.add('no-webgl');initScroll();return;}

var texCache={}, LATTE_CB=[];
function canvasTex(key,size,draw){
  if(texCache[key]) return texCache[key];
  var c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;texCache[key]=t;return t;
}
function std(color,rough,metal,extra){return new T.MeshStandardMaterial(Object.assign({color:color,roughness:rough==null?.6:rough,metalness:metal||0},extra||{}));}
function lathe(pts,seg){return new T.LatheGeometry(pts.map(function(p){return new T.Vector2(p[0],p[1]);}),seg||64);}
function M(geo,mat){return new T.Mesh(geo,mat);}
function specks(x,s,r,n,cols,a,b){for(var i=0;i<n;i++){x.fillStyle=cols[(r()*cols.length)|0];x.beginPath();x.arc(r()*s,r()*s,a+r()*(b-a),0,Math.PI*2);x.fill();}}

var TX={
  bamboo:function(){return canvasTex('bamboo',512,function(x,s){var r=rng(7);x.fillStyle='#c79d62';x.fillRect(0,0,s,s);for(var i=0;i<s;i+=9){x.fillStyle='rgba('+(80+r()*40|0)+','+(52+r()*20|0)+',26,'+(.14+r()*.22)+')';x.fillRect(i,0,2+r()*3,s);}x.fillStyle='rgba(70,45,22,.4)';x.fillRect(0,s*.2,s,7);x.fillRect(0,s*.78,s,7);});},
  tortilla:function(){return canvasTex('tortilla',256,function(x,s){var r=rng(9);x.fillStyle='#dcaa55';x.fillRect(0,0,s,s);specks(x,s,r,160,['rgba(150,90,30,.35)','rgba(120,70,20,.3)','rgba(245,210,140,.4)'],1,5);});},
  parantha:function(){return canvasTex('parantha',512,function(x,s){var r=rng(13),c=s/2,g=x.createRadialGradient(c,c,10,c,c,c);g.addColorStop(0,'#e4b66c');g.addColorStop(.8,'#cf9449');g.addColorStop(1,'#a8702f');x.fillStyle=g;x.fillRect(0,0,s,s);x.strokeStyle='rgba(140,85,30,.25)';for(var i=1;i<12;i++){x.lineWidth=1+r()*2;x.beginPath();x.arc(c+(r()-.5)*8,c+(r()-.5)*8,i*20,0,6.283);x.stroke();}specks(x,s,r,220,['rgba(110,60,20,.5)','rgba(80,45,15,.45)','rgba(250,220,160,.4)'],2,7);});},
  bhaji:function(){return canvasTex('bhaji',512,function(x,s){var r=rng(17);x.fillStyle='#b3472a';x.fillRect(0,0,s,s);specks(x,s,r,600,['#c85a30','#9c3a20','#d0703a','#7a2d18'],3,12);specks(x,s,r,120,['#4f8a3a','#6ba24a','#3f7430'],2,5);specks(x,s,r,60,['rgba(250,210,120,.6)'],3,9);});},
  galouti:function(){return canvasTex('galouti',256,function(x,s){var r=rng(19);x.fillStyle='#6b4428';x.fillRect(0,0,s,s);specks(x,s,r,400,['#4f301b','#7d5433','#3b2414','#8f6540'],1,4);});},
  wood:function(){return canvasTex('wood',512,function(x,s){var r=rng(23);x.fillStyle='#6a4a33';x.fillRect(0,0,s,s);for(var i=0;i<70;i++){x.strokeStyle='rgba('+(40+r()*30|0)+',25,15,'+(.15+r()*.25)+')';x.lineWidth=1+r()*3;x.beginPath();var y=r()*s;x.moveTo(0,y);x.bezierCurveTo(s*.3,y+(r()-.5)*20,s*.6,y+(r()-.5)*20,s,y+(r()-.5)*10);x.stroke();}});},
  pav:function(){return canvasTex('pav',256,function(x,s){var r=rng(29),g=x.createLinearGradient(0,0,0,s);g.addColorStop(0,'#b87434');g.addColorStop(.35,'#dba35c');g.addColorStop(1,'#e8c48a');x.fillStyle=g;x.fillRect(0,0,s,s);specks(x,s,r,120,['rgba(120,70,25,.3)','rgba(250,225,170,.5)'],1,4);});},
  soft:function(){return canvasTex('soft',128,function(x,s){var g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,248,236,1)');g.addColorStop(.4,'rgba(255,248,236,.45)');g.addColorStop(1,'rgba(255,248,236,0)');x.fillStyle=g;x.fillRect(0,0,s,s);});},
  shadow:function(){return canvasTex('shadow',256,function(x,s){var g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(.45,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,s,s);});},
  bg:function(kind){return canvasTex('bg-'+kind,512,function(x,s){var r=rng(kind==='sand'?31:37),g=x.createRadialGradient(s*.5,s*.4,s*.02,s*.5,s*.5,s*.75);
    if(kind==='sand'){g.addColorStop(0,'#f1e8da');g.addColorStop(.5,'#d8c4a5');g.addColorStop(1,'#9d8061');}
    else{g.addColorStop(0,'#664632');g.addColorStop(.45,'#2e1f16');g.addColorStop(1,'#0e0906');}
    x.fillStyle=g;x.fillRect(0,0,s,s);for(var i=0;i<5000;i++){x.fillStyle='rgba('+(kind==='sand'?'60,40,20':'255,240,220')+','+(r()*.05)+')';x.fillRect(r()*s,r()*s,1,1);}});}
};

function makeRenderer(canvas,maxDpr,opts){
  var rr=new T.WebGLRenderer(Object.assign({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'},opts||{}));
  rr.setPixelRatio(Math.min(window.devicePixelRatio||1,maxDpr));
  rr.toneMapping=T.ACESFilmicToneMapping;rr.toneMappingExposure=1.05;rr.outputEncoding=T.sRGBEncoding;rr.setClearColor(0x000000,0);
  return rr;
}
function envFor(rr){
  var pm=new T.PMREMGenerator(rr), s=new T.Scene();
  var sky=canvasTex('envsky',256,function(x,sz){var g=x.createLinearGradient(0,0,0,sz);g.addColorStop(0,'#fff0d8');g.addColorStop(.45,'#7d5a3f');g.addColorStop(1,'#140d08');x.fillStyle=g;x.fillRect(0,0,sz,sz);});
  s.add(M(new T.SphereGeometry(10,32,16),new T.MeshBasicMaterial({map:sky,side:T.BackSide})));
  var lm=new T.MeshBasicMaterial({color:0xfff2dc});
  [[4,6,3,4,.3,2],[-6,3,-1,.3,3,5],[0,5,-6,6,.3,2]].forEach(function(b){var m=M(new T.BoxGeometry(b[3],b[4],b[5]),lm);m.position.set(b[0],b[1],b[2]);m.lookAt(0,0,0);s.add(m);});
  var tex=pm.fromScene(s,.04).texture; pm.dispose(); return tex;
}
function addLights(scene,bright){
  scene.add(new T.HemisphereLight(0xfff0dc,0x2a1a10,bright?.55:.4));
  var key=new T.DirectionalLight(0xffd6a0,bright?1.6:1.9);key.position.set(3,6,4);scene.add(key);
  var rim=new T.DirectionalLight(0xd8a868,1.1);rim.position.set(-4,3,-4);scene.add(rim);
  var fill=new T.DirectionalLight(0xbfd0e0,.25);fill.position.set(-5,1,4);scene.add(fill);
}
function shadowMesh(size,op){var m=M(new T.PlaneGeometry(size,size),new T.MeshBasicMaterial({map:TX.shadow(),transparent:true,depthWrite:false,opacity:op||.8}));m.rotation.x=-Math.PI/2;m.position.y=.004;return m;}
function plate(r,color){return M(lathe([[0,0],[r*.68,0],[r*.94,.07],[r,.14],[r*.97,.165],[r*.9,.11],[r*.68,.05],[0,.05]],72),std(color,.42,.05,{side:T.DoubleSide}));}

/* ---- builders ---- */
var BUILDERS={dimsum:buildDimsum,tacos:buildTacos,frappe:buildFrappe,fondue:buildFondue,galouti:buildGalouti};

function disposeTree(o){o.traverse(function(m){if(m.geometry)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(function(mt){mt.dispose();});});}
function visibleLoop(el,fn){
  var running=false,raf=0,last=0;
  function frame(now){var dt=Math.min(.05,(now-last)/1000||0);last=now;fn(dt);if(running)raf=requestAnimationFrame(frame);}
  function start(){if(running||reduced)return;running=true;last=performance.now();raf=requestAnimationFrame(frame);}
  function stop(){running=false;cancelAnimationFrame(raf);}
  new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting&&!document.hidden?start():stop();});},{rootMargin:'80px'}).observe(el);
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else if(el.getBoundingClientRect().bottom>0&&el.getBoundingClientRect().top<innerHeight)start();});
  return {once:function(){fn(0);}};
}
var mouse={x:0,y:0};
if(!touch) addEventListener('pointermove',function(e){mouse.x=(e.clientX/innerWidth-.5)*2;mouse.y=(e.clientY/innerHeight-.5)*2;},{passive:true});

/* ---- stage ---- */
function initStage(){
  var canvas=$('#stageCanvas'),rr=makeRenderer(canvas,1.75),scene=new T.Scene();
  scene.environment=envFor(rr);addLights(scene);
  var cam=new T.PerspectiveCamera(30,1,.1,100);cam.position.set(0,3.3,7.6);cam.lookAt(0,.75,0);
  var holder=new T.Group();scene.add(holder);
  var CFG={dimsum:{s:1,y:.1},tacos:{s:1,y:.1},frappe:{s:.95,y:-.4},fondue:{s:.82,y:0},galouti:{s:.98,y:.15}};
  var groups=DISHES.map(function(d,i){var w=new T.Group();w.add(BUILDERS[d.key]());w.scale.setScalar(CFG[d.key].s);w.position.y=CFG[d.key].y;w.visible=i===0;holder.add(w);return w;});
  var cur=0,st={x:0,y:0},t=0,drag=null,spin=0;
  function layout(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;rr.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  var loop=visibleLoop(canvas,function(dt){
    t+=dt;st.x=lerp(st.x,mouse.x,.05);st.y=lerp(st.y,mouse.y,.05);
    spin*=.94;holder.rotation.y+=dt*.28+spin;holder.rotation.x=lerp(holder.rotation.x,.06+st.y*.08,.1);holder.position.y=Math.sin(t*1.2)*.05;
    rr.render(scene,cam);
  });
  canvas.parentElement.addEventListener('pointerdown',function(e){drag=e.clientX;});
  addEventListener('pointerup',function(){drag=null;});
  canvas.parentElement.addEventListener('pointermove',function(e){if(drag===null)return;spin=(e.clientX-drag)*.0016;drag=e.clientX;});
  layout();loop.once();
  addEventListener('resize',function(){layout();loop.once();});
  return {show:function(i){
    if(i===cur)return;var from=groups[cur],to=groups[i],s1=CFG[DISHES[i].key].s;cur=i;
    groups.forEach(function(g,j){if(j!==i&&g!==from)g.visible=false;});
    if(!hasGsap||reduced){from.visible=false;to.visible=true;to.scale.setScalar(s1);to.rotation.y=0;loop.once();return;}
    gsap.killTweensOf([from.scale,from.rotation,to.scale,to.rotation]);
    gsap.to(from.scale,{x:.001,y:.001,z:.001,duration:.45,ease:'power3.in',onComplete:function(){if(groups[cur]!==from)from.visible=false;}});
    gsap.to(from.rotation,{y:from.rotation.y+1.4,duration:.45,ease:'power3.in'});
    to.visible=true;to.scale.setScalar(.001);to.rotation.y=-1.6;
    gsap.to(to.scale,{x:s1,y:s1,z:s1,duration:.9,delay:.3,ease:'back.out(1.4)'});
    gsap.to(to.rotation,{y:0,duration:1.1,delay:.3,ease:'power3.out'});
  }};
}

/* ---- rendered photography ---- */
function makeShots(){
  var off;try{off=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){return;}
  off.setPixelRatio(1);off.toneMapping=T.ACESFilmicToneMapping;off.toneMappingExposure=1.05;off.outputEncoding=T.sRGBEncoding;
  var env=envFor(off);
  var jobs=[
    ['galouti',BUILDERS.galouti,{cam:[.4,4.4,4.2],look:[0,.1,0],bg:'dark',w:900,h:980}],
    ['fondue',BUILDERS.fondue,{cam:[0,3.6,5.6],look:[0,.7,0],bg:'sand',w:760,h:1000}]
  ];

  var idle=window.requestIdleCallback?function(f){requestIdleCallback(f,{timeout:600});}:function(f){setTimeout(f,40);};
  var i=0;
  (function next(){
    if(i>=jobs.length){off.dispose();return;}
    var job=jobs[i++],o=job[2],w=o.w,h=o.h;
    off.setSize(w,h,false);
    var sc=new T.Scene();sc.background=TX.bg(o.bg);sc.environment=env;addLights(sc,o.bg==='sand');
    var obj=job[1]();sc.add(obj);
    var cam=new T.PerspectiveCamera(30,w/h,.1,100);cam.position.set(o.cam[0],o.cam[1],o.cam[2]);cam.lookAt(o.look[0],o.look[1],o.look[2]);
    off.render(sc,cam);
    applyShot(job[0],off.domElement.toDataURL('image/jpeg',.86));
    disposeTree(obj);
    idle(next);
  })();
}

try{stageApi=initStage();}catch(e){console.warn('Stage 3D unavailable',e);root.classList.add('no-webgl');}
setTimeout(function(){try{makeShots();}catch(e){console.warn('Renders unavailable',e);}},reduced?0:300);
initScroll();

/* ---------------- GSAP scroll choreography ---------------- */
function initScroll(){
  if(!hasGsap||reduced) return;
  var mm=gsap.matchMedia();
  mm.add('(min-width: 1024px)',function(){
    var n=DISHES.length;
    sigTrigger=ScrollTrigger.create({trigger:'#signatures',start:'top top',end:function(){return '+='+innerHeight*n*.75;},pin:'.sig-pin',scrub:true,onUpdate:function(s){setDish(Math.min(n-1,Math.floor(s.progress*n)));}});
    var track=$('#expTrack');
    gsap.to(track,{x:function(){return -(track.scrollWidth-innerWidth);},ease:'none',scrollTrigger:{trigger:'#experience',start:'top top',end:function(){return '+='+(track.scrollWidth-innerWidth);},pin:true,scrub:.8,invalidateOnRefresh:true}});
    gsap.to('.hero-content',{yPercent:-14,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.utils.toArray('[data-parallax]').forEach(function(el){gsap.fromTo(el,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}});});
    return function(){sigTrigger=null;};
  });
}
})();
