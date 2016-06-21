# Video
- Built using Vanilla JS
- Works with Youtube, Facebook and Vimeo
- Uses Bootstrap

## Instalation
- Include the **video.js** file in your html.
- Call the JS:
```js
var video = new Video('.js-video', {
    youtubeToken: 'YOUR_YOUTUBE_TOKEN'
});
```

- Create the Input, e.g.:
```html
<input class="form-control js-video" name="video" type="text">
```

- Create the Output:
```html
<div class="js-video-output"></div>
```

## How to use
- Paste the video URL on the input. :)
