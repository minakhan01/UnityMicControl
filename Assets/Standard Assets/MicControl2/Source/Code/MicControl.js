#pragma strict


import UnityEngine.Audio;

@script RequireComponent(AudioSource)

#if UNITY_EDITOR
import System.IO;
@ExecuteInEditMode
#endif

//if false the below will override and set the mic selected in the editor
var useDefaultMic:boolean=false;

var ShowDeviceName:boolean=true;
var InputDevice : int=0;;
private var selectedDevice:String;
private var SourceContainer:AudioSource;

var advanced:boolean=false;

var audioSource:AudioSource;
//The maximum amount of sample data that gets loaded in, best is to leave it on 256, unless you know what you are doing. A higher number gives more accuracy but 
//lowers performance allot, it is best to leave it at 256.
var amountSamples:int=1024;

var loudness:float;
var rawInput:float;

var sensitivity:float=1;
var minMaxSensitivity:Vector2= Vector2(0,10);

var bufferTime:float=1;

enum freqList {_44100HzCD,_48000HzDVD}
var freq: freqList;
var maxFreq: int=44100;
var minFreq: int=0;
 

var Mute:boolean=true;
var debug:boolean=false;
private var micSelected:boolean=false; 

private var recording:boolean=true; 

/*
var :Transform;
var VolumeFallOff:float=1;
var PanThreshold:float=1;
private var ListenerDistance:float;
private var ListenerPosition:Vector3;
*/
var focused:boolean=false;
private var Initialised:boolean=false;


var doNotDestroyOnLoad:boolean=false;



