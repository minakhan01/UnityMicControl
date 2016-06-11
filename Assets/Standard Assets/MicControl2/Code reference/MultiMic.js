#pragma strict

//Place here the 'controllers' you want to call loudness from in the inspector 
 var micController:GameObject; 
 var micController2:GameObject;  

  var amp1:float=1; 
  var amp2:float=1;
 
 function Update(){ 
//each ldness value will call from a different controller, in order to receive that controller's microphone's data
 var ldness: float = micController.GetComponent(MicControl).loudness; 
 var ldness2: float = micController2.GetComponent(MicControl).loudness; 


 transform.localScale= Vector3(1+ldness2*amp2,1+ldness*amp1,1);

 }