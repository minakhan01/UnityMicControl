-----------------------------------------------------
Original source code (java) created by Mark Duisters.
-----------------------------------------------------
C# users be sure to move the MicControl folder into Standard Assets or Plugins folder so you can call the loudness and rawInput value correctly.
#"Make sure you are NOT in WEBPLAYER mode". If you want to develop for the web setup everything in "standalone mode", or go to Chapter 4: WebPlayer Setup.
" Note that Webplayer support will be dropped in the future as it will be soon depricated by Unity.

~~ How To Setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Go to GameObject-Audio-MicControl.
2. The controller will be placed in the Scene.
3. You can now use "micController.GetComponent(MicControl).loudness" in your scripts to receive the device's loudness' 
   (look in the Code reference folder for a_callReference for more info);.

Once placed in the scene all its public functions and variables can be called from any (Unity)script. See the call functions below.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


first of all:
Some of you might question why the project is no longer an open source project. One of the reasons is that, despite being required to submit any adaptations or updates
made by the users, no one contributed their efforts towards the project, nor did they send their own updates through. 

Those who did contribute and gave credits, thank you. However it was not enough to keep it open source in comparison with those who did not.
Thus the open source project is closed and all community attributions have been removed and only the original source code that is created by me is left (starting from version 2.0).
All this makes everything more manageable for me.


This is also the reason for the name MicControl 2 rather than continuing/ updating its predecessor. The asset is now under a complete different mentality.
The fact that this is now a paid asset, makes it possible for me to spend more time helping customers through the support mail.

The open source MicControl project had a good run, but it is time to move on.



//There is an example scene delivered with this asset showing  object scaling and physics movement based on voice strength.
//there is also a tutorial video (check the website).

//For WebPlayer build !!! you need to add this code http://docs.unity3d.com/412/Documentation/ScriptReference/Application.RequestUserAuthorization.html?from=UserAuthorization
//This is not included with this asset or the source code because it troubles the normal standalone builds.

Chapter 1: User accessible variables and functions
Chapter 2: Explanation of the script variables and functions (how the script works).
Chapter 3: Examples.
Chapter 4: WebPLayer setup.



Video tutorial: http://markduisters.com/2015/11/21/miccontrol-2-tutorials/




~~ Functionality Overview ~~

