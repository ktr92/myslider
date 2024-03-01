class Myslider {
  constructor(selector, settings) {
    this.settings = settings
    this.$el = document.querySelector(selector) 
    this.$slider = this.$el.querySelector("[data-myslider='slider']")
    this.activeId = 0
    this.slideWIdth = window.innerWidth / this.settings.slides
    this.slidesCount = this.$slider.querySelectorAll("[data-myslider='slide']").length
    this.sectionCount = Math.ceil(this.slidesCount / this.settings.slides)
    this.dots = this.createDots()
    this.position = this.$slider.style.left
    this.sliderInit()
  }

  sliderInit() {
    let index = 0
    this.$slider.style.width = this.slideWIdth * this.slidesCount + 'px'
    this.$slider.querySelectorAll("[data-myslider='slide']").forEach($slide => {
      $slide.style.width =  this.slideWIdth + 'px'
      $slide.dataset.mysliderid = index
      index++
    })

    const $next = this.$el.querySelector("[data-myslider='next']")
    $next.addEventListener('click', () => {
      this.activateSlide(this.activeId + 1)
    });

    const $prev = this.$el.querySelector("[data-myslider='prev']")
    $prev.addEventListener('click', () => {
      this.activateSlide(this.activeId - 1)
    });

  }

  createDots() {
    const $dots = this.$el.querySelector("[data-myslider='dots']")
    for (let i = 0; i < this.sectionCount; i++) {
      $dots.insertAdjacentHTML('beforeend', `<div class="myslider__dots__button" data-mysliderdot="${i * (this.settings.slides-1)}" data-myslider='dot'></div>`)
    }
    document.querySelector("[data-myslider='dot']").classList.add('active')
    return $dots
  }

  activateSlide(n) {
    if (n < 0) {
      this.position = this.slideWIdth * (this.slidesCount - this.settings.slides)
      this.$slider.style.left = -this.position + 'px'
      this.activeId = this.slidesCount - this.settings.slides
     } else {
      if (n < this.slidesCount - (this.settings.slides - 1)) {
        this.position = this.slideWIdth * n
        this.$slider.style.left = -this.position + 'px'
        this.activeId = n
       } else {
        this.$slider.style.left = 0
        this.activeId = 0
       }
     }

     console.log(this)
  }

}

const slider = new Myslider("[data-myslider='slidercontainer']", {
  slides: 3
})
console.log(slider)

/* 
document.querySelectorAll("[data-myslider='slidercontainer']").forEach($sliderwrapper => {
  const settings = {
    slides: 3,
    dots: true,
    swipe: true
  }
  const state = {
    currentSlide: 0,
    currentSection: 1,
    sectionRest: 0,
    slidesRest: 0,
    slidesPrev: 0,
    slidesCount: 0,
    sectionsCount: 0,
    slidesOver: 0
  }
  const $slider = $sliderwrapper.querySelector("[data-myslider='slider']")
  let slideWIdth =  window.innerWidth / settings.slides
  let slidesCount = $slider.querySelectorAll("[data-myslider='slide']").length
  const sectionCount = Math.ceil(slidesCount / settings.slides)
  $slider.style.width = slideWIdth * slidesCount + 'px'
  let index = 0
  $slider.querySelectorAll("[data-myslider='slide']").forEach($slide => {
    $slide.style.width =  slideWIdth + 'px'
    $slide.dataset.mysliderid = index
    index++
  })


  state.sectionsCount = Math.ceil(slidesCount / settings.slides)

  state.sectionRest = Math.floor(slidesCount / settings.slides)

  state.slidesOver = slidesCount - Math.ceil(slidesCount / state.sectionRest)

  let position = $slider.style.left
  state.slidesRest = slidesCount - 1
  console.log(state)
  const move = (dir, step, isarrow = false) => {
      if (dir === 'next') {
        if (state.slidesRest > 0) {
          if (isarrow && state.slidesCount >= settings.slides - 1 ) {
            const $dotnext = document.querySelector("[data-myslider='dot'].active")
            $dotnext.classList.remove('active')
            $dotnext.nextElementSibling.classList.add('active')
            state.currentSection += 1
            state.slidesCount = 0
          } else {
            state.slidesCount += step

          }
          if (state.slidesRest < step) {
            step -= state.slidesRest
          }
          position = position - slideWIdth * step
          state.slidesRest -= step
          state.currentSlide += step
          state.slidesPrev += step
        }
       
      }
      if (dir === 'prev') {
        if (state.slidesPrev > 0 ) {
          if (isarrow && state.slidesCount <= settings.slides - 1 && state.currentSection > 1) {
            const $dotprev = document.querySelector("[data-myslider='dot'].active")
            $dotprev.classList.remove('active')
            $dotprev.previousElementSibling.classList.add('active')
            state.currentSection -= 1
            state.slidesCount = settings.slides - 1
          }else {
            state.slidesCount -= step

          }
          if (state.slidesRest < step) {
            step -= state.slidesRest
          }
          position = position + slideWIdth * step
          state.slidesRest += step
          state.currentSlide -= step
          state.slidesPrev -= step
        
        }
      
      }
      console.log(state)
      $slider.style.left = position + 'px'
    }



  const $next = $sliderwrapper.querySelector("[data-myslider='next']")
  $next.addEventListener('click', () => {
    move('next', 1, true)
  });

  const $prev = $sliderwrapper.querySelector("[data-myslider='prev']")
  $prev.addEventListener('click', () => {
    move('prev', 1, true)   
  });

  if (settings.dots) {
    (function generateDots() {
      const $dots = $sliderwrapper.querySelector("[data-myslider='dots']")
      for (let i = 0; i < sectionCount; i++) {
        $dots.insertAdjacentHTML('beforeend', `<div class="myslider__dots__button" data-mysliderdot="${i * (settings.slides-1)}" data-myslider='dot'></div>`)
      }
      document.querySelector("[data-myslider='dot']").classList.add('active')
      $dots.addEventListener('click', (e) => {
        if (e.target instanceof HTMLElement) {
          const $el = e.target
          if ($el.dataset.mysliderdot) {
            const slideId =  $el.dataset.mysliderdot
            const currentId = document.querySelector("[data-myslider='dot'].active").dataset.mysliderdot
            document.querySelectorAll("[data-myslider='dot']").forEach(dot => {
              dot.classList.remove('active')
            })
            $el.classList.add('active')

            if (currentId > slideId) {
              move('prev', currentId - slideId, false)  
              state.currentSection -= 1
             
            } else {
              move('next', slideId - currentId, false)   
              state.currentSection += 1
            } 

          }
        }
      })
    })()
  }



  if (settings.swipe) {
    (function swipe(){

      $sliderwrapper.addEventListener("touchstart", startTouch, false);
      $sliderwrapper.addEventListener("touchmove", moveTouch, false);
     
       // Swipe Up / Down / Left / Right
       let initialX = null;
       let initialY = null;
     
       function startTouch(e) {
         initialX = e.touches[0].clientX;
         initialY = e.touches[0].clientY;
       };
     
       function moveTouch(e) {
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
             move('next')
           } else {
             move('prev')
           }  
         } 
     
         initialX = null;
         initialY = null;
     
         e.preventDefault();
       };
     }())
  }

 


}) */