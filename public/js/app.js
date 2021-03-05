'use script';
console.log('app.js is connected');

// //Photo carousel
var slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName('mySlides');
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1;}
  slides[slideIndex-1].style.display = 'block';
  setTimeout(showSlides, 5000); // Change image every 2 seconds
}

function BMI(weight, height){
  this.kg = (0.453592)*weight;
  this.m2 = ((0.0254)*height)((0.0254)*height);
  this.bmi = this.kg/this.m2;
} 
