# Talk zodiac

Playing around with the WebSpeech API again. Kind of a part 2 to [Let's talk CSS colours](https://github.com/SingaporeCSS/colour-speech). Code modified from references linked below. Probably quite buggy still. Submit issue if you find a bug and maybe I'll get around to fixing it, thanks.

References:
- [Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
- [Feature detection test for the Web Speech Recognition API](https://gist.github.com/alrra/3784549)

## To setup on local

1. `git clone git@github.com:huijing/talk-zodiac.git`
2. `npm install`
3. `gulp`

- Styles go in the styles.scss file, and will be compiled by Gulp
- Scripts go into the js folder, and will be concatenated by Gulp