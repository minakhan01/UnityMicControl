#pragma strict

var MicController:GameObject;


function Start () {
//wait till the end of the frame, so that we make sure that the controller is catched properly.
yield WaitForEndOfFrame();

//first we stop the Microphone 
MicController.GetComponent(MicControl).StopMicrophone();


//then we make a manual call to the MicController's initializer.
MicController.GetComponent(MicControl).InitMic();


}