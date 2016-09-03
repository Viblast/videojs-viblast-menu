This plugin provides Viblast Player quality menu control to Video.js framework.

### Usage

- Include the plugin after viblast.js:

```html
<link rel="stylesheet" href="http://vjs.zencdn.net/5.9.2/video-js.css">

<script type="text/javascript" src="http://vjs.zencdn.net/5.9.2/video.js"></script>

<script type="text/javascript" src="https://cdn.viblast.com/vb/stable/viblast.js"></script>

<link rel="stylesheet" href="viblast-menu-plugin.css">
<script type="text/javascript" src="videojs.viblast-menu.js"></script>

```
- Or just type ```bower install videojs-viblast-menu --save```

- Add "ViblastQualityMenu" to the Video.js plugins object:

```javascript
    plugins: {
    	ViblastQualityMenu: {
    	}

```
By default the plugin creates labels for each variant of the playlist.
The labels are generated based on the presence playlist information in the following order:
* Bandwidth
* Resolution
* Internal Id

### Options
This is possible to provide custom label generator for audio and video streams:
```javascript
...
createCustomQualityVideoLabel = function(quality,index) {
if (quality === 'auto') {
  return "auto";
}
return quality.width+"x"+quality.height;
}
....
plugins: {
  ViblastQualityMenu: {
  customLabel: {
    /*pass your own quality label creator function like this :*/
        audioStream:createCustomQualityAudioLabel,
        videoStream:createCustomQualityVideoLabel,
        default:createCustomQualityDefaultLabel
      }

    }
  }
```
When the plugin receives the quality information it calls the functions passed as arguments in its setup. Different functions for different types of streams can be passed.
The functions are called with two arguments: Quality and Index. The quality object contains the information contained in the playlist/manifest about the variant - Bandwidth, width and height. The index contains the position of the variant definition within the playlist.
