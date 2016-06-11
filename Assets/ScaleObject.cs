using UnityEngine;
using System.Collections;

public class ScaleObject : MonoBehaviour {

	GameObject micController;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		var loudness = micController.GetComponent<MicControl>().loudness;
		Debug.Log ("loudness: "+loudness);
		transform.localScale= new Vector3(1+10*loudness,1+10*loudness,1+10*loudness);
	}

}
