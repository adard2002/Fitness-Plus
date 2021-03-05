'use script';

function BMI(weight, height){
  this.kg = weight*.453592;
  this.m = height*.0254;
  this.m2 = this.m*this.m;
  this.bmi = this.kg/this.m2;
  this.round = Math.round(this.bmi * 10) / 10;
} 


BMI.prototype.render = function(){
        
  var footer = document.getElementById('footer');
  var appear = document.createElement('h3');
  appear.textContent = "Height = " + Math.round(this.m * 10) / 10 + "m, " 
  + "Weight = " + Math.round(this.kg * 10) / 10 + "kg, " 
  + "BMI = " + this.round;
  footer.appendChild(appear);
}

function handleBMISubmit(event) {
  event.preventDefault();
  var weightInput = document.getElementById('weight');
  var weightValue = weightInput.value;
  var heightInput = document.getElementById('height');
  var heightValue = heightInput.value;
  var newBMI = new BMI(parseFloat(weightValue), parseFloat(heightValue));
  newBMI.render();
  var form = document.getElementById("bmiform");
  form.reset();
}

var formElement = document.getElementById('bmiform');

formElement.addEventListener('submit', handleBMISubmit);

