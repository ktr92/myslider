class Myslider {
  constructor(selector, settings) {
    this.settings = settings
    this.slidesVisible = settings.slides ?? 1
    this.screen = 1920
    this.$el = document.querySelector(selector) 
    this.$slider = this.$el.querySelector("[data-myslider='slider']")
    this.$next = this.$el.querySelector("[data-myslider='next']")
    this.$prev = this.$el.querySelector("[data-myslider='prev']")
    this.$dots = this.$el.querySelector("[data-myslider='dots']")
    this.dotsItems = null
    this.activeId = 0
    this.slideWIdth =  this.$el.offsetWidth / this.slidesVisible
    this.slidesCount = this.$slider.querySelectorAll("[data-myslider='slide']").length
    this.sectionCount = Math.ceil(this.slidesCount / this.slidesVisible)
    this.position = this.$slider.style.left
    this.responsive = settings.responsive ?? null
    this.sliderInit()
  }


  sliderInit() {
    this.sizeInit()
    if (this.$next && this.$prev) {
      this.arrowsInit()
    }
    if (this.$dots) {
      this.dotsInit()
    }
    if (this.responsive && this.responsive.length > 0) {
      this.responsive.unshift({width: this.screen, slides: this.settings.slides ?? 1})
    }
    this.initSwipe()

    window.addEventListener('resize', () => {
      this.sizeInit()
    })
  }

  arrowsInit() {
    this.$next.addEventListener('click', () => {
      this.activateSlide(this.activeId + 1)
    });

    this.$prev.addEventListener('click', () => {
      this.activateSlide(this.activeId - 1)
    });
  }
  
  sizeInit() {
    if (this.responsive && this.responsive.length) {
      this.responsive.forEach((size, index) => {
        if (size.width > window.innerWidth) {
          this.screen = size.width
          this.slidesVisible = size.slides
        }
      })
    }
    
    this.slideWIdth = this.$el.offsetWidth / this.slidesVisible

    let index = 0
    this.$slider.style.width = this.slideWIdth * this.slidesCount + 'px'
    this.$slider.querySelectorAll("[data-myslider='slide']").forEach($slide => {
      $slide.style.width =  this.slideWIdth + 'px'
      $slide.dataset.mysliderid = index
      index++
    })
  }

  dotsInit() {
  
    for (let i = 0; i < this.sectionCount; i++) {
      this.$dots.insertAdjacentHTML('beforeend', `<div class="myslider__dots__button" data-mysliderdot="${i * (this.slidesVisible)}" data-myslider='dot'></div>`)
    }
    document.querySelector("[data-myslider='dot']").classList.add('active')
    const dots = document.querySelectorAll('[data-mysliderdot]')


    dots.forEach(el => {
      el.addEventListener('click', (e) => {
        const id = +e.target.dataset.mysliderdot
        if (id < this.slidesCount - (this.slidesVisible - 1)) {
          this.activateSlide(id)

        } else {
          this.activateSlide(this.slidesCount - this.slidesVisible)

        }
      })
    })

    this.dotsItems = dots
  }

  activateDot(dots, id) {
    const activeDot = document.querySelector(`[data-mysliderdot="${id}"]`)
    if (activeDot) {
      dots.forEach(dot => {
        dot.classList.remove('active')
      })
      activeDot.classList.add('active')
    }
  } 

 

  activateSlide(n) {
    if (n < 0) {
      this.position = this.slideWIdth * (this.slidesCount - this.slidesVisible)
      this.$slider.style.left = -this.position + 'px'
      this.activeId = this.slidesCount - this.slidesVisible
     } else {
      if (n < this.slidesCount - (this.slidesVisible - 1)) {
        this.position = this.slideWIdth * n
        this.$slider.style.left = -this.position + 'px'
        this.activeId = n
       } else {
        this.$slider.style.left = 0
        this.activeId = 0
       }
     }

     this.activateDot(this.dotsItems, this.activeId)

  }

  initSwipe() {
       let initialX = null;
       let initialY = null;    

       const startTouch = (e) => {
         initialX = e.touches[0].clientX;
         initialY = e.touches[0].clientY;
       };     

       const moveTouch = (e) => {
         if (initialX === null) {
           return;
         } 

         if (initialY === null) {
           return;
         }  

         let currentX = e.touches[0].clientX;
         let currentY = e.touches[0].clientY;    
         let diffX = initialX - currentX;
         let diffY = initialY - currentY;
    
         if (Math.abs(diffX) > Math.abs(diffY)) {
           if (diffX > 0) {
            this.activateSlide(this.activeId + 1)
           } else {
            this.activateSlide(this.activeId - 1)
           }  
         } 
     
         initialX = null;
         initialY = null;
     
         e.preventDefault();
       };

       this.$slider.addEventListener("touchstart", startTouch, false);
       this.$slider.addEventListener("touchmove", moveTouch, false);
  }

}

const slider = new Myslider("[data-myslider='slidercontainer']", {
  slides: 3,
  responsive: [
    {
      width: 992,
      slides: 2
    },
    {
      width: 480,
      slides: 1
    }
  ]
})
