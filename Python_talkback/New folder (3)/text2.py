from gtts import gTTS
import os
myText = " sir, please do some physical exercise. "
language = 'en'
output = gTTS(text = myText, lang= language, slow= False)
output.save("exercise.mp3")
os.system("start exercise.mp3")