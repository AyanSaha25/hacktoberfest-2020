from gtts import gTTS
import os
myText = " sir, please turned sleep your laptop and please do some exercise for your eyes. "
language = 'en'
output = gTTS(text = myText, lang= language, slow= False)
output.save("eye_exercise.mp3")
os.system("start eye_exercise.mp3")