function Start () {

//make this controller persistent
if(doNotDestroyOnLoad){
DontDestroyOnLoad (transform.gameObject);
	}


//return and throw error if no device is connected
 if(Microphone.devices.Length==0){
 	Debug.LogError("No connected device detected! Connect at least one device.");
 		Debug.LogError("No usable device detected! Try setting your device as the system's default.");
 			return;
		 		}

   	// Request permission to use the microphone on mobile devices.
 	if(Application.platform == RuntimePlatform.Android || Application.platform == RuntimePlatform.IPhonePlayer ||  SystemInfo.deviceModel.Contains("iPhone") || SystemInfo.deviceModel.Contains("iPad") || Application.platform == RuntimePlatform.WP8Player){
		yield Application.RequestUserAuthorization (UserAuthorization.Microphone);
		if (Application.HasUserAuthorization(UserAuthorization.Microphone)){
			InitMic();
				Initialised=true;
					}

		//if no permission is granted do not execute script
		else{
			return;
		}
  }
  else{
  InitMic();
  Initialised=true;
  }
  


}

 
//apply the mic input data stream to a float;
function Update () {
//pause everything when not focused on the app and then re-initialize.
if (!focused){
			StopMicrophone();
			Initialised=false;
			if(debug){
				Debug.Log("mic stopped");
					}
						return;
							}


		if (!Application.isPlaying) {
		//stop the microphone if you are clicking inside the editor and the player is stopped
			StopMicrophone();
				Initialised=false;
						if(debug){
							Debug.Log("mic stopped");
								}
									return;
										}

		if(focused){
			if(!Initialised){
					InitMic();
					if(debug){
				 Debug.Log("mic started");
				 }
					Initialised=true;
		
						}
							}


if(focused){

if(Microphone.IsRecording(selectedDevice) && recording){
  loudness = GetDataStream()*sensitivity;
  rawInput = GetDataStream();

  }
/*   if(debug){
   Debug.Log(loudness);
  }*/

  //Make sure the AudioSource volume is always 1
  audioSource.volume = 1;


}

}
 
 
function GetDataStream():float{



if(Microphone.IsRecording(selectedDevice)){
  
   var dataStream: float[]  = new float[amountSamples];
       var audioValue: float = 0;
          audioSource.GetOutputData(dataStream,0);
  
        for(var i:float in dataStream){
            audioValue += Mathf.Abs(i);
        }
        return audioValue/amountSamples;
        }

 
 

  
}
 
 
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Initialize microphone
  function InitMic(){

//select audio source
if(!audioSource){
  audioSource = transform.GetComponent.<AudioSource>();
	} 

 //only Initialize microphone if a device is detected
if(Microphone.devices.Length>=0){

var i=0;
//count amount of devices connected
for(device in Microphone.devices){
i++;
}

//set selected device from isnpector as device number. (to find the device).
if(i>=1 && !useDefaultMic){
selectedDevice= Microphone.devices[InputDevice];
}

//set the default device if enabled
if(useDefaultMic){
selectedDevice= Microphone.devices[0];
}




//Now that we know which device to listen to, lets set the frequency we want to record at

if(freq== freqList._44100HzCD){
maxFreq=44100;

}

if(freq == freqList._48000HzDVD){
maxFreq=48000;

}



//detect the selected microphone one time to geth the first buffer.
 audioSource.clip = new Microphone.Start(selectedDevice, true, bufferTime, maxFreq);

	
//loop the playing of the recording so it will be realtime
audioSource.loop = true;
//if you only need the data stream values  check Mute, if you want to hear yourself ingame don't check Mute. 
//audioSource.mute = Mute;	



  	var mixer:AudioMixer = Resources.Load("MicControl2Mixer") as AudioMixer;
		if(Mute){
			mixer.SetFloat("MicControl2Volume",-80);
				}
				else{
					mixer.SetFloat("MicControl2Volume",0);
						}

   



//don't do anything until the microphone started up
	while (!(Microphone.GetPosition(selectedDevice) > 0)){
		if(debug){
			Debug.Log("Awaiting connection");
				}
					}
	if(debug){
		Debug.Log("Connected");
			}
 
//Now that the basic initialisation is done, we are ready to start the microphone and gather data.
		 StartMicrophone ();
			recording=true; 

 }



 }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 
 
 
    //for the above control the mic start or stop
 

 public function StartMicrophone () {

 		GetMicCaps (); 	//first detect if maxFreq is set or not. If not use a default value

 		   audioSource.clip = Microphone.Start(selectedDevice, true, bufferTime, maxFreq);//Starts recording

          while (!(Microphone.GetPosition(selectedDevice) > 0)){} // Wait until the recording has started
        audioSource.Play(); // Play the audio source! 
    }
 
 
 public function StopMicrophone () {
        audioSource.Stop();//Stops the audio
         Microphone.End(selectedDevice);//Stops the recording of the device  

    }


    //if no frequency is set, the system will default to 44100
      function GetMicCaps () {
         Microphone.GetDeviceCaps(selectedDevice,  minFreq,  maxFreq);//Gets the frequency of the device
         if ((0 + maxFreq) == 0)//These 2 lines of code are mainly for windows computers
             maxFreq = 44100;
 
    			}
    

    
        
	 //start or stop the script from running when the state is paused or not.
    function OnApplicationFocus(focus: boolean) {
		focused = focus;
	}
	
	function OnApplicationPause(focus: boolean) {
		focused = focus;
	}
	
	function OnApplicationExit(focus: boolean) {
		focused = focus;
	}
	
	

	#if UNITY_EDITOR
			
	   //draw the gizmo
 function OnDrawGizmos () {
 if(Application.isEditor)
		Gizmos.DrawIcon (transform.position, "MicControlGizmo.tif", true);
		
					
			
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//if gizmo folder does not exist create it
	if (!Directory.Exists(Application.dataPath+"/Gizmos")){
		Directory.CreateDirectory(Application.dataPath+"/Gizmos");
			}
	//then copy the gizmo into the folder
	var info = new DirectoryInfo(Application.dataPath+"/Gizmos");
	var fileInfo = info.GetFiles();
	
		if(!File.Exists(Application.dataPath+"/Gizmos/MicControlGizmo.tif")){
			File.Copy(Application.dataPath+"/MicControl2/Source/MicControlGizmo.tif",Application.dataPath+"/Gizmos/MicControlGizmo.tif");
				}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
		
	}
	
	#endif
    
    