 // ==UserScript==
// @name        4chan captcha solver
// @namespace   sneed
// @match       https://boards.4channel.org/*
// @match       https://boards.4chan.org/*
// @match       https://sys.4chan.org/*
// @match       https://sys.4channel.org/*
// @grant GM.getValue
// @grant GM.setValue
// @version     1.4.6
// @author      brunohazard
// @require     https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.js
// @require     https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.10.0/dist/tf-backend-wasm.js
// @description 7/8/2021, 1:16:32 PM
// @run-at      document-end
// ==/UserScript==
// ========================================================= //
/*                      ACKNOWLEDGEMENTS                     */
/*        AUTOMATIC1111 - Original author of the script      */
/*    HamletDuFromage & soyware - Slider solver algorithm    */
/*    coomdev - CTC decoder algorithm, captcha collection    */
/*                 Yukariin - Model training                 */
/*       moffatman - Model training, captcha collection      */
/*                  aaafre4 - Captcha saver                  */
// ========================================================= //
(function() {
  const modelJSON = {"format": "layers-model", "generatedBy": "keras v2.15.0", "convertedBy": "TensorFlow.js Converter v4.16.0", "modelTopology": {"keras_version": "2.15.0", "backend": "tensorflow", "model_config": {"class_name": "Functional", "config": {"name": "ocr_model_v1", "trainable": true, "layers": [{"class_name": "InputLayer", "config": {"batch_input_shape": [null, 300, 80, 1], "dtype": "float32", "sparse": false, "ragged": false, "name": "image"}, "name": "image", "inbound_nodes": []}, {"class_name": "Conv2D", "config": {"name": "Conv1", "trainable": true, "dtype": "float32", "filters": 32, "kernel_size": [3, 3], "strides": [1, 1], "padding": "same", "data_format": "channels_last", "dilation_rate": [1, 1], "groups": 1, "activation": "relu", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "HeNormal", "config": {"seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}, "name": "Conv1", "inbound_nodes": [[["image", 0, 0, {}]]]}, {"class_name": "MaxPooling2D", "config": {"name": "pool1", "trainable": true, "dtype": "float32", "pool_size": [2, 2], "padding": "valid", "strides": [2, 2], "data_format": "channels_last"}, "name": "pool1", "inbound_nodes": [[["Conv1", 0, 0, {}]]]}, {"class_name": "Conv2D", "config": {"name": "Conv2", "trainable": true, "dtype": "float32", "filters": 64, "kernel_size": [3, 3], "strides": [1, 1], "padding": "same", "data_format": "channels_last", "dilation_rate": [1, 1], "groups": 1, "activation": "relu", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "HeNormal", "config": {"seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}, "name": "Conv2", "inbound_nodes": [[["pool1", 0, 0, {}]]]}, {"class_name": "MaxPooling2D", "config": {"name": "pool2", "trainable": true, "dtype": "float32", "pool_size": [2, 2], "padding": "valid", "strides": [2, 2], "data_format": "channels_last"}, "name": "pool2", "inbound_nodes": [[["Conv2", 0, 0, {}]]]}, {"class_name": "Reshape", "config": {"name": "reshape", "trainable": true, "dtype": "float32", "target_shape": [75, 1280]}, "name": "reshape", "inbound_nodes": [[["pool2", 0, 0, {}]]]}, {"class_name": "Dense", "config": {"name": "dense1", "trainable": true, "dtype": "float32", "units": 128, "activation": "relu", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "GlorotUniform", "config": {"seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}, "name": "dense1", "inbound_nodes": [[["reshape", 0, 0, {}]]]}, {"class_name": "Dropout", "config": {"name": "dropout", "trainable": true, "dtype": "float32", "rate": 0.2, "noise_shape": null, "seed": null}, "name": "dropout", "inbound_nodes": [[["dense1", 0, 0, {}]]]}, {"class_name": "Bidirectional", "config": {"name": "bidirectional", "trainable": true, "dtype": "float32", "layer": {"module": "keras.layers", "class_name": "LSTM", "config": {"name": "lstm", "trainable": true, "dtype": "float32", "return_sequences": true, "return_state": false, "go_backwards": false, "stateful": false, "unroll": false, "time_major": false, "units": 128, "activation": "tanh", "recurrent_activation": "sigmoid", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "GlorotUniform", "config": {"seed": null}, "registered_name": null}, "recurrent_initializer": {"module": "keras.initializers", "class_name": "Orthogonal", "config": {"gain": 1.0, "seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "unit_forget_bias": true, "kernel_regularizer": null, "recurrent_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "recurrent_constraint": null, "bias_constraint": null, "dropout": 0.25, "recurrent_dropout": 0.0, "implementation": 2}, "registered_name": null}, "merge_mode": "concat"}, "name": "bidirectional", "inbound_nodes": [[["dropout", 0, 0, {}]]]}, {"class_name": "Bidirectional", "config": {"name": "bidirectional_1", "trainable": true, "dtype": "float32", "layer": {"module": "keras.layers", "class_name": "LSTM", "config": {"name": "lstm_1", "trainable": true, "dtype": "float32", "return_sequences": true, "return_state": false, "go_backwards": false, "stateful": false, "unroll": false, "time_major": false, "units": 64, "activation": "tanh", "recurrent_activation": "sigmoid", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "GlorotUniform", "config": {"seed": null}, "registered_name": null}, "recurrent_initializer": {"module": "keras.initializers", "class_name": "Orthogonal", "config": {"gain": 1.0, "seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "unit_forget_bias": true, "kernel_regularizer": null, "recurrent_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "recurrent_constraint": null, "bias_constraint": null, "dropout": 0.25, "recurrent_dropout": 0.0, "implementation": 2}, "registered_name": null}, "merge_mode": "concat"}, "name": "bidirectional_1", "inbound_nodes": [[["bidirectional", 0, 0, {}]]]}, {"class_name": "InputLayer", "config": {"batch_input_shape": [null, null], "dtype": "float32", "sparse": false, "ragged": false, "name": "label"}, "name": "label", "inbound_nodes": []}, {"class_name": "Dense", "config": {"name": "dense2", "trainable": true, "dtype": "float32", "units": 23, "activation": "softmax", "use_bias": true, "kernel_initializer": {"module": "keras.initializers", "class_name": "GlorotUniform", "config": {"seed": null}, "registered_name": null}, "bias_initializer": {"module": "keras.initializers", "class_name": "Zeros", "config": {}, "registered_name": null}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}, "name": "dense2", "inbound_nodes": [[["bidirectional_1", 0, 0, {}]]]}], "input_layers": [["image", 0, 0]], "output_layers": [["dense2", 0, 0]]}}, "training_config": {"loss": null, "metrics": null, "weighted_metrics": null, "loss_weights": null, "optimizer_config": {"class_name": "Custom>Adam", "config": {"name": "Adam", "weight_decay": null, "clipnorm": null, "global_clipnorm": null, "clipvalue": null, "use_ema": false, "ema_momentum": 0.99, "ema_overwrite_frequency": null, "jit_compile": true, "is_legacy_optimizer": false, "learning_rate": 9.999999747378752e-06, "beta_1": 0.9, "beta_2": 0.999, "epsilon": 1e-07, "amsgrad": false}}}}, "weightsManifest": [{"paths": ["group1-shard1of1.bin"], "weights": [{"name": "Conv1/kernel", "shape": [3, 3, 1, 32], "dtype": "float32"}, {"name": "Conv1/bias", "shape": [32], "dtype": "float32"}, {"name": "Conv2/kernel", "shape": [3, 3, 32, 64], "dtype": "float32"}, {"name": "Conv2/bias", "shape": [64], "dtype": "float32"}, {"name": "bidirectional/forward_lstm/lstm_cell/kernel", "shape": [128, 512], "dtype": "float32"}, {"name": "bidirectional/forward_lstm/lstm_cell/recurrent_kernel", "shape": [128, 512], "dtype": "float32"}, {"name": "bidirectional/forward_lstm/lstm_cell/bias", "shape": [512], "dtype": "float32"}, {"name": "bidirectional/backward_lstm/lstm_cell/kernel", "shape": [128, 512], "dtype": "float32"}, {"name": "bidirectional/backward_lstm/lstm_cell/recurrent_kernel", "shape": [128, 512], "dtype": "float32"}, {"name": "bidirectional/backward_lstm/lstm_cell/bias", "shape": [512], "dtype": "float32"}, {"name": "bidirectional_1/forward_lstm_1/lstm_cell/kernel", "shape": [256, 256], "dtype": "float32"}, {"name": "bidirectional_1/forward_lstm_1/lstm_cell/recurrent_kernel", "shape": [64, 256], "dtype": "float32"}, {"name": "bidirectional_1/forward_lstm_1/lstm_cell/bias", "shape": [256], "dtype": "float32"}, {"name": "bidirectional_1/backward_lstm_1/lstm_cell/kernel", "shape": [256, 256], "dtype": "float32"}, {"name": "bidirectional_1/backward_lstm_1/lstm_cell/recurrent_kernel", "shape": [64, 256], "dtype": "float32"}, {"name": "bidirectional_1/backward_lstm_1/lstm_cell/bias", "shape": [256], "dtype": "float32"}, {"name": "dense1/kernel", "shape": [1280, 128], "dtype": "float32"}, {"name": "dense1/bias", "shape": [128], "dtype": "float32"}, {"name": "dense2/kernel", "shape": [128, 23], "dtype": "float32"}, {"name": "dense2/bias", "shape": [23], "dtype": "float32"}]}]};
  const charset = [' ', '0', '2', '4', '8', 'A', 'D', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y'];
  let model;

  tf.wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.10.0/dist/');
  tf.setBackend('wasm');
  tf.enableProdMode();

  /*
   * decide if a pixel is closer to black than to white.
   * return 0 for white, 1 for black
   */
  function pxlBlackOrWhite(r, g, b) {
    return (r + g + b > 384) ? 0 : 1;
  }

  /*
   * Get bordering pixels of transparent areas (the outline of the circles)
   * and return their coordinates with the neighboring color.
   */
  function getBoundries(imgdata) {
    const data = imgdata.data;
    const width = imgdata.width;

    let i = data.length - 1;
    let cl = 0;
    let cr = 0;
    const chkArray = [];
    let opq = true;
    while (i > 0) {
      // alpha channel above 128 is assumed opaque
      const a = data[i] > 128;
      if (a !== opq) {
        if ((data[i - 4] > 128) === opq) {
          // ignore just 1-width areas
          i -= 4;
          continue;
        }
        if (a) {
          /* transparent pixel to its right */
          /*
                  // set to color blue (for debugging)
                  data[i + 4] = 255;
                  data[i + 3] = 255;
                  data[i + 2] = 0;
                  data[i + 1] = 0;
                  */
          const pos = (i + 1) / 4;
          const x = pos % width;
          const y = (pos - x) / width;
          // 1: black, 0: white
          const clr = pxlBlackOrWhite(data[i - 1], data[i - 2], data[i - 3]);
          chkArray.push([x, y, clr]);
          cr += 1;
        } else {
          /* opaque pixel to its right */
          /*
                  // set to color red (for debugging)
                  data[i] = 255;
                  data[i - 1] = 0;
                  data[i - 2] = 0;
                  data[i - 3] = 255;
                  */
          const pos = (i - 3) / 4;
          const x = pos % width;
          const y = (pos - x) / width;
          // 1: black, 0: white
          const clr = pxlBlackOrWhite(data[i + 1], data[i + 2], data[i + 3]);
          chkArray.push([x, y, clr]);
          cl += 1;
        }
        opq = a;
      }
      i -= 4;
    }
    return chkArray;
  }

  /*
   * slide the background image and compare the colors of the border pixels in
   * chkArray, the position with the most matches wins
   * Return in slider-percentage.
   */
  function getBestPos(bgdata, chkArray, slideWidth) {
    const data = bgdata.data;
    const width = bgdata.width;
    let bestSimilarity = 0;
    let bestPos = 0;

    for (let s = 0; s <= slideWidth; s += 1) {
      let similarity = 0;
      const amount = chkArray.length;
      for (let p = 0; p < amount; p += 1) {
        const chk = chkArray[p];
        const x = chk[0] + s;
        const y = chk[1];
        const clr = chk[2];
        const off = (y * width + x) * 4;
        const bgclr = pxlBlackOrWhite(data[off], data[off + 1], data[off + 2]);
        if (bgclr === clr) {
          similarity += 1;
        }
      }
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestPos = s;
      }
    }
    return bestPos / slideWidth * 100;
  }

  function getImageDataFromURI(uri) {
    return new Promise((resolve, reject) => {
      const image = document.createElement('img');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imgdata);
      };
      image.onerror = (e) => {
        reject(e);
      };
      image.src = uri;
    });
  }

  /*
   * Automatically slide captcha into place
   * Arguments are the "t-fg', 't-bg', 't-slider' elements of the captcha
   */
  async function slideCaptcha(tfgElement, tbgElement, sliderElement) {
    // get data uris for captcha back- and foreground
    const tbgUri = tbgElement.style.backgroundImage.slice(5, -2);
    const tfgUri = tfgElement.style.backgroundImage.slice(5, -2);

    // load foreground (image with holes)
    const igd = await getImageDataFromURI(tfgUri);
    // get array with pixels of foreground
    // that we compare to background
    const chkArray = getBoundries(igd);
    // load background (image that gets slid)
    const sigd = await getImageDataFromURI(tbgUri);
    const slideWidth = sigd.width - igd.width;
    // slide, compare and get best matching position
    const sliderPos = getBestPos(sigd, chkArray, slideWidth);
    // slide in the UI
    sliderElement.value = sliderPos;
    sliderElement.dispatchEvent(new Event('input'), { bubbles: true });
    return 0 - (sliderPos / 2);
  }

  function toggle(obj,v){
    if(v) obj.style.display = '';
    else obj.style.display = 'none';
  }

  function base64ToArray(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const iohander = {
    load: function(){
      return new Promise((resolve, reject) => {
        resolve({
          modelTopology: modelJSON.modelTopology,
          weightSpecs: modelJSON.weightsManifest[0]["weights"],
          weightData: base64ToArray(weights64),
          format: modelJSON.format,
          generatedBy: modelJSON.generatedBy,
          convertedBy: modelJSON.convertedBy
        });
      });
    }
  }

  async function load(){
    return await tf.loadLayersModel(iohander);
  }

  // returns ImageData from captcha's background image, foreground image, and offset (ranging from 0 to -50)
  async function imageFromCanvas(img, bg, off){
    var h=img.height, w=img.width;
    var th=80;
    var ph=0, pw=16;
    var scale = th/h

    const canvas = document.createElement('canvas');
    const fcanvas = document.createElement('canvas');
    const cw = w * scale + pw * 2;
    canvas.width = cw >= 300 ? 300 : cw;
    canvas.height = th;

    fcanvas.width = 300;
    fcanvas.height = 80;

    const ctx = canvas.getContext('2d');
    const fctx = fcanvas.getContext('2d'); // used to contain the captcha stretched to 300w

    ctx.fillStyle = "rgb(238,238,238)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);

    const draw = function (off) {
      if(bg){
        var border = 4;
        ctx.drawImage( bg, -off + border, 0, w-border*2, h, -w / 2 + border, -h / 2, w-border*2, h );
      }
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      fctx.drawImage(canvas, 0, 0, 300, 80);
    }

    if(bg && off==null){
      off = await slideCaptcha(document.getElementById('t-fg'), document.getElementById('t-bg'), document.getElementById('t-slider'));
    }
    console.log(off);
    draw(off, false);

    //return ctx.getImageData(0,0,canvas.width,canvas.height);
    return fctx.getImageData(0,0,300,80);
  }

  function toMonochromeFloat(px) {
    const ret = Array(px.length >> 2);
    for (let i = 0; i < px.length; i += 4) {
      ret[i >> 2] = px[i] / 255;
    }
    return ret;
  }

  const greedyCTCDecode = (yPred) => tf.tidy(() => yPred.argMax(-1).arraySync());

  function processCTCDecodedSequence(decodedSequence, blankLabel = 0) {
    const result = [];
    let prevLabel = blankLabel;

    for (const label of decodedSequence) {
      if (label !== blankLabel && label !== prevLabel) {
        result.push(label);
      }
      prevLabel = label;
    }

    return result;
  }

  function indicesToSymbols(decodedIndices) {
    return decodedIndices.map(index => charset[index - 1] || '');
  }

  function imageDataToBase64(imageData) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}


  // for debugging purposes
  function imagedataToImage(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }

  async function predict(img, bg, off){
    if(! model){
      model = await load()
    }
    const image = await imageFromCanvas(img, bg, off);
    const mono = toMonochromeFloat(image.data);
    const filtered2 = tf.tensor3d(mono, [image.height, image.width, 1]);
    tensor = tf.browser.fromPixels(image, 1).mul(-1/238).add(1)
    //prediction = await model.predict(tensor.expandDims(0)).data()
    const prediction = model.predict(filtered2.transpose([1, 0, 2]).expandDims(0));

    //return createSequence(prediction)
    if (Array.isArray(prediction))
      throw new Error("Unexpected inference type");

    const v = greedyCTCDecode(prediction);
    const s = processCTCDecodedSequence(v[0], charset.length + 1);
    const indices =  indicesToSymbols(s).join('').trim();
    window.indices = indices;
    window.imgBase64 = imageDataToBase64(image)
    return indices
  }

  async function imageFromUri(uri){
    if(uri.startsWith("url(\"")){
      uri = uri.substr(5,uri.length-7)
    }
    if(! uri.startsWith("data:")){
      return null
    }

    var img = new Image();
    await new Promise((r) => {
      img.onload = r;
      img.crossOrigin = 'anonymous';
      img.src = uri;
    });

    return img
  }


  async function predictUri(uri, uribg, bgoff){
    var img = await imageFromUri(uri)
    var bg = uribg ? await imageFromUri(uribg) : null
    var off = bgoff ? parseInt(bgoff) : null;

    return await predict(img, bg, off)
  }


  const solveButton = document.createElement('input')
  solveButton.id="t-auto-solve"
  solveButton.value="Solve"
  solveButton.type="button"
  solveButton.style.fontSize = "11px"
  solveButton.style.padding = "0 2px"
  solveButton.style.margin = "0px 0px 0px 6px"
  solveButton.style.height = "18px"
  solveButton.onclick=async function(){ solve(true); }

  const altsDiv = document.createElement('div')
  altsDiv.id="t-auto-options"
  altsDiv.style.margin = "0"
  altsDiv.style.padding = "0"

  const saveCaptchaCheckmark = document.createElement('input');
  saveCaptchaCheckmark.type = 'checkbox';
  saveCaptchaCheckmark.id = 'save-captcha';

  const label = document.createElement('label');
  label.htmlFor = 'save-captcha';
  label.textContent = 'Save Captcha';


  let storedPalceholder;

  function placeAfter(elem, sibling){
    if(elem.parentElement!=sibling.parentElement){
      setTimeout(function(){
        sibling.parentElement.insertBefore(elem,sibling.nextElementSibling);
      }, 1);
    }
  }

  let previousText = null;
  async function solve(force){
    const resp = document.getElementById('t-resp');
    if(! resp) return;

    const bg=document.getElementById('t-bg');
    if(! bg) return;

    const fg=document.getElementById('t-fg');
    if(! fg) return;

    const help=document.getElementById('t-help');
    if(! help) return;

    saveCaptchaCheckmark.checked = localStorage.getItem('saveCaptcha') === 'true';


    placeAfter(solveButton, resp);
    placeAfter(altsDiv, help);
    placeAfter(saveCaptchaCheckmark, help);
    placeAfter(label, saveCaptchaCheckmark);

    await tf.ready();

    // palememe
    setTimeout(function(){
      toggle(solveButton, bg.style.backgroundImage)
    }, 1);

    const text=fg.style.backgroundImage;
    if(! text){
      altsDiv.innerHTML = '';
      return;
    }

    if(text==previousText && !force) return;
    previousText=text;

    altsDiv.innerHTML = '';
    if(! storedPalceholder) storedPalceholder = resp.placeholder;
    resp.placeholder = "solving captcha...";

    const sequence = await predictUri(text, bg.style.backgroundImage, force ? bg.style.backgroundPositionX : null);
    resp.placeholder = storedPalceholder;

    resp.value = sequence;
  }

  let keyupSet = false;

  const saveCaptcha = async () => {
  const saveEnabled = localStorage.getItem("saveCaptcha") === 'true';
    if (!saveEnabled) {
      return;
    }

    console.log(window.indices);
    console.log(window.imgBase64);

    const link = document.createElement('a');
    link.download = window.indices+'.png';
    link.href = window.imgBase64
    link.click();
  }

  const tRespDom = () => document.querySelector("#t-resp");

  const onKeyUp = () => {
    window.indices = tRespDom().value.toUpperCase()
    console.log(window.indices)
  }

  saveCaptchaCheckmark.addEventListener('change', async () => {
    localStorage.setItem("saveCaptcha", saveCaptchaCheckmark.checked);
    if (saveCaptchaCheckmark.checked) {
      onKeyUp()
    }
  });

  const addKeyUpEventListener = () => {
    tRespDom().addEventListener('keyup', onKeyUp)
    keyupSet = true;
  }

  const handleSaveCaptcha = async () => {
    const saveEnabled = localStorage.getItem("saveCaptcha") === 'true';

    if (!saveEnabled) {
      if (keyupSet) {
        tRespDom() && tRespDom().removeEventListener('keyup', onKeyUp);
        keyupSet = false;
      }

      return;
    }

    if (tRespDom() && !keyupSet) {
      addKeyUpEventListener();
    }

    if (!tRespDom()) {
        //console.log("trespdom not found");
        keyupSet = false;
    }
  }

  const observer = new MutationObserver(function(mutationsList, observer) {
    handleSaveCaptcha()
    solve(false);
  });

  const onPostSuccessful = async () => {
    await saveCaptcha()
    window.indices = undefined;
    window.imgBase64 = undefined
  }

  document.addEventListener('QRPostSuccessful', onPostSuccessful);
  document.addEventListener('4chanQRPostSuccess', onPostSuccessful);

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });

  if(navigator.userAgent.toLowerCase().indexOf('firefox') !== -1){ // request canvas permission on firefox
    let image = new Image(16, 16);
    imageFromCanvas(image, image, 0);
  }
})();