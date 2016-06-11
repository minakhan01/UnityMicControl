using UnityEngine;
using System.Collections;

[RequireComponent (typeof(AudioSource))]
public class MicBehavior : MonoBehaviour {

	AudioSource audio;
	int qSamples = 1024;
	float[] spectrum;
	float[] samples;

	float rmsValue;   // sound level - RMS
	float dbValue;    // sound level - dB
	float pitchValue; // sound pitch - Hz

	float refValue = 0.1f; // RMS value for 0 dB
	float threshold = 0.02f;      // minimum amplitude to extract pitch
	float fSample;

	void Start() {
		spectrum = new float[qSamples];
		samples = new float[qSamples];
		audio = GetComponent<AudioSource>();
		audio.clip = Microphone.Start(null, true, 1, 44100);
		audio.loop = true;
		audio.Play();
		fSample = AudioSettings.outputSampleRate;
	}

	void Update() {
		audio.GetOutputData(samples, 0); // fill array with samples
		int i;
		float sum = 0;
		for (i=0; i < qSamples; i++){
			sum += samples[i]*samples[i]; // sum squared samples
		}
		rmsValue = Mathf.Sqrt(sum/qSamples); // rms = square root of average
		dbValue = 20*Mathf.Log10(rmsValue/refValue); // calculate dB
		if (dbValue < -160) dbValue = -160; // clamp it to -160dB min

		audio.GetSpectrumData(spectrum, 0, FFTWindow.BlackmanHarris);
		float maxV = 0;
		int maxN = 0;
		for (i=0; i < qSamples; i++){ // find max 
			if (spectrum[i] > maxV && spectrum[i] > threshold){
				maxV = spectrum[i];
				maxN = i; // maxN is the index of max
			}
		}
		float freqN = maxN; // pass the index to a float variable
		if (maxN > 0 && maxN < qSamples-1){ // interpolate index using neighbours
			var dL = spectrum[maxN-1]/spectrum[maxN];
			var dR = spectrum[maxN+1]/spectrum[maxN];
			freqN += 0.5f*(dR*dR - dL*dL);
		}
		pitchValue = freqN*(fSample/2)/qSamples; // convert index to frequency
		Debug.Log("pitchValue: "+pitchValue+" rmsValue: "+ rmsValue+" dbValue: "+ dbValue);
//		int i = 1;
//		while (i < spectrum.Length-1) {
//			Debug.DrawLine(new Vector3(i - 1, spectrum[i] + 10, 0), new Vector3(i, spectrum[i + 1] + 10, 0), Color.red);
//			Debug.DrawLine(new Vector3(i - 1, Mathf.Log(spectrum[i - 1]) + 10, 2), new Vector3(i, Mathf.Log(spectrum[i]) + 10, 2), Color.cyan);
//			Debug.DrawLine(new Vector3(Mathf.Log(i - 1), spectrum[i - 1] - 10, 1), new Vector3(Mathf.Log(i), spectrum[i] - 10, 1), Color.green);
//			Debug.DrawLine(new Vector3(Mathf.Log(i - 1), Mathf.Log(spectrum[i - 1]), 3), new Vector3(Mathf.Log(i), Mathf.Log(spectrum[i]), 3), Color.yellow);
//			i++;
//		}
	}
}