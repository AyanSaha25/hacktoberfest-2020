from gtts import gTTS
import os
myText = " sir, please takw your drink"
language = 'en'
output = gTTS(text = myText, lang= language, slow= False)
output.save("water.mp3")
os.system("start water.mp3")
