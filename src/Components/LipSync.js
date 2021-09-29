import React, { useEffect } from 'react'

//credit: https://github.com/srigaurav1986/speech-driven-lipsync/blob/fc5c55f63422bdad45abf7a1f6a0977ba7fd2918/application/lipsyncprocessing.js
function LipSync(props) {
    console.log("initializing lip sync")

    useEffect(() => {

        var BoundingFrequencyMale = [0, 500, 700, 3000, 6000];//[0,400,560,2400,4800];
        var BoundingFrequencyFemale = [0, 500, 700, 3000, 6000];
        var BlendShapes = {};


        var audioContext = new AudioContext();
        var FFT_SIZE = 1024;
        var samplingFrequency = 44100;
        var Error = function () { console.log("failed to get Media"); }

        var IndicesFrequencyFemale = [];
        var IndicesFrequencyMale = [];
        for (let m = 0; m < BoundingFrequencyMale.length; m++) {
            IndicesFrequencyMale[m] = Math.round(((2 * FFT_SIZE) / samplingFrequency) * BoundingFrequencyMale[m]);
            //IndicesFrequencyFemale[n] = ((2*FFT_SIZE)/samplingFrequency) *BoundingFrequencyFemale[m];
            //console.log("IndicesFrequencyMale[", m, "]", IndicesFrequencyMale[m]);
        }
        const getRMS = function (spectrum) {
            var rms = 0;
            for (var i = 0; i < spectrum.length; i++) {
                rms += spectrum[i] * spectrum[i];
            }
            rms /= spectrum.length;
            rms = Math.sqrt(rms);
            return rms;
        }

        window.getstPSD = function (spectrum) {
            var sensitivity_threshold = 0.5;
            var stPSD = new Float32Array(spectrum.length);
            for (let i = 0; i < spectrum.length; i++) {
                stPSD[i] = sensitivity_threshold + ((spectrum[i] + 20) / 140);
            }
            return stPSD;
        }

        var screen_constraints = {
            video: false,
            audio: true
        };

        let tempStream = new MediaStream();

        //console.info('getScreenId callback \n( screen_constraints, error ) =>\n', screen_constraints);

        navigator.mediaDevices.getUserMedia(screen_constraints).then((stream) => {
            // share this "MediaStream" object using RTCPeerConnection API
            console.log("getUserMedia success");

            tempStream.addTrack(stream.getAudioTracks()[0]);
            var input = audioContext.createMediaStreamSource(tempStream);
            window.userSpeechAnalyzer = audioContext.createAnalyser();
            window.userSpeechAnalyzer.smoothingTimeConstant = 0.5;
            window.userSpeechAnalyzer.fftSize = FFT_SIZE;
            input.connect(window.userSpeechAnalyzer);
            //userSpeechAnalyzer.connect(audioContext.destination);

            //var node = audioContext.createScriptProcessor(FFT_SIZE * 2, 1, 1);

            //window.userSpeechAnalyzer.connect(node);
            setInterval(() => {
                // bitcount returns array which is half the FFT_SIZE
                var spectrum = new Float32Array(window.userSpeechAnalyzer.frequencyBinCount);
                // getByteFrequencyData returns amplitude for each bin
                window.userSpeechAnalyzer.getFloatFrequencyData(spectrum);
                // getByteTimeDomainData gets volumes over the sample time
                // analyser.getByteTimeDomainData(self.spectrum);
                //console.log(self.spectrum);
                //self.spectrumRMS = self.getRMS(self.spectrum);
                var stPSD = window.getstPSD(spectrum);
                //console.log(self.stPSD);
                var EnergyBinMale = new Float32Array(BoundingFrequencyMale.length);
                var EnergyBinFemale = new Float32Array(BoundingFrequencyFemale.length);
                var BlendShapeKiss;
                var BlendShapeLips;
                var BlenShapeMouth;
                for (let m = 0; m < BoundingFrequencyMale.length - 1; m++) {
                    for (let j = IndicesFrequencyMale[m]; j <= IndicesFrequencyMale[m + 1]; j++) {
                        if (stPSD[j] > 0) {

                            EnergyBinMale[m] += stPSD[j];
                            //EnergyBinFemale[m]+ = stPSD[j];  	

                        }
                    }
                    EnergyBinMale[m] /= (IndicesFrequencyMale[m + 1] - IndicesFrequencyMale[m]);
                    //	EnergyBinFemale[m] = EnergyBinFemale[m]/(IndicesFrequencyFemale[m+1] -IndicesFrequencyFemale[m] ) 
                    //	console.log("EnergyBinMale",EnergyBinMale[m]);
                }

                if (EnergyBinMale[1] > 0.2) {
                    BlendShapeKiss = 1 - 2 * EnergyBinMale[2];
                } else {
                    BlendShapeKiss = (1 - 2 * EnergyBinMale[2]) * 5 * EnergyBinMale[1];
                }

                BlendShapeLips = 3 * EnergyBinMale[3];
                BlenShapeMouth = 0.8 * (EnergyBinMale[1] - EnergyBinMale[3]);

                BlendShapes = {
                    "BlendShapeMouth": BlenShapeMouth,
                    "BlendShapeLips": BlendShapeLips,
                    "BlendShapeKiss": BlendShapeKiss
                }

                //console.log("Blendershape", BlenShapeMouth, BlendShapeLips, BlendShapeKiss);
                //if (BlenShapeMouth && BlendShapeKiss && BlendShapeLips)
                //console.log("Blendershape", JSON.stringify(BlendShapes));
                props.blendShapeHandler(BlendShapes)
                //console.log(self.stPSD);
                //console.log(self.vol);
                // get peak - a hack when our volumes are low
                //if (self.vol > self.peak_volume) self.peak_volume = self.vol;
                //self.volume = self.vol;

            }, 50);


            stream.oninactive = stream.onended = function () {
                //document.querySelector('video').src = null;
            };
        }).catch((error) => {
            console.error('getScreenId error', error);

        });
    }, [])


    return <mesh />
}

export default LipSync;