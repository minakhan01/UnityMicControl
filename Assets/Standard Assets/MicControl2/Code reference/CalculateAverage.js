#pragma strict

//Place here the 'controllers' you want to call loudness from in the inspector 
 var micController:GameObject; 
 var micController2:GameObject;  

 function Update(){ 
//Add a variable that calls the loudness value for each controller.
 var ldness: float = micController.GetComponent(MicControl).loudness; 
 var ldness2: float = micController2.GetComponent(MicControl).loudness; 


  //calculate average
  var avarage:float= (ldness+ldness2)/2;

//this average value will contain the calculated average loudness between two controllers.
//to calculate the average of even more controllers, simply add more controller variables, let a variable call to their loudness.
//add them up together and device by the number of controllers used.

 }