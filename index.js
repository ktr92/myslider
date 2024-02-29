

document.querySelectorAll("[data-myslider='slidercontainer']").forEach($sliderwrapper => {
  const settings = {
    slides: 3,
    dots: true,
    swipe: true
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

  let position = $slider.style.left
  let sliderRest = slidesCount - settings.slides
  let currentSlideId = 0
  const move = (dir, step) => {
      if (dir === 'next') {
        if (sliderRest > 0) {
          position = position - slideWIdth * step
          sliderRest -= 1
          currentSlideId += step
        }
      }
      if (dir === 'prev') {
        if (sliderRest < slidesCount - settings.slides) {
          position = position + slideWIdth * step
          sliderRest += 1
          currentSlideId -= step
        }
      }
      $slider.style.left = position + 'px'
    }


  const $next = $sliderwrapper.querySelector("[data-myslider='next']")
  $next.addEventListener('click', () => {
    move('next', 1)
  });

  const $prev = $sliderwrapper.querySelector("[data-myslider='prev']")
  $prev.addEventListener('click', () => {
    move('prev', 1)   
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
              move('prev', currentId - slideId)   
            } else {
              move('next', slideId - currentId)   
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

 


})