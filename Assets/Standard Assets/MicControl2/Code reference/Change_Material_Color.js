#pragma strict

//Place here the 'controller' you want to call loudness from in the inspector 
 var micController:GameObject;  
 //This value will give an extra boost or limit the loudness received. This way you can leave your input sensitivity the way it is, thus
 //keeping your current scripts unharmed from the change.
 var amp:float=1;
 
 //this is the color value that will be controlled by MicControl 2
 private var clr:Color;
 
 
 
 
 
 function Update(){ 
 
		//Use this in your script to call loudnes data from selected controller 
 			var ldness: float = micController.GetComponent(MicControl).loudness*amp; 
 
				 //clamp the received value to fit between 0 and 1. This is to fit nicely for color adaptation.
 					Mathf.Clamp(ldness,0.0,1.0);
 
  		//we will influence the red channel with the loudness value received from MicControl 2
 		clr= Color(ldness,0,0);
 		
 		//set the value to the albedo color of the material
 		transform.GetComponent(Renderer).material.SetColor("_Color", clr);
 		
//		you can swap out _Color with any of these to influence different parts of the shader.
// 		Common color names used by Unity's builtin shaders: 
//		"_Color" is the main color of a material. This can also be accessed via color property. 
//		"_SpecColor" is the specular color of a material (used in specular/vertexlit shaders). 
//		"_EmissionColor" is the emissive color of a material (used in vertexlit shaders). 
//		"_ReflectColor" is the reflection color of the material (used in reflective shaders).
 
 }