1. This script allows you to call information from a selected microphone.
2. The script can detect every microphone attached.
3. The script finds the volume of sound going through ONLY the selected microphone. (for multiple microphone's use multiple MicControllers with different slots selected, upt to 6 different devices supported).
4. The volume of the AudioSource directly affects the loudness variable (can be set in script.)
5. The system's default microphone is always set in slot 1.
6. Can call the input loudness from outside the script.(for multiple microphones create Multiple GameObject variables and call to that specific controller).




A script that allows you to call information from the computer's microphone from any script (see setup example).

MicControl2 can recognize up to six different microphone devices (first six by order of your operating system) per controller.

The user can set the Sensitivity and choose to show debug information.

The maximum amount of samples that gets streamed is by default 256, there is no need to change
this value unless you really know what you are doing (increasing may cause performance issues). Larger values
fill up a bigger float array, increasing precision, which will be used to calculate the loudness variable.


"~~ Chapter 1: User accessible variables and functions ~~
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Call variables and functions. All these functions can be called from external java or C# scripts.

//Main function.
MicControl.loudness;
[This call's the volume data from your microphone in any script and converts it to the loudness value.]

//Sub functions.
MicControl.StartMicrophone();
[This will force the microphone to start recording when called from an external script or a custom mod script that detects microphones.]

MicControl.StopMicrophone();
[This will force stop the microphone from anything recording/listening. This is useful when your player dies and is not allowed to use the MicControl functions anymore.]

MicControl.MicDeviceGUI (left:float , top:float, width:float, height:float, buttonSpaceTop:float, buttonSpaceLeft:float) - 
 [This lets you create a GUI element which you can use to give you a selection of the different microphones.]
 [Both buttonSpaceTop and buttonSpaceLeft need to be, the left or top, add the space you want between each button.]
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------



"~~ Chapter 2: Explanation of all the variables and functions used in the script ~~
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
variable and function explanation:
			  			   

var InputDevice : If the microphone is selected in the inspector, its corresponding number will be stored here.
				  


 
 
var audioSource: Here the script will place its AudioSource, which it generates by itself.

var amountSamples: The maximum amount of sample data that gets loaded in, best is to 
				   leave it on 256, unless you know what you are doing. A higher number gives more accuracy but 
		 		   lowers performance allot, it is best to leave it at 256.


var loudness: 		  This value can be called from any script. It is read only and it gives you a single float value
		       	      based on the input data (No actual audio). This can be used to create interactive objects or
 		    		  to change objects, basically everything that uses float values can be changed with this.

		  		      Example: transform.position.x=MicControl.loudness. This will move the object over the X axis
			     	  		   based on the input gathered from the microphone.
			      	
var rawInput:         Used by the editor script to show the unmodified "loudness" value. (the loudness value is equal to rawInput*sensitivity).
					  You can also call this value instead of loudness, although not recommended. You would need to do your own sensitivity or other
					  modifications to this value. 




var sensitivity: How sensitive should the input be? 0 will detect nothing, a higher number will give a bigger
				 loudness value.


var Mute: This values determine if the user can hear himself or not.

var debug: Writes the loudness value to the console, this can be used to see when higher pitches are used or
 	  	   whether the device is receiving input or not.

var ShowDeviceName:  When turned on the console will spit out each single device detected and its number. This
		   			 can be used to find out which slot should be selected in the editor.


//private var's (leave them untouched).

private var selectedDevice: this refers to the slot in 'enum Devices' and should be left untouched.

private var minFreq: 
		   			  Both these values are used to detect the frequency of your device. If no frequency can be detected it
		   			  will use a default of 44100. These values should be left untouched.		     
private var maxFreq: 
 

private var micSelected: This value should be left untouched as it is only used to show the GUI of 'SelectIngame'.

private var recording: This value tells the script if the mic is streaming or not.


private var focused:  Here we have a very important piece, with this the MicController can detect if the application is in use or not. If not
					  it will stop the stream when the application is not in use and restart/initialize the microphone when the aplication is back in use.
					  This is very important as it prevents data lag (sound playing seconds to late) and keeps the stream 'realtime'.
					  The usere can also call this value to check wether the application is active is active or not.
							 
private var Initialised: Checks if the microphone is initialized, if not it will do so.

var doNotDestroyOnLoad:If enabled this controller will not be destroyed while loading a new scene during runtime.




			     	 



// functions \\

//create a standard gui button from any script that is automatically hooked up to the Microphone selection function.
public function MicDeviceGUI: This creates a function to create microphone gui buttons on the fly.

//called only inside the script, do not touch or change anything in this function! It is its core setup.
private  function InitMic():Sets up and initializes the microphone.

//call these functions in external scripts to start or stop the microphone (not recommended as it may distort your data stream).
public functions StartMicrophone () -
This starts the listening of audio from your microphone.

public functions StopMicrophone () - 
This stops the playing of audio from your microphone.

function OnApplicationFocus(focus: boolean)-
This will switch the 'focused' boolean to true if the application is active.

function OnApplicationPause(focus: boolean)-
This will switch the 'focused' boolean to false if the application is not active.


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------




"~~ Chapter 3: Examples ~~
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Examples of scripts can be found in the "Code reference" folder.

//This will be done automatically when the game window is no longer active (for both the editor and build windows).
//This script will force shut down the selected microphone on start of the level and then proceeds to start it up again, this can be used on a respawn.


"Note that the system will manage its own starting and pausing of the microphone when the application gets out of focus and back in focus."
"However should you for whatever reason feel the need to stop this manually ingame, simply call these functions."
function Start(){
//stop current mic
MicControl.StopMicrophone();
//start fresh input.
MicControl.StartMicrophone();

}


//This script will force shut down the selected microphone on start of the level and then proceeds to start it up again, this can be used on a respawn.


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
"~~ Chapter 3: WebPlayer Setup ~~
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

To use this script in the web player do not switch the platform to webplayer mode! As of this writing 31-07-2014 the unity editor crashes when initializing the microphone
in the editors 'webplayer' playmode.

Instead setup your microphone script trough the standalone build platform (PC, Mac, Linux). These modes will correctly initialize the microphones.
When your script is setup to your likings and all the other scripts that call to your script are working as they should do. Build to the webplayer and open the html link generated by
Unity to view your webplayer build. In here you will now see a request to use your mic, accept it and there you go a functional microphone control inside your web player.

webplayer tutorial: https://www.youtube.com/watch?v=euL41orNfPM&feature=youtu.be


-----------------------
Thank You For Reading
-----------------------

http://markduisters.com