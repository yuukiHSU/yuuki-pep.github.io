Vue.component('product', {
    props: {
      premium: {
        type: Boolean,
        required: true
      }
    },
    template: `
     <div class="product">
          
        <div class="product-image">
          <img :src="image">
        </div>
  
        <div class="product-info">
            <h1>{{ product }}</h1>
            <p v-if="inStock">有現貨</p>
            <p v-else>待補貨</p>
            <p>運費: {{ shipping }}</p>
  
            <ul>
              <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
            </ul>
  
            <div class="color-box"
                 v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)"
                 >
            </div> 
  
            <button @click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            加入購物車
            </button>
  
         </div> 
         
         <product-review @review-submitted="addReview"></product-review>
      
      </div>
     `,
    data() {
      return {
          product: '火具',
          
          selectedVariant: 0,
          details: ['克維拉火布', '航空級鋁材', '羽球握把布'],
          variants: [
            {
              variantId: 2234,
              variantColor: 'orange',
              variantImage: './assets/火長棍.jpg',
              variantQuantity: 10     
            },
            {
              variantId: 2235,
              variantColor: 'yellow',
              variantImage: './assets/火球.jpg',
              variantQuantity: 0     
            }
          ],
          reviews: []
      }
    },
      methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {  
            this.selectedVariant = index
        },
        addReview(productReview) {
          this.reviews.push(productReview)
        }
      },
      computed: {
          title() {
              return this.brand + ' ' + this.product  
          },
          image(){
              return this.variants[this.selectedVariant].variantImage
          },
          inStock(){
              return this.variants[this.selectedVariant].variantQuantity
          },
          shipping() {
            if (this.premium) {
              return "免費"
            }
              return 60
          }
      }
  })


  Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">姓名:</label>
          <input class="name" v-model="name">
        </p>
        
        <p>
          <label for="review">評論:</label>      
          <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
          <label for="rating">評價:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>
            
        <p>
          <input type="submit" value="Submit">  
        </p>    
      
    </form>
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        errors: []
      }
    },
    methods: {
      onSubmit() {
        if (this.name && this.review && this.rating) {
          let productReview = {
            name: this.name,
            review: this.review,
            rating: this.rating
          }
          this.$emit('review-submitted', productReview)
          this.name = null
          this.review = null
          this.rating = null
        } else {
          if (!this.name) this.errors.push("Name required.")
          if (!this.review) this.errors.push("Review required.")
          if (!this.rating) this.errors.push("Rating required.")
        }
      }
    }
  })
  
  var app = new Vue({
      el: '#app',
      data: {
        premium: true,
        cart: []
      },
      methods: {
        updateCart(id) {
          this.cart.push(id)
        }
      }
  })