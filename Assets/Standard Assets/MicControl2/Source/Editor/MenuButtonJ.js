#pragma strict
import UnityEditor;
import System.IO;
import UnityEngine.Audio;

@MenuItem ("GameObject/Audio/MicControl",false,-16)



static function SpawnMicController () {

	var MicController:GameObject= new GameObject("MicController");
		MicController.AddComponent(MicControl);

	if(MicController.GetComponent.<AudioSource>()==null){
		MicController.AddComponent(AudioSource);
			}

				var mixer:AudioMixer = Resources.Load("MicControl2Mixer") as AudioMixer;
					MicController.GetComponent.<AudioSource>().outputAudioMixerGroup = mixer.FindMatchingGroups("Master")[0] ;

	if(Camera.current){
		MicController.transform.position=Camera.current.transform.position;
			}
				else{
				MicController.transform.position = Vector3(0,0,0);
					}


